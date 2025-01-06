import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  subtext?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
  style?: string;
}

export default function PricingCard({
  title,
  price,
  period,
  subtext,
  description,
  features,
  buttonText,
  highlighted = false,
  badge,
  style,
}: PricingCardProps) {
  return (
    <Card className={`relative w-[28rem] border-border ${style}`}>
      {badge && (
        <Badge
          className="absolute rounded-xl top-4 right-4 py-1 bg-primary text-secondary border-none"
          variant="outline"
        >
          {badge}
        </Badge>
      )}
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-primary font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">{price}</span>
            {period && <span className="text-lg ml-2">{period}</span>}
          </div>
          {subtext && <p className="text-smmt-1">{subtext}</p>}
        </div>
        <p className="text-sm">{description}</p>
        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className="w-full font-semibold py-2 rounded-md">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
