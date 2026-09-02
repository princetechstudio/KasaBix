import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import type { DB, Session, Debt, DebtStatus, PaymentMethod, Product } from "../types";
import { dataService } from "../services/dataService";
import { authService, type RegisterInput } from "../services/authService";
import {
  salesService, productService, customerService, debtService,
  expenseService, purchaseService, staffService, type CompleteSaleInput,
} from "../services/domainServices";
import { isBeforeToday } from "../utils/format";

type Theme = "light" | "dark" | "system";
const THEME_KEY = "kasabiz_theme";

interface AppCtx {
  db: DB;
  session: Session | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  login: (email: string, password: string) => Promise<Session>;
  loginWithGoogle: () => Promise<Session>;
  register: (input: RegisterInput) => Promise<Session>;
  logout: () => Promise<void>;
  completeSale: (input: CompleteSaleInput) => ReturnType<typeof salesService.complete>;
  holdSale: (h: Parameters<typeof salesService.hold>[1]) => void;
  releaseHold: (id: string) => void;
  addProduct: (d: Omit<Product, "id" | "updatedAt">) => void;
  updateProduct: (id: string, d: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordMovement: (productId: string, type: "Purchase" | "Sale" | "Return" | "Adjustment" | "Damage", qty: number, note: string) => void;
  addCustomer: (d: { name: string; phone: string; location: string }) => void;
  updateCustomer: (id: string, d: { name: string; phone: string; location: string }) => void;
  deleteCustomer: (id: string) => void;
  recordPayment: (debtId: string, amount: number, method: PaymentMethod) => void;
  addExpense: (d: { description: string; category: DB["expenses"][number]["category"]; amount: number; method: PaymentMethod }) => void;
  deleteExpense: (id: string) => void;
  addPurchase: (d: { supplier: string; productId: string; productName: string; qty: number; cost: number; status: DB["purchases"][number]["status"] }) => void;
  addStaff: (d: { name: string; email: string; role: DB["staff"][number]["role"] }) => void;
  setStaffStatus: (id: string, status: "Active" | "Inactive") => void;
  removeStaff: (id: string) => void;
  saveSettings: (patch: Partial<DB["settings"]>) => void;
  resetDemo: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

export function debtStatus(d: Debt): DebtStatus {
  const outstanding = d.total - d.paid;
  if (outstanding <= 0) return "Paid";
  if (isBeforeToday(d.dueDate)) return "Overdue";
  if (d.paid > 0) return "Partially Paid";
  return "Pending";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => dataService.load());
  const [session, setSession] = useState<Session | null>(() => authService.getSession());
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "system" || t === "light" ? t : "light";
  });

  useEffect(() => {
    dataService.save(db);
  }, [db]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const value = useMemo<AppCtx>(
    () => ({
      db, session, theme,
      setTheme: setThemeState,
      login: async (email, password) => {
        const s = await authService.login(email, password);
        setSession(s);
        return s;
      },
      loginWithGoogle: async () => {
        const s = await authService.loginWithGoogle();
        setSession(s);
        return s;
      },
      register: async (input) => {
        const s = await authService.register(input);
        setSession(s);
        return s;
      },
      logout: async () => {
        await authService.logout();
        setSession(null);
      },
      completeSale: (input) => {
        const result = salesService.complete(db, input);
        setDb(result.db);
        return result;
      },
      holdSale: (h) => setDb((d) => salesService.hold(d, h)),
      releaseHold: (id) => setDb((d) => salesService.releaseHold(d, id)),
      addProduct: (d) => setDb((x) => productService.create(x, d)),
      updateProduct: (id, d) => setDb((x) => productService.update(x, id, d)),
      deleteProduct: (id) => setDb((x) => productService.remove(x, id)),
      recordMovement: (productId, type, qty, note) =>
        setDb((x) => productService.recordMovement(x, productId, type, qty, note)),
      addCustomer: (d) => setDb((x) => customerService.create(x, d)),
      updateCustomer: (id, d) => setDb((x) => customerService.update(x, id, d)),
      deleteCustomer: (id) => setDb((x) => customerService.remove(x, id)),
      recordPayment: (debtId, amount, method) =>
        setDb((x) => debtService.recordPayment(x, debtId, amount, method)),
      addExpense: (d) => setDb((x) => expenseService.create(x, d)),
      deleteExpense: (id) => setDb((x) => expenseService.remove(x, id)),
      addPurchase: (d) => setDb((x) => purchaseService.create(x, d)),
      addStaff: (d) => setDb((x) => staffService.create(x, d)),
      setStaffStatus: (id, status) => setDb((x) => staffService.setStatus(x, id, status)),
      removeStaff: (id) => setDb((x) => staffService.remove(x, id)),
      saveSettings: (patch) =>
        setDb((x) => ({ ...x, settings: { ...x.settings, ...patch } })),
      resetDemo: () => setDb(dataService.reset()),
    }),
    [db, session, theme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
