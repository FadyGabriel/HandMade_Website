import React, { useEffect, useState } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(6, { message: "Please enter a valid product title" })
    .max(60, { message: "Title must be less than 60 characters" })
    .regex(/^[\p{L}\s]+$/u, { message: "Title can only contain letters" }),

  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine(
    (val) => {
      if (!val) return false; // فارغ مش مقبول
      if (isNaN(Number(val))) return false;

      const num = parseFloat(val);
      if (num <= 0) return false;

      if (/^0\d+/.test(val)) return false;

      return true;
    },
    {
      message: "Price must be a valid number greater than zero ",
    }
  ),

  category: z.string().min(1, "Category is required"),
  stock: z.string().refine(
    (val) => {
      if (!val) return false;
      if (!/^\d+$/.test(val)) return false;

      const num = parseInt(val, 10);
      if (num <= 0) return false;

      if (/^0\d+/.test(val)) return false;

      return true;
    },
    {
      message: "Stock must be a valid integer greater than zero",
    }
  ),
});

const AddProduct = ({ selectedProduct, onSaveComplete }) => {
  const [imageFile, setImageFile] = useState(null);
  const isEditMode = selectedProduct !== null;

  const categoryMap = {
    Textiles: 1,
    Clothing: 2,
    Woodwork: 3,
    "Home Decor": 4,
    Accessories: 5,
    "Wall Art": 6,
    Candles: 7,
    Jewelry: 8,
    Kitchenware: 9,
    "Plants & Terrariums": 10,
    Others: 11,
  };
  const categories = Object.keys(categoryMap);
  const getCategoryId = (name) => categoryMap[name] || 0;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isEditMode && selectedProduct) {
      reset({
        title: selectedProduct.title || "",
        description: selectedProduct.description || "",
        price: String(selectedProduct.price || ""),
        category: selectedProduct.categoryName || "",
        stock: String(selectedProduct.stock || ""),
      });
    } else {
      reset();
    }
  }, [selectedProduct, isEditMode, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "react_uploads");
    data.append("cloud_name", "dojghbhxq");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dojghbhxq/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const onSubmit = async (formData) => {
    if (!imageFile && !isEditMode) {
      toast.error("Image is required");
      return;
    }

    try {
      let imgURL = selectedProduct?.imgURL || "";

      if (imageFile) {
        toast.loading("Uploading image...");
        imgURL = await uploadToCloudinary(imageFile);
        toast.dismiss();
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: getCategoryId(formData.category),
        categoryName: formData.category,
        stock: parseInt(formData.stock),
        imgURL,
        status: selectedProduct?.status || "pending",
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        const productRef = doc(db, "Products", selectedProduct.id);
        await updateDoc(productRef, productData);
        toast.success("Product updated!");
      } else {
        productData.createdAt = new Date().toISOString();
        productData.vendorId = auth.currentUser.uid;
        productData.vendorRef = doc(db, "Vendors", auth.currentUser.uid);
        await addDoc(collection(db, "Products"), productData);
        toast.success("Product added!");
      }

      reset();
      setImageFile(null);
      onSaveComplete && onSaveComplete();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 rounded-lg bg-[#F5F5F1] shadow-xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-2xl font-bold text-[#A78074] mb-6 text-center">
          {isEditMode ? "Update Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["title", "description", "price", "stock"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field[0].toUpperCase() + field.slice(1)}
              </label>
              {field === "description" ? (
                <textarea
                  id={field}
                  {...register(field)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  type={
                    field === "price" || field === "stock" ? "number" : "text"
                  }
                  id={field}
                  {...register(field)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#A77F73] ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded-md"
            />
            {isSubmitted && !imageFile && !isEditMode && (
              <p className="text-red-500 text-sm mt-1">Image is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#A77F73] text-white py-2 px-4 rounded-md hover:scale-[1.04] cursor-pointer hover:bg-[#90675F] focus:outline-none transition duration-500"
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;
