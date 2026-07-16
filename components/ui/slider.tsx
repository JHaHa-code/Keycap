"use client"

import { cn } from "@/lib/utils"

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  format?: (value: number) => string
  className?: string
}

export function Slider({ value, min, max, step = 1, onChange, label, format, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono tabular-nums text-foreground">{format ? format(value) : value}</span>
        </div>
      )}
      <div className="relative flex h-5 items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-secondary" />
        <div
          className="absolute h-1.5 rounded-full bg-primary transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={label}
          className="slider-input absolute h-5 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  )
}
