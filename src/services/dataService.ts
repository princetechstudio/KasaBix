import type { DB } from "../types";
import { seedDatabase } from "../data/mockData";

/**
 * Local persistence layer for the demo dataset.
 * Swap these two functions for Supabase reads/writes when a backend exists —
 * the rest of the app only talks to this interface.
 */

const DB_KEY = "kasabiz_db_v1";

export const dataService = {
  load(): DB {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DB;
        if (parsed && Array.isArray(parsed.products) && parsed.settings) return parsed;
      }
    } catch {
      /* corrupted storage → reseed */
    }
    const fresh = seedDatabase();
    this.save(fresh);
    return fresh;
  },

  save(db: DB): void {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage full or unavailable — demo keeps working in memory */
    }
  },

  reset(): DB {
    const fresh = seedDatabase();
    this.save(fresh);
    return fresh;
  },
};

export {
  productService, salesService, customerService, expenseService,
} from "./domainServices";
