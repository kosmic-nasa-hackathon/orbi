import { allowedFromEvaluation, validateSuggestion } from "./guardrails";
import { createTemplateCoach } from "./providers/template";
import type { CoachProvider, CoachRequest, CoachSuggestion } from "./types";

/**
 * Ask a provider, validate the output, and fall back to the deterministic
 * coach when anything is ungrounded. The UI always gets a safe suggestion.
 */
export async function askCoach(
  request: CoachRequest,
  provider: CoachProvider,
  fallback: CoachProvider = createTemplateCoach(),
): Promise<CoachSuggestion> {
  const safe = async (reason: string): Promise<CoachSuggestion> => {
    const suggestion = await fallback.suggest(request);
    return { ...suggestion, fallbackFrom: reason };
  };

  if (!provider.available()) return safe(`${provider.id} unavailable`);

  let suggestion: CoachSuggestion;
  try {
    suggestion = await provider.suggest(request);
  } catch {
    return safe(`${provider.id} error`);
  }

  const check = validateSuggestion(suggestion, allowedFromEvaluation(request.evaluation));
  if (!check.ok) return safe(`${provider.id} rejected: ${check.errors[0]}`);

  return suggestion;
}
