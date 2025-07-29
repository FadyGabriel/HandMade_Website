import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function startChat(vendorId) {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const customerId = currentUser.uid;
  const chatId = `${customerId}_${vendorId}`; // consistent ID format

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      customerId,
      vendorId,
      participants: [customerId, vendorId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: ""
    });
  }

  return chatId;
}
