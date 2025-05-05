"use client";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { LOGIN } from "@/lib/queries";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/ShowToast";
import client from '@/lib/apollo';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [login, { loading, error }] = useMutation(LOGIN);
  // const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const {
        data: {
          login: { token, user },
        },
      } = await login({
        variables: { email: data.email, password: data.password },
      });

      if (user.status === "INACTIVE") {
        showToast("Your account is inactive. Please contact support.", "error");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);

      // Wait for the Apollo Client store to reset
      await client.resetStore();

      showToast("Login successful! Reloading...", "success");
      // Force a full page reload instead of client-side navigation
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    }
  };

  useEffect(() => {
    if (error) {
      showToast(error.message, "error");
    }
  }, [error]);

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen bg-gradient-to-br from-green-950 to-green-950 flex items-center justify-center px-4 sm:px-6 relative overflow-hidden"
      >
        {/* Decorative Background Shapes - Adjusted for mobile */}
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-green-700/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-600/50 rounded-full blur-3xl -z-10"></div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white/15 backdrop-blur-2xl my-10 rounded-lg p-4 sm:p-6 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] bg-gradient-to-b from-white/5 to-transparent mx-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-50 mb-3 sm:mb-4">
            Welcome back
          </h1>
          <p className="text-center text-green-100 text-sm sm:text-base mb-4 sm:mb-6">
            Please enter your details.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-50"
              >
                E-mail
              </label>
              <input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                placeholder="Enter your e-mail"
                className="w-full p-2 sm:p-3 text-sm sm:text-base bg-white/5 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner"
              />
              {errors.email && (
                <span className="text-red-400 text-xs sm:text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-50"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 sm:p-3 text-sm sm:text-base bg-white/5 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner"
              />
              {errors.password && (
                <span className="text-red-400 text-xs sm:text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs sm:text-sm text-green-100">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-400"
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="text-green-200 hover:underline text-xs sm:text-sm">
                Forgot your password?
              </a>
            </div>
            
            {error && (
              <span className="text-red-400 text-xs sm:text-sm block">
                {error.message}
              </span>
            )}
            
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full p-2 sm:p-3 text-sm sm:text-base bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-all duration-200 font-medium sm:font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Log in"
              )}
            </motion.button>
          </form>
          
          <p className="text-center text-green-100 text-xs sm:text-sm mt-3 sm:mt-4">
            Dont have an account?{" "}
            <Link href="/signup" className="text-green-200 hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
}