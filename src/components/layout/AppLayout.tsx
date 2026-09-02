import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, ShoppingCart, Receipt, Package, Boxes,
  Truck, Users, Coins, Wallet, Settings as SettingsIcon, Shield, LogOut,
  Menu, Plus, Moon, Sun, Monitor, ChevronDown, X, Store,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ui/Toast";
import { cn, KenteBar, Button, Modal } from "../ui/core";

const NAV = [
  {
    group: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    group: "Sell",
    items: [
      { to: "/sales/new", label: "New Sale (POS)", icon: ShoppingCart },
      { to: "/sales", label: "Sales", icon: Receipt },
      { to: "/receipts", label: "Receipts", icon: Receipt },
    ],
  },
  {
    group: "Manage",
    items: [
      { to: "/products", label: "Products", icon: Package },
      { to: "/inventory", label: "Inventory", icon: Boxes },
      { to: "/purchases", label: "Purchases", icon: Truck },
    ],
  },
  {
    group: "People",
    items: [
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/debtors", label: "Debtors", icon: Coins },
      { to: "/staff", label: "Staff", icon: Users },
    ],
  },
  {
    group: "Money",
    items: [{ to: "/expenses", label: "Expenses", icon: Wallet }],
  },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard", "/reports": "Reports", "/sales/new": "New Sale",
  "/sales": "Sales", "/receipts": "Receipts", "/products": "Products",
  "/inventory": "Inventory", "/purchases": "Purchases", "/customers": "Customers",
  "/debtors": "Debtors", "/staff": "Staff", "/expenses": "Expenses", "/settings": "Settings",
};

function Logo({ compact }: { compact?: boolean }) {
  return (
    <NavLink to="/dashboard" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4v16M7 12l8-8M8 11l8 9" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-white">
          Kasa<span className="text-primary-400">Biz</span>
        </span>
      )}
    </NavLink>
  );
}

function SideLink({ to, label, icon: Icon, onNavigate }: {
  to: string; label: string; icon: typeof LayoutDashboard; onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to} onClick={onNavigate}
      className={({ isActive }) => cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-150",
        isActive
          ? "bg-primary-600 text-white shadow-md shadow-primary-900/40"
          : "text-slate-400 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  const { db, session, logout, theme, setTheme } = useApp();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [moreSheet, setMoreSheet] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [loc.pathname]);
  useEffect(() => { setMobileNav(false); setMoreSheet(false); setUserMenu(false); }, [loc.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const title = TITLES[loc.pathname] ?? "KasaBiz";
  const biz = db.settings.business;
  const initials = (session?.name ?? "U").split(" ").map((w) => w[0]).slice(0, 2).join("");

  const handleLogout = async () => {
    await logout();
    toast.push("Signed out. See you soon!", "info");
    nav("/login");
  };

  const ThemeBtn = ({ t, icon, label }: { t: "light" | "dark" | "system"; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => { setTheme(t); toast.push(`Theme set to ${label}`, "info"); }}
      aria-label={`Switch to ${label} theme`}
      className={cn("rounded-lg p-2 transition", theme === t
        ? "bg-primary-600 text-white shadow-sm"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100")}
    >
      {icon}
    </button>
  );

  return (
    <div className="min-h-screen lg:pl-[248px]">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-night-950 lg:flex">
        <div className="px-5 pb-5 pt-6"><Logo /></div>
        <div className="mx-5 mb-4 rounded-xl border border-white/8 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-primary-300">
              <Store className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-white">{biz.businessName}</p>
              <p className="truncate text-[11px] font-semibold text-slate-500">{biz.location}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-5 pb-4" aria-label="Main navigation">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">{g.group}</p>
              <div className="space-y-0.5">
                {g.items.map((it) => <SideLink key={it.to} {...it} />)}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/8 p-4">
          <SideLink to="/settings" label="Settings" icon={SettingsIcon} />
          <SideLink to="/admin" label="Admin Demo" icon={Shield} />
          <button onClick={handleLogout}
            className="mt-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-[18px] w-[18px]" /> Sign out
          </button>
        </div>
        <KenteBar className="rounded-none" />
      </aside>

      {/* ---------- Mobile slide-over nav ---------- */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night-950/70 animate-fade-in" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[270px] flex-col bg-night-950 animate-slide-right">
            <div className="flex items-center justify-between px-5 pb-5 pt-6">
              <Logo />
              <button onClick={() => setMobileNav(false)} aria-label="Close menu" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-5 overflow-y-auto px-5 pb-4" aria-label="Mobile navigation">
              {NAV.map((g) => (
                <div key={g.group}>
                  <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">{g.group}</p>
                  <div className="space-y-0.5">
                    {g.items.map((it) => <SideLink key={it.to} {...it} onNavigate={() => setMobileNav(false)} />)}
                  </div>
                </div>
              ))}
              <div>
                <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">Account</p>
                <div className="space-y-0.5">
                  <SideLink to="/settings" label="Settings" icon={SettingsIcon} onNavigate={() => setMobileNav(false)} />
                  <SideLink to="/admin" label="Admin Demo" icon={Shield} onNavigate={() => setMobileNav(false)} />
                </div>
              </div>
            </nav>
            <div className="p-4">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-[13.5px] font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="h-[18px] w-[18px]" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-night-950/85">
        <div className="flex h-15 items-center justify-between gap-3 px-4 py-3 sm:px-6" style={{ height: 60 }}>
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileNav(true)} aria-label="Open menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-bold text-slate-900 dark:text-white sm:text-base">{title}</p>
              <p className="hidden truncate text-[11px] font-semibold text-slate-400 sm:block">{biz.businessName} · {biz.region}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-0.5 rounded-xl border border-slate-200 p-0.5 dark:border-slate-700 md:flex">
              <ThemeBtn t="light" icon={<Sun className="h-4 w-4" />} label="Light" />
              <ThemeBtn t="dark" icon={<Moon className="h-4 w-4" />} label="Dark" />
              <ThemeBtn t="system" icon={<Monitor className="h-4 w-4" />} label="System" />
            </div>
            <Button size="sm" className="h-9" onClick={() => nav("/sales/new")}>
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New Sale</span><span className="sm:hidden">Sale</span>
            </Button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenu((v) => !v)} aria-label="Account menu" aria-expanded={userMenu}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-900 font-display text-[11px] font-bold text-white dark:bg-primary-600">
                  {initials}
                </span>
                <ChevronDown className={cn("hidden h-4 w-4 text-slate-400 transition-transform sm:block", userMenu && "rotate-180")} />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-scale-in dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{session?.name}</p>
                    <p className="truncate text-xs font-medium text-slate-400">{session?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => { nav("/settings"); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                      <SettingsIcon className="h-4 w-4" /> Settings
                    </button>
                    <button onClick={() => nav("/admin")} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                      <Shield className="h-4 w-4" /> Admin Demo
                    </button>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-5 sm:px-6 lg:pb-10">
        <Outlet />
      </main>

      {/* ---------- Mobile bottom nav ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-night-950/95 lg:hidden" aria-label="Bottom navigation">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {[
            { to: "/dashboard", label: "Home", icon: LayoutDashboard },
            { to: "/sales", label: "Sales", icon: Receipt },
            { to: "/sales/new", label: "POS", icon: ShoppingCart, primary: true },
            { to: "/customers", label: "Customers", icon: Users },
          ].map((it) => (
            <NavLink key={it.to} to={it.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition",
                it.primary ? "" : isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400",
              )}>
              {({ isActive }) => it.primary ? (
                <>
                  <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/40 ring-4 ring-white dark:ring-night-950">
                    <it.icon className="h-5 w-5" />
                  </span>
                  <span className={cn(isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400")}>{it.label}</span>
                </>
              ) : (
                <><it.icon className="h-5 w-5" />{it.label}</>
              )}
            </NavLink>
          ))}
          <button onClick={() => setMoreSheet(true)} className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold text-slate-400">
            <Menu className="h-5 w-5" /> More
          </button>
        </div>
      </nav>

      {/* ---------- More sheet ---------- */}
      <Modal open={moreSheet} onClose={() => setMoreSheet(false)} title="All sections" sheet>
        <div className="grid grid-cols-2 gap-2 pb-2">
          {[
            ...NAV.flatMap((g) => g.items),
            { to: "/settings", label: "Settings", icon: SettingsIcon },
            { to: "/admin", label: "Admin Demo", icon: Shield },
          ].map((it) => (
            <NavLink key={it.to} to={it.to} onClick={() => setMoreSheet(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-3 text-[13px] font-bold transition",
                isActive
                  ? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-500/10 dark:text-primary-300"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300",
              )}>
              <it.icon className="h-[18px] w-[18px]" /> {it.label}
            </NavLink>
          ))}
        </div>
      </Modal>
    </div>
  );
}
