"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PriceRangeInputProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  min: number
  max: number
  className?: string
}

export function PriceRangeInput({ value, onValueChange, min, max, className }: PriceRangeInputProps) {
  const [localMin, setLocalMin] = React.useState(value[0].toString())
  const [localMax, setLocalMax] = React.useState(value[1].toString())
  const [isMinFocused, setIsMinFocused] = React.useState(false)
  const [isMaxFocused, setIsMaxFocused] = React.useState(false)

  // Update local values when props change (but not when focused)
  React.useEffect(() => {
    if (!isMinFocused) {
      setLocalMin(value[0].toString())
    }
    if (!isMaxFocused) {
      setLocalMax(value[1].toString())
    }
  }, [value, isMinFocused, isMaxFocused])

  const handleMinChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value)
  }, [])

  const handleMaxChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value)
  }, [])

  const handleMinBlur = React.useCallback(() => {
    setIsMinFocused(false)
    const numValue = Number.parseInt(localMin) || min
    const clampedValue = Math.max(min, Math.min(numValue, value[1]))

    if (clampedValue !== value[0]) {
      onValueChange([clampedValue, value[1]])
    }
    setLocalMin(clampedValue.toString())
  }, [localMin, min, value, onValueChange])

  const handleMaxBlur = React.useCallback(() => {
    setIsMaxFocused(false)
    const numValue = Number.parseInt(localMax) || max
    const clampedValue = Math.min(max, Math.max(numValue, value[0]))

    if (clampedValue !== value[1]) {
      onValueChange([value[0], clampedValue])
    }
    setLocalMax(clampedValue.toString())
  }, [localMax, max, value, onValueChange])

  const handleMinFocus = React.useCallback(() => {
    setIsMinFocused(true)
  }, [])

  const handleMaxFocus = React.useCallback(() => {
    setIsMaxFocused(true)
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price-min" className="text-sm font-medium">
            Preço mínimo
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <Input
              id="price-min"
              type="number"
              value={localMin}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              onFocus={handleMinFocus}
              min={min}
              max={max}
              className="pl-8"
              placeholder="0"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-max" className="text-sm font-medium">
            Preço máximo
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <Input
              id="price-max"
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              onFocus={handleMaxFocus}
              min={min}
              max={max}
              className="pl-8"
              placeholder="2000"
            />
          </div>
        </div>
      </div>

      {/* Visual Range Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>R$ {min}</span>
          <span>R$ {max}</span>
        </div>
        <div className="relative h-2 bg-secondary rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${((value[0] - min) / (max - min)) * 100}%`,
              width: `${((value[1] - value[0]) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span>R$ {value[0]}</span>
          <span>R$ {value[1]}</span>
        </div>
      </div>
    </div>
  )
}
