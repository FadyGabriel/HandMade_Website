import { useState } from "react";
import ProductCard from "./ProductCard";
import { FiFilter } from "react-icons/fi";

export default function ProductList({ products, categories = [] }) {
  // price
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [customPriceEnabled, setCustomPriceEnabled] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // categories
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemPage = 8;

  // categories
  const filterCategories = products.filter((p) => {
    const isApproved = p.status === "approved"; // ✅ Only approved products
    const inCategory = selectedCategory === "All" || p.category === selectedCategory;
  
    const price = parseFloat(p.price);
    let inPriceRange = true;
  
    if (customPriceEnabled) {
      const min = parseFloat(customMinPrice) || 0;
      const max = parseFloat(customMaxPrice) || Infinity;
      inPriceRange = price >= min && price <= max;
    } else {
      switch (selectedPriceRange) {
        case "lt100":
          inPriceRange = price < 100;
          break;
        case "100-300":
          inPriceRange = price >= 100 && price <= 300;
          break;
        case "300-500":
          inPriceRange = price > 300 && price <= 500;
          break;
        case "gt500":
          inPriceRange = price > 500;
          break;
        default:
          inPriceRange = true;
      }
    }
  
    return isApproved && inCategory && inPriceRange; // ✅ Apply approval status filter
  });
  

  const totalPages = Math.ceil(filterCategories.length / itemPage);
  const starIndex = (currentPage - 1) * itemPage;
  const endIndex = starIndex + itemPage;
  const currentProducts = filterCategories.slice(starIndex, endIndex);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="p-4">
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          {categories.map((categ) => (
            <button
              key={categ}
              onClick={() => {
                setSelectedCategory(categ);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded border ${
                selectedCategory === categ
                  ? "bg-[#A78074] text-white"
                  : "text-[#A78074] border-[#A78074] hover:bg-[#A78074]/10"
              }`}
            >
              {categ}
            </button>
          ))}

          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="flex items-center gap-1 px-4 py-2 border border-[#A78074] text-[#A78074] rounded hover:bg-[#A78074]/10"
          >
            <FiFilter className="text-lg" />
            Filter
          </button>
        </div>
      </div>

      {showPriceFilter && (
        <div className="flex items-center gap-2 mb-7">
          <select
            value={selectedPriceRange}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPriceRange(value);
              setCurrentPage(1);
              if (value === "custom") {
                setCustomPriceEnabled(true);
              } else {
                setCustomPriceEnabled(false);
                setCustomMinPrice("");
                setCustomMaxPrice("");
              }
            }}
            className="border border-[#A78074] text-[#A78074] px-4 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#A78074]"
          >
            <option value="All">All Prices</option>
            <option value="lt100">Less than 100</option>
            <option value="100-300">100 - 300</option>
            <option value="300-500">300 - 500</option>
            <option value="gt500">More than 500</option>
            <option value="custom">Custom Price</option>
          </select>

          {selectedPriceRange === "custom" && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={customMinPrice}
                onChange={(e) => setCustomMinPrice(e.target.value)}
                className="w-24 px-2 py-1 border border-[#A78074] rounded text-[#A78074] 
          caret-[#A78074] placeholder:text-[#A78074]/60 focus:outline-none focus:ring-1 focus:ring-[#A78074]"
              />
              <span className="text-[#A78074]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={customMaxPrice}
                onChange={(e) => setCustomMaxPrice(e.target.value)}
                className="w-24 px-2 py-1 border border-[#A78074] rounded text-[#A78074] 
          caret-[#A78074] placeholder:text-[#A78074]/60 focus:outline-none focus:ring-1 focus:ring-[#A78074]"
              />
            </div>
          )}
        </div>
      )}

      {currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-28 text-[#A78074] mb-4 animate-bounce transition-all duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.75 7.25H18.25M4 7.25v11a2 2 0 002 2h12a2 2 0 002-2v-11M9.75 11.75l4.5 4.5M14.25 11.75l-4.5 4.5"
            />
          </svg>

          <p className="text-2xl text-[#A78074] font-semibold">
            No Products Available
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product, index) => (
              <ProductCard
                id={product.id}
                key={index}
                title={product.title}
                price={product.price}
                image={product.imgURL}
                rating={product.rating}
                stock={product.stock}
                categoryName={product.category}
              />
            ))}
          </div>
          {/* Previous */}
          <div className="flex justify-center mt-11 mb-1 gap-2 flex-wrap">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded border border-[#A78074] text-[#A78074] disabled:opacity-50
           cursor-pointer"
            >
              Previous
            </button>
            {/* number-pages */}
            {pages.map((page) => {
              return (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-4 py-2 rounded border ${
                    currentPage === page
                      ? "bg-[#A78074] text-white cursor-pointer"
                      : "border-[#A78074] text-[#A78074] hover:bg-[#A78074]/10 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {/* Next */}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded border border-[#A78074] text-[#A78074] disabled:opacity-50
           cursor-pointer"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}
