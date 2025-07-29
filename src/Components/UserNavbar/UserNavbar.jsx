import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from "../../assets/logo.png";
import { IoNotifications } from "react-icons/io5";

export default function UserNavbar() {
  const [userName, setUserName] = useState("User");
  const [cartCount, setCartCount] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserName(data.displayName || "User");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where("customerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      snapshot.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const messagesRef = collection(db, "chats", chatId, "messages");

        const msgQuery = query(messagesRef, orderBy("createdAt", "desc"));

        onSnapshot(msgQuery, (msgSnap) => {
          const latest = msgSnap.docs[0]?.data();
          if (
            latest &&
            latest.senderId !== user.uid &&
            latest.createdAt?.seconds > (Date.now() / 1000) - 5
          ) {
            setHasNewMessages(true);
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
        const unsubscribeCart = onSnapshot(q, (snapshot) => {
          setCartCount(snapshot.size);
        });
        return unsubscribeCart;
      } else {
        setCartCount(0);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-16 h-16" />
          </NavLink>
        </div>

        {/* Hamburger for small screens */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Center Links */}
        <div
          className={`w-full md:flex md:items-center md:gap-6 md:static md:w-auto transition-all duration-300 ease-in-out ${
            menuOpen ? "block mt-4" : "hidden"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 text-gray-700 font-medium text-sm sm:text-base">
            <Link to="/homeuser" className="hover:text-[#1B8354]">Home</Link>
            <Link to="/userproducts" className="hover:text-[#1B8354]">Products</Link>

            <div className="relative">
              <Link to="/cart" className="hover:text-[#1B8354]">
                Cart
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <Link to="/userfavorite" className="hover:text-[#1B8354]">Favorites</Link>
            <Link to="/userorders" className="hover:text-[#1B8354]">Orders</Link>
            <Link to="/vendors" className="hover:text-[#1B8354]">Vendors</Link>

            <div className="relative">
              <Link to="/customerchats" className="hover:text-[#1B8354]">
                Chats
              </Link>
              {hasNewMessages && (
                <span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-sm sm:text-base mt-3 md:mt-0">
          <Link to="/userprofile" className="text-gray-700 font-medium">
            Welcome, <span className="text-[#1B8354]">{userName}</span>
          </Link>
          <div className="relative">
            <Link to='/usernotification' className="relative text-xl text-gray-700 hover:text-[#1B8354]">
              <IoNotifications />
              {hasNewNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
        </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
