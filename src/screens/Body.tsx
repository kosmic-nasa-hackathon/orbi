import { PersonStanding } from "lucide-react";
import { ScreenPlaceholder } from "../components/ui/ScreenPlaceholder";

export default function Body() {
  return (
    <ScreenPlaceholder
      icon={PersonStanding}
      title="Body"
      question="How am I doing?"
      lane="lane B · #14"
    />
  );
}
