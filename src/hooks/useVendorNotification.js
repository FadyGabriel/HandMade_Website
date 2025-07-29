// src/hooks/useVendorNotification.js
import { useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import toast from "react-hot-toast";

export default function useVendorNotification() {
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatQuery = query(
      collection(db, "chats"),
      where("vendorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(chatQuery, (chatSnapshot) => {
      chatSnapshot.forEach((chatDoc) => {
        const chatId = chatDoc.id;

        const msgRef = collection(db, "chats", chatId, "messages");
        const msgQuery = query(msgRef, orderBy("createdAt", "desc"));

        onSnapshot(msgQuery, (msgSnapshot) => {
          const latest = msgSnapshot.docs[0]?.data();
          if (
            latest &&
            latest.senderId !== user.uid &&
            latest.createdAt?.seconds > Date.now() / 1000 - 5
          ) {
            toast.success("📨 New message from a customer!");
          }
        });
      });
    });

    return () => unsubscribe();
  }, []);
}
