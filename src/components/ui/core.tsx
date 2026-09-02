import {
  useEffect, useId, useRef, useState,
  type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes,
  type SelectHTMLAttributes, type TextareaHTMLAttributes,
} from "react";
import { Loader2, Search, X, Inbox } from "lucide-react";

export const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

/* ---------------- Button ---------------- */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "dark";
type BtnSize = "sm" | "md" | "lg";

const BTN_V: Record<BtnVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-600/25",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/25",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/25",
  dark: "bg-night-900 text-white hover:bg-night-800 border border-white/10",
};

const BTN_S: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-150 select-none",
        "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        BTN_V[variant], BTN_S[size], className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ---------------- Badge ---------------- */

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "gold";

const TONES: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
  primary: "bg-primary-50 text-primary-700 ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-300",
  gold: "bg-yellow-50 text-yellow-700 ring-yellow-600/25 dark:bg-yellow-500/10 dark:text-yellow-400",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset whitespace-nowrap", TONES[tone], className)}>
      {children}
    </span>
  );
}

/* ---------------- Card ---------------- */

export function Card({ children, className, hover }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900",
      hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop hover:border-primary-200 dark:hover:border-primary-900",
      className,
    )}>
      {children}
    </div>
  );
}

/* ---------------- StatCard ---------------- */

export function StatCard({ label, value, sub, icon, tone = "primary", delay = 0 }: {
  label: string; value: string; sub?: ReactNode; icon: ReactNode; tone?: Tone; delay?: number;
}) {
  const iconBg: Record<Tone, string> = {
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  };
  return (
    <Card className="p-4 sm:p-5 animate-fade-up" >
      <div style={{ animationDelay: `${delay}ms` }} className="animate-fade-up flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular truncate">{value}</p>
          {sub && <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{sub}</div>}
        </div>
        <span className={cn("shrink-0 rounded-xl p-2.5", iconBg[tone])}>{icon}</span>
      </div>
    </Card>
  );
}

/* ---------------- Form primitives ---------------- */

export function Field({ label, error, hint, children, className }: {
  label: string; error?: string; hint?: string; children: ReactNode; className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-bold text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-red-600 dark:text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

const inputCls = (error?: boolean) => cn(
  "w-full h-10 rounded-xl border bg-white px-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400",
  "transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500",
  "dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600",
  error ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700",
);

export function Input({ error, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input className={cn(inputCls(error), className)} {...rest} />;
}

export function Select({ error, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select className={cn(inputCls(error), "appearance-none bg-no-repeat pr-9", className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.75rem center" }}
      {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ error, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return <textarea className={cn(inputCls(error), "h-auto min-h-20 py-2.5", className)} {...rest} />;
}

export function SearchInput({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        aria-label={placeholder ?? "Search"}
        className={cn(inputCls(), "pl-10")}
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <button
      type="button" role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
    >
      <span>
        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>}
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-700")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}

/* ---------------- Tabs ---------------- */

export function Tabs({ tabs, active, onChange, className }: {
  tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; className?: string;
}) {
  return (
    <div role="tablist" className={cn("no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70", className)}>
      {tabs.map((t) => (
        <button
          key={t.id} role="tab" aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-bold transition-all duration-150",
            active === t.id
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({ open, onClose, title, children, footer, wide, sheet }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
  footer?: ReactNode; wide?: boolean; sheet?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-[70] flex justify-center bg-night-950/60 backdrop-blur-[3px] animate-fade-in no-print",
      sheet ? "items-end sm:items-center" : "items-center p-4")}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop outline-none dark:bg-slate-900 sm:rounded-2xl",
          sheet ? "animate-slide-up" : "animate-scale-in",
          wide ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 id={titleId} className="font-display text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmLabel = "Delete", tone = "danger" }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; body: string; confirmLabel?: string; tone?: "danger" | "primary";
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </>
      }>
      <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">{body}</p>
    </Modal>
  );
}

/* ---------------- EmptyState ---------------- */

export function EmptyState({ icon, title, body, action, className }: {
  icon?: ReactNode; title: string; body?: string; action?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40", className)}>
      <span className="mb-3 rounded-2xl bg-white p-3.5 text-slate-400 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        {icon ?? <Inbox className="h-6 w-6" />}
      </span>
      <h3 className="font-display text-[15px] font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------------- PageHeader ---------------- */

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {sub && <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------- Table helpers ---------------- */

export const thCls = "px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap";
export const tdCls = "px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap";
export const rowCls = "border-t border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/50";

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-x-auto", className)}>{children}</div>;
}

/* ---------------- ProductThumb ---------------- */

const THUMB_HUES = [
  "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
];

export function ProductThumb({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = THUMB_HUES[h % THUMB_HUES.length];
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <span className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg font-display font-bold",
      size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-xs",
      hue, className,
    )} aria-hidden>
      {initials}
    </span>
  );
}

/* ---------------- Misc ---------------- */

export function KenteBar({ className }: { className?: string }) {
  return <div aria-hidden className={cn("kente h-1 w-full rounded-full", className)} />;
}

export function SegBtns<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
            value === o.id ? "bg-night-900 text-white shadow-sm dark:bg-primary-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function useDelayedFlag(ms = 450): [boolean, () => void] {
  const [flag, setFlag] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const trigger = () => {
    setFlag(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlag(false), ms);
  };
  return [flag, trigger];
}
