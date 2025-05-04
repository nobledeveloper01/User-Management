"use client";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SIGNUP } from "@/lib/queries";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/ShowToast";
import LoadingSpinner from "@/components/LoadingSpinner";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [signup, { loading, error }] = useMutation(SIGNUP);
  const router = useRouter();
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signup({
        variables: {
          input: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: "USER",
          },
        },
      });

      showToast(
        "Account created successfully! Redirecting to login...",
        "success"
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Signup failed", "error");
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
        className="min-h-screen bg-gradient-to-br from-green-950 to-green-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-green-700/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-600/50 rounded-full blur-3xl -z-10"></div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white/15 backdrop-blur-2xl rounded-lg p-6 sm:p-8 my-10 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] bg-gradient-to-b from-white/5 to-transparent"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-50 mb-3 sm:mb-4">
            Join Us
          </h1>
          <p className="text-center text-green-100 mb-4 sm:mb-6 text-sm sm:text-base">
            Please enter your details to sign up.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-green-50"
              >
                Name
              </label>
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter your name"
                className="w-full p-2 sm:p-3 bg-white/15 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
              />
              {errors.name && (
                <span className="text-white text-xs sm:text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
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
                className="w-full p-2 sm:p-3 bg-white/5 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
              />
              {errors.email && (
                <span className="text-white text-xs sm:text-sm">
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
                className="w-full p-2 sm:p-3 bg-white/5 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
              />
              {errors.password && (
                <span className="text-white text-xs sm:text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-green-50"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="Confirm your password"
                className="w-full p-2 sm:p-3 bg-white/5 rounded-md border border-white/10 text-green-300 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
              />
              {errors.confirmPassword && (
                <span className="text-white text-xs sm:text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.7))",
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full p-2 sm:p-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    Signing up...
                  </span>
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
          <p className="text-center text-green-100 mt-3 sm:mt-4 text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-green-200 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
}