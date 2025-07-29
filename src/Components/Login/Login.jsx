import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../../firebase";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import Navbar from '../Navbar/Navbar';
import { useState } from 'react';

// Validation schema
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setLoading(true);
  try {
    // Admin credentials check (fixed email/password)
    if (data.email === "admin123@gmail.com" && data.password === "admin@123") {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Welcome Admin");
      navigate("/admin/overview");
      return;
    }

    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Get role from Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      toast.error("User data not found in Firestore.");
      return;
    }

    const userData = userDocSnap.data();
    console.log(userData);
    

    if (userData.role === "customer") {
      toast.success("Welcome Customer");
      navigate("/homeuser");
    } else if (userData.role === "vendor") {
      toast.success("Welcome Vendor");
      navigate("/vendorhome");
    } else {
      toast.error("Unknown user role.");
    }
    setLoading(false);
  } catch (error) {
    console.error('Login error:', error);
    switch (error.code) {
      case 'auth/user-not-found':
        toast.error('User not found.');
        break;
      case 'auth/wrong-password':
        toast.error('Incorrect password.');
        break;
      case 'auth/invalid-email':
        toast.error('Invalid email format.');
        break;
      default:
        toast.error('Login failed. Please try again.');
    }
    setLoading(false);
  }
};
  return (
    <>
    <Navbar></Navbar>
    <section className="min-h-screen bg-[#F8F1EF] flex items-center justify-center px-4">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-center text-[#A77F73] mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#A77F73] focus:border-[#A77F73] outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#A77F73] focus:border-[#A77F73] outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className={`w-full bg-[#A77F73] text-white py-2.5 rounded-md font-medium text-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-[#90675F]"
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
                  </svg>{" "}
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </motion.button>

          {/* Link to Register */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#A77F73] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
    </>
  );
};

export default Login;