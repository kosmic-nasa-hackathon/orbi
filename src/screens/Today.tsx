import { CalendarCheck } from "lucide-react";
import { ScreenPlaceholder } from "../components/ui/ScreenPlaceholder";

export default function Today() {
  return (
    <ScreenPlaceholder
      icon={CalendarCheck}
      title="Today"
      question="What do I need to do?"
      lane="lane A · #13"
    />
  );
}
