import ProductList from "./ProductsList";
import Search from "./Search";
import UserNavbar from "../UserNavbar/UserNavbar";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);
        const categorySnapshot = await getDocs(collection(db, "category"));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const mergedProducts = productList.map((product) => {
          const matchedCategory = categoryList.find(
            (cat) => cat.id === String(product.category_id)
          );
          return {
            ...product,
            category: matchedCategory?.name || "Unknown",
          };
        });

        setProducts(mergedProducts);
        setCategories(["All", ...new Set(categoryList.map((c) => c.name))]);
      } catch (error) {
        console.error("Error fetching products :", error);
      }
    };
    fetchProductData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );
  return (
    <>
    <UserNavbar/>
      <div className="min-h-screen flex flex-col items-center p-6">
        <Search search={searchQuery} onSearchChange={handleSearchChange} />
        <ProductList products={filteredProducts} categories={categories} />
      </div>
    </>
  );
}
