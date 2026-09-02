import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ShieldCheck, Smartphone } from "lucide-react";
import { KenteBar } from "../ui/core";

export default function AuthShell({ title, sub, children, footer }: {
  title: string; sub: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-night-950 p-10 lg:flex">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" aria-hidden />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/40">
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 h-[22px] w-[22px]" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v16M7 12l8-8M8 11l8 9" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold text-white">Kasa<span className="text-primary-400">Biz</span></span>
        </Link>

        <div className="relative">
          <KenteBar className="mb-6 w-16" />
          <h2 className="font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
            Know your numbers.<br />Grow your business.
          </h2>
          <p className="mt-3 max-w-sm text-[15px] font-medium leading-relaxed text-slate-400">
            Join thousands of Ghanaian shops, vendors and salons tracking every cedi with KasaBiz.
          </p>
          <div className="mt-8 grid max-w-sm grid-cols-3 gap-3">
            {[
              { icon: TrendingUp, label: "Daily profit, always clear" },
              { icon: Smartphone, label: "MoMo-ready receipts" },
              { icon: ShieldCheck, label: "Debts never forgotten" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <f.icon className="h-5 w-5 text-primary-400" />
                <p className="mt-2 text-xs font-bold leading-snug text-slate-300">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <blockquote className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold leading-relaxed text-slate-200">
              "Before KasaBiz I only knew my money at month-end. Now I see my profit every evening."
            </p>
            <footer className="mt-2 text-xs font-bold text-slate-500">Abena Serwaa · Serwaa Provisions, Kumasi</footer>
          </blockquote>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-10 dark:bg-night-950">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4v16M7 12l8-8M8 11l8 9" />
              </svg>
            </span>
            <span className="font-display text-xl font-bold text-slate-900 dark:text-white">Kasa<span className="text-primary-600">Biz</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[28px]">{title}</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">{sub}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">{footer}</div>
        </div>
      </div>
    </div>
  );
}
