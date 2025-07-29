import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import { FiImage } from "react-icons/fi";

export default function VendorChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [customerName, setCustomerName] = useState("Customer");
  const [customerId, setCustomerId] = useState(null);
  const [sendingImage, setSendingImage] = useState(false);

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          const customerIdFromChat = chatData.customerId;
          setCustomerId(customerIdFromChat);

          const userRef = doc(db, "Users", customerIdFromChat);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCustomerName(userData.displayName || userData.email || "Customer");
          }
        }
      } catch (err) {
        console.error("Error fetching customer info:", err);
      }
    };

    fetchCustomerName();
  }, [chatId]);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        chatId,
        text: newMessage.trim(),
        imageUrl: "", // explicit empty for clarity
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: newMessage.trim(),
        updatedAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    setSendingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "react_uploads"); // your Cloudinary preset

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dojghbhxq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) throw new Error("Image upload failed");

      const imageUrl = data.secure_url;

      await addDoc(collection(db, "chats", chatId, "messages"), {
        chatId,
        senderId: user.uid,
        imageUrl,
        text: "", // no text in this case
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: "📷 Image",
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to send image");
    } finally {
      setSendingImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-[#A78074]">Chat</h2>

      <div className="bg-white shadow rounded-lg p-4 max-h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === auth.currentUser?.uid;

          return (
            <div
              key={msg.id}
              className={`mb-4 max-w-[75%] ${
                isCurrentUser ? "ml-auto text-right" : "mr-auto text-left"
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">
                {isCurrentUser ? "You" : customerName}
              </p>

              <div
                className={`p-2 rounded break-words ${
                  isCurrentUser ? "bg-green-100" : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text && <p className="whitespace-pre-line mb-1">{msg.text}</p>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Sent"
                    className="rounded max-w-[200px] max-h-[200px] object-cover"
                  />
                )}
                {!msg.text && !msg.imageUrl && (
                  <span className="text-red-500">[Empty message]</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-4 py-2"
        />
        <label className="bg-[#A78074] flex items-center justify-center text-white px-4 py-2 rounded cursor-pointer hover:bg-[#8c6f66] transition">
           <FiImage />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <button
          onClick={handleSend}
          className="bg-[#A78074] text-white px-4 py-2 rounded hover:bg-[#8c6f66] transition"
        >
          Send
        </button>
        
      </div>

      {sendingImage && <p className="text-sm text-gray-500">Uploading image...</p>}
    </div>
  );
}
