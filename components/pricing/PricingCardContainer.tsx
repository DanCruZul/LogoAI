import PricingCard from "./PricingCard";

interface PricingCardContainerProps {
  isMonthly: boolean;
}

export default function PricingCardContainer({
  isMonthly,
}: PricingCardContainerProps) {
  return (
    <div className="flex flex-col mt-16 items-center lg:flex-row max-md:gap-6 justify-center">
      <PricingCard
        style="h-fit bg-transparent lg:py-6"
        title="Free"
        price="€0"
        description="Start creating AI-powered logos for your projects."
        features={[
          "5 AI-generated logos per month",
          "Basic editing tools",
          "PNG downloads",
          "Community support",
        ]}
        buttonText="Get started"
      />
      <PricingCard
        style="h-fit"
        title="Pro"
        price={isMonthly ? "€10" : "€100"}
        period={isMonthly ? "per month" : "per year"}
        subtext={isMonthly ? "plus local taxes" : "save €20 yearly"}
        description="Unlock advanced features and create more logos."
        features={[
          "Unlimited AI-generated logos",
          "Advanced editing tools",
          "PNG, SVG, and EPS downloads",
          "Custom color palettes",
          "Priority support",
          "No watermarks",
        ]}
        buttonText="Upgrade to Pro"
        highlighted={true}
        badge="Most Popular"
      />
    </div>
  );
}
