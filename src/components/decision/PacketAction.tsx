import { Lock, Send, Timer } from "lucide-react";
import type { Evaluation } from "../../domain/types";
import { isPacketFor, useOrbiStore } from "../../store/orbiStore";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { formatLatency } from "./latency";

/** "Send to flight surgeon": marks the packet for Mission Control. */
export function PacketAction({ evaluation }: { evaluation: Evaluation }) {
  const packet = useOrbiStore((state) => state.packet);
  const sendPacket = useOrbiStore((state) => state.sendPacket);
  const sent = isPacketFor(packet, evaluation);
  const queued = evaluation.mission === "MARS";

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Flight surgeon packet</p>
        <p className="flex items-center gap-2 text-caption text-muted">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Carries the conclusion and the evidence. Cycle details stay private unless you share them.
        </p>
      </div>
      {sent ? (
        <p role="status" className="flex items-center gap-2 text-caption">
          <Badge tone={queued ? "watch" : "nominal"}>
            {queued ? (
              <Timer className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Send className="h-3 w-3" aria-hidden="true" />
            )}
            {queued ? "Queued" : "Sent"}
          </Badge>
          {queued
            ? `Travels with the next comms window (${formatLatency(evaluation.latencySeconds)})`
            : "Delivered to Mission Control"}
        </p>
      ) : (
        <Button variant="primary" onClick={() => sendPacket(evaluation)}>
          <Send className="h-4 w-4" aria-hidden="true" />
          Send to flight surgeon
        </Button>
      )}
    </Card>
  );
}
