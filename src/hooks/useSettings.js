import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getSettings, updateSettings } from "../services/settingsService";

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => (user ? getSettings(user.id) : null));

  useEffect(() => {
    if (user) setSettings(getSettings(user.id));
  }, [user]);

  const save = useCallback(
    (updates) => {
      if (!user) return;
      const updated = updateSettings(user.id, updates);
      setSettings(updated);
      return updated;
    },
    [user]
  );

  return { settings, updateSettings: save };
}
