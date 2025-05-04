"use client";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { CREATE_USER, UPDATE_USER } from "@/lib/queries";
import { motion } from "framer-motion";
import { User } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { showToast } from "./ShowToast";

type FormData = {
  name: string;
  email: string;
  password?: string;
  location: string;
  profilePhoto: string;
  role: string;
  status: string;
};


interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onCancel?: () => void;
}


export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { user: authUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          location: user.location || "",
          profilePhoto: user.profilePhoto || "",
          role: user.role,
          status: user.status,
        }
      : undefined,
  });

  const [createUser, { loading: createLoading, error: createError }] =
    useMutation(CREATE_USER);
  const [updateUser, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER);

  const onSubmit = async (data: FormData) => {
    try {
      if (user) {
        const { ...updateData } = data;
        await updateUser({
          variables: { id: user.id, input: updateData },
          refetchQueries: ["GetUsers"],
        });
        showToast("User updated successfully", "success");
      } else {
        if (!data.password) {
          showToast('Password is required', "error");
          return;
        }
        await createUser({
          variables: { input: { ...data } },
          refetchQueries: ["GetUsers"],
        });
        showToast('User created successfully', "success");
      }
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Operation failed', "error");
    }
  };

  const handleCancel = () => {
    reset(); // Reset form fields
    onCancel?.(); // Call onCancel if provided
  };

  if (!authUser) {
    return (
      <div className="text-center p-6 text-red-400">
        Please log in to create or edit users.
      </div>
    );
  }


  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-green-50"
        >
          Full Name
        </label>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter full name"
          className="w-full p-3 bg-white/5 rounded-md border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
        />
        {errors.name && (
          <span className="text-red-400 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-green-50"
        >
          Email
        </label>
        <input
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
          placeholder="Enter email"
          className="w-full p-3 bg-white/5 rounded-md border border-white/10 text-white  focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
        />
        {errors.email && (
          <span className="text-red-400 text-sm">{errors.email.message}</span>
        )}
      </div>

      {!user && (
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
            placeholder="Enter password"
            className="w-full p-3 bg-white/5 rounded-md border border-white/10 text-white  focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
          />
          {errors.password && (
            <span className="text-red-400 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-green-50"
        >
          Location
        </label>
        <input
          id="location"
          {...register("location")}
          placeholder="Enter location"
          className="w-full p-3 bg-white/5 rounded-md border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-green-50"
        >
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner appearance-none"
        >
          <option className="text-black" value="">
            Select Role
          </option>
          <option className="text-black" value="ADMIN">
            Admin
          </option>
          <option className="text-black" value="USER">
            User
          </option>
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-green-50"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner appearance-none"
        >
          <option className="text-black" value="">
            Select Status
          </option>
          <option className="text-black" value="ACTIVE">
            Active
          </option>
          <option className="text-black" value="INACTIVE">
            Inactive
          </option>
        </select>
      </div>

      {(createError || updateError) && (
        <span className="text-red-400 text-sm block">
          {createError?.message || updateError?.message}
        </span>
      )}

      <div>
        <label
          htmlFor="profilePhoto"
          className="block text-sm font-medium text-green-50"
        >
          Profile Image URL
        </label>
        <input
          id="profilePhoto"
          {...register("profilePhoto")}
          placeholder="Enter profile image URL"
          className="w-full p-3 bg-white/5 rounded-md border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleCancel}
          className="w-full p-3 bg-gray-500/80 text-white rounded-md hover:bg-gray-600 transition-all duration-200"
        >
          Cancel
        </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={createLoading || updateLoading}
        className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-all duration-200"
      >
        {(createLoading || updateLoading) ? (
      <>
      <span className="flex items-center justify-center gap-2">

        <LoadingSpinner size="sm" />
        {user ? "Updating..." : "Creating..."}
      </span>
      </>
    ) : user ? "Update User" : "Add User"}
      </motion.button>
      </div>
    </motion.form>
  );
}
