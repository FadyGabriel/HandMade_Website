import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function CustomerChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        const q = query(collection(db, "chats"), where("customerId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const chatList = [];

        for (let docSnap of snapshot.docs) {
          const chatData = docSnap.data();
          const vendorRef = doc(db, "Vendors", chatData.vendorId);
          const vendorSnap = await getDoc(vendorRef);
          const vendor = vendorSnap.exists() ? vendorSnap.data() : { firstName: "Unknown", lastName: "" };

          chatList.push({
            id: docSnap.id,
            lastMessage: chatData.lastMessage || "",
            vendorName: `${vendor.firstName} ${vendor.lastName}`,
          });
        }

        setChats(chatList);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUser]);

  if (loading) {
    return  <div className="flex justify-center items-center py-8">
    <div className="h-8 w-8 border-4 border-t-transparent border-[#A78074] rounded-full animate-spin"></div>
  </div>
  }

  return (
    <>
      <UserNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#A78074] mb-6">Your Chats</h1>

        {chats.length === 0 ? (
          <p className="text-gray-600">You don't have any chats yet.</p>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <h3 className="font-semibold text-[#4b3832] mb-1">
                  Chat with {chat.vendorName}
                </h3>
                <p className="text-sm text-gray-600">
                  Last Message: {chat.lastMessage || "No messages yet"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
