import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { findUserByEmail } from "../../services/authService";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const user = findUserByEmail(email);
    if (user) {
      setSent(true);
    } else {
      toast.error("No account found with that email address.");
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <AuthLayout>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%", background: "var(--success-100)",
              color: "var(--success-500)", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>Check your simulated inbox</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 26 }}>
            Password reset instructions have been simulated successfully. Since FinTrack is a
            frontend-only demo, no real email was sent — you can go back and log in with your
            existing password.
          </p>
          <Link to="/login">
            <Button fullWidth icon={ArrowLeft}>Back to Login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>Forgot your password?</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
        Enter your email and we'll simulate sending you reset instructions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Send Reset Instructions
        </Button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, fontSize: 13.5 }}>
        <Link to="/login" style={{ color: "var(--brand-500)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
