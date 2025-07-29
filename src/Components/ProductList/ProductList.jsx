import ProductCard from "../ProductCard/ProductCard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
export default function ProductList() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "Products"),
      where("status", "==", "approved")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const approvedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(approvedProducts.slice(0 , 4));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">No approved products yet.</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.imgURL}
            rating={product.rating}
            categoryName={product.categoryName}
            
          />
        ))
      )}
    </div>
  );
}
