import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png";
import useVendorNotification from '../../hooks/useVendorNotification';
import { Menu, X } from 'lucide-react';
import { IoNotifications } from "react-icons/io5";

export default function VendorNavbar() {
  const [displayName, setDisplayName] = useState('');
  const [vendorStatus, setVendorStatus] = useState(null); // 🔸 store vendor status
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
 
  const vendorId = auth.currentUser?.uid;

   useEffect(() => {
      const user = auth.currentUser;
      if (!user) return;
    
      const notificationsQuery = query(
        collection(db, "Notifications"),
        where("userId", "==", user.uid)
      );
    
      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const hasNew = snapshot.docs.some((doc) => doc.data().read === false);
        setHasNewNotifications(hasNew);
      });
    
      return () => unsubscribe();
    }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const vendorRef = doc(db, "Vendors", user.uid);
          const vendorSnap = await getDoc(vendorRef);
          const vendorData = vendorSnap.data();
          setDisplayName(vendorData?.displayName || "Vendor");
          setVendorStatus(vendorData?.status || "pending"); // 🔸 set status
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          setDisplayName("Vendor");
          setVendorStatus("pending");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const chatQuery = query(collection(db, "chats"), where("vendorId", "==", user.uid));

    const unsubscribe = onSnapshot(chatQuery, (chatSnapshot) => {
      chatSnapshot.forEach((chatDoc) => {
        const msgRef = collection(db, "chats", chatDoc.id, "messages");
        const msgQuery = query(msgRef, orderBy("createdAt", "desc"));
        onSnapshot(msgQuery, (msgSnapshot) => {
          const latest = msgSnapshot.docs[0]?.data();
          if (latest && latest.senderId !== user.uid && latest.createdAt?.seconds > Date.now() / 1000 - 5) {
            setHasNewMessage(true);
          }
        });
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "Cart"), where("userId", "==", user.uid));
        const unsubscribeCart = onSnapshot(q, (snapshot) => setCartCount(snapshot.size));
        return unsubscribeCart;
      } else {
        setCartCount(0);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out. Try again.');
    }
  };

  useVendorNotification();

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <NavLink to="/vendorhome">
            <img src={logo} alt="Hand Made Logo" className="w-14 h-14" />
          </NavLink>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 md:hidden focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`w-full md:flex md:items-center md:w-auto ${
            menuOpen ? 'block' : 'hidden'
          } mt-4 md:mt-0`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mx-auto text-gray-700 font-medium text-sm sm:text-base">
            <Link to="/vendorhome" className="hover:text-[#1B8354]">Home</Link>

            {/* Only show these links if status is "approved" */}
            {vendorStatus === "Approved" && (
              <>
                <Link to="/vendor/showvendorproduct" className="hover:text-[#1B8354]">Add Products</Link>
                <Link to="/vendor/approvedproduct" className="hover:text-[#1B8354]">Approved Products</Link>
              </>
            )}

            <div className="relative">
              <Link to="/vendor/cart" className="hover:text-[#1B8354]">Cart</Link>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <Link to="/vendor/favorites" className="hover:text-[#1B8354]">Favorites</Link>
            <Link to="/vendor/orders" className="hover:text-[#1B8354]">Orders</Link>

            <div className="relative">
              <Link to="/vendor/chats" className="hover:text-[#1B8354]">Chats</Link>
              {hasNewMessage && (
                <span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Welcome + Logout */}
        <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 mt-4 md:mt-0 text-sm sm:text-base">
          <Link to={`/vendor/${vendorId}`} className="text-gray-700 font-medium">
            Welcome, <span className="text-[#1B8354]">{displayName}</span>
          </Link>
          <div className="relative">
                      <Link to='/vendornotification' className="relative text-xl text-gray-700 hover:text-[#1B8354]">
                        <IoNotifications />
                        {hasNewNotifications && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </Link>
                  </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
