import { useId } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ComposedChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { cedis, cedisShort } from "../utils/format";

export const CHART_COLORS = ["#3f5ee9", "#0d9488", "#f59e0b", "#e11d48", "#0ea5e9", "#8b5cf6", "#64748b"];

const AXIS = { fontSize: 11, fill: "#94a3b8", fontWeight: 600 } as const;

function MoneyTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="mt-0.5 flex items-center gap-1.5 text-[13px] font-bold text-slate-800 dark:text-slate-100">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.stroke }} />
          {p.name}: <span className="tabular">{cedis(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

function CountTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="mt-0.5 text-[13px] font-bold text-slate-800 dark:text-slate-100">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function AreaMoney({ data, color = "#3f5ee9", name = "Sales", height = 240 }: {
  data: { label: string; value: number }[]; color?: string; name?: string; height?: number;
}) {
  const gid = useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.18} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(v) => cedisShort(v)} width={46} />
        <Tooltip content={<MoneyTip />} cursor={{ stroke: color, strokeOpacity: 0.25 }} />
        <Area type="monotone" dataKey="value" name={name} stroke={color} strokeWidth={2.5} fill={`url(#${gid})`} animationDuration={700} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsMoney({ data, color = "#0d9488", name = "Expenses", height = 240 }: {
  data: { label: string; value: number }[]; color?: string; name?: string; height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.18} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(v) => cedisShort(v)} width={46} />
        <Tooltip content={<MoneyTip />} cursor={{ fill: "#94a3b8", fillOpacity: 0.08 }} />
        <Bar dataKey="value" name={name} fill={color} radius={[5, 5, 0, 0]} animationDuration={700} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueProfitChart({ data, height = 260 }: {
  data: { label: string; revenue: number; profit: number }[]; height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.18} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={(v) => cedisShort(v)} width={46} />
        <Tooltip content={<MoneyTip />} cursor={{ fill: "#94a3b8", fillOpacity: 0.08 }} />
        <Bar dataKey="revenue" name="Revenue" fill="#3f5ee9" fillOpacity={0.85} radius={[5, 5, 0, 0]} maxBarSize={26} animationDuration={700} />
        <Line type="monotone" dataKey="profit" name="Profit" stroke="#0d9488" strokeWidth={2.5} dot={false} animationDuration={700} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 220, money = true }: {
  data: { name: string; value: number }[]; height?: number; money?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={money ? <MoneyTip /> : <CountTip />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%"
          paddingAngle={3} strokeWidth={0} animationDuration={700}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DonutLegend({ data, money = true }: { data: { name: string; value: number }[]; money?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {data.map((d, i) => (
        <li key={d.name} className="flex items-center justify-between gap-3 text-[13px] font-semibold">
          <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="truncate">{d.name}</span>
          </span>
          <span className="tabular text-slate-900 dark:text-white">{money ? cedis(d.value) : d.value}</span>
        </li>
      ))}
    </ul>
  );
}
