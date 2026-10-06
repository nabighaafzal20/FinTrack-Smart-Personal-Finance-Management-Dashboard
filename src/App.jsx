import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FinanceProvider } from "./context/FinanceContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13.5px",
                },
              }}
            />
          </BrowserRouter>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
