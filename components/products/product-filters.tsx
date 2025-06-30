"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PriceRangeInput } from "@/components/ui/price-range-input"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FilterState } from "@/hooks/use-product-filters"

interface FilterOption {
  id: string
  name: string
  count: number
}

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: any) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  isLoading?: boolean
  className?: string
}

const categories: FilterOption[] = [
  { id: "futsal", name: "Futsal", count: 45 },
  { id: "society", name: "Society", count: 38 },
  { id: "campo", name: "Campo", count: 73 },
]

const brands: FilterOption[] = [
  { id: "nike", name: "Nike", count: 52 },
  { id: "adidas", name: "Adidas", count: 41 },
  { id: "puma", name: "Puma", count: 28 },
  { id: "mizuno", name: "Mizuno", count: 19 },
  { id: "umbro", name: "Umbro", count: 16 },
]

const sizes = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"]

const colors = [
  { id: "preto", name: "Preto", hex: "#000000" },
  { id: "branco", name: "Branco", hex: "#FFFFFF" },
  { id: "verde", name: "Verde", hex: "#22c55e" },
  { id: "vermelho", name: "Vermelho", hex: "#CC0000" },
  { id: "azul", name: "Azul", hex: "#0066CC" },
  { id: "amarelo", name: "Amarelo", hex: "#FFCC00" },
]

export default function ProductFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  isLoading = false,
  className,
}: ProductFiltersProps) {
  // Stable event handlers
  const handleCategoryChange = useCallback(
    (categoryId: string) => (checked: boolean) => {
      const newCategories = checked
        ? [...filters.categories, categoryId]
        : filters.categories.filter((id) => id !== categoryId)
      onFilterChange("categories", newCategories)
    },
    [filters.categories, onFilterChange],
  )

  const handleBrandChange = useCallback(
    (brandId: string) => (checked: boolean) => {
      const newBrands = checked ? [...filters.brands, brandId] : filters.brands.filter((id) => id !== brandId)
      onFilterChange("brands", newBrands)
    },
    [filters.brands, onFilterChange],
  )

  const handleSizeChange = useCallback(
    (size: string) => () => {
      const newSizes = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size]
      onFilterChange("sizes", newSizes)
    },
    [filters.sizes, onFilterChange],
  )

  const handleColorChange = useCallback(
    (colorId: string) => (checked: boolean) => {
      const newColors = checked ? [...filters.colors, colorId] : filters.colors.filter((id) => id !== colorId)
      onFilterChange("colors", newColors)
    },
    [filters.colors, onFilterChange],
  )

  const handlePriceChange = useCallback(
    (newRange: [number, number]) => {
      onFilterChange("priceRange", newRange)
    },
    [onFilterChange],
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Ativos
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
          <span className="font-medium">Faixa de Preço</span>
          <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="px-2">
            <PriceRangeInput
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={2000}
              className="w-full"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
          <span className="font-medium">Modalidade</span>
          <div className="flex items-center gap-2">
            {filters.categories.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.categories.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={handleCategoryChange(category.id)}
                disabled={isLoading}
              />
              <Label htmlFor={`category-${category.id}`} className="flex-1 cursor-pointer text-sm font-normal">
                <span>{category.name}</span>
                <span className="text-muted-foreground ml-1">({category.count})</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
          <span className="font-medium">Marca</span>
          <div className="flex items-center gap-2">
            {filters.brands.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.brands.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={filters.brands.includes(brand.id)}
                onCheckedChange={handleBrandChange(brand.id)}
                disabled={isLoading}
              />
              <Label htmlFor={`brand-${brand.id}`} className="flex-1 cursor-pointer text-sm font-normal">
                <span>{brand.name}</span>
                <span className="text-muted-foreground ml-1">({brand.count})</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Sizes */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
          <span className="font-medium">Tamanho</span>
          <div className="flex items-center gap-2">
            {filters.sizes.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.sizes.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={handleSizeChange(size)}
                disabled={isLoading}
                className="h-8 text-xs"
              >
                {size}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Colors */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
          <span className="font-medium">Cor</span>
          <div className="flex items-center gap-2">
            {filters.colors.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.colors.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={filters.colors.includes(color.id)}
                onCheckedChange={handleColorChange(color.id)}
                disabled={isLoading}
              />
              <Label
                htmlFor={`color-${color.id}`}
                className="flex items-center space-x-2 cursor-pointer text-sm font-normal"
              >
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span>{color.name}</span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters Button (Mobile) */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={isLoading}
            className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Todos os Filtros
          </Button>
        </>
      )}
    </div>
  )
}
