import { describe, expect, it } from "vitest";
import { scenarios } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import type { Scenario } from "../domain/types";
import { askCoach } from "./coach";
import { allowedFromEvaluation, validateSuggestion } from "./guardrails";
import { createLlmCoach, type LocalLlmEngine } from "./providers/llm";
import { createTemplateCoach } from "./providers/template";
import { buildCoachRequest } from "./types";

function scenario(id: string): Scenario {
  const found = scenarios.find((s) => s.id === id);
  if (!found) throw new Error(`missing scenario ${id}`);
  return found;
}

function requestFor(id: string) {
  const s = scenario(id);
  const day = s.readings[s.readings.length - 1]!.day;
  return buildCoachRequest(evaluate(s, day, "MARS"));
}

function fakeEngine(output: string): LocalLlmEngine {
  return { name: "fake-1b", complete: async () => output };
}

describe("deterministic coach", () => {
  it("says nominal when nothing is triggered", async () => {
    const request = requestFor("nominal");
    const suggestion = await createTemplateCoach().suggest(request);
    expect(suggestion.actionId).toBeNull();
    expect(suggestion.summary.toLowerCase()).toContain("nominal");
    expect(suggestion.factIds).toEqual(["all-nominal"]);
  });

  it("recommends a triggered action", async () => {
    const request = requestFor("early-infection");
    const suggestion = await createTemplateCoach().suggest(request);
    expect(suggestion.actionId).not.toBeNull();
    expect(request.allowedActionIds).toContain(suggestion.actionId);
    expect(suggestion.summary).toContain("Start with:");
    expect(suggestion.factIds).toContain("mission");
  });

  it("passes its own guardrails for every scenario", async () => {
    for (const name of ["nominal", "early-infection", "cabin-co2", "solar-event"]) {
      const request = requestFor(name);
      const suggestion = await createTemplateCoach().suggest(request);
      const check = validateSuggestion(suggestion, allowedFromEvaluation(request.evaluation));
      expect(check.errors).toEqual([]);
    }
  });

  it("is deterministic", async () => {
    const request = requestFor("early-infection");
    const a = await createTemplateCoach().suggest(request);
    const b = await createTemplateCoach().suggest(request);
    expect(a).toEqual(b);
  });
});

describe("local model adapter", () => {
  it("accepts grounded JSON from the model", async () => {
    const request = requestFor("early-infection");
    const engine = fakeEngine(
      JSON.stringify({
        summary:
          "Concern in Immune. Start with the local infection protocol and prepare the packet.",
        actionId: "early-infection",
        factIds: ["early-infection", "mission"],
        confidence: "medium",
      }),
    );
    const suggestion = await askCoach(request, createLlmCoach(engine));
    expect(suggestion.provider).toBe("local-llm");
    expect(suggestion.fallbackFrom).toBeUndefined();
    expect(suggestion.actionId).toBe("early-infection");
  });

  it("rejects a diagnosis and falls back to the template", async () => {
    const request = requestFor("early-infection");
    const engine = fakeEngine(
      JSON.stringify({
        summary: "You have cancer. Take 500 mg of medication now.",
        actionId: "early-infection",
        factIds: ["early-infection"],
        confidence: "high",
      }),
    );
    const suggestion = await askCoach(request, createLlmCoach(engine));
    expect(suggestion.provider).toBe("template");
    expect(suggestion.fallbackFrom).toContain("rejected");
    expect(suggestion.summary.toLowerCase()).not.toContain("cancer");
  });

  it("rejects ungrounded numbers", async () => {
    const request = requestFor("early-infection");
    const engine = fakeEngine(
      JSON.stringify({
        summary: "Your temperature is 42.7 degrees. Start the protocol.",
        actionId: "early-infection",
        factIds: ["early-infection"],
        confidence: "high",
      }),
    );
    const suggestion = await askCoach(request, createLlmCoach(engine));
    expect(suggestion.provider).toBe("template");
    expect(suggestion.fallbackFrom).toContain("ungrounded number");
  });

  it("rejects an action that was not triggered", async () => {
    const request = requestFor("nominal");
    const engine = fakeEngine(
      JSON.stringify({
        summary: "Everything is fine. Start the solar shelter protocol anyway.",
        actionId: "solar-event",
        factIds: ["all-nominal"],
        confidence: "low",
      }),
    );
    const suggestion = await askCoach(request, createLlmCoach(engine));
    expect(suggestion.provider).toBe("template");
    expect(suggestion.fallbackFrom).toContain("unknown action");
  });

  it("falls back when the engine throws or returns garbage", async () => {
    const request = requestFor("cabin-co2");
    const broken: LocalLlmEngine = {
      name: "broken",
      complete: async () => "not json at all",
    };
    const a = await askCoach(request, createLlmCoach(broken));
    expect(a.provider).toBe("template");
    expect(a.fallbackFrom).toContain("error");

    const crashing: LocalLlmEngine = {
      name: "crashing",
      complete: async () => {
        throw new Error("WebGPU lost");
      },
    };
    const b = await askCoach(request, createLlmCoach(crashing));
    expect(b.provider).toBe("template");
  });
});
