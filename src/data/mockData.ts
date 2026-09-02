import type { DB, Sale, Product, Customer, Debt, Expense, Purchase, Staff, Movement } from "../types";
import { daysAgo, daysFromNow } from "../utils/format";

export const REGIONS = [
  "Greater Accra", "Ashanti", "Eastern", "Central", "Western", "Volta", "Northern",
  "Upper East", "Upper West", "Bono", "Bono East", "Ahafo", "Oti", "Savannah",
  "North East", "Western North",
];

export const BUSINESS_TYPES = [
  "Retail", "Wholesale", "Food", "Fashion", "Beauty", "Electronics", "Pharmacy", "Services", "Other",
];

export const EXPENSE_CATEGORIES = [
  "Rent", "Electricity", "Water", "Transport", "Salaries", "Internet", "Marketing", "Supplies", "Other",
] as const;

export const PAYMENT_METHODS = [
  "Cash", "MTN MoMo", "Telecel Cash", "AT Money", "Bank", "Card",
] as const;

export const SUPPLIERS = [
  "Ghana Textiles Ltd", "Accra Central Wholesale", "Kumasi Traders Hub", "Tema Imports Co.", "Aflao Mercantile",
];

const p = (
  id: string, name: string, sku: string, category: string, price: number, cost: number,
  stock: number, minStock: number, supplier: string, unit: string, updatedDaysAgo: number,
): Product => ({ id, name, sku, category, price, cost, stock, minStock, supplier, unit, updatedAt: daysAgo(updatedDaysAgo, 9) });

const products: Product[] = [
  p("pr1", "Black T-Shirt", "PFS-001", "T-Shirts", 200, 120, 4, 10, "Accra Central Wholesale", "piece", 1),
  p("pr2", "Blue Jeans", "PFS-002", "Jeans", 350, 220, 5, 8, "Kumasi Traders Hub", "piece", 2),
  p("pr3", "Nike Sneakers", "PFS-003", "Footwear", 800, 550, 2, 5, "Tema Imports Co.", "pair", 3),
  p("pr4", "Baseball Cap", "PFS-004", "Accessories", 120, 60, 18, 6, "Accra Central Wholesale", "piece", 4),
  p("pr5", "Polo Shirt", "PFS-005", "Shirts", 250, 150, 3, 8, "Accra Central Wholesale", "piece", 1),
  p("pr6", "Kids Hoodie", "PFS-006", "Hoodies", 300, 180, 14, 6, "Kumasi Traders Hub", "piece", 5),
  p("pr7", "Ankara Fabric (6 yds)", "PFS-007", "Fabrics", 480, 320, 7, 10, "Ghana Textiles Ltd", "roll", 2),
  p("pr8", "Denim Jacket", "PFS-008", "Jackets", 600, 380, 1, 3, "Kumasi Traders Hub", "piece", 6),
  p("pr9", "Summer Dress", "PFS-009", "Dresses", 420, 260, 0, 4, "Ghana Textiles Ltd", "piece", 4),
  p("pr10", "Kente Scarf", "PFS-010", "Accessories", 180, 90, 9, 12, "Ghana Textiles Ltd", "piece", 3),
  p("pr11", "Leather Belt", "PFS-011", "Accessories", 150, 80, 22, 8, "Aflao Mercantile", "piece", 8),
  p("pr12", "White Sneakers", "PFS-012", "Footwear", 750, 500, 6, 4, "Tema Imports Co.", "pair", 2),
  p("pr13", "Ladies Handbag", "PFS-013", "Bags", 550, 350, 11, 5, "Aflao Mercantile", "piece", 5),
  p("pr14", "Socks (3-pack)", "PFS-014", "Accessories", 90, 45, 30, 10, "Accra Central Wholesale", "pack", 1),
  p("pr15", "Sport Shorts", "PFS-015", "Shorts", 160, 90, 16, 6, "Kumasi Traders Hub", "piece", 7),
];

const c = (id: string, name: string, phone: string, location: string, createdDaysAgo: number): Customer =>
  ({ id, name, phone, location, createdAt: daysAgo(createdDaysAgo, 12) });

const customers: Customer[] = [
  c("cu1", "Ama Mensah", "024 417 8830", "Osu, Accra", 92),
  c("cu2", "Kwame Boateng", "055 230 1147", "Tema, Community 8", 74),
  c("cu3", "Kofi Asare", "020 883 4521", "East Legon, Accra", 61),
  c("cu4", "Akosua Mensima", "027 665 9012", "Dansoman, Accra", 48),
  c("cu5", "Efua Owusu", "054 118 7263", "Lapaz, Accra", 33),
  c("cu6", "Yaw Darko", "026 334 5589", "Madina, Accra", 19),
];

interface SaleSeed {
  no: number; custId: string | null; custName: string;
  lines: [string, number][]; discount?: number; method: Sale["paymentMethod"];
  paid?: number; day: number; h: number; m: number;
}

const sale = (s: SaleSeed): Sale => {
  const items = s.lines.map(([pid, qty]) => {
    const prod = products.find((x) => x.id === pid)!;
    return { productId: pid, name: prod.name, qty, price: prod.price, cost: prod.cost };
  });
  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);
  const discount = s.discount ?? 0;
  const total = subtotal - discount;
  const isCredit = s.method === "Credit";
  const amountPaid = isCredit ? s.paid ?? 0 : total;
  return {
    id: `s${s.no}`, receiptNo: `KB-${s.no}`,
    customerId: s.custId, customerName: s.custName,
    items, subtotal, discount, total,
    costTotal: items.reduce((a, i) => a + i.qty * i.cost, 0),
    paymentMethod: s.method,
    status: isCredit ? (amountPaid > 0 ? "Partial" : "Credit") : "Paid",
    amountPaid, cashier: "Prince Ankomah", date: daysAgo(s.day, s.h, s.m),
  };
};

const sales: Sale[] = [
  sale({ no: 1027, custId: "cu4", custName: "Akosua Mensima", lines: [["pr1", 1]], method: "Telecel Cash", day: 0, h: 15, m: 48 }),
  sale({ no: 1026, custId: "cu3", custName: "Kofi Asare", lines: [["pr6", 1]], method: "MTN MoMo", day: 0, h: 13, m: 26 }),
  sale({ no: 1025, custId: null, custName: "Walk-in Customer", lines: [["pr2", 1]], method: "Cash", day: 0, h: 11, m: 2 }),
  sale({ no: 1024, custId: "cu1", custName: "Ama Mensah", lines: [["pr1", 2]], method: "MTN MoMo", day: 0, h: 9, m: 14 }),
  sale({ no: 1023, custId: null, custName: "Walk-in Customer", lines: [["pr4", 1], ["pr14", 1]], method: "Cash", day: 1, h: 17, m: 5 }),
  sale({ no: 1022, custId: "cu5", custName: "Efua Owusu", lines: [["pr13", 1]], method: "Credit", paid: 150, day: 1, h: 12, m: 40 }),
  sale({ no: 1021, custId: "cu6", custName: "Yaw Darko", lines: [["pr12", 1]], method: "MTN MoMo", day: 2, h: 16, m: 20 }),
  sale({ no: 1020, custId: null, custName: "Walk-in Customer", lines: [["pr14", 2]], method: "Cash", day: 2, h: 10, m: 15 }),
  sale({ no: 1019, custId: "cu1", custName: "Ama Mensah", lines: [["pr7", 1], ["pr12", 1]], discount: 30, method: "Credit", paid: 400, day: 3, h: 14, m: 10 }),
  sale({ no: 1018, custId: null, custName: "Walk-in Customer", lines: [["pr5", 1]], method: "Cash", day: 3, h: 11, m: 30 }),
  sale({ no: 1017, custId: "cu3", custName: "Kofi Asare", lines: [["pr11", 1], ["pr14", 1]], method: "MTN MoMo", day: 4, h: 15, m: 44 }),
  sale({ no: 1016, custId: null, custName: "Walk-in Customer", lines: [["pr1", 1]], method: "Cash", day: 4, h: 9, m: 52 }),
  sale({ no: 1015, custId: "cu4", custName: "Akosua Mensima", lines: [["pr9", 1]], method: "AT Money", day: 5, h: 13, m: 12 }),
  sale({ no: 1014, custId: "cu2", custName: "Kwame Boateng", lines: [["pr8", 1]], method: "Credit", paid: 0, day: 5, h: 10, m: 38 }),
  sale({ no: 1013, custId: null, custName: "Walk-in Customer", lines: [["pr4", 2]], method: "Cash", day: 6, h: 16, m: 47 }),
  sale({ no: 1012, custId: "cu1", custName: "Ama Mensah", lines: [["pr2", 1], ["pr1", 1]], method: "MTN MoMo", day: 6, h: 12, m: 22 }),
  sale({ no: 1011, custId: "cu6", custName: "Yaw Darko", lines: [["pr13", 1]], method: "MTN MoMo", day: 8, h: 15, m: 5 }),
  sale({ no: 1010, custId: null, custName: "Walk-in Customer", lines: [["pr6", 1], ["pr14", 1]], method: "Cash", day: 8, h: 11, m: 41 }),
  sale({ no: 1009, custId: "cu5", custName: "Efua Owusu", lines: [["pr7", 1], ["pr10", 1]], method: "Telecel Cash", day: 9, h: 14, m: 33 }),
  sale({ no: 1008, custId: null, custName: "Walk-in Customer", lines: [["pr12", 1]], method: "Card", day: 10, h: 17, m: 19 }),
  sale({ no: 1007, custId: "cu3", custName: "Kofi Asare", lines: [["pr1", 3]], method: "MTN MoMo", day: 10, h: 10, m: 8 }),
  sale({ no: 1006, custId: "cu3", custName: "Kofi Asare", lines: [["pr5", 1], ["pr11", 1]], method: "Credit", paid: 0, day: 12, h: 13, m: 55 }),
  sale({ no: 1005, custId: null, custName: "Walk-in Customer", lines: [["pr2", 1]], method: "Cash", day: 12, h: 9, m: 47 }),
];

const debts: Debt[] = [
  {
    id: "d1", customerId: "cu1", customerName: "Ama Mensah", receiptNo: "KB-1019",
    total: 1200, paid: 400, dueDate: daysFromNow(5), createdAt: daysAgo(3, 14, 10),
    payments: [{ id: "dp1", amount: 400, method: "MTN MoMo", date: daysAgo(3, 14, 12) }],
  },
  {
    id: "d2", customerId: "cu2", customerName: "Kwame Boateng", receiptNo: "KB-1014",
    total: 600, paid: 0, dueDate: daysAgo(2, 18), createdAt: daysAgo(5, 10, 38),
    payments: [],
  },
  {
    id: "d3", customerId: "cu5", customerName: "Efua Owusu", receiptNo: "KB-1022",
    total: 550, paid: 150, dueDate: daysFromNow(10), createdAt: daysAgo(1, 12, 40),
    payments: [{ id: "dp2", amount: 150, method: "Cash", date: daysAgo(1, 16, 2) }],
  },
  {
    id: "d4", customerId: "cu3", customerName: "Kofi Asare", receiptNo: "KB-1006",
    total: 400, paid: 400, dueDate: daysAgo(4, 18), createdAt: daysAgo(12, 13, 55),
    payments: [{ id: "dp3", amount: 250, method: "MTN MoMo", date: daysAgo(6, 12, 30) }, { id: "dp4", amount: 150, method: "Cash", date: daysAgo(1, 11, 20) }],
  },
];

const e = (id: string, description: string, category: Expense["category"], amount: number, method: Expense["method"], day: number, h: number, m = 0): Expense =>
  ({ id, description, category, amount, method, date: daysAgo(day, h, m) });

const expenses: Expense[] = [
  e("ex1", "Delivery — restock from Tema warehouse", "Transport", 120, "Cash", 0, 12, 30),
  e("ex2", "ECG prepaid meter top-up", "Electricity", 200, "MTN MoMo", 0, 8, 45),
  e("ex3", "Instagram & TikTok ads", "Marketing", 180, "Card", 2, 15, 10),
  e("ex4", "MTN Business Broadband", "Internet", 250, "Bank", 3, 9, 5),
  e("ex5", "Staff salaries (2)", "Salaries", 900, "Bank", 4, 16, 0),
  e("ex6", "GWCL water bill", "Water", 90, "Cash", 5, 10, 40),
  e("ex7", "Monthly shop rent — Osu", "Rent", 1500, "Bank", 6, 9, 0),
  e("ex8", "Packaging bags & price tags", "Supplies", 140, "Cash", 8, 13, 25),
  e("ex9", "Tro-tro fare — market run", "Transport", 60, "Cash", 9, 7, 50),
  e("ex10", "Shop repainting supplies", "Supplies", 220, "Cash", 11, 14, 15),
];

const purchases: Purchase[] = [
  { id: "pu1", supplier: "Accra Central Wholesale", productId: "pr5", productName: "Polo Shirt", qty: 15, cost: 2250, date: daysAgo(1, 9, 20), status: "Paid" },
  { id: "pu2", supplier: "Kumasi Traders Hub", productId: "pr2", productName: "Blue Jeans", qty: 12, cost: 2640, date: daysAgo(3, 11, 45), status: "Credit" },
  { id: "pu3", supplier: "Accra Central Wholesale", productId: "pr1", productName: "Black T-Shirt", qty: 20, cost: 2400, date: daysAgo(5, 10, 15), status: "Partial" },
  { id: "pu4", supplier: "Ghana Textiles Ltd", productId: "pr7", productName: "Ankara Fabric (6 yds)", qty: 10, cost: 3200, date: daysAgo(7, 15, 30), status: "Paid" },
  { id: "pu5", supplier: "Tema Imports Co.", productId: "pr3", productName: "Nike Sneakers", qty: 6, cost: 3300, date: daysAgo(10, 12, 0), status: "Paid" },
];

const staff: Staff[] = [
  { id: "st1", name: "Prince Ankomah", email: "prince@kasabiz.demo", role: "Owner", status: "Active", lastActive: daysAgo(0, 8, 55) },
  { id: "st2", name: "Abena Serwaa", email: "abena@kasabiz.demo", role: "Manager", status: "Active", lastActive: daysAgo(0, 8, 30) },
  { id: "st3", name: "Kojo Antwi", email: "kojo@kasabiz.demo", role: "Cashier", status: "Active", lastActive: daysAgo(1, 18, 5) },
  { id: "st4", name: "Linda Mensah", email: "linda@kasabiz.demo", role: "Staff", status: "Inactive", lastActive: daysAgo(6, 17, 40) },
];

const m = (id: string, productId: string, type: Movement["type"], qty: number, note: string, day: number, h: number): Movement => ({
  id, productId, productName: products.find((x) => x.id === productId)?.name ?? productId,
  type, qty, note, date: daysAgo(day, h),
});

const movements: Movement[] = [
  m("mv1", "pr5", "Purchase", 15, "Restock from Accra Central Wholesale", 1, 9),
  m("mv2", "pr12", "Return", 1, "Customer returned wrong size", 2, 15),
  m("mv3", "pr2", "Purchase", 12, "Restock from Kumasi Traders Hub", 3, 11),
  m("mv4", "pr10", "Adjustment", -2, "Stock count correction", 4, 17),
  m("mv5", "pr1", "Purchase", 20, "Restock from Accra Central Wholesale", 5, 10),
  m("mv6", "pr9", "Damage", -1, "Sun-faded on display", 6, 12),
  m("mv7", "pr7", "Purchase", 10, "Restock from Ghana Textiles Ltd", 7, 15),
  m("mv8", "pr3", "Purchase", 6, "Restock from Tema Imports Co.", 10, 12),
];

export function seedDatabase(): DB {
  return {
    products: JSON.parse(JSON.stringify(products)),
    customers: JSON.parse(JSON.stringify(customers)),
    sales: JSON.parse(JSON.stringify(sales)),
    expenses: JSON.parse(JSON.stringify(expenses)),
    debts: JSON.parse(JSON.stringify(debts)),
    purchases: JSON.parse(JSON.stringify(purchases)),
    staff: JSON.parse(JSON.stringify(staff)),
    movements: JSON.parse(JSON.stringify(movements)),
    heldSales: [],
    settings: {
      business: {
        businessName: "Prince Fashion Store",
        businessType: "Fashion",
        phone: "024 555 0192",
        location: "14 Oxford Street, Osu",
        region: "Greater Accra",
        currency: "GH₵ (Ghana Cedi)",
      },
      profile: { name: "Prince Ankomah", email: "prince@kasabiz.demo", phone: "024 555 0192" },
      notifications: { lowStock: true, debtReminders: true, dailySummary: true },
      plan: "Pro",
    },
    nextReceipt: 1028,
  };
}

/* ---------- Admin demo data (KasaBiz platform-level) ---------- */

export const adminData = {
  stats: {
    totalUsers: 1284, totalBusinesses: 861, activeBusinesses: 547,
    monthlyRevenue: 18420, freeUsers: 612, proUsers: 198, businessUsers: 51,
  },
  registrations: [
    { m: "Mar", users: 62, businesses: 41 }, { m: "Apr", users: 78, businesses: 55 },
    { m: "May", users: 91, businesses: 60 }, { m: "Jun", users: 104, businesses: 74 },
    { m: "Jul", users: 118, businesses: 88 }, { m: "Aug", users: 131, businesses: 95 },
    { m: "Sep", users: 126, businesses: 90 }, { m: "Oct", users: 149, businesses: 112 },
    { m: "Nov", users: 167, businesses: 128 }, { m: "Dec", users: 158, businesses: 119 },
    { m: "Jan", users: 183, businesses: 141 }, { m: "Feb", users: 196, businesses: 152 },
  ],
  revenue: [
    { m: "Sep", amount: 9800 }, { m: "Oct", amount: 11650 }, { m: "Nov", amount: 13480 },
    { m: "Dec", amount: 14220 }, { m: "Jan", amount: 16340 }, { m: "Feb", amount: 18420 },
  ],
  regions: [
    { name: "Greater Accra", value: 318 }, { name: "Ashanti", value: 204 },
    { name: "Central", value: 87 }, { name: "Eastern", value: 71 },
    { name: "Western", value: 58 }, { name: "Northern", value: 44 }, { name: "Others", value: 79 },
  ],
  types: [
    { name: "Retail", value: 262 }, { name: "Food", value: 171 }, { name: "Fashion", value: 143 },
    { name: "Beauty", value: 96 }, { name: "Electronics", value: 74 }, { name: "Services", value: 63 }, { name: "Other", value: 52 },
  ],
  recentUsers: [
    { id: 1, name: "Adwoa Nyarko", email: "adwoa@glowbeauty.gh", plan: "Pro", joined: "2 hours ago" },
    { id: 2, name: "Selorm Attipoe", email: "selorm@voltatech.gh", plan: "Free", joined: "5 hours ago" },
    { id: 3, name: "Mariam Iddrisu", email: "mariam@tamalefoods.gh", plan: "Business", joined: "Yesterday" },
    { id: 4, name: "Kwabena Osei", email: "kwabena@oseipharmacy.gh", plan: "Free", joined: "Yesterday" },
    { id: 5, name: "Josephine Baah", email: "josephine@baahprovisions.gh", plan: "Pro", joined: "2 days ago" },
  ],
  recentBusinesses: [
    { id: 1, name: "Glow Beauty Studio", owner: "Adwoa Nyarko", region: "Greater Accra", type: "Beauty", plan: "Pro", mrr: 25 },
    { id: 2, name: "VoltaTech Electronics", owner: "Selorm Attipoe", region: "Volta", type: "Electronics", plan: "Free", mrr: 0 },
    { id: 3, name: "Tamale Fresh Foods", owner: "Mariam Iddrisu", region: "Northern", type: "Food", plan: "Business", mrr: 50 },
    { id: 4, name: "Osei Pharmacy", owner: "Kwabena Osei", region: "Ashanti", type: "Pharmacy", plan: "Free", mrr: 0 },
    { id: 5, name: "Baah Provision Store", owner: "Josephine Baah", region: "Central", type: "Retail", plan: "Pro", mrr: 25 },
    { id: 6, name: "Ashanti Auto Works", owner: "Kwesi Appiah", region: "Ashanti", type: "Services", plan: "Business", mrr: 50 },
  ],
};
