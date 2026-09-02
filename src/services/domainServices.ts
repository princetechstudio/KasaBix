import type {
  DB, Product, Customer, Sale, SaleItem, Expense, Purchase, Debt, Movement,
  PaymentMethod, HeldSale,
} from "../types";
import { uid, daysFromNow } from "../utils/format";

/**
 * Pure domain operations. The AppContext applies these to state; when a real
 * backend exists, the same operations become API mutations — page code and
 * component code remain untouched.
 */

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export interface CompleteSaleInput {
  items: SaleItem[];
  customerId: string | null;
  customerName: string;
  discount: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}

export const salesService = {
  complete(db: DB, input: CompleteSaleInput): { db: DB; sale: Sale } {
    const next: DB = clone(db);
    const subtotal = input.items.reduce((a, i) => a + i.qty * i.price, 0);
    const total = Math.max(0, subtotal - input.discount);
    const credit = input.paymentMethod === "Credit";
    const amountPaid = credit ? Math.min(input.amountPaid, total) : total;
    const sale: Sale = {
      id: uid(),
      receiptNo: `KB-${next.nextReceipt}`,
      customerId: input.customerId,
      customerName: input.customerName,
      items: input.items,
      subtotal,
      discount: input.discount,
      total,
      costTotal: input.items.reduce((a, i) => a + i.qty * i.cost, 0),
      paymentMethod: input.paymentMethod,
      status: credit ? (amountPaid > 0 ? "Partial" : "Credit") : "Paid",
      amountPaid,
      cashier: next.settings.profile.name || "Owner",
      date: new Date().toISOString(),
    };
    next.nextReceipt += 1;
    next.sales = [sale, ...next.sales];

    // decrement stock + record movements
    for (const item of input.items) {
      const prod = next.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
        prod.updatedAt = sale.date;
      }
      next.movements.unshift({
        id: uid(), productId: item.productId, productName: item.name,
        type: "Sale", qty: -item.qty, note: `Receipt ${sale.receiptNo}`, date: sale.date,
      });
    }

    // create debtor record when the sale is on credit
    const outstanding = total - amountPaid;
    if (credit && outstanding > 0) {
      next.debts.unshift({
        id: uid(), customerId: input.customerId ?? "walk-in",
        customerName: input.customerName, receiptNo: sale.receiptNo,
        total, paid: amountPaid, dueDate: daysFromNow(14), createdAt: sale.date,
        payments: amountPaid > 0
          ? [{ id: uid(), amount: amountPaid, method: input.paymentMethod === "Credit" ? "Cash" : input.paymentMethod, date: sale.date }]
          : [],
      });
    }
    return { db: next, sale };
  },

  hold(db: DB, held: Omit<HeldSale, "id" | "heldAt">): DB {
    const next = clone(db);
    next.heldSales = [{ ...held, id: uid(), heldAt: new Date().toISOString() }, ...next.heldSales];
    return next;
  },

  releaseHold(db: DB, id: string): DB {
    const next = clone(db);
    next.heldSales = next.heldSales.filter((h) => h.id !== id);
    return next;
  },
};

export const productService = {
  create(db: DB, data: Omit<Product, "id" | "updatedAt">): DB {
    const next = clone(db);
    const prod: Product = { ...data, id: uid(), updatedAt: new Date().toISOString() };
    next.products = [prod, ...next.products];
    next.movements.unshift({
      id: uid(), productId: prod.id, productName: prod.name,
      type: "Adjustment", qty: prod.stock, note: "Initial stock", date: prod.updatedAt,
    });
    return next;
  },
  update(db: DB, id: string, data: Partial<Product>): DB {
    const next = clone(db);
    next.products = next.products.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p,
    );
    return next;
  },
  remove(db: DB, id: string): DB {
    const next = clone(db);
    next.products = next.products.filter((p) => p.id !== id);
    return next;
  },
  recordMovement(db: DB, productId: string, type: Movement["type"], qty: number, note: string): DB {
    const next = clone(db);
    const prod = next.products.find((p) => p.id === productId);
    if (!prod) return next;
    const delta = type === "Damage" ? -Math.abs(qty) : type === "Return" ? Math.abs(qty) : qty;
    prod.stock = Math.max(0, prod.stock + delta);
    prod.updatedAt = new Date().toISOString();
    next.movements.unshift({
      id: uid(), productId, productName: prod.name, type, qty: delta, note, date: prod.updatedAt,
    });
    return next;
  },
};

export const customerService = {
  create(db: DB, data: Omit<Customer, "id" | "createdAt">): DB {
    const next = clone(db);
    next.customers = [{ ...data, id: uid(), createdAt: new Date().toISOString() }, ...next.customers];
    return next;
  },
  update(db: DB, id: string, data: Partial<Customer>): DB {
    const next = clone(db);
    next.customers = next.customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    return next;
  },
  remove(db: DB, id: string): DB {
    const next = clone(db);
    next.customers = next.customers.filter((c) => c.id !== id);
    return next;
  },
};

export const debtService = {
  recordPayment(db: DB, debtId: string, amount: number, method: PaymentMethod): DB {
    const next = clone(db);
    const debt = next.debts.find((d) => d.id === debtId);
    if (!debt) return next;
    const applied = Math.min(amount, debt.total - debt.paid);
    debt.paid += applied;
    debt.payments = [{ id: uid(), amount: applied, method, date: new Date().toISOString() }, ...debt.payments];
    return next;
  },
};

export const expenseService = {
  create(db: DB, data: Omit<Expense, "id" | "date"> & { date?: string }): DB {
    const next = clone(db);
    next.expenses = [{ ...data, id: uid(), date: data.date ?? new Date().toISOString() }, ...next.expenses];
    return next;
  },
  remove(db: DB, id: string): DB {
    const next = clone(db);
    next.expenses = next.expenses.filter((x) => x.id !== id);
    return next;
  },
};

export const purchaseService = {
  create(db: DB, data: Omit<Purchase, "id" | "date">): DB {
    const next = clone(db);
    const purchase: Purchase = { ...data, id: uid(), date: new Date().toISOString() };
    next.purchases = [purchase, ...next.purchases];
    const prod = next.products.find((p) => p.id === data.productId);
    if (prod) {
      prod.stock += data.qty;
      prod.updatedAt = purchase.date;
    }
    next.movements.unshift({
      id: uid(), productId: data.productId, productName: data.productName,
      type: "Purchase", qty: data.qty, note: `Supplier: ${data.supplier}`, date: purchase.date,
    });
    return next;
  },
};

export const staffService = {
  create(db: DB, data: { name: string; email: string; role: DB["staff"][number]["role"] }): DB {
    const next = clone(db);
    next.staff = [
      { ...data, id: uid(), status: "Active" as const, lastActive: new Date().toISOString() },
      ...next.staff,
    ];
    return next;
  },
  setStatus(db: DB, id: string, status: "Active" | "Inactive"): DB {
    const next = clone(db);
    next.staff = next.staff.map((s) => (s.id === id ? { ...s, status } : s));
    return next;
  },
  remove(db: DB, id: string): DB {
    const next = clone(db);
    next.staff = next.staff.filter((s) => s.id !== id);
    return next;
  },
};
