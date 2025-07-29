import React from "react";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../Navbar/Navbar";
import { Link } from 'react-router-dom'
export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get only approved products, ordered (e.g. by popularity or creation), limit to 3
        const productsRef = collection(db, "Products");
        const q = query(
          productsRef,
          where("status", "==", "approved"),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(list);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#F5F5F1] py-12 px-6 md:px-16 text-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-[#A78074] mx-auto"></div>
      </section>
    );
  }

  return (
    <>
      <Navbar />
      <section className="bg-[#F5F5F1] text-[#A78074] py-12 px-6 md:px-16">
        <div className="mb-10 max-w-xl">
          <h2 className="text-4xl font-light mb-4">Featured Products</h2>
          <p className="text-sm mb-2">
            Explore our best‑sellers made with dexterous hands — timeless and expressive pieces for everyday life.
          </p>
          {/* Optionally show the date or other info */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="group bg-white p-4 shadow-sm hover:shadow-md transition duration-300 relative"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={product.imgURL || product.img}
                  alt={product.title}
                  className="w-full h-full object-contain transition-opacity duration-500 "
                />
                
                
              
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-1">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-[#A78074] font-semibold">
                  {product.price?.toFixed(2)} EGP
                  {product.salePrice && (
                    <span className="line-through ml-2 text-sm text-red-400">
                      {product.salePrice.toFixed(2)} EGP
                    </span>
                  )}
                </p>
                <Link to='/login' className="bg-[#A78074] text-white px-4 py-2 rounded-md border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">
                  Quick view
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to='/login' className="bg-[#A78074] text-white px-6 py-2 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">
            Show More Products
          </Link>
        </div>
      </section>
    </>
  );
}

