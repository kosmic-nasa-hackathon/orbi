import type { Evaluation } from "../domain/types";
import type { CoachSuggestion } from "./types";

const BANNED = [
  "diagnose",
  "diagnosis",
  "prescribe",
  "prescription",
  "medication",
  "cancer",
  "cure",
  "you have",
  "take \\d+ ?mg",
];

export interface GuardrailInput {
  allowedActionIds: string[];
  allowedFactIds: string[];
  allowedNumbers: Set<string>;
}

function numbersIn(text: string): string[] {
  return text.match(/\d+(?:[.,]\d+)?/g) ?? [];
}

export function allowedFromEvaluation(evaluation: Evaluation): GuardrailInput {
  const allowedNumbers = new Set<string>();
  for (const fact of evaluation.facts) {
    for (const n of numbersIn(fact.value)) allowedNumbers.add(n);
  }
  for (const assessment of evaluation.assessments) {
    for (const action of assessment.actions) {
      for (const n of numbersIn(action)) allowedNumbers.add(n);
    }
    for (const n of numbersIn(assessment.escalation.now)) allowedNumbers.add(n);
    if (assessment.escalation.next) {
      for (const n of numbersIn(assessment.escalation.next)) allowedNumbers.add(n);
    }
  }
  const estimates = evaluation.estimates;
  for (const n of [
    estimates.boneLossPct.min,
    estimates.boneLossPct.max,
    estimates.boneLossPct.months,
    estimates.radiationPct,
    estimates.radiationDoseMSv,
    estimates.radiationBudgetMSv,
    estimates.exerciseAdherencePct,
  ]) {
    allowedNumbers.add(String(n));
  }
  return {
    allowedActionIds: [...new Set(evaluation.assessments.map((a) => a.ruleId))],
    allowedFactIds: evaluation.facts.map((f) => f.id),
    allowedNumbers,
  };
}

export interface GuardrailResult {
  ok: boolean;
  errors: string[];
}

/**
 * A local model is allowed to rephrase, not to invent.
 * - no diagnosis / prescription language
 * - every number must already exist in the deterministic facts/actions
 * - the recommended action must be one of the triggered rules
 * - every cited fact must exist
 */
export function validateSuggestion(
  suggestion: CoachSuggestion,
  allowed: GuardrailInput,
): GuardrailResult {
  const errors: string[] = [];
  const summary = suggestion.summary.trim();

  if (summary.length < 20) errors.push("summary too short");
  if (summary.length > 320) errors.push("summary too long");

  const lower = summary.toLowerCase();
  for (const pattern of BANNED) {
    if (new RegExp(pattern, "i").test(lower)) errors.push(`banned phrase: ${pattern}`);
  }

  for (const number of numbersIn(summary)) {
    if (!allowed.allowedNumbers.has(number)) errors.push(`ungrounded number: ${number}`);
  }

  if (suggestion.actionId !== null && !allowed.allowedActionIds.includes(suggestion.actionId)) {
    errors.push(`unknown action: ${suggestion.actionId}`);
  }

  for (const id of suggestion.factIds) {
    if (!allowed.allowedFactIds.includes(id)) errors.push(`unknown fact: ${id}`);
  }

  return { ok: errors.length === 0, errors };
}
