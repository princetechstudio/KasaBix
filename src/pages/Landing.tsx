import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Package, Wallet, Users, Coins, Receipt, BarChart3, UserCog,
  BookOpen, AlertTriangle, TrendingDown, PackageX, HelpCircle, CheckCircle2,
  ChevronDown, Menu, X, ArrowRight, Smartphone, Store, PlayCircle, Star,
} from "lucide-react";
import { Button, Card, Badge, KenteBar, ProductThumb, cn } from "../components/ui/core";
import { AreaMoney } from "../components/charts";
import { cedis } from "../utils/format";
import { PLANS } from "./Pricing";

const Logo = ({ dark = false }: { dark?: boolean }) => (
  <Link to="/" className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-md shadow-primary-600/30">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 12l8-8M8 11l8 9" /></svg>
    </span>
    <span className={cn("font-display text-lg font-bold tracking-tight", dark ? "text-white" : "text-slate-900")}>
      Kasa<span className="text-primary-500">Biz</span>
    </span>
  </Link>
);

const FEATURES = [
  { icon: ShoppingCart, title: "Sales Management", desc: "Record every sale in seconds with a mobile-first POS. Cash, MTN MoMo, Telecel Cash, AT Money — all tracked.", big: true },
  { icon: Package, title: "Inventory", desc: "Live stock levels with low-stock alerts before you run out." },
  { icon: Wallet, title: "Expenses", desc: "Rent, trotro, ECG bills — see exactly where money leaves." },
  { icon: Users, title: "Customers", desc: "Purchase history and phone numbers for every regular." },
  { icon: Coins, title: "Debtors", desc: "Never forget who owes you. Due dates, part-payments, reminders." },
  { icon: Receipt, title: "Digital Receipts", desc: "Professional receipts you can print or share on WhatsApp." },
  { icon: BarChart3, title: "Reports", desc: "Daily profit, best sellers and expense breakdowns in one tap." },
  { icon: UserCog, title: "Staff Management", desc: "Cashier and manager roles so your team sells without chaos." },
];

const PAINS = [
  { icon: BookOpen, title: "Lost sales records", desc: "Notebooks get soaked, torn or misplaced — and the day's sales vanish with them." },
  { icon: CircleHelp, title: "Forgotten debts", desc: "\"Maame, I'll bring it Friday\" — and by month-end you've lost track of who owes what." },
  { icon: TrendingDown, title: "Unknown profit", desc: "The tin has money, but is the business actually making profit? Hard to tell." },
  { icon: PackageX, title: "Stock shortages", desc: "A customer asks for blue jeans… and you discover you ran out last week." },
  { icon: AlertTriangle, title: "Untracked expenses", desc: "Transport, airtime, light bills — small spends silently eating your margin." },
];

const STEPS = [
  { n: "01", title: "Create your business", desc: "Sign up free, name your shop — a provision store in Osu or a salon in Tamale — and set your currency to Ghana Cedis." },
  { n: "02", title: "Add your products", desc: "List what you sell with selling price, cost price and stock. Import from a simple form or add on the go from your phone." },
  { n: "03", title: "Record sales & watch your numbers", desc: "Every sale updates stock, profit and customer history instantly. Open your dashboard each evening and know your day." },
];

const FAQS = [
  { q: "Do I need internet to use KasaBiz?", a: "Your dashboard works on any phone or computer with a browser. Sales you record sync to your numbers immediately, and the app is built to be light on data — a few megabytes a month." },
  { q: "Can I accept Mobile Money payments?", a: "KasaBiz records MoMo, Telecel Cash, AT Money, bank, card and cash payments so your books match your statements. Direct payment collection is on our roadmap." },
  { q: "How do debtor reminders work?", a: "When a customer buys on credit, KasaBiz tracks the balance and due date. You can send a friendly WhatsApp reminder with their outstanding amount in one tap." },
  { q: "Is my business data safe?", a: "Yes. Data is encrypted in transit and at rest, backed up daily, and only you and the staff you invite can see it. This demo runs entirely in your browser." },
  { q: "Can I use it for a salon or food business?", a: "Absolutely. KasaBiz is used by shops, food vendors, fashion businesses, salons, barbers, electronics sellers, mechanics, pharmacies and wholesalers across Ghana." },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["#features", "Features"], ["#how", "How it Works"], ["#pricing", "Pricing"], ["#faq", "FAQ"]];
  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-300", scrolled ? "bg-white/90 shadow-sm backdrop-blur-md dark:bg-night-950/90" : "bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Landing navigation">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="rounded-lg px-3.5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Login</Link>
          <Link to="/register"><Button size="md">Start Free</Button></Link>
        </div>
        <button className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-night-950/60 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white p-5 shadow-pop animate-slide-up dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
            </div>
            <nav className="mt-6 space-y-1">
              {links.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">{label}</a>
              ))}
            </nav>
            <div className="mt-auto space-y-2">
              <Link to="/login" className="block"><Button variant="secondary" className="w-full">Login</Button></Link>
              <Link to="/register" className="block"><Button className="w-full">Start Free</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroMockup() {
  const spark = [
    { label: "Mon", value: 890 }, { label: "Tue", value: 1240 }, { label: "Wed", value: 760 },
    { label: "Thu", value: 1450 }, { label: "Fri", value: 1120 }, { label: "Sat", value: 1980 }, { label: "Today", value: 1250 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-primary-600/10 blur-2xl" aria-hidden />
      <Card className="relative overflow-hidden !rounded-2xl !shadow-pop dark:bg-night-900">
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-400 dark:bg-slate-800">app.kasabiz.app/dashboard</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Today's Sales</p>
              <p className="font-display text-2xl font-bold tabular text-slate-900 dark:text-white">{cedis(1250)}</p>
            </div>
            <Badge tone="success"><TrendingDown className="hidden" />▲ 18% vs yesterday</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[["Profit", "GH₵930", "text-emerald-600"], ["Expenses", "GH₵320", "text-red-500"], ["Debts", "GH₵1,800", "text-amber-600"]].map(([l, v, c]) => (
              <div key={l} className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{l}</p>
                <p className={cn("font-display text-[13px] font-bold tabular sm:text-sm", c)}>{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-28">
            <AreaMoney data={spark} height={112} />
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              ["KB-1024", "Ama Mensah", "2× Black T-Shirt", "MoMo", 400],
              ["KB-1025", "Walk-in", "1× Blue Jeans", "Cash", 350],
            ].map(([no, cust, item, pm, amt]) => (
              <div key={no as string} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                <ProductThumb name={item as string} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-slate-800 dark:text-slate-100">{cust} <span className="font-semibold text-slate-400">· {item}</span></p>
                  <p className="text-[10px] font-bold text-slate-400">#{no} · {pm}</p>
                </div>
                <span className="font-display text-[13px] font-bold tabular text-slate-900 dark:text-white">{cedis(amt as number)}</span>
                <Badge tone="success">Paid</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="absolute -left-3 top-16 hidden animate-float items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-pop sm:flex dark:border-slate-700 dark:bg-slate-900">
        <span className="rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-500/15"><Smartphone className="h-4 w-4" /></span>
        <div>
          <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">MTN MoMo received</p>
          <p className="text-[10px] font-bold tabular text-emerald-600">+{cedis(400)} · Ama Mensah</p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 hidden animate-float-slow items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-pop sm:flex dark:border-slate-700 dark:bg-slate-900">
        <span className="rounded-lg bg-red-100 p-2 text-red-500 dark:bg-red-500/15"><PackageX className="h-4 w-4" /></span>
        <div>
          <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">Low stock alert</p>
          <p className="text-[10px] font-bold text-slate-400">Nike Sneakers · 2 left</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-white dark:bg-night-950">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_65%_at_50%_35%,black,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-36">
          <div className="animate-fade-up">
            <Badge tone="primary" className="!px-3 !py-1.5"><Store className="h-3.5 w-3.5" /> Built for Ghanaian SMEs</Badge>
            <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Run Your Business <span className="relative whitespace-nowrap text-primary-600">Smarter.<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 10" fill="none" aria-hidden><path d="M3 7c40-5 140-5 214-2" stroke="#fcd116" strokeWidth="5" strokeLinecap="round" /></svg></span>
            </h1>
            <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Track sales, expenses, stock, customers and debts in one simple place — made for shops, food vendors, salons, fashion and more.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/register"><Button size="lg">Start Free <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="#how">
                <Button size="lg" variant="secondary"><PlayCircle className="h-5 w-5 text-primary-600" /> See How It Works</Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Works on any phone</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pay with MoMo</span>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <HeroMockup />
          </div>
        </div>
        <KenteBar className="rounded-none" />
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="border-b border-slate-100 bg-slate-50 py-8 dark:border-slate-800 dark:bg-night-900/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6">
          {[["2,300+", "Ghanaian businesses"], ["GH₵4.2m", "Sales tracked monthly"], ["16", "Regions covered"], ["4.9/5", "Average trader rating"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{v}</p>
              <p className="mt-0.5 text-[13px] font-bold text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <Badge tone="danger">The notebook problem</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Still running your business with a notebook?
          </h2>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            The exercise book has served you well. But it can't add up your profit, remind debtors, or warn you before stock runs out.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PAINS.map((pain, i) => (
            <Card key={pain.title} hover className="p-5 animate-fade-up" >
              <div style={{ animationDelay: `${i * 70}ms` }}>
                <span className="inline-flex rounded-xl bg-red-50 p-2.5 text-red-500 dark:bg-red-500/10"><pain.icon className="h-5 w-5" /></span>
                <h3 className="mt-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">{pain.title}</h3>
                <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">{pain.desc}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-8 flex flex-col items-start gap-5 !rounded-2xl border-primary-200 bg-primary-50/60 p-6 sm:flex-row sm:items-center dark:border-primary-900 dark:bg-primary-500/5 sm:p-8">
          <span className="shrink-0 rounded-2xl bg-primary-600 p-3.5 text-white shadow-lg shadow-primary-600/30">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 12l8-8M8 11l8 9" /></svg>
          </span>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Meet KasaBiz — your business, always counted.</h3>
            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              One dashboard for sales, stock, expenses, customers and debts. Know your numbers every evening, grow with confidence every month.
            </p>
          </div>
          <Button onClick={() => nav("/register")}>Start Free</Button>
        </Card>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-y border-slate-100 bg-slate-50 py-20 dark:border-slate-800 dark:bg-night-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <Badge tone="primary">Everything in one place</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything your shop needs, nothing it doesn't.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {FEATURES.map((f, i) => (
              <Card key={f.title} hover className={cn("group p-6 animate-fade-up", f.big ? "sm:col-span-2 lg:col-span-3" : i < 4 ? "lg:col-span-2" : "lg:col-span-3")}>
                <div style={{ animationDelay: `${i * 60}ms` }} className="flex h-full flex-col">
                  <span className="inline-flex w-fit rounded-xl bg-primary-50 p-3 text-primary-600 transition-transform duration-200 group-hover:scale-110 dark:bg-primary-500/15 dark:text-primary-300">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <Badge tone="success">Up and running in minutes</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Three steps to knowing your numbers.</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative animate-fade-up" style={{ animationDelay: `${i * 110}ms` }}>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-night-950 font-display text-lg font-bold text-white shadow-lg dark:bg-primary-600">{s.n}</span>
                {i < 2 && <span className="hidden h-px flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700 md:block" aria-hidden />}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section id="pricing" className="border-y border-slate-100 bg-slate-50 py-20 dark:border-slate-800 dark:bg-night-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="gold">Pricing</Badge>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Start free. Grow when you're ready.</h2>
            </div>
            <Link to="/pricing" className="text-sm font-bold text-primary-600 hover:underline dark:text-primary-400">See full comparison →</Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Card key={plan.id} className={cn("relative flex flex-col p-6 animate-fade-up", plan.highlight && "border-primary-500 bg-night-950 text-white shadow-pop dark:bg-primary-950/60 dark:border-primary-600")} >
                <div style={{ animationDelay: `${i * 90}ms` }} className="flex h-full flex-col">
                  {plan.highlight && <span className="absolute -top-3 left-6 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Most popular</span>}
                  <div className="flex items-center justify-between">
                    <h3 className={cn("font-display text-lg font-bold", plan.highlight ? "text-white" : "text-slate-900 dark:text-white")}>{plan.name}</h3>
                    <plan.icon className={cn("h-5 w-5", plan.highlight ? "text-primary-400" : "text-primary-600")} />
                  </div>
                  <p className="mt-3"><span className={cn("font-display text-3xl font-bold tabular", plan.highlight ? "text-white" : "text-slate-900 dark:text-white")}>{cedis(plan.price)}</span><span className="ml-1 text-sm font-semibold text-slate-400">/month</span></p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className={cn("flex items-start gap-2 text-[13.5px] font-semibold", plan.highlight ? "text-slate-200" : "text-slate-600 dark:text-slate-300")}>
                        <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", plan.highlight ? "text-primary-400" : "text-emerald-500")} />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing" className="mt-5 block">
                    <Button variant={plan.highlight ? "primary" : "secondary"} className="w-full">{plan.id === "free" ? "Start Free" : `Choose ${plan.name}`}</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <Badge tone="info">FAQ</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Questions? Answered.</h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-night-950 px-6 py-14 text-center sm:px-12">
          <div className="grid-lines absolute inset-0 opacity-50" aria-hidden />
          <KenteBar className="absolute inset-x-0 top-0 rounded-none" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your business deserves better than a notebook.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] font-medium text-slate-400">
              Join traders from Makola to Kejetia who know their numbers every single day.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register"><Button size="lg">Start Free Today <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/login"><Button size="lg" variant="dark">Login to Demo</Button></Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-2 text-[13px] font-bold text-slate-400">Loved by 2,300+ Ghanaian businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 dark:border-slate-800 dark:bg-night-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Know Your Numbers. Grow Your Business. KasaBiz is the simple management platform for Ghanaian SMEs.
            </p>
            <KenteBar className="mt-5 w-16" />
          </div>
          {[
            ["Product", ["Features", "#features"], ["How it Works", "#how"], ["Pricing", "/pricing"], ["FAQ", "#faq"]],
            ["Company", ["About", "#"], ["Careers", "#"], ["Contact", "#"], ["Press", "#"]],
            ["Legal", ["Terms", "#"], ["Privacy", "#"], ["Security", "#"]],
          ].map(([title, ...links]) => (
            <div key={title as string}>
              <p className="font-display text-sm font-bold text-slate-900 dark:text-white">{title as string}</p>
              <ul className="mt-3 space-y-2">
                {(links as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") || href.startsWith("#") && href.length > 1 ? (
                      <Link to={href.startsWith("#") ? `/${href}` : href} className="text-sm font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400">{label}</Link>
                    ) : (
                      <a href={href} className="text-sm font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 pt-6 text-[13px] font-semibold text-slate-400 dark:border-slate-800 sm:px-6">
          <p>© 2026 KasaBiz Ltd · Accra, Ghana</p>
          <p>Made with pride for Ghanaian traders 🇬🇭</p>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-display text-[15px] font-bold text-slate-900 dark:text-white">{q}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <p className="animate-fade-in border-t border-slate-100 px-5 py-4 text-sm font-medium leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">{a}</p>}
    </div>
  );
}
