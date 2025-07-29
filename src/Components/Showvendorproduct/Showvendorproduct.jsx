import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import VendorNavbar from '../VendorNavbar/VendorNavbar';
import { onAuthStateChanged } from 'firebase/auth';
import AddProduct from '../VendorAddProducts/VendorAddProducts';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Showvendorproduct() {
    const [vendorProducts, setVendorProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return;
            const productsRef = collection(db, "Products");
            const q = query(productsRef, where("vendorId", "==", user.uid));

            const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setVendorProducts(products);
            });
            // Clean up Firestore listener on unmount
            return () => unsubscribeSnapshot();
        });
        // Clean up Auth listener on unmount
        return () => unsubscribeAuth();
    }, []);

    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Once deleted, this cannot be restored!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#A78074',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!',
            background: '#fff',
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "Products", productId));
                toast.success("Product deleted successfully!");
            } catch (error) {
                toast.error("Failed to delete product.");
                console.error(error);
            }
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <>
            <div>
                <VendorNavbar />
                <AddProduct selectedProduct={selectedProduct} onSaveComplete={() => setSelectedProduct(null)} />

                <div className='flex w-[85vw] my-8 mx-auto flex-wrap flex-row gap-6 justify-center items-center'>
                    {vendorProducts.length > 0 ? (
                        vendorProducts.map(product => (
                            <div key={product.id} 
                                className='w-[280px] bg-[#F5F5F1] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-[1.02]'
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.imgURL}
                                        alt={product.title}
                                        className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3 capitalize">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            product.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                                            product.status === "rejected" ? "bg-red-100 text-red-800 border-red-300" : 
                                            "bg-green-100 text-green-800 border-green-300"
                                        }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-[#A78074] mb-2 line-clamp-2 leading-tight">
                                        {product.title}
                                    </h3>

                                    {/* Price and Stock */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xl font-bold text-[#A78074]">
                                            {product.price} EGP
                                        </span>
                                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-3">
                                        <span className="inline-block bg-[#A78074] text-white text-xs px-3 py-1 rounded-full">
                                            {product.categoryName}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    {/* Action Buttons */}
                                    {product.status !== "approved" && (
                                        <div className="flex gap-2 mt-4">
                                            <button 
                                                onClick={() => handleEditClick(product)}
                                                className="flex-1 bg-[#A78074] cursor-pointer text-white py-2 px-3 rounded-lg hover:bg-[#90675F] transition-colors duration-200 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="flex-1 bg-gray-200 cursor-pointer text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}


                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="bg-[#F5F5F1] rounded-xl p-8 max-w-md mx-auto">
                                <div className="text-[#A78074] text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-[#A78074] mb-2">No products found</h3>
                                <p className="text-gray-600">Start by adding your first product using the form above!</p>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
            <br />

        </>
    );
}

