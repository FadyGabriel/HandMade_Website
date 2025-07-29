import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase"; 
import VendorNavbar from "../VendorNavbar/VendorNavbar";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, "Notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc") // ✅ Sort by latest first
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <VendorNavbar />
      <div className="p-4">
      <h1 className="text-4xl font-[Playfair_Display] text-center text-[#A78074] mb-12">
                Your Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-3 rounded shadow ${
                  notif.read ? "bg-white" : "bg-yellow-100"
                }`}
              >
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-400">
                  {notif.createdAt?.toDate().toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
