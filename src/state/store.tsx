/**
 * Global app store — React context + reducer, persisted to localStorage.
 * All mutations a real backend would own live here as actions; swapping in
 * an API later means dispatching the same actions after the request resolves.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { buildSeedData } from "../data/mockData";
import type {
  BusinessData, BusinessSettings, Customer, Expense, HeldSale, Movement,
  Product, Purchase, Sale, SaleItem, StaffMember,
} from "../data/mockData";
import { uid } from "../lib/format";

const DATA_KEY = "kasabiz_data_v3";

/* --------------------------------- types ---------------------------------- */

export interface Toast {
  id: string;
  message: string;
  tone: "success" | "error" | "info" | "warning";
}

interface State {
  data: BusinessData;
  toasts: Toast[];
}

export interface CompleteSaleInput {
  items: SaleItem[];
  customerId: string | null;
  customerName: string;
  discount: number;
  method: string;
  amountPaid: number;
  dueDate: string | null;
  cashier: string;
}

type Action =
  | { type: "PRODUCT_SAVE"; product: Product }
  | { type: "PRODUCT_DELETE"; id: string }
  | { type: "SALE_COMPLETE"; input: CompleteSaleInput; sale: Sale }
  | { type: "PAYMENT_RECORD"; saleId: string; amount: number; method: string; date: string }
  | { type: "CUSTOMER_SAVE"; customer: Customer }
  | { type: "CUSTOMER_DELETE"; id: string }
  | { type: "EXPENSE_SAVE"; expense: Expense }
  | { type: "EXPENSE_DELETE"; id: string }
  | { type: "PURCHASE_ADD"; purchase: Purchase }
  | { type: "STAFF_SAVE"; member: StaffMember }
  | { type: "STAFF_STATUS"; id: string; status: StaffMember["status"] }
  | { type: "MOVEMENT_ADD"; movement: Movement }
  | { type: "HELD_SAVE"; held: HeldSale }
  | { type: "HELD_REMOVE"; id: string }
  | { type: "SETTINGS_UPDATE"; settings: BusinessSettings }
  | { type: "PLAN_SET"; plan: BusinessData["plan"] }
  | { type: "DATA_RESET" }
  | { type: "TOAST_PUSH"; toast: Toast }
  | { type: "TOAST_REMOVE"; id: string };

/* -------------------------------- reducer --------------------------------- */

function reducer(state: State, action: Action): State {
  const d = state.data;
  switch (action.type) {
    case "PRODUCT_SAVE": {
      const exists = d.products.some((p) => p.id === action.product.id);
      const products = exists
        ? d.products.map((p) => (p.id === action.product.id ? { ...action.product, updatedAt: new Date().toISOString() } : p))
        : [{ ...action.product, updatedAt: new Date().toISOString() }, ...d.products];
      return { ...state, data: { ...d, products } };
    }
    case "PRODUCT_DELETE":
      return { ...state, data: { ...d, products: d.products.filter((p) => p.id !== action.id) } };

    case "SALE_COMPLETE": {
      const { input, sale } = action;
      // decrement stock + record movements
      let products = d.products;
      const movements: Movement[] = [];
      input.items.forEach((it) => {
        products = products.map((p) =>
          p.id === it.productId ? { ...p, stock: Math.max(0, p.stock - it.qty), updatedAt: new Date().toISOString() } : p
        );
        movements.push({
          id: uid("mv"), date: sale.date, type: "Sale", productId: it.productId,
          productName: it.name, qty: -it.qty, note: `Receipt ${sale.receipt}`,
        });
      });
      return {
        ...state,
        data: {
          ...d, products,
          sales: [sale, ...d.sales],
          movements: [...movements, ...d.movements],
          nextReceiptNo: d.nextReceiptNo + 1,
        },
      };
    }

    case "PAYMENT_RECORD": {
      const sales = d.sales.map((s) =>
        s.id === action.saleId
          ? { ...s, payments: [...s.payments, { id: uid("pay"), amount: action.amount, method: action.method, date: action.date }] }
          : s
      );
      return { ...state, data: { ...d, sales } };
    }

    case "CUSTOMER_SAVE": {
      const exists = d.customers.some((c) => c.id === action.customer.id);
      const customers = exists
        ? d.customers.map((c) => (c.id === action.customer.id ? action.customer : c))
        : [action.customer, ...d.customers];
      return { ...state, data: { ...d, customers } };
    }
    case "CUSTOMER_DELETE":
      return { ...state, data: { ...d, customers: d.customers.filter((c) => c.id !== action.id) } };

    case "EXPENSE_SAVE": {
      const exists = d.expenses.some((e) => e.id === action.expense.id);
      const expenses = exists
        ? d.expenses.map((e) => (e.id === action.expense.id ? action.expense : e))
        : [action.expense, ...d.expenses];
      return { ...state, data: { ...d, expenses: expenses.sort((a, b) => +new Date(b.date) - +new Date(a.date)) } };
    }
    case "EXPENSE_DELETE":
      return { ...state, data: { ...d, expenses: d.expenses.filter((e) => e.id !== action.id) } };

    case "PURCHASE_ADD": {
      let products = d.products;
      const movements: Movement[] = [];
      action.purchase.items.forEach((it) => {
        products = products.map((p) =>
          p.id === it.productId ? { ...p, stock: p.stock + it.qty, cost: it.cost, updatedAt: new Date().toISOString() } : p
        );
        movements.push({
          id: uid("mv"), date: action.purchase.date, type: "Purchase", productId: it.productId,
          productName: it.name, qty: it.qty, note: `Restock · ${action.purchase.ref}`,
        });
      });
      return {
        ...state,
        data: { ...d, products, purchases: [action.purchase, ...d.purchases], movements: [...movements, ...d.movements] },
      };
    }

    case "STAFF_SAVE":
      return { ...state, data: { ...d, staff: [action.member, ...d.staff] } };
    case "STAFF_STATUS":
      return {
        ...state,
        data: { ...d, staff: d.staff.map((s) => (s.id === action.id ? { ...s, status: action.status } : s)) },
      };

    case "MOVEMENT_ADD": {
      const dir = action.movement.qty;
      const products = d.products.map((p) =>
        p.id === action.movement.productId
          ? { ...p, stock: Math.max(0, p.stock + dir), updatedAt: new Date().toISOString() }
          : p
      );
      return { ...state, data: { ...d, products, movements: [action.movement, ...d.movements] } };
    }

    case "HELD_SAVE":
      return { ...state, data: { ...d, heldSales: [action.held, ...d.heldSales] } };
    case "HELD_REMOVE":
      return { ...state, data: { ...d, heldSales: d.heldSales.filter((h) => h.id !== action.id) } };

    case "SETTINGS_UPDATE":
      return { ...state, data: { ...d, settings: action.settings } };
    case "PLAN_SET":
      return { ...state, data: { ...d, plan: action.plan } };
    case "DATA_RESET":
      return { ...state, data: buildSeedData() };

    case "TOAST_PUSH":
      return { ...state, toasts: [...state.toasts.slice(-3), action.toast] };
    case "TOAST_REMOVE":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    default:
      return state;
  }
}

/* --------------------------------- context -------------------------------- */

interface Ctx {
  data: BusinessData;
  toasts: Toast[];
  dispatch: React.Dispatch<Action>;
  toast: (message: string, tone?: Toast["tone"]) => void;
}

const AppCtx = createContext<Ctx | null>(null);

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BusinessData;
      if (parsed.products && parsed.sales) return { data: parsed, toasts: [] };
    }
  } catch { /* corrupted storage — fall back to seed */ }
  return { data: buildSeedData(), toasts: [] };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(state.data)); } catch { /* storage full */ }
  }, [state.data]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = uid("t");
    dispatch({ type: "TOAST_PUSH", toast: { id, message, tone } });
    window.setTimeout(() => dispatch({ type: "TOAST_REMOVE", id }), 4000);
  }, []);

  const value = useMemo(
    () => ({ data: state.data, toasts: state.toasts, dispatch, toast }),
    [state, toast]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/* --------------------------- theme (appearance) --------------------------- */

export type ThemePref = "light" | "dark" | "system";
const THEME_KEY = "kasabiz_theme_v1";

export function useTheme() {
  const [pref, setPref] = React.useState<ThemePref>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "system" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, pref);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = pref === "system" ? (mq.matches ? "dark" : "light") : pref;
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  return { pref, setPref };
}

/* --------------------------- toast host visuals --------------------------- */

export function useToastTone(tone: Toast["tone"]) {
  return tone;
}
