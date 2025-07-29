import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import ProductCard from "./ProductCard";

export default function Recommendation({ category, excludeId }) {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        let q;
        if (category) {
          q = query(
            collection(db, "Products"),
            where("categoryName", "==", category)
          );
        } else {
          q = collection(db, "Products");
        }

        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((prod) => prod.id !== excludeId);
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendation();
  }, [category, excludeId]);

  return (
    <div className="w-full px-6 sm:px-12 lg:px-20 mt-4 ">
      <div className="text-3xl text-center sm:text-3xl text-[#A78074] font-bold mb-7 ">
        {products.length > 0
          ? "Similar products just for you"
          : "No related products found"}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.imgURL}
            rating={product.rating}
            stock={product.stock}
          />
        ))}
      </div>
      {visibleCount < products.length && (
        <div className="text-center mt-7 mb-6">
          <button
            onClick={() => setVisibleCount(visibleCount + 4)}
            className="bg-[#A78074] text-white py-2 px-6 rounded-lg hover:bg-[#946c61] transition duration-300 cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
