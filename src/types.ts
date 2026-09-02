export type PaymentMethod =
  | "Cash"
  | "MTN MoMo"
  | "Telecel Cash"
  | "AT Money"
  | "Bank"
  | "Card"
  | "Credit";

export type SaleStatus = "Paid" | "Partial" | "Credit";

export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  cost: number;
}

export interface Sale {
  id: string;
  receiptNo: string;
  customerId: string | null;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  costTotal: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  amountPaid: number;
  cashier: string;
  date: string; // ISO
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  unit: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  createdAt: string;
}

export interface DebtPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  receiptNo: string;
  total: number;
  paid: number;
  dueDate: string;
  createdAt: string;
  payments: DebtPayment[];
}

export type DebtStatus = "Pending" | "Partially Paid" | "Overdue" | "Paid";

export type ExpenseCategory =
  | "Rent"
  | "Electricity"
  | "Water"
  | "Transport"
  | "Salaries"
  | "Internet"
  | "Marketing"
  | "Supplies"
  | "Other";

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  method: PaymentMethod;
  date: string;
}

export type PurchaseStatus = "Paid" | "Partial" | "Credit";

export interface Purchase {
  id: string;
  supplier: string;
  productId: string;
  productName: string;
  qty: number;
  cost: number;
  date: string;
  status: PurchaseStatus;
}

export type StaffRole = "Owner" | "Admin" | "Manager" | "Cashier" | "Staff";

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "Active" | "Inactive";
  lastActive: string;
}

export type MovementType = "Purchase" | "Sale" | "Return" | "Adjustment" | "Damage";

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  qty: number; // signed
  note: string;
  date: string;
}

export interface HeldSale {
  id: string;
  customerId: string | null;
  customerName: string;
  items: SaleItem[];
  discount: number;
  heldAt: string;
}

export interface BusinessSettings {
  businessName: string;
  businessType: string;
  phone: string;
  location: string;
  region: string;
  currency: string;
}

export interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
}

export interface NotificationSettings {
  lowStock: boolean;
  debtReminders: boolean;
  dailySummary: boolean;
}

export interface Settings {
  business: BusinessSettings;
  profile: ProfileSettings;
  notifications: NotificationSettings;
  plan: "Free" | "Pro" | "Business";
}

export interface DB {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  debts: Debt[];
  purchases: Purchase[];
  staff: Staff[];
  movements: Movement[];
  heldSales: HeldSale[];
  settings: Settings;
  nextReceipt: number;
}

export interface Session {
  name: string;
  email: string;
  businessName: string;
  role: "Owner" | "Admin";
}
