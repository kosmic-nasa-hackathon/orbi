import { RadioTower } from "lucide-react";
import { ScreenPlaceholder } from "../components/ui/ScreenPlaceholder";

export default function MissionControl() {
  return (
    <ScreenPlaceholder
      icon={RadioTower}
      title="Mission Control"
      question="What reaches the flight surgeon, and when?"
      lane="lane F · #19"
    />
  );
}
