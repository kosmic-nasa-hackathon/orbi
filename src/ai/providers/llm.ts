import { LEVEL_LABEL } from "../../domain/levels";
import type { CoachProvider, CoachRequest, CoachSuggestion } from "../types";

/**
 * The engine is injected on purpose: the browser adapter (WebLLM/WebGPU)
 * lives outside the domain, and tests can use a fake.
 */
export interface LocalLlmEngine {
  name: string;
  complete(prompt: string): Promise<string>;
}

export function buildCoachPrompt(request: CoachRequest): string {
  const { evaluation } = request;
  const facts = request.facts.map((f) => `- [${f.id}] ${f.label}: ${f.value}`).join("\n");
  const actions = evaluation.assessments
    .map((a) => `- [${a.ruleId}] ${a.actions[0] ?? "repeat the measurement"}`)
    .join("\n");

  return `You are ORBI, an on-board health coach for astronauts. You do not diagnose and you do not prescribe.
Use ONLY the facts below. Do not invent numbers. Do not mention medication, cancer, cures or a diagnosis.
Choose exactly one action id from the allowed list, or null when everything is nominal.

LEVEL: ${LEVEL_LABEL[evaluation.assessments[0]?.level ?? "NOMINAL"]}
MISSION: ${evaluation.mission} (${evaluation.latencySeconds} s one-way)
FACTS:
${facts}

ALLOWED ACTIONS:
${actions || "- none"}

Return ONLY valid JSON, no markdown:
{"summary":"<=280 chars, calm and concrete, no new numbers","actionId":"<id or null>","factIds":["<ids you used>"],"confidence":"low|medium|high"}`;
}

function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? raw).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no JSON object in model output");
  return JSON.parse(body.slice(start, end + 1));
}

export function createLlmCoach(engine: LocalLlmEngine, id = "local-llm"): CoachProvider {
  return {
    id,
    label: `On-device · ${engine.name}`,
    onDevice: true,
    available: () => true,
    async suggest(request: CoachRequest): Promise<CoachSuggestion> {
      const raw = await engine.complete(buildCoachPrompt(request));
      const parsed = extractJson(raw) as {
        summary?: unknown;
        actionId?: unknown;
        factIds?: unknown;
        confidence?: unknown;
      };

      if (typeof parsed.summary !== "string") throw new Error("model output missing summary");
      const actionId =
        parsed.actionId === null || parsed.actionId === undefined
          ? null
          : typeof parsed.actionId === "string"
            ? parsed.actionId
            : (() => {
                throw new Error("model output actionId is not a string");
              })();
      const factIds = Array.isArray(parsed.factIds)
        ? parsed.factIds.filter((id): id is string => typeof id === "string")
        : [];
      const confidence =
        parsed.confidence === "high" ||
        parsed.confidence === "medium" ||
        parsed.confidence === "low"
          ? parsed.confidence
          : "low";

      return {
        summary: parsed.summary,
        actionId,
        factIds,
        confidence,
        provider: id,
        onDevice: true,
      };
    },
  };
}
