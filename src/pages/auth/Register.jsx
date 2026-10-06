import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch {
      // error toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout subtitle="Create your free account and start tracking your finances in minutes.">
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>Create your account</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
        It only takes a minute to get started.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Full name"
          icon={User}
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name", { required: "Full name is required" })}
        />
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
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <Button type="submit" fullWidth loading={submitting} style={{ marginTop: 4 }}>
          Create Account
        </Button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, fontSize: 13.5, color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--brand-500)", fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
