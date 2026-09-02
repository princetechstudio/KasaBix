import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import AuthShell from "../components/layout/AuthShell";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/ui/Toast";
import { Button, Field, Input, Select } from "../components/ui/core";
import { BUSINESS_TYPES } from "../data/mockData";

export default function Register() {
  const { register } = useApp();
  const toast = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", businessName: "", businessType: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.fullName.trim().length < 2) errs.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!/^0\d{2}\s?\d{3}\s?\d{4}$/.test(form.phone.trim())) errs.phone = "Use a Ghanaian number, e.g. 024 417 8830.";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.businessName.trim().length < 2) errs.businessName = "Enter your business name.";
    if (!form.businessType) errs.businessType = "Select your business type.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const s = await register(form);
    toast.push(`${s.businessName} is ready. Welcome to KasaBiz!`, "success");
    nav("/dashboard");
  };

  return (
    <AuthShell
      title="Create your free account"
      sub="Set up your business in under a minute. No card required."
      footer={<>Already have an account? <Link to="/login" className="font-bold text-primary-600 hover:underline dark:text-primary-400">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.fullName}>
            <Input value={form.fullName} error={!!errors.fullName} onChange={set("fullName")} placeholder="Kwesi Mensah" />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <Input value={form.phone} error={!!errors.phone} onChange={set("phone")} placeholder="024 417 8830" inputMode="tel" />
          </Field>
        </div>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={form.email} error={!!errors.email} onChange={set("email")} placeholder="you@business.com" />
        </Field>
        <Field label="Password" error={errors.password} hint="At least 6 characters.">
          <Input type="password" value={form.password} error={!!errors.password} onChange={set("password")} placeholder="••••••••" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name" error={errors.businessName}>
            <Input value={form.businessName} error={!!errors.businessName} onChange={set("businessName")} placeholder="Mensah Provisions" />
          </Field>
          <Field label="Business type" error={errors.businessType}>
            <Select value={form.businessType} error={!!errors.businessType} onChange={set("businessType")}>
              <option value="">Select type…</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          <UserPlus className="h-4 w-4" /> Start Free
        </Button>
        <p className="text-center text-xs font-medium leading-relaxed text-slate-400">
          By continuing you agree to the KasaBiz Terms & Privacy Policy. This is a frontend demo — no real account is created.
        </p>
      </form>
    </AuthShell>
  );
}
