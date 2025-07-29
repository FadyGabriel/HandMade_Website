// src/hooks/useMessageNotification.js
import { useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase"; // adjust path if needed
import toast from "react-hot-toast"; 
import { onAuthStateChanged } from "firebase/auth";

function useMessageNotification() {
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (!user) return;
      
          const q = query(collection(db, "chats"), where("customerId", "==", user.uid));
      
          const unsubscribeChats = onSnapshot(q, (snapshot) => {
            snapshot.forEach((docSnap) => {
              const chatId = docSnap.id;
              const messagesRef = collection(db, "chats", chatId, "messages");
              const msgQuery = query(messagesRef, orderBy("createdAt", "desc"));
      
              onSnapshot(msgQuery, (msgSnap) => {
                const latestMsg = msgSnap.docs[0]?.data();
                if (
                  latestMsg &&
                  latestMsg.senderId !== user.uid &&
                  latestMsg.createdAt?.seconds > (Date.now() / 1000) - 5
                ) {
                  toast.success("📨 New message from vendor!");
                }
              });
            });
          });
      
          return () => {
            unsubscribeChats();
          };
        });
      
        return () => unsubscribeAuth();
      }, []);
}

export default useMessageNotification;
