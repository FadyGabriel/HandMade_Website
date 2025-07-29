import React, { useState, useEffect } from "react";
import UserNavbar from "../UserNavbar/UserNavbar";
import ProductList from "../ProductList/ProductList";
import Search from "../Search/Search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Banner from "./Banner";
import SpecialOffers from "./SpecialOffers";
import Testimonials from "./Testimonials";
import { Link } from "react-router-dom";
import UserComplaints from "../UserComplaints/UserComplaints";
import UserReviews from "../UserReviews/UserReviews";
export default function HomeUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productSnapshot, categorySnapshot] = await Promise.all([
          getDocs(collection(db, "Products")),
          getDocs(collection(db, "category")),
        ]);

        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoryMap = {};
        categorySnapshot.forEach((doc) => {
          categoryMap[doc.id] = doc.data().name;
        });

        //setProducts(productList);
        setProducts(productList.slice(0 , 6));
        setCategories(categoryMap);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );

  const enrichedProducts = filteredProducts.map((product) => ({
    ...product,
    name: categories[product.categoryId] || "Unknown",
  }));

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen ">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <Banner />
            {/* <Search search={searchQuery} onSearchChange={handleSearchChange} /> */}
            <div>
              <h2 className="text-4xl font-bold mt-10 mb-6 text-[#A78074] text-center">Top Products</h2>
              <ProductList products={enrichedProducts} />
            </div>
            <Link to='/userproducts' className=" bg-[#A78074] w-50 mx-auto flex justify-center mt-10 text-white mt-1 px-6 py-2 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">View More</Link>
            <SpecialOffers />
            <Testimonials />
            <UserComplaints />
            <UserReviews/>
          </>
        )}
      </div>
    </>
  );
}
