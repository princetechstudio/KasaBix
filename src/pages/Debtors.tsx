/** Debtor management — who owes what, record payments, send reminders. */
import React, { useMemo, useState } from "react";
import { BellRing, CalendarClock, CheckCircle2, Coins, Users, Wallet } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Select,
  StatCard, statusTone,
} from "../components/ui";
import { useApp } from "../state/store";
import type { DebtorRow } from "../services/dataService";
import { getDebtors, paymentsThisMonth, saleOutstanding } from "../services/dataService";
import { fmtDate, ghs, PAYMENT_METHODS, uid } from "../lib/format";

export default function Debtors() {
  const { data, dispatch, toast } = useApp();
  const debtors = useMemo(() => getDebtors(data), [data]);
  const totalDebt = debtors.reduce((s, d) => s + d.outstanding, 0);
  const paidThisMonth = useMemo(() => paymentsThisMonth(data), [data]);

  const [payFor, setPayFor] = useState<DebtorRow | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader title="Debtors" sub="Track money owed to you — never forget a cedi" />

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Total Debt" value={totalDebt} icon={<Coins className="size-4" />} tone="danger"
          sub={<span>{debtors.length > 0 ? "outstanding right now" : "all settled"}</span>} />
        <StatCard label="Customers Owing" value={debtors.length} prefix="" icon={<Users className="size-4" />} tone="warn"
          sub={<span>{debtors.filter((d) => d.status === "Overdue").length} overdue</span>} />
        <StatCard label="Payments This Month" value={paidThisMonth} icon={<Wallet className="size-4" />} tone="ok"
          sub={<span>collected from debtors & sales</span>} />
      </div>

      <Card className="overflow-hidden">
        {debtors.length === 0 ? (
          <EmptyState icon={<CheckCircle2 className="size-6" />} title="Great! No outstanding debts."
            desc="When you sell on credit, customers will appear here with what they owe." />
        ) : (
          <div className="tbl-wrap">
            <table className="tbl !min-w-[900px]">
              <thead><tr><th>Customer</th><th>Total Purchase</th><th>Amount Paid</th><th>Outstanding</th><th>Due Date</th><th>Status</th><th className="!text-right">Actions</th></tr></thead>
              <tbody>
                {debtors.map((d) => (
                  <tr key={d.customer.id}>
                    <td>
                      <p className="font-bold text-ink">{d.customer.name}</p>
                      <p className="text-[11px] text-faint font-mono">{d.customer.phone}</p>
                    </td>
                    <td className="tnum font-semibold text-ink">{ghs(d.totalPurchase)}</td>
                    <td className="tnum text-sub">{ghs(d.amountPaid)}</td>
                    <td className="tnum font-extrabold text-danger">{ghs(d.outstanding)}</td>
                    <td className="text-sub whitespace-nowrap">
                      {d.oldestDue ? (
                        <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5 text-faint" />{fmtDate(d.oldestDue)}</span>
                      ) : "—"}
                    </td>
                    <td><Badge tone={statusTone(d.status)} dot={d.status === "Overdue"}>{d.status}</Badge></td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="success" onClick={() => setPayFor(d)}>Record Payment</Button>
                        <Button size="sm" variant="secondary"
                          onClick={() => toast(`Reminder sent to ${d.customer.phone} (demo).`, "info")}>
                          <BellRing className="size-3.5" /> Remind
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {payFor && <PaymentModal debtor={payFor} onClose={() => setPayFor(null)} />}
    </div>
  );
}

function PaymentModal({ debtor, onClose }: { debtor: DebtorRow; onClose: () => void }) {
  const { dispatch, toast } = useApp();
  const [amount, setAmount] = useState(String(debtor.outstanding));
  const [method, setMethod] = useState("MTN Mobile Money");
  const [err, setErr] = useState("");

  const save = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { setErr("Enter an amount greater than 0."); return; }
    if (val > debtor.outstanding) { setErr(`Amount can't exceed the outstanding ${ghs(debtor.outstanding)}.`); return; }
    setErr("");
    // apply to the customer's credit sales, oldest first
    let remaining = val;
    for (const sale of [...debtor.sales].sort((a, b) => +new Date(a.date) - +new Date(b.date))) {
      if (remaining <= 0) break;
      const out = saleOutstanding(sale);
      if (out <= 0) continue;
      const applied = Math.min(out, remaining);
      remaining -= applied;
      dispatch({ type: "PAYMENT_RECORD", saleId: sale.id, amount: applied, method, date: new Date().toISOString() });
    }
    toast(`Payment of ${ghs(val)} recorded from ${debtor.customer.name}.`);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Record payment" sub={`${debtor.customer.name} owes ${ghs(debtor.outstanding)}`}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="success" onClick={save}>Save Payment</Button></>}>
      <div className="space-y-4">
        <div className="rounded-lg bg-card2 border border-line px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-sub">Outstanding balance</span>
          <span className="font-extrabold text-danger tnum">{ghs(debtor.outstanding)}</span>
        </div>
        <Field label="Amount received (GH₵)" error={err}>
          <Input type="number" min="0" step="0.01" value={amount} invalid={!!err} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Payment method">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
