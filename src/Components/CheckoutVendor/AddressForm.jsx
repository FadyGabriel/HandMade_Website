import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";    
import UserNavbar from "../UserNavbar/UserNavbar";   

/* ======== التحقق بالـ Yup ======== */
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^01[0-9]{9}$/, "Enter a valid Egyptian phone"),
  city: yup.string().required("City is required"),
  area: yup.string().required("Area is required"),
  address: yup.string().required("Address is required"),
  floor: yup.string().optional(),
});

const AddressForm = ({ onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  /* ======== الحفظ في Firestore ======== */
  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      // users/{uid}/addresses
      const ref = await addDoc(
        collection(db, "users", user.uid, "addresses"),
        {
          ...data,
          createdAt: serverTimestamp(),
        }
      );

      // أعِد البيانات (مع المعرّف) إلى Checkout
      onSave({ id: ref.id, ...data });

      // نظّف الحقول
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to save address, please try again.");
    }
  };

  return (
    <>
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 bg-[#faf8f6] p-5 rounded-xl border border-[#A78074]/20"
    >
      <h3 className="text-lg font-semibold text-[#A78074] mb-1">
        Shipping Address
      </h3>

      {[
        { label: "Full Name", name: "fullName" },
        { label: "Phone Number", name: "phone", type: "tel" },
        { label: "City", name: "city" },
        { label: "Area", name: "area" },
        { label: "Address", name: "address" },
        { label: "Floor No (optional)", name: "floor" },
      ].map(({ label, name, type = "text" }) => (
        <div key={name}>
          <input
            type={type}
            placeholder={label}
            {...register(name)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors[name]
                ? "border-red-400"
                : "border-[#d9d5d2] focus:border-[#A78074]"
            } focus:outline-none`}
          />
          {errors[name] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#A78074] text-white py-2 rounded-lg font-medium hover:bg-white hover:text-[#A78074] border border-[#A78074] transition disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save Address"}
      </button>
    </form>
    </>
  );
};

export default AddressForm;
