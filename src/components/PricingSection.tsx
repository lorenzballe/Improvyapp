import React, { useState } from "react";
import { Check, X, Sparkles, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";

// --- 1. Typescript Interfaces (API) ---

export type BillingCycle = 'monthly' | 'annually';

export interface Feature {
  name: string;
  isIncluded: boolean;
  tooltip?: string;
}

export interface PriceTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  isPopular: boolean;
  buttonLabel: string;
  features: Feature[];
}

export interface PricingComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The list of pricing tiers to display. Must contain exactly 3 tiers. */
  plans: [PriceTier, PriceTier, PriceTier];
  /** The currently selected billing cycle. */
  billingCycle: BillingCycle;
  /** Callback function when the user changes the billing cycle. */
  onCycleChange: (cycle: BillingCycle) => void;
  /** Callback function when a user selects a plan. */
  onPlanSelect: (planId: string, cycle: BillingCycle) => void;
  /** Option to hide the detailed comparison table. */
  hideComparison?: boolean;
}

// --- 2. Utility Components ---

/** Renders a single feature row with an icon. */
const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => {
  const Icon = feature.isIncluded ? Check : X;
  const iconColor = feature.isIncluded ? "text-emerald-400" : "text-zinc-600";

  return (
    <li className="flex items-start space-x-3 py-2 text-left">
      <div className={cn("rounded-full p-0.5 mt-0.5 flex items-center justify-center bg-white/5", feature.isIncluded ? "border border-emerald-500/20" : "")}>
        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", iconColor)} aria-hidden="true" />
      </div>
      <span className={cn("text-xs leading-5 transition-colors duration-200", feature.isIncluded ? "text-zinc-200" : "text-zinc-500 line-through")}>
        {feature.name}
      </span>
    </li>
  );
};

// --- 3. Main Component: PricingComponent ---

export const PricingComponent: React.FC<PricingComponentProps> = ({
  plans,
  billingCycle,
  onCycleChange,
  onPlanSelect,
  hideComparison = false,
  className,
  ...props
}) => {
  // Ensure exactly 3 plans are passed for the intended layout
  if (plans.length !== 3) {
    console.error("PricingComponent requires exactly 3 pricing tiers.");
    return null;
  }

  const annualDiscountPercent = 20; // Example: 20% discount for annual billing

  // --- 3.1. Billing Toggle ---
  const CycleToggle = (
    <div className="flex justify-center mb-12 mt-4">
      <div className="relative p-1 bg-white/[0.02] border border-white/5 rounded-full flex gap-1 z-10 font-sans">
        <button
          type="button"
          onClick={() => onCycleChange('monthly')}
          className={cn(
            "px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer",
            billingCycle === 'monthly'
              ? "bg-white text-zinc-950 font-bold shadow-md"
              : "text-zinc-400 hover:text-white"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onCycleChange('annually')}
          className={cn(
            "px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 relative cursor-pointer",
            billingCycle === 'annually'
              ? "bg-white text-zinc-950 font-bold shadow-md"
              : "text-zinc-400 hover:text-white"
          )}
        >
          Annually
          <span className="absolute -top-3.5 -right-3.5 text-[9px] font-semibold tracking-wider bg-[#ea5358]/10 text-[#ea5358] border border-[#ea5358]/20 px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
            Save {annualDiscountPercent}%
          </span>
        </button>
      </div>
    </div>
  );

  // --- 3.2. Pricing Cards ---
  const PricingCards = (
    <div className="grid gap-8 md:grid-cols-3 items-stretch">
      {plans.map((plan) => {
        const isFeatured = plan.isPopular;
        const currentPrice = billingCycle === 'monthly' ? plan.priceMonthly : Math.floor(plan.priceAnnually / 12);
        const originalMonthlyPrice = plan.priceMonthly;
        // Billed annually summary calculation
        const priceSuffix = "/mo";

        return (
          <div
            key={plan.id}
            className={cn(
              "group relative flex flex-col rounded-3xl transition-all duration-500",
              isFeatured 
                ? "bg-gradient-to-b from-[#ea5358]/20 via-transparent to-[#f7ba2b]/5 p-[1px] hover:scale-[1.02]" 
                : "bg-white/[0.02] border border-white/5 hover:border-white/10 hover:scale-[1.01]"
            )}
          >
            {/* Ambient Popular Accent Badge */}
            {isFeatured && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-sans font-semibold tracking-widest uppercase bg-zinc-950 border border-[#f7ba2b]/35 text-[#f7ba2b] px-3.5 py-1 rounded-full z-15 shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f7ba2b] animate-pulse"></span>
                Most Popular
              </span>
            )}

            {/* Glowing background inside card */}
            <div className={cn(
              "flex flex-col flex-grow rounded-3xl p-6 justify-between relative",
              isFeatured ? "bg-zinc-950/[0.92] backdrop-blur-3xl" : "bg-transparent"
            )}>
              {/* Header block */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                    {plan.id === 'starter' ? 'The Foundation' : plan.id === 'pro' ? 'The Boutique Standard' : 'The Bespoke Tier'}
                  </span>
                </div>
                
                <h4 className="text-2xl font-normal font-display italic tracking-tight text-white mb-2">{plan.name}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed min-h-[36px] font-light">
                  {plan.description}
                </p>

                <div className="my-4 border-t border-b border-white/5 py-3 flex flex-col justify-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-normal text-white tracking-tight font-display">
                      ${currentPrice}
                    </span>
                    <span className="text-xs font-normal text-zinc-500 font-sans">{priceSuffix}</span>
                  </div>
                  
                  {billingCycle === 'annually' ? (
                    <div className="mt-1 flex flex-col gap-0.5">
                      <p className="text-[10px] font-sans text-zinc-400">
                        Billed annually (${plan.priceAnnually})
                      </p>
                      <p className="text-[10px] text-zinc-500 font-sans">
                        Was <span className="line-through">${originalMonthlyPrice}/mo</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-sans mt-1 font-light">Billed month-to-month</p>
                  )}
                </div>

                {/* Features Checklist */}
                <div className="space-y-1">
                  <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest font-bold mb-2">Included features:</p>
                  <ul className="space-y-0.5 my-1">
                    {plan.features.map((feature) => (
                      <FeatureItem key={feature.name} feature={feature} />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => onPlanSelect(plan.id, billingCycle)}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-full text-xs font-sans tracking-wider transition-all duration-300 font-semibold cursor-pointer",
                    isFeatured
                      ? "bg-white text-zinc-950 hover:bg-zinc-50 shadow-lg active:scale-95"
                      : "bg-white/5 text-white hover:bg-white/10 active:scale-95 border border-white/10"
                  )}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- 3.3. Comparison Table (Mobile hidden, Tablet/Desktop visible) ---
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features.map(f => f.name))));

  const ComparisonTable = (
    <div className="mt-20 hidden md:block border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative bg-zinc-900/10 backdrop-blur-md">
      <table className="min-w-full divide-y divide-white/5">
        <thead>
          <tr className="bg-white/[0.02]">
            <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 w-[240px]">
              Feature Matrix
            </th>
            {plans.map((plan) => (
              <th
                key={`th-${plan.id}`}
                scope="col"
                className={cn(
                  "px-6 py-4 text-center text-xs font-sans font-semibold uppercase tracking-wider text-white",
                  plan.isPopular && "bg-[#ea5358]/10"
                )}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-transparent">
          {allFeatures.map((featureName, index) => (
            <tr 
              key={featureName} 
              className={cn(
                "transition-colors hover:bg-white/[0.02]", 
                index % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
              )}
            >
              <td className="px-6 py-4 text-left text-xs font-medium text-zinc-300">
                {featureName}
              </td>
              {plans.map((plan) => {
                const feature = plan.features.find(f => f.name === featureName);
                const isIncluded = feature?.isIncluded ?? false;
                const Icon = isIncluded ? Check : X;
                const iconColor = isIncluded ? "text-emerald-400" : "text-zinc-600";

                return (
                  <td
                    key={`${plan.id}-${featureName}`}
                    className={cn(
                      "px-6 py-4 text-center transition-all duration-150",
                      plan.isPopular && "bg-[#ea5358]/5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 mx-auto", iconColor)} aria-hidden="true" />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- 3.4. Final Render ---
  return (
    <div className={cn("w-full py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props}>
      <header className="text-center mb-12">
        <span className="font-sans text-[11px] text-[#f7ba2b] tracking-widest uppercase font-semibold">Our Studio Plans</span>
        <h2 className="text-4xl sm:text-6xl font-normal text-white mt-2 font-display leading-[1.05] italic">
          Investing in your brand's digital story.
        </h2>
        <p className="mt-4 text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-sans font-light">
          Simple, transparent commitments designed with deep aesthetic care. Select the path that corresponds to your creative objectives.
        </p>
      </header>
      
      {CycleToggle}
      
      {/* Pricing Cards */}
      <section aria-labelledby="pricing-plans">
        {PricingCards}
      </section>

      {/* Comparison Table */}
      {!hideComparison && (
        <section aria-label="Feature Comparison Table" className="mt-16">
          <h3 className="text-lg font-bold mb-4 hidden md:block text-center text-white tracking-tight font-display">
            Detailed Feature Comparison
          </h3>
          {ComparisonTable}
        </section>
      )}
    </div>
  );
};

// --- Example Data ---

export const examplePlans: [PriceTier, PriceTier, PriceTier] = [
  {
    id: 'starter',
    name: 'Prestige',
    description: 'An elegant digital foundation designed for refined portfolios and emerging boutiques.',
    priceMonthly: 19,
    priceAnnually: 182, // ~15.17/mo
    isPopular: false,
    buttonLabel: 'Select Concept',
    features: [
      { name: '1 Creative Blueprint', isIncluded: true },
      { name: 'Integrated Performance Analytics', isIncluded: true },
      { name: 'Standard Studio Mail Support', isIncluded: true },
    ],
  },
  {
    id: 'pro',
    name: 'Signature',
    description: 'Our standard-bearer. Exquisite custom layout tuning and continuous fluid flow motion.',
    priceMonthly: 49,
    priceAnnually: 470, // ~39.17/mo
    isPopular: true,
    buttonLabel: 'Commission Signature',
    features: [
      { name: 'Unlimited WebGL Masterpieces', isIncluded: true },
      { name: 'Advanced Dynamic Analytics', isIncluded: true },
      { name: '24/7 Premium Concierge Support', isIncluded: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Bespoke',
    description: 'Complete creative integration with dedicated art direction and physical rendering support.',
    priceMonthly: 199,
    priceAnnually: 1910, // ~159.17/mo
    isPopular: false,
    buttonLabel: 'Bespoke Inquiry',
    features: [
      { name: 'Tailormade Virtual Realization', isIncluded: true },
      { name: 'Dedicated Principal Designer', isIncluded: true },
      { name: 'Private Slack & Video Channel', isIncluded: true },
    ],
  },
];

// Example React Component Usage
export default function ExampleComp() {
  const [cycle, setCycle] = useState<BillingCycle>('annually');

  const handleCycleChange = (newCycle: BillingCycle) => {
    setCycle(newCycle);
  };

  const handlePlanSelect = (planId: string, currentCycle: BillingCycle) => {
    alert(`Selected Plan ID: "${planId}" Billed: "${currentCycle}"`);
  };

  return (
    <div className="text-zinc-200">
      <PricingComponent
        plans={examplePlans}
        billingCycle={cycle}
        onCycleChange={handleCycleChange}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  );
}
