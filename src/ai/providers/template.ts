import { SYSTEM_LABEL } from "../../content/systems";
import { LEVEL_LABEL } from "../../domain/levels";
import type { Assessment } from "../../domain/types";
import type { CoachProvider, CoachRequest, CoachSuggestion } from "../types";

function confidenceFor(level: Assessment["level"]): CoachSuggestion["confidence"] {
  if (level === "URGENT") return "high";
  if (level === "CONCERN") return "medium";
  return "low";
}

function clip(text: string, max = 300): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Deterministic coach. This is the default and the fallback: no model,
 * no download, no hallucination, same output every time.
 */
export function createTemplateCoach(): CoachProvider {
  return {
    id: "template",
    label: "Deterministic coach",
    onDevice: true,
    available: () => true,
    async suggest(request: CoachRequest): Promise<CoachSuggestion> {
      const { evaluation } = request;
      if (evaluation.assessments.length === 0) {
        return {
          summary:
            "All systems and the radiation halo are nominal today. Keep the check-in rhythm and protect your sleep window.",
          actionId: null,
          factIds: evaluation.facts.some((f) => f.id === "all-nominal") ? ["all-nominal"] : [],
          confidence: "low",
          provider: "template",
          onDevice: true,
        };
      }

      const top = evaluation.assessments[0]!;
      const systems = [...new Set(evaluation.assessments.map((a) => SYSTEM_LABEL[a.system]))]
        .slice(0, 3)
        .join(", ");
      const extra =
        evaluation.assessments.length > 1 ? " There are additional findings to review." : "";
      const action = top.actions[0] ?? "Repeat the measurement and log it";

      const opening =
        top.ruleId === "cabin-air"
          ? `${LEVEL_LABEL[top.level]} in ${systems}. This is the cabin, not your body.`
          : top.ruleId === "solar-event"
            ? `${LEVEL_LABEL[top.level]} radiation event.`
            : `${LEVEL_LABEL[top.level]} in ${systems}.`;

      const evidence = top.because[0] ?? "A pattern crossed your personal baseline.";
      const summary = clip(
        `${opening} ${top.title}: ${evidence}. Start with: ${action}. ${top.escalation.now}.${extra}`,
      );

      return {
        summary,
        actionId: top.ruleId,
        factIds: [top.ruleId, "mission"].filter((id) => evaluation.facts.some((f) => f.id === id)),
        confidence: confidenceFor(top.level),
        provider: "template",
        onDevice: true,
      };
    },
  };
}
