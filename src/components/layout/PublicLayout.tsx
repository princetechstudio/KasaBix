/** Public marketing layout: sticky navbar + rich footer. */
import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, MapPin, Phone, Mail } from "lucide-react";
import { Button, KenteBar } from "../ui";
import { cx } from "../../lib/format";
import { authService } from "../../services/authService";
import { Logo } from "./AppShell";

const LINKS = [
  { label: "Features", to: "/#features" },
  { label: "How it Works", to: "/#how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/#faq" },
];

export function useAnchorNav() {
  const nav = useNavigate();
  const loc = useLocation();
  return (to: string) => {
    if (to.startsWith("/#")) {
      const id = to.slice(2);
      if (loc.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        nav("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 350);
      }
    } else {
      nav(to);
    }
  };
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const go = useAnchorNav();
  const loc = useLocation();
  const signedIn = !!authService.getSession();
  React.useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          <Link to="/" aria-label="KasaBiz home"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Public navigation">
            {LINKS.map((l) => (
              <button key={l.label} onClick={() => go(l.to)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-sub hover:text-ink hover:bg-card transition">
                {l.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto hidden md:flex items-center gap-2">
            {signedIn ? (
              <Button variant="navy" onClick={() => go("/dashboard")}>Open Dashboard <ArrowRight className="size-4" /></Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => go("/login")}>Login</Button>
                <Button onClick={() => go("/register")}>Start Free</Button>
              </>
            )}
          </div>
          <button className="md:hidden ml-auto p-2 rounded-lg text-ink hover:bg-card" onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-line bg-card px-4 py-4 space-y-1 animate-fade-in">
            {LINKS.map((l) => (
              <button key={l.label} onClick={() => { setOpen(false); go(l.to); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-ink hover:bg-card2">
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 pt-3">
              <Button variant="secondary" className="flex-1" onClick={() => { setOpen(false); go("/login"); }}>Login</Button>
              <Button className="flex-1" onClick={() => { setOpen(false); go("/register"); }}>Start Free</Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-navy text-white mt-auto">
        <KenteBar className="rounded-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="text-sm text-white/60 mt-4 max-w-xs leading-relaxed">
              Know Your Numbers. Grow Your Business. The simple manager built for Ghanaian shops, food vendors, salons and SMEs.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs font-semibold text-white/70">
              <span className="inline-flex w-5 h-3.5 rounded-[3px] overflow-hidden border border-white/20" aria-hidden>
                <span className="w-1/3 bg-[#ce1126]" /><span className="w-1/3 bg-[#fcd116]" /><span className="w-1/3 bg-[#006b3f]" />
              </span>
              Proudly built for Ghana
            </div>
          </div>
          <FooterCol title="Product" items={[["Features", "/#features"], ["How it Works", "/#how-it-works"], ["Pricing", "/pricing"], ["FAQ", "/#faq"]]} />
          <FooterCol title="Account" items={[["Login", "/login"], ["Create account", "/register"], ["Admin demo", "/admin"], ["Dashboard", "/dashboard"]]} />
          <div>
            <p className="text-sm font-bold text-white mb-4">Get in touch</p>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2.5"><MapPin className="size-4 text-gold shrink-0" /> 14 Oxford Street, Osu — Accra</li>
              <li className="flex items-center gap-2.5"><Phone className="size-4 text-gold shrink-0" /> 030 274 8899</li>
              <li className="flex items-center gap-2.5"><Mail className="size-4 text-gold shrink-0" /> hello@kasabiz.app</li>
            </ul>
            <p className="mt-5 text-xs text-white/45">Pay with MTN MoMo, Telecel Cash or AT Money.</p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/45">
            <p>© {new Date().getFullYear()} KasaBiz. Frontend demo — no real payments or data.</p>
            <p>Akwaaba! 🇬🇭 made with care in Accra</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  const go = useAnchorNav();
  return (
    <div>
      <p className="text-sm font-bold text-white mb-4">{title}</p>
      <ul className="space-y-2.5">
        {items.map(([label, to]) => (
          <li key={label}>
            <button onClick={() => go(to)} className="text-sm text-white/65 hover:text-gold transition font-medium">{label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NavLinkButton({ to, children }: { to: string; children: React.ReactNode }) {
  return <NavLink to={to} className={cx("text-sm font-semibold")}>{children}</NavLink>;
}
