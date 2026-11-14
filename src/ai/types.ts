import type { Evaluation } from "../domain/types";

export type Confidence = "low" | "medium" | "high";

/**
 * The coach never returns a diagnosis. It returns a short, grounded
 * recommendation plus the ids of the facts and the action it used.
 */
export interface CoachSuggestion {
  summary: string;
  /** ruleId of the recommendation, or null when everything is nominal. */
  actionId: string | null;
  factIds: string[];
  confidence: Confidence;
  provider: string;
  onDevice: boolean;
  /** Set when a model output was rejected and the deterministic fallback ran. */
  fallbackFrom?: string;
}

export interface CoachRequest {
  evaluation: Evaluation;
  /** Rule ids that currently have an assessment. */
  allowedActionIds: string[];
  /** Facts the model may cite. */
  facts: { id: string; label: string; value: string }[];
}

export interface CoachProvider {
  id: string;
  label: string;
  onDevice: boolean;
  available(): boolean;
  suggest(request: CoachRequest): Promise<CoachSuggestion>;
}

export function buildCoachRequest(evaluation: Evaluation): CoachRequest {
  return {
    evaluation,
    allowedActionIds: [...new Set(evaluation.assessments.map((a) => a.ruleId))],
    facts: evaluation.facts.map(({ id, label, value }) => ({ id, label, value })),
  };
}
