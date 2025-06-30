"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Chuteiras Nike Mercurial",
    subtitle: "Velocidade e precisão em campo",
    description: "Descubra a nova linha Nike Mercurial com tecnologia de ponta",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "Ver Coleção",
    link: "/produtos?marca=nike&linha=mercurial",
    discount: "20% OFF",
  },
  {
    id: 2,
    title: "Adidas Predator",
    subtitle: "Controle absoluto da bola",
    description: "A evolução das chuteiras Predator chegou",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "Comprar Agora",
    link: "/produtos?marca=adidas&linha=predator",
    discount: "15% OFF",
  },
  {
    id: 3,
    title: "Puma Future",
    subtitle: "O futuro do futebol",
    description: "Tecnologia adaptativa para máximo desempenho",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "Explorar",
    link: "/produtos?marca=puma&linha=future",
    discount: "Lançamento",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {banner.discount}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
                  <h2 className="text-xl md:text-2xl mb-4 text-gray-200">{banner.subtitle}</h2>
                  <p className="text-lg mb-8 text-gray-300">{banner.description}</p>
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link href={banner.link}>{banner.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
