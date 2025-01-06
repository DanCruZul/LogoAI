import { useState } from "react";
import PricingToggle from "./PricingToggle";

export default function PricingHeader() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <div className="text-center space-y-4">
      <h1
        className="text-6xl font-bold tracking-tight bg-gradient text-transparent !bg-clip-text
          pb-2"
      >
        Pricing
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Use LogoAI for free on all your projects. Upgrade to enable advanced
        features and more AI-powered logo generation for your needs.
      </p>
    </div>
  );
}
