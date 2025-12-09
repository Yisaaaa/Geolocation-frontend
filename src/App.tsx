import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/authStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
    // document.documentElement.classList.add("dark");
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" richColors />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
