import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Wallet, Coins, PackageX, Plus, Package,
  UserPlus, ArrowRight, Receipt,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card, StatCard, Badge, Button, ProductThumb, thCls, tdCls, rowCls, TableWrap } from "../components/ui/core";
import { AreaMoney, BarsMoney, RevenueProfitChart } from "../components/charts";
import { cedis, isToday, isThisMonth, fmtWhen, fmtDay, startOfDay, sameDay } from "../utils/format";
import type { Tone } from "../components/ui/core";

export default function Dashboard() {
  const { db, session } = useApp();
  const nav = useNavigate();

  const stats = useMemo(() => {
    const todaySales = db.sales.filter((s) => isToday(s.date));
    const todayExpenses = db.expenses.filter((e) => isToday(e.date));
    const salesTotal = todaySales.reduce((a, s) => a + s.total, 0);
    const expTotal = todayExpenses.reduce((a, e) => a + e.amount, 0);
    const outstanding = db.debts.reduce((a, d) => a + Math.max(0, d.total - d.paid), 0);
    const lowStock = db.products.filter((p) => p.stock <= p.minStock);
    return {
      salesTotal, expTotal, profit: salesTotal - expTotal,
      salesCount: todaySales.length, outstanding,
      lowStock: lowStock.sort((a, b) => a.stock - b.stock),
    };
  }, [db]);

  const chartData = useMemo(() => {
    const days: { label: string; value: number; expense: number; profit: number; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const d0 = startOfDay(day);
      const daySales = db.sales.filter((s) => sameDay(new Date(s.date), d0));
      const dayExp = db.expenses.filter((e) => sameDay(new Date(e.date), d0));
      const revenue = daySales.reduce((a, s) => a + s.total, 0);
      const cogs = daySales.reduce((a, s) => a + s.costTotal, 0);
      const expense = dayExp.reduce((a, e) => a + e.amount, 0);
      days.push({ label: i === 0 ? "Today" : fmtDay(day.toISOString()), value: revenue, expense, revenue, profit: revenue - cogs - expense });
    }
    return days;
  }, [db.sales, db.expenses]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    db.expenses.filter((e) => isThisMonth(e.date)).forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [db.expenses]);

  const recent = db.sales.slice(0, 6);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { label: "New Sale", icon: Plus, to: "/sales/new", cls: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-600/30" },
    { label: "Add Product", icon: Package, to: "/products?add=1", cls: "bg-white text-slate-700 border border-slate-200 hover:border-primary-300 hover:text-primary-700 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700" },
    { label: "Add Expense", icon: Wallet, to: "/expenses?add=1", cls: "bg-white text-slate-700 border border-slate-200 hover:border-primary-300 hover:text-primary-700 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700" },
    { label: "Add Customer", icon: UserPlus, to: "/customers?add=1", cls: "bg-white text-slate-700 border border-slate-200 hover:border-primary-300 hover:text-primary-700 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700" },
  ];

  const stockTone = (stock: number, min: number): Tone => (stock === 0 ? "danger" : stock <= min ? "warning" : "success");

  return (
    <div className="space-y-6">
      {/* Greeting + quick actions */}
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold text-primary-600 dark:text-primary-400">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[28px]">
            {greeting}, {session?.name.split(" ")[0]} 👋🏾
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Here's what's happening at {db.settings.business.businessName} today.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          {quickActions.map((qa) => (
            <Link key={qa.label} to={qa.to}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-150 active:scale-[0.97] ${qa.cls}`}>
              <qa.icon className="h-4 w-4" /> {qa.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Today's Sales" value={cedis(stats.salesTotal)} icon={<TrendingUp className="h-5 w-5" />} tone="primary" delay={0}
          sub={<span className="font-bold text-emerald-600">{stats.salesCount} sales recorded</span>} />
        <StatCard label="Today's Expenses" value={cedis(stats.expTotal)} icon={<Wallet className="h-5 w-5" />} tone="danger" delay={60}
          sub="Rent, utilities & more" />
        <StatCard label="Today's Profit" value={cedis(stats.profit)} icon={<TrendingDown className="h-5 w-5 rotate-180" />} tone="success" delay={120}
          sub={<span className="font-bold text-emerald-600">Sales − expenses</span>} />
        <StatCard label="Outstanding Debts" value={cedis(stats.outstanding)} icon={<Coins className="h-5 w-5" />} tone="warning" delay={180}
          sub={`${db.debts.filter((d) => d.total - d.paid > 0).length} customers owing`} />
        <StatCard label="Low Stock" value={`${stats.lowStock.length} items`} icon={<PackageX className="h-5 w-5" />} tone="gold" delay={240}
          sub={<Link to="/inventory" className="font-bold text-primary-600 hover:underline dark:text-primary-400">Restock now →</Link>} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2 animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">Sales Overview</h2>
              <p className="text-xs font-semibold text-slate-400">Last 14 days · {cedis(chartData.reduce((a, d) => a + d.value, 0))} total</p>
            </div>
            <Badge tone="primary"><Receipt className="h-3 w-3" /> {db.sales.length} receipts</Badge>
          </div>
          <AreaMoney data={chartData.map(({ label, value }) => ({ label, value }))} height={250} />
        </Card>
        <Card className="p-5 animate-fade-up">
          <h2 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">Expenses Overview</h2>
          <p className="text-xs font-semibold text-slate-400">This month by category</p>
          <div className="mt-3">
            <BarsMoney data={expenseByCategory} color="#e11d48" name="Expenses" height={250} />
          </div>
        </Card>
      </div>

      <Card className="p-5 animate-fade-up">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">Profit Overview</h2>
            <p className="text-xs font-semibold text-slate-400">Revenue vs net profit, last 14 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-sm bg-primary-600" /> Revenue</span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" /> Profit</span>
          </div>
        </div>
        <RevenueProfitChart data={chartData} height={240} />
      </Card>

      {/* Recent sales + low stock */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">Recent Sales</h2>
            <Link to="/sales" className="flex items-center gap-1 text-[13px] font-bold text-primary-600 hover:underline dark:text-primary-400">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TableWrap className="mt-3">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={thCls}>Receipt</th><th className={thCls}>Customer</th><th className={thCls}>Items</th>
                  <th className={thCls}>Amount</th><th className={thCls}>Payment</th><th className={thCls}>Date</th><th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className={rowCls}>
                    <td className={`${tdCls} font-bold text-primary-700 dark:text-primary-300`}>#{s.receiptNo}</td>
                    <td className={tdCls}>{s.customerName}</td>
                    <td className={`${tdCls} max-w-[180px] truncate text-slate-500 dark:text-slate-400`}>
                      {s.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </td>
                    <td className={`${tdCls} font-bold tabular`}>{cedis(s.total)}</td>
                    <td className={tdCls}>{s.paymentMethod}</td>
                    <td className={`${tdCls} text-slate-500 dark:text-slate-400`}>{fmtWhen(s.date)}</td>
                    <td className={tdCls}>
                      <Badge tone={s.status === "Paid" ? "success" : s.status === "Partial" ? "warning" : "danger"}>{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        <Card className="p-5 animate-fade-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[15px] font-bold text-slate-900 dark:text-white">Low Stock</h2>
            <Badge tone="warning">{stats.lowStock.length} items</Badge>
          </div>
          <ul className="mt-4 space-y-2.5">
            {stats.lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition hover:border-slate-200 dark:border-slate-800">
                <ProductThumb name={p.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                  <p className="text-[11px] font-semibold text-slate-400">Min. {p.minStock} · SKU {p.sku}</p>
                </div>
                <Badge tone={stockTone(p.stock, p.minStock)}>{p.stock === 0 ? "Out" : `${p.stock} left`}</Badge>
              </li>
            ))}
          </ul>
          <Link to="/inventory" className="mt-4 block">
            <Button variant="secondary" className="w-full">View Inventory</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
