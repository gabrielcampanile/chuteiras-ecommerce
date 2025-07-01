"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/providers/auth-provider";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

interface FavoriteItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Load favorites from Firestore or localStorage on mount or user change
  useEffect(() => {
    if (user) {
      // Firestore
      const favRef = collection(db, "users", user.uid, "favorites");
      const unsubscribe = onSnapshot(favRef, (snapshot) => {
        const favs: FavoriteItem[] = [];
        snapshot.forEach((doc) => favs.push(doc.data() as FavoriteItem));
        setFavorites(favs);
        setIsLoaded(true);
      });
      return () => unsubscribe();
    } else {
      // localStorage fallback
      const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
          const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
        }
      } catch (error) {
          console.error("Error loading favorites from localStorage:", error);
          localStorage.removeItem("favorites");
      }
    }
      setIsLoaded(true);
    }
  }, [user]);

  // Save favorites to localStorage whenever it changes (but not on initial load and only if not logged in)
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded, user]);

  // Limpa localStorage ao logar
  useEffect(() => {
    if (user) {
      localStorage.removeItem("favorites");
    }
  }, [user]);

  const addToFavorites = async (item: FavoriteItem) => {
    if (user) {
      const favRef = doc(db, "users", user.uid, "favorites", String(item.id));
      await setDoc(favRef, item);
    } else {
      router.push("/login");
    }
  };

  const removeFromFavorites = async (id: string | number) => {
    if (user) {
      const favRef = doc(db, "users", user.uid, "favorites", String(id));
      await deleteDoc(favRef);
    } else {
      router.push("/login");
    }
  };

  const isFavorite = (id: string | number) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
