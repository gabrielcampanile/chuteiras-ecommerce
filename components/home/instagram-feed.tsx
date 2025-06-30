import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock Instagram posts
const instagramPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Nike Mercurial chegando! 🔥⚽",
    likes: 234,
    url: "https://instagram.com/p/example1",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Adidas Predator em destaque 💚",
    likes: 189,
    url: "https://instagram.com/p/example2",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Puma Future - Tecnologia do futuro ⚡",
    likes: 156,
    url: "https://instagram.com/p/example3",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Mizuno Morelia - Tradição japonesa 🇯🇵",
    likes: 203,
    url: "https://instagram.com/p/example4",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Promoção especial! Não perca 🏷️",
    likes: 298,
    url: "https://instagram.com/p/example5",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Cliente satisfeito é nossa prioridade ❤️",
    likes: 167,
    url: "https://instagram.com/p/example6",
  },
]

export default function InstagramFeed() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h2 className="text-3xl md:text-4xl font-bold">@chuteiraspro</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe nosso Instagram para ver os últimos lançamentos, promoções e dicas de futebol.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.caption}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                  <Instagram className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{post.likes} curtidas</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="https://instagram.com/chuteiraspro" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 mr-2" />
              Seguir no Instagram
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
