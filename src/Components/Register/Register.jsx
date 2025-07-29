import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import Navbar from "../Navbar/Navbar";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from 'react-router-dom';
// Zod schema with role field
const schema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, "First name is required")
      .max(10, "First name must not exceed 10 characters")
      .regex(/^[\p{L}]+$/u, "First name must contain letters only"),
    lastName: z
      .string()
      .trim()
      .min(3, "Last name is required")
      .max(10, "Last name must not exceed 10 characters")
      .regex(/^[\p{L}]+$/u, "Last name must contain letters only"),

    email: z.string().refine(
      (val) => {
        const lowerVal = val.toLocaleLowerCase();
        return /^[a-zA-Z][a-zA-Z0-9._%+-]*@(gmail|yahoo)\.(com|net|org)(\.eg)?$/.test(
          lowerVal
        );
      },
      {
        message: "Please enter a valid email",
      }
    ),

    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Phone must be a valid Egyptian number"),

    password: z.string().refine(
      (val) => {
        if (val.length < 12) return false;

        if (!/[a-z]/.test(val)) return false;

        if (!/[A-Z]/.test(val)) return false;

        if (!/\d/.test(val)) return false;

        if ((val.match(/[^a-zA-Z0-9]/g) || []).length < 1) return false;

        if (/\s/.test(val)) return false;

        if (/(.)\1\1/.test(val)) return false;

        return true;
      },
      {
        message:
          "Password must be at least 12 characters, include uppercase, lowercase, number, at least one special character, no spaces, and no triple repeated characters.",
      }
    ),

    confirmPassword: z.string(),

    role: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.enum(["customer", "vendor"], {
        required_error: "Please select a role",
      })
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (data) => {
    console.log("Register form data:", data);
    // handle API call here
    setFirebaseError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      const userData = {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        createdAt: new Date().toISOString(),
        displayName: `${data.firstName} ${data.lastName}`,
        ...(data.role === "vendor" && { status: "pending" }),
      };
      await setDoc(doc(db, "Users", user.uid), userData);
      toast.success("Account created successfully!");

      if (user) {
        if (data.role === "vendor") {
          navigate("/vendorform");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Firebase error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setFirebaseError("Email already registered.");
          break;
        case "auth/weak-password":
          setFirebaseError("Weak password.");
          break;
        default:
          setFirebaseError("Registration failed. Try again.");
          toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#F8F1EF] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full"
        >
          <h2 className="text-3xl font-bold text-center text-[#A77F73] mb-6">
            Create an Account
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="John"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                {...register("phone")}
                placeholder="0123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  style={{ userSelect: "none" }}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#A77F73] outline-none"
                />
                <button
                  type="button"
                  onClick={toggleConfirm}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Role</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input type="radio" value="customer" {...register("role")} />
                  Customer
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input type="radio" value="vendor" {...register("role")} />
                  Vendor
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-2.5 rounded-md font-medium text-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#A77F73] text-white hover:bg-[#90675F]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </motion.button>
              {/* Link to Register */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Do you have an account?{' '}
            <Link to="/login" className="text-[#A77F73] hover:underline">
              Login
            </Link>
          </p>
            </div>
            
            {firebaseError && (
              <p className="text-red-600 text-center mt-2">{firebaseError}</p>
            )}
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default Register;
