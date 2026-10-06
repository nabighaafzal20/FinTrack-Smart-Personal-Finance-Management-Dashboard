import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      navigate("/dashboard");
    } catch {
      // error toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>Welcome back</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
        Log in to continue to your dashboard.
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
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", cursor: "pointer" }}>
            <input type="checkbox" {...register("rememberMe")} />
            Remember me
          </label>
          <Link to="/forgot-password" style={{ color: "var(--brand-500)", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={submitting}>
          Log In
        </Button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, fontSize: 13.5, color: "var(--text-secondary)" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "var(--brand-500)", fontWeight: 700 }}>
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
