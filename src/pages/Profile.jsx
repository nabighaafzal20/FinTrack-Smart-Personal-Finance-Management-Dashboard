import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { initials } from "../utils/formatters";

const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED", "SAR"];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      currency: settings?.currency || "PKR",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    updateProfile({ name: data.name.trim(), bio: data.bio?.trim() || "", avatar });
    if (data.currency !== settings?.currency) {
      updateSettings({ currency: data.currency });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your personal information.</p>
        </div>
      </div>

      <Card style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
          <div className="profile-avatar-wrap">
            {avatar ? (
              <img src={avatar} alt="Profile avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-fallback">{initials(user?.name || "U")}</div>
            )}
            <label className="profile-avatar-edit" title="Change photo">
              <Camera size={13} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="visually-hidden" />
            </label>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{user?.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full Name" icon={User} error={errors.name?.message} {...register("name", { required: "Full name is required" })} />
          <Input label="Email Address" icon={Mail} disabled {...register("email")} hint="Email address cannot be changed." />
          <Select label="Preferred Currency" {...register("currency")}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Textarea label="Bio" rows={3} placeholder="Tell us a little about yourself..." {...register("bio")} />

          <Button type="submit" loading={isSubmitting} style={{ alignSelf: "flex-start" }}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
