import { Printer, Download, Share2 } from "lucide-react";
import type { Sale } from "../types";
import { useApp } from "../context/AppContext";
import { useToast } from "./ui/Toast";
import { Modal, Button, KenteBar } from "./ui/core";
import { cedis, fmtDate, fmtTime } from "../utils/format";

export default function ReceiptView({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const { db } = useApp();
  const toast = useToast();
  const biz = db.settings.business;
  const balance = sale.total - sale.amountPaid;

  const share = async () => {
    const text = `Receipt ${sale.receiptNo} — ${biz.businessName}\nTotal: ${cedis(sale.total)}\nDate: ${fmtDate(sale.date)} ${fmtTime(sale.date)}\n\n${sale.items.map((i) => `${i.qty}× ${i.name} — ${cedis(i.qty * i.price)}`).join("\n")}\n\nSent via KasaBiz`;
    if (navigator.share) {
      try { await navigator.share({ title: `Receipt ${sale.receiptNo}`, text }); return; } catch { /* cancelled */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    toast.push("Opening WhatsApp share…", "info");
  };

  return (
    <Modal open onClose={onClose} title={`Receipt ${sale.receiptNo}`} wide
      footer={
        <div className="no-print flex w-full flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={share}><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="secondary" onClick={() => { toast.push("Preparing PDF… (demo opens print dialog)", "info"); setTimeout(() => window.print(), 400); }}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      }>
      <div className="receipt-print mx-auto max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-700">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v16M7 12l8-8M8 11l8 9" />
            </svg>
          </div>
          <p className="font-display text-lg font-bold">KasaBiz</p>
          <p className="mt-1 text-sm font-bold">{biz.businessName}</p>
          <p className="text-xs font-medium text-slate-500">{biz.location}, {biz.region}</p>
          <p className="text-xs font-medium text-slate-500">Phone: {biz.phone}</p>
          <KenteBar className="mx-auto mt-3 w-24" />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-bold">
          <span>Receipt: <span className="text-primary-700">#{sale.receiptNo}</span></span>
          <span className="text-slate-500">{fmtDate(sale.date)} · {fmtTime(sale.date)}</span>
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-500">Customer: {sale.customerName} · Served by {sale.cashier}</p>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-dashed border-slate-300 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-1.5">Item</th><th className="py-1.5 text-center">Qty</th>
              <th className="py-1.5 text-center">Price</th><th className="py-1.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((i) => (
              <tr key={i.productId} className="border-b border-dashed border-slate-200">
                <td className="py-2 pr-2 font-semibold">{i.name}</td>
                <td className="py-2 text-center tabular">{i.qty}</td>
                <td className="py-2 text-center tabular">{cedis(i.price)}</td>
                <td className="py-2 text-right font-bold tabular">{cedis(i.qty * i.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-3 space-y-1 text-sm font-semibold">
          <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="tabular">{cedis(sale.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Discount</dt><dd className="tabular text-red-600">−{cedis(sale.discount)}</dd></div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold"><dt>Total</dt><dd className="tabular">{cedis(sale.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Paid ({sale.paymentMethod})</dt><dd className="tabular text-emerald-600">{cedis(sale.amountPaid)}</dd></div>
          {balance > 0 && (
            <div className="flex justify-between"><dt className="text-slate-500">Balance due</dt><dd className="tabular text-red-600">{cedis(balance)}</dd></div>
          )}
        </dl>

        <div className="mt-5 border-t border-dashed border-slate-300 pt-3 text-center">
          <p className="text-xs font-bold text-slate-500">Medaase! Thank you for your business.</p>
          <p className="mt-0.5 text-[10px] font-semibold text-slate-400">Powered by KasaBiz · kasabiz.app</p>
        </div>
      </div>
    </Modal>
  );
}
