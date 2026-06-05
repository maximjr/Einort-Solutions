import { useState, useEffect } from "react";
import { collection, query, where, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Conversation } from "../services/admin/messageService";
import { useAuth } from "./useAuth";
import { messageService } from "../services/admin/messageService";

export function useMessaging() {
  const { user, userData } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !user?.uid) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const isAdmin = userData?.role === "admin" || userData?.role === "super_admin" || userData?.isAdmin;

    let q;
    if (isAdmin) {
      q = query(
        collection(db, "conversations"),
        orderBy("updatedAt", "desc"),
        limit(100)
      );
    } else {
      q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid),
        limit(100)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];
        
        // Sort in memory to avoid composite index requirement for clients
        if (!isAdmin) {
          data = data.sort((a, b) => {
            const timeA = a.updatedAt?.toMillis() || 0;
            const timeB = b.updatedAt?.toMillis() || 0;
            return timeB - timeA;
          });
        }
        
        setConversations(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error subscribing to conversations:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, userData?.role, userData?.isAdmin]);

  return {
    conversations,
    loading,
    error,
    sendMessage: messageService.sendMessage,
    markAsRead: messageService.markAsRead
  };
}
