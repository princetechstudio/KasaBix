import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, KeyRound, Sparkles } from "lucide-react";
import AuthShell from "../components/layout/AuthShell";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import { Button, Field, Input } from "../components/ui/core";

const GoogleIcon = () => (
  <svg className="h-4.5 w-4.5 h-[18px] w-[18px]" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.9z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1L1.3 17.2C3.3 21.2 7.3 24 12 24z" />
    <path fill="#FBBC05" d="M5.1 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.3 6.8C.5 8.4 0 10.2 0 12s.5 3.6 1.3 5.2l3.8-2.9z" />
    <path fill="#EA4335" d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.3-3.2C18 1.4 15.2 0 12 0 7.3 0 3.3 2.8 1.3 6.8l3.8 2.9c.9-3 3.7-5 6.9-5z" />
  </svg>
);

export default function Login() {
  const { login, loginWithGoogle } = useApp();
  const toast = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState("prince@kasabiz.demo");
  const [password, setPassword] = useState("demo1234");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<"form" | "google" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading("form");
    const s = await login(email, password);
    toast.push(`Welcome back, ${s.name.split(" ")[0]}!`, "success");
    nav("/dashboard");
  };

  const google = async () => {
    setLoading("google");
    const s = await loginWithGoogle();
    toast.push(`Signed in with Google as ${s.name}`, "success");
    nav("/dashboard");
  };

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to your KasaBiz dashboard."
      footer={<>New to KasaBiz? <Link to="/register" className="font-bold text-primary-600 hover:underline dark:text-primary-400">Create a free account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={email} error={!!errors.email} autoComplete="email"
            onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input type="password" value={password} error={!!errors.password} autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <div className="flex justify-end">
          <button type="button"
            onClick={() => toast.push("Password reset link sent to your email (demo).", "info")}
            className="text-[13px] font-bold text-primary-600 hover:underline dark:text-primary-400">
            Forgot password?
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading === "form"}>
          <LogIn className="h-4 w-4" /> Login
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <Button variant="secondary" size="lg" className="w-full" loading={loading === "google"} onClick={google}>
        <GoogleIcon /> Continue with Google
      </Button>

      <p className="mt-5 flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-3 text-xs font-semibold leading-relaxed text-primary-800 dark:border-primary-900 dark:bg-primary-500/10 dark:text-primary-300">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
        Demo mode — any email and password (6+ characters) signs you into the sample business, Prince Fashion Store.
      </p>
    </AuthShell>
  );
}
