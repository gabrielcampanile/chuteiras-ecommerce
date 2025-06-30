"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

interface ProductSortProps {
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
}

const sortOptions = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "name-asc", label: "A-Z" },
  { value: "name-desc", label: "Z-A" },
  { value: "newest", label: "Lançamentos" },
  { value: "rating", label: "Melhor Avaliados" },
]

export default function ProductSort({ value, onValueChange, isLoading = false }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
