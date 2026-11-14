import { MessageSquareText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { askCoach } from "../../ai/coach";
import { createTemplateCoach } from "../../ai/providers/template";
import { buildCoachRequest, type CoachProvider, type CoachSuggestion } from "../../ai/types";
import type { Evaluation } from "../../domain/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

/**
 * "Explain" asks the coach through askCoach(), which validates the output and falls back to the
 * deterministic template. The explanation never changes the decision.
 */
export function CoachExplain({
  evaluation,
  provider = createTemplateCoach(),
}: {
  evaluation: Evaluation;
  provider?: CoachProvider;
}) {
  const [suggestion, setSuggestion] = useState<CoachSuggestion | null>(null);
  const [busy, setBusy] = useState(false);

  async function explain() {
    setBusy(true);
    try {
      setSuggestion(await askCoach(buildCoachRequest(evaluation), provider));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      kicker="Explains on board"
      title="In plain words"
      actions={
        <Button size="sm" onClick={explain} disabled={busy}>
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          {suggestion ? "Explain again" : "Explain"}
        </Button>
      }
    >
      {suggestion ? (
        <div className="flex flex-col gap-3" aria-live="polite">
          <p className="text-body">{suggestion.summary}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {suggestion.provider === "template" ? "Deterministic coach" : suggestion.provider}
            </Badge>
            {suggestion.fallbackFrom && (
              <span className="text-caption text-muted">
                On-device model not used; showing the deterministic explanation.
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-body text-muted">
          The coach explains the decision above. It never changes the level or the actions.
        </p>
      )}
    </Panel>
  );
}
