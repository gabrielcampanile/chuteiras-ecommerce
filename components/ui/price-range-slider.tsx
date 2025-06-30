"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface PriceRangeSliderProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  min: number
  max: number
  step?: number
  className?: string
  formatValue?: (value: number) => string
}

const PriceRangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, PriceRangeSliderProps>(
  ({ className, value, onValueChange, min, max, step = 1, formatValue, ...props }, ref) => {
    const formatPrice = formatValue || ((val: number) => `R$ ${val}`)

    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        if (newValue.length === 2 && Array.isArray(newValue)) {
          const typedValue: [number, number] = [newValue[0], newValue[1]]
          // Only call onValueChange if the values actually changed
          if (typedValue[0] !== value[0] || typedValue[1] !== value[1]) {
            onValueChange(typedValue)
          }
        }
      },
      [onValueChange, value],
    )

    return (
      <div className={cn("space-y-4", className)}>
        <SliderPrimitive.Root
          ref={ref}
          className="relative flex w-full touch-none select-none items-center"
          value={value}
          onValueChange={handleValueChange}
          max={max}
          min={min}
          step={step}
          minStepsBetweenThumbs={1}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/10" />
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/10" />
        </SliderPrimitive.Root>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="font-medium">{formatPrice(value[0])}</span>
          <span className="font-medium">{formatPrice(value[1])}</span>
        </div>
      </div>
    )
  },
)

PriceRangeSlider.displayName = "PriceRangeSlider"

export { PriceRangeSlider }
