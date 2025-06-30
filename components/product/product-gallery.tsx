"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${name} - Imagem ${currentImage + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Icon */}
        <div className="absolute top-2 right-2">
          <Button variant="secondary" size="icon" className="opacity-80 hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
              index === currentImage ? "border-primary" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${name} - Miniatura ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
