import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, Zap, Crown, Sparkles, ArrowLeft } from "lucide-react";
import { Button, Badge, KenteBar } from "../components/ui/core";
import { useToast } from "../components/ui/Toast";
import { cedis } from "../utils/format";

export interface Plan {
  id: string; name: string; price: number; tagline: string; icon: typeof Zap;
  features: string[]; missing: string[]; highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free", price: 0, tagline: "For traders just getting started", icon: Sparkles,
    features: ["1 business, 1 user", "Up to 50 products", "50 sales per month", "Basic dashboard", "Digital receipts", "Community support"],
    missing: ["Staff accounts", "Advanced reports", "Debtor reminders"],
  },
  {
    id: "pro", name: "Pro", price: 25, tagline: "For busy shops that sell daily", icon: Zap, highlight: true,
    features: ["1 business, 3 staff accounts", "Unlimited products & sales", "Full reports & CSV export", "Debtor tracking & reminders", "Low-stock alerts", "Inventory movements", "Priority WhatsApp support"],
    missing: ["Multi-branch"],
  },
  {
    id: "business", name: "Business", price: 50, tagline: "For wholesalers & growing teams", icon: Crown,
    features: ["Up to 3 branches", "10 staff accounts with roles", "Everything in Pro", "Purchases & supplier credit", "Profit analytics per branch", "Dedicated onboarding call", "Phone support (Accra & Kumasi)"],
    missing: [],
  },
];

export default function Pricing({ embedded }: { embedded?: boolean }) {
  const nav = useNavigate();
  const toast = useToast();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const choose = (plan: Plan) => {
    if (plan.id === "free") {
      nav("/register");
    } else {
      toast.push(`${plan.name} plan selected — finish signup to activate (demo).`, "info");
      nav("/register");
    }
  };

  return (
    <div className={embedded ? "" : "min-h-screen bg-slate-100 dark:bg-night-950"}>
      {!embedded && (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-night-950/85">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-md shadow-primary-600/25">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 12l8-8M8 11l8 9" /></svg>
              </span>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Kasa<span className="text-primary-600">Biz</span></span>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:block">Login</Link>
              <Button size="sm" onClick={() => nav("/register")}>Start Free</Button>
            </div>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {!embedded && (
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        )}
        <div className="max-w-2xl">
          <Badge tone="primary">Simple pricing in Ghana Cedis</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Pay less than a daily meal,<br className="hidden sm:block" /> run your whole business.
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Every plan includes digital receipts and mobile-money-friendly records. Upgrade or cancel anytime — no lock-in.
          </p>
        </div>

        <div className="mt-7 inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} onClick={() => setBilling(b)}
              className={`rounded-lg px-4 py-2 text-[13px] font-bold capitalize transition ${billing === b ? "bg-night-900 text-white dark:bg-primary-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>
              {b}{b === "yearly" && <span className="ml-1.5 text-emerald-500">−17%</span>}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, idx) => {
            const price = billing === "yearly" ? Math.round(plan.price * 10) : plan.price;
            return (
              <div key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 animate-fade-up ${
                  plan.highlight
                    ? "border-primary-500 bg-night-950 text-white shadow-pop lg:-translate-y-3 dark:bg-primary-950/60 dark:border-primary-600"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-pop dark:border-slate-800 dark:bg-slate-900"
                }`}
                style={{ animationDelay: `${idx * 90}ms` }}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className={`rounded-xl p-2.5 ${plan.highlight ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"}`}>
                    <plan.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className={`font-display text-lg font-bold ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{plan.name}</h3>
                    <p className={`text-xs font-semibold ${plan.highlight ? "text-slate-400" : "text-slate-400"}`}>{plan.tagline}</p>
                  </div>
                </div>
                <p className="mt-5">
                  <span className={`font-display text-4xl font-bold tabular ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{cedis(price)}</span>
                  <span className={`ml-1 text-sm font-semibold ${plan.highlight ? "text-slate-400" : "text-slate-400"}`}>/{billing === "yearly" ? "year" : "month"}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-[13.5px] font-semibold ${plan.highlight ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-primary-400" : "text-emerald-500"}`} />{f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] font-semibold text-slate-400 line-through decoration-slate-300 dark:text-slate-600">
                      <X className="mt-0.5 h-4 w-4 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full" size="lg"
                  variant={plan.highlight ? "primary" : "secondary"}
                  onClick={() => choose(plan)}>
                  {plan.id === "free" ? "Start Free" : `Choose ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[13px] font-semibold text-slate-400">
          Pay with MTN MoMo, Telecel Cash, AT Money or card. Prices include VAT.
        </p>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <KenteBar className="mx-auto mb-4 w-16" />
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Not sure? Start Free, upgrade when your sales grow.</p>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Average Pro customer recovers more than GH₵300 a month in forgotten debts.</p>
        </div>
      </div>
    </div>
  );
}
