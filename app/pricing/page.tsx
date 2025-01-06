"use client";

import { useState } from "react";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingToggle from "@/components/pricing/PricingToggle";
import PricingCardContainer from "@/components/pricing/PricingCardContainer";
import Navigation from "@/components/nav";
import Footer from "@/components/footer";

export default function PricingPage() {
  const [isMonthly, setIsMonthly] = useState(false);

  return (
    <div className="relative h-full w-full bg-background min-h-screen">
      <div
        className="absolute inset-0
          bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]
          bg-[size:14px_24px]"
      ></div>
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-grow space-y-8 relative z-90">
        <PricingHeader />
        <PricingToggle isMonthly={isMonthly} setIsMonthly={setIsMonthly} />
        <div>
          <PricingCardContainer isMonthly={isMonthly} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
