import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import VendorNavbar from "../VendorNavbar/VendorNavbar";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [vendorName, setVendorName] = useState("Unknown Vendor");
    const [vendorId, setVendorId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductAndVendor = async () => {
            try {
                const productRef = doc(db, "Products", id);
                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) {
                    console.error("Product not found");
                    setLoading(false);
                    return;
                }

                const productData = productSnap.data();
                setProduct(productData);

                // Fetch vendor name from Vendors (or Users) collection
                if (productData.vendorId) {
                    setVendorId(productData.vendorId);
                    const vendorRef = doc(db, "Vendors", productData.vendorId);
                    const vendorSnap = await getDoc(vendorRef);

                    if (vendorSnap.exists()) {
                        const vendorData = vendorSnap.data();
                        const fullName = `${vendorData.firstName || ""} ${vendorData.lastName || ""}`.trim();
                        setVendorName(fullName || "Unknown Vendor");
                    }
                }
            } catch (err) {
                console.error("Error loading product or vendor:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndVendor();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!product) return <div className="text-center py-10">Product not found</div>;

    return (
        <>
            <VendorNavbar />
            <div className="max-w-4xl mx-auto py-10 px-6">
                <img
                    src={product.image || product.imgURL}
                    alt={product.title}
                    className="w-full h-80 object-contain rounded-lg"
                />
                <h1 className="text-3xl font-bold mt-6 text-[#A78074]">{product.title}</h1>
                <p className="mt-2 text-lg text-[#4b3832]">Price: {product.price} EGP</p>
                <p className="mt-2 text-gray-600">Stock: {product.stock}</p>
                <p className="mt-2 text-gray-600">
                    Vendor:{" "}
                    {vendorId ? (
                    <Link
                        to={`/vendor/${vendorId}`}
                        className="text-[#A78074] underline hover:text-[#8c6152] transition"
                    >
                        {vendorName}
                    </Link>
                    ) : (
                    "Unknown Vendor"
                    )}
                </p>
                <p className="mt-4 text-base">
                    Description: {product.description || "No description available."}
                </p>
            </div>
        </>
    );
}
