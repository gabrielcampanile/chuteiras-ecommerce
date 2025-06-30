"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoriteItem {
  id: number
  name: string
  price: number
  image: string
  brand: string
  category: string
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: number) => void
  isFavorite: (id: number) => boolean
  toggleFavorite: (item: FavoriteItem) => void
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites)
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
        localStorage.removeItem("favorites") // Clear corrupted data
      }
    }
    setIsLoaded(true)
  }, [])

  // Save favorites to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

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
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
