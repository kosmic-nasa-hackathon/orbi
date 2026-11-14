import { ArrowRight } from "lucide-react";
import { goTo, type View } from "../../navigation";
import { Button } from "../ui/Button";

/** The one big button at the end of a step. */
export function NextStep({ to, label }: { to: View; label: string }) {
  return (
    <div className="flex justify-end">
      <Button variant="primary" size="lg" onClick={() => goTo(to)}>
        {label}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
