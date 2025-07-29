import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { useEffect, useState, useRef } from "react";
import UserNavbar from "../UserNavbar/UserNavbar";
import { FiImage } from "react-icons/fi";

export default function CustomerVendorChat() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [vendorName, setVendorName] = useState("Vendor");
  const [vendorId, setVendorId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchChatAndVendor = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "chats", chatId));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setVendorId(chatData.vendorId);

          const vendorDoc = await getDoc(doc(db, "Vendors", chatData.vendorId));
          if (vendorDoc.exists()) {
            setVendorName(vendorDoc.data().displayName || "Vendor");
          }
        }
      } catch (err) {
        console.error("Error fetching vendor info:", err);
      }
    };

    fetchChatAndVendor();
  }, [chatId]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "react_uploads"); // Replace with your actual preset
    data.append("cloud_name", "dojghbhxq"); // Replace with your Cloudinary cloud name

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dojghbhxq/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    let imageUrl = "";

    try {
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const messageRef = collection(db, "chats", chatId, "messages");

      await addDoc(messageRef, {
        senderId: currentUser.uid,
        text: text.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      // Clear input after sending
      setText("");
      setImageFile(null);
      fileInputRef.current.value = null;
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <>
      {/* <UserNavbar /> */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="h-[400px] overflow-y-auto border p-4 rounded bg-gray-50">
          {messages.map((msg) => {
            const isVendor = msg.senderId === vendorId;
            const isUser = msg.senderId === currentUser.uid;

            return (
              <div
                key={msg.id}
                className={`mb-4 max-w-[70%] ${
                  isUser ? "ml-auto text-right" : "mr-auto text-left"
                }`}
              >
                {!isUser && isVendor && (
                  <p className="text-xs text-gray-500 mb-1">{vendorName}</p>
                )}

                <div
                  className={`p-2 rounded break-words ${
                    isUser
                      ? "bg-[#A78074] text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.text && (
                    <p className="mb-1 whitespace-pre-line">{msg.text}</p>
                  )}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="sent"
                      className="w-48 h-auto rounded mt-1"
                    />
                  )}
                  {!msg.text && !msg.imageUrl && (
                    <span className="text-red-500">[No message]</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4 items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Type your message..."
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-[#A78074] flex items-center justify-center text-white px-4 py-3 rounded cursor-pointer hover:bg-[#8c6f66] transition"
            title="Upload image"
          >
            <FiImage />
          </button>
          <button
            onClick={sendMessage}
            className="bg-[#A78074] text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

        {/* Preview selected image (optional) */}
        {imageFile && (
          <div className="mt-2 text-sm text-gray-600">
            Selected Image: {imageFile.name}
          </div>
        )}
      </div>
    </>
  );
}
