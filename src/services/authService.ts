/**
 * authService — mock authentication for the frontend demo.
 *
 * Every function returns a Promise with the same signature a real backend
 * client (e.g. Supabase Auth) would expose, so swapping in real auth later
 * only means replacing the bodies of these functions — no UI changes.
 */
import { DEFAULT_SETTINGS, DEMO_USER } from "../data/mockData";
import type { BusinessSettings } from "../data/mockData";

export interface Session {
  user: { name: string; email: string; phone: string };
  business: BusinessSettings;
  signedInAt: string;
}

const SESSION_KEY = "kasabiz_session_v1";
const PROFILE_KEY = "kasabiz_profile_v1";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export const authService = {
  /** Demo login — any email + password (min 6 chars) succeeds. */
  async login(email: string, _password: string): Promise<Session> {
    await delay(750);
    const profile = localStorage.getItem(PROFILE_KEY);
    const user = profile
      ? (JSON.parse(profile) as Session["user"])
      : { ...DEMO_USER, email };
    const session: Session = {
      user,
      business: { ...DEFAULT_SETTINGS },
      signedInAt: new Date().toISOString(),
    };
    writeSession(session);
    return session;
  },

  /** Demo registration — stores the profile so the session feels real. */
  async register(data: {
    fullName: string; email: string; phone: string; businessName: string; businessType: string;
  }): Promise<Session> {
    await delay(900);
    const user = { name: data.fullName, email: data.email, phone: data.phone };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    const session: Session = {
      user,
      business: { ...DEFAULT_SETTINGS, name: data.businessName, type: data.businessType },
      signedInAt: new Date().toISOString(),
    };
    writeSession(session);
    return session;
  },

  /** "Continue with Google" — frontend demo only. */
  async loginWithGoogle(): Promise<Session> {
    await delay(800);
    return this.login("prince@kasabiz.demo", "demo-password");
  },

  async requestPasswordReset(_email: string): Promise<void> {
    await delay(600); // would call POST /auth/reset in production
  },

  getSession(): Session | null {
    return readSession();
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
  },
};
