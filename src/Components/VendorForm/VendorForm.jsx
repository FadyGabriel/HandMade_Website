// VendorForm
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const validGovernorateCodes = [
  "01",
  "02",
  "03",
  "04",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "31",
  "32",
  "33",
  "34",
  "35",
  "88",
];

const vendorSchema = z.object({
  nationID: z
    .string()
    .length(14, "Nation ID must be exactly 14 digits")
    .regex(/^[23]\d{13}$/, "Nation ID must be digits only") // يبدا بي 2 او 3 دا القرن
    .refine((val) => {
      const year = parseInt(val.slice(1, 3));
      return year >= 0 && year <= 99; // الخانه التانيه والتالته اخر رقمين من سنت الميلاد
    }, "Year in National ID must be between 00 and 99")
    .refine((val) => {
      const month = parseInt(val.slice(3, 5));
      return month >= 1 && month <= 12;
    }, "Month in National ID must be between 01 and 12") // الخانه الرابعه والخامسه الشهر
    .refine((val) => {
      const day = parseInt(val.slice(5, 7));
      return day >= 1 && day <= 31;
    }, "Day in National ID must be between 01 and 31") // الخانه السادسه والسابعه يوم اليملاد
    .refine((val) => {
      const govCode = val.slice(7, 9);
      return validGovernorateCodes.includes(govCode);
    }, "Governorate code in National ID is invalid") // الخانه التامنه والتسعه كود المحافظه
    .refine((val) => {
      const serial = parseInt(val.slice(9, 12));
      return serial >= 0 && serial <= 999;
    }, "Serial number in National ID must be between 000 and 999") // الخانه 10 11 12 ترتيب اتولدت كام في المحافظه بتاعتي
    .refine((val) => {
      const genderDigit = parseInt(val.slice(12, 13));
      return genderDigit >= 0 && genderDigit <= 9;
    }, "Gender digit must be a number between 0 and 9") // رقم لو زوجي انثي لو فردي ذكر الخانه 13
    .refine((val) => {
      const checkDigit = parseInt(val.slice(13, 14));
      return checkDigit >= 0 && checkDigit <= 9;
    }, "Invalid national ID format"), // الخانه 14 رقم عشوائي للحمايه البطاقه من التزوير
  bio: z.string().min(20, "Bio must be exactly 20 characters"),
});

export default function VendorForm() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(vendorSchema),
    mode: "onBlur",
  });

  const nationIDValue = watch("nationID", "");

  const onSubmit = async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const vendorData = {
          ...userData,
          bio: formData.bio,
          nationID: formData.nationID,
        };

        await setDoc(doc(db, "Vendors", user.uid), vendorData);
        toast.success("Vendor details saved!");
        navigate("/login");
      } else {
        console.error("User document not found");
        toast.error("User document not found");
      }
    } catch (error) {
      console.error("Error saving vendor details:", error);
      toast.error("Error saving vendor details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8F1EF] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full"
      >
        <h2 className="text-3xl font-bold text-center text-[#A77F73] mb-6">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nation ID */}
          <div>
            <label
              htmlFor="nationID"
              className="block text-sm text-gray-700 mb-1"
            >
              Nation ID
            </label>
            <input
              type="text"
              id="nationID"
              {...register("nationID")}
              className={`w-full px-4 py-2 border rounded-md outline-none ${
                errors.nationID
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#A77F73]"
              }`}
              placeholder="Enter your 14-digit nation ID"
              maxLength={14}
            />

            <p
              className={`text-xs mt-1 text-left ${
                nationIDValue.length === 14 ? "text-green-500" : "text-gray-500"
              }`}
            >
              {nationIDValue.length}/14 digits
            </p>

            {errors.nationID && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nationID.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              {...register("bio")}
              className={`w-full px-4 py-2 border rounded-md outline-none resize-vertical ${
                errors.bio
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#A77F73]"
              }`}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
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
                  Saving...
                </span>
              ) : (
                "Submit"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
