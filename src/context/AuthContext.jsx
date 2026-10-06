import { createContext, useState, useCallback, useEffect } from "react";
import * as authService from "../services/authService";
import { categoryService } from "../services/categoryService";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      categoryService.ensureDefaultCategories(user.id);
    }
  }, [user]);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login({ email, password });
      authService.setCurrentUser(loggedInUser);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    try {
      const newUser = await authService.register({ name, email, password });
      authService.setCurrentUser(newUser);
      setUser(newUser);
      toast.success("Account created successfully!");
      return newUser;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully.");
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return;
    try {
      const updated = authService.updateUser(user.id, updates);
      setUser(updated);
      toast.success("Profile updated.");
      return updated;
    } catch (err) {
      toast.error(err.message);
    }
  }, [user]);

  const changePassword = useCallback(async (newPassword) => {
    if (!user) return;
    await authService.changePassword(user.id, newPassword);
    toast.success("Password changed successfully.");
  }, [user]);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    authService.deleteUser(user.id);
    authService.logout();
    setUser(null);
    toast.success("Account deleted.");
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
