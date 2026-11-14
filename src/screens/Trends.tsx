import { ChartLine } from "lucide-react";
import { ScreenPlaceholder } from "../components/ui/ScreenPlaceholder";

export default function Trends() {
  return (
    <ScreenPlaceholder
      icon={ChartLine}
      title="Trends"
      question="How has my body drifted over 30 days?"
      lane="lane D · #18"
    />
  );
}
