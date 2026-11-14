import { Stethoscope } from "lucide-react";
import { ScreenPlaceholder } from "../components/ui/ScreenPlaceholder";

export default function Decision() {
  return (
    <ScreenPlaceholder
      icon={Stethoscope}
      title="Decision"
      question="How serious is it, and what do I do?"
      lane="lane C · #15"
    />
  );
}
