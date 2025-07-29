import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function ProfileUser() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const docRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = { uid: currentUser.uid, ...docSnap.data() };
            setUserData(data);
            setFormData({
              displayName: data.displayName,
              phone: data.phone,
            });
          } else {
            console.log("No user document found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nameLetters = userData.displayName?.split("") || [];
  const formattedDate = new Date(userData.createdAt).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "Users", userData.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phone: formData.phone,
      });
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
    <UserNavbar />
    <div className="bg-white text-[#A78074]">
      <div className="relative w-full px-6 sm:px-12 lg:px-10 py-10">
        <motion.div
          className="relative flex flex-col sm:flex-row items-center sm:items-start gap-10 shadow-lg bg-[#f5f5f1] p-6 rounded-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Profile Picture */}
          <div className="w-full sm:w-[300px] lg:w-[350px] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center bg-[#e4e4e0]">
            <div className="w-40 h-40 rounded-full bg-[#A78074] flex items-center justify-center shadow-lg">
              <span className="text-white text-6xl font-bold">
                {userData.displayName?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#A78074] mb-6 bg-transparent outline-none border-b-2 border-[#A78074]"
              />
            ) : (
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#A78074] mb-6 flex flex-wrap"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {nameLetters.map((char, i) => (
                  <motion.span key={i} variants={letter}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>
            )}

            <div className="text-lg sm:text-xl lg:text-2xl text-[#7A5C50] leading-relaxed font-medium space-y-2 mb-4">
              <p>Email: {userData.email}</p>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full text-base sm:text-lg bg-transparent border-b border-[#A78074] py-1 focus:outline-none focus:ring-0 focus:border-[#A78074]"
                  />
                  <p>Role: {userData.role}</p>
                </>
              ) : (
                <>
                  <p>Phone: {userData.phone}</p>
                  <p>Role: {userData.role}</p>
                </>
              )}
              <p>Joined on: {formattedDate}</p>
            </div>

            {isEditing ? (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSave}
                  className="text-sm sm:text-base bg-[#A78074] text-white px-4 sm:px-6 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm sm:text-base bg-gray-400 text-white px-4 sm:px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm sm:text-base bg-[#A78074] text-white mt-4 px-6 sm:px-8 py-2 sm:py-3 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition text-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
