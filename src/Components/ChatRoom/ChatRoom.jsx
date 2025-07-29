import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import VendorNavbar from "../VendorNavbar/VendorNavbar";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!user || !text.trim()) return;

    const messageData = {
      senderId: user.uid,
      text: text.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      // ✅ Update chat metadata
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        lastMessage: text.trim(),
        updatedAt: serverTimestamp(),
      });

      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
    <VendorNavbar></VendorNavbar>
    <div className="p-4">
      <div className="h-80 overflow-y-scroll border mb-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.senderId === user?.uid ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-1 bg-gray-200 rounded">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
}
