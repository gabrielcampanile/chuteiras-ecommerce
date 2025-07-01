"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
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

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: string | number;
        size: string;
        color: string;
        quantity: number;
      };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return action.payload;

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { user } = useAuth();
  const router = useRouter();

  // Load cart from Firestore or localStorage on mount or user change
  useEffect(() => {
    if (user) {
      const cartRef = collection(db, "users", user.uid, "cart");
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const items: CartItem[] = [];
        snapshot.forEach((doc) => items.push(doc.data() as CartItem));
        dispatch({
          type: "LOAD_CART",
          payload: {
            items,
            total: items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          },
        });
      });
      return () => unsubscribe();
    } else {
      const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
          const parsedCart = JSON.parse(savedCart);
          if (
            parsedCart &&
            typeof parsedCart === "object" &&
            Array.isArray(parsedCart.items)
          ) {
            dispatch({ type: "LOAD_CART", payload: parsedCart });
        }
      } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          localStorage.removeItem("cart");
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (but not on initial load and only if not logged in)
  useEffect(() => {
    if (!user && (state.items.length > 0 || state.total === 0)) {
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }, [state, user]);

  // Persist cart changes to Firestore if logged in
  useEffect(() => {
    if (user) {
      const cartRef = collection(db, "users", user.uid, "cart");
      // Salva cada item como um doc separado
      state.items.forEach(async (item) => {
        const itemRef = doc(
          cartRef,
          String(item.id) + "-" + item.size + "-" + item.color
        );
        await setDoc(itemRef, item);
      });
      // Remove do Firestore os itens que não estão mais no carrinho
      getDocs(cartRef).then((snapshot) => {
        snapshot.forEach((docSnap) => {
          const exists = state.items.some(
            (item) =>
              docSnap.id ===
              String(item.id) + "-" + item.size + "-" + item.color
          );
          if (!exists) {
            deleteDoc(docSnap.ref);
          }
        });
      });
    }
  }, [state, user]);

  // Limpa localStorage ao logar
  useEffect(() => {
    if (user) {
      localStorage.removeItem("cart");
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  const { user } = useAuth();
  const router = useRouter();

  function addItem(item: CartItem) {
    if (!user) {
      router.push("/login");
      return;
    }
    context.dispatch({ type: "ADD_ITEM", payload: item });
  }

  function removeItem(id: string | number) {
    if (!user) {
      router.push("/login");
      return;
    }
    context.dispatch({ type: "REMOVE_ITEM", payload: id });
  }

  function updateQuantity(id: string | number, size: string, color: string, quantity: number) {
    if (!user) {
      router.push("/login");
      return;
    }
    context.dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, color, quantity } });
  }

  function clearCart() {
    if (!user) {
      router.push("/login");
      return;
    }
    context.dispatch({ type: "CLEAR_CART" });
  }

  return {
    items: context.state.items,
    total: context.state.total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
