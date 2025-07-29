import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import VendorNavbar from '../VendorNavbar/VendorNavbar';
import { motion } from 'framer-motion';

export default function ShowApprovedProducts() {

    const [approvedVendorProducts, setApprovedVendorProducts] = useState([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const productsRef = collection(db, "Products");
            const q = query(
                productsRef,
                where("vendorId", "==", user.uid),
                where("status", "==", "approved")
            );

            const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setApprovedVendorProducts(products);
            });

            // 🔁 Clean up Firestore listener on unmount
            return () => unsubscribeSnapshot();
        });

        // 🔁 Clean up Auth listener on unmount
        return () => unsubscribeAuth();
    }, []);




    return (
        <>
            <VendorNavbar />
            <div className='flex w-[85vw] my-8 mx-auto flex-wrap flex-row gap-6 justify-center items-center'>
                
                {approvedVendorProducts.length > 0 ? (
                    approvedVendorProducts.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
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
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                        product.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                                        product.status === "rejected" ? "bg-red-100 text-red-800 border-red-300" : 
                                        "bg-green-100 text-green-800 border-green-300"
                                    }`}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
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
                            </div>
                        </motion.div>
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
        </>
    )
}
