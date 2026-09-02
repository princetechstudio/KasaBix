import type { Session } from "../types";

/**
 * Mock authentication service.
 *
 * This is a frontend demo: sessions live in localStorage and latency is
 * simulated. To connect a real backend later, replace the bodies of these
 * functions with Supabase calls (supabase.auth.signInWithPassword,
 * supabase.auth.signUp, supabase.auth.signOut) — the signatures and the
 * `Session` shape stay the same, so no UI changes are required.
 */

const SESSION_KEY = "kasabiz_session";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  businessType: string;
}

export const authService = {
  async login(email: string, _password: string): Promise<Session> {
    await delay(800);
    const session: Session = {
      name: "Prince Ankomah",
      email: email || "prince@kasabiz.demo",
      businessName: "Prince Fashion Store",
      role: "Owner",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async loginWithGoogle(): Promise<Session> {
    await delay(900);
    const session: Session = {
      name: "Prince Ankomah",
      email: "prince.ankomah@gmail.com",
      businessName: "Prince Fashion Store",
      role: "Owner",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async register(input: RegisterInput): Promise<Session> {
    await delay(900);
    const session: Session = {
      name: input.fullName,
      email: input.email,
      businessName: input.businessName,
      role: "Owner",
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
};
