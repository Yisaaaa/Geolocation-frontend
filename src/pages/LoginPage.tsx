import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setLoading] = useState(false);

  console.log("LOGIN PAGE MOUNTED");

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      setLoading(true);
      console.log("Logging in");
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.log("err");
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="text-text-primary w-full min-h-screen flex flex-col items-center gap-8">
      <div className="mt-40">
        {/* Icon here */}
        <h1 className="text-center text-4xl font-semibold">IP Geolocation</h1>
        <p>Track and visualize IP locations worldwide</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="font-semibold text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="test@example.com"
                  className="border-border border-2 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="font-semibold text-sm">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="border-border border-2 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-error text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent-color hover:bg-accent-color-hover text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-70 text-sm"
              >
                {isLoading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Signing in...</p>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
