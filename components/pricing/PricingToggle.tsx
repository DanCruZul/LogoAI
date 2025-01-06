import { Button } from "@/components/ui/button";

interface PricingToggleProps {
  isMonthly: boolean;
  setIsMonthly: (isMonthly: boolean) => void;
}

export default function PricingToggle({
  isMonthly,
  setIsMonthly,
}: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="border border-border rounded-full p-1">
        <Button
          variant={isMonthly ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsMonthly(true)}
          className="rounded-full px-4 py-2 text-sm font-medium"
        >
          Monthly
        </Button>
        <Button
          variant={!isMonthly ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsMonthly(false)}
          className="rounded-full px-4 py-2 text-sm font-medium"
        >
          Yearly
        </Button>
      </div>
    </div>
  );
}
