"use client"

import { memo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { KeyDef } from "@/lib/keymap"
import type { KeycapProfile } from "@/lib/store"
import { cn } from "@/lib/utils"

interface KeycapProps {
  keyDef: KeyDef
  pressed: boolean
  accent: string
  keyColor: string
  profile: KeycapProfile
  effects: boolean
  animationSpeed: number
  onPress: (index: number, velocity: number) => void
  onRelease: (index: number) => void
}

/** Per-profile sculpt tuning: press depth (px) and cap height feel. */
const PROFILE: Record<KeycapProfile, { depth: number; height: number; topInset: number; round: number }> = {
  GMK: { depth: 8, height: 14, topInset: 10, round: 12 },
  Cherry: { depth: 8, height: 12, topInset: 10, round: 12 },
  PBT: { depth: 8, height: 14, topInset: 11, round: 12 },
  ABS: { depth: 8, height: 13, topInset: 10, round: 12 },
  OEM: { depth: 9, height: 16, topInset: 10, round: 12 },
  SA: { depth: 10, height: 20, topInset: 14, round: 16 },
  XDA: { depth: 7, height: 16, topInset: 12, round: 14 },
  DSA: { depth: 6, height: 12, topInset: 13, round: 16 },
}

/** Pick a readable legend color for a given keycap fill. */
function legendColor(hex: string): string {
  const c = hex.replace("#", "")
  if (c.length < 6) return "#111"
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? "#1a1a1a" : "#f5f5f5"
}

function KeycapImpl({
  keyDef,
  pressed,
  accent,
  keyColor,
  profile,
  effects,
  animationSpeed,
  onPress,
  onRelease,
}: KeycapProps) {
  const [ripples, setRipples] = useState<number[]>([])
  const p = PROFILE[profile]
  const legend = legendColor(keyColor)

  const handleDown = (e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    const velocity = 0.7 + Math.random() * 0.3
    onPress(keyDef.index, velocity)
    if (effects) {
      const id = Date.now() + Math.random()
      setRipples((r) => [...r, id])
      window.setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 650)
    }
  }

  const handleUp = () => onRelease(keyDef.index)

  const spring = {
    type: "spring" as const,
    stiffness: 900 / animationSpeed,
    damping: 26 * animationSpeed,
    mass: 0.6,
  }

  return (
    <div className="relative select-none" style={{ perspective: 700 }}>
      {/* Fixed key well / housing shadow that the cap sinks into */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: "color-mix(in oklab, var(--foreground) 8%, transparent)", transform: `translateY(${p.height}px)` }}
        aria-hidden
      />

      <motion.button
        type="button"
        aria-label={`Key ${keyDef.legend}`}
        aria-pressed={pressed}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
        onContextMenu={(e) => e.preventDefault()}
        animate={{
          y: pressed ? p.depth : 0,
          boxShadow: pressed
            ? `0 ${p.height - p.depth}px 0 -1px color-mix(in oklab, ${keyColor} 55%, #000), 0 4px 8px rgba(0,0,0,0.25)`
            : `0 ${p.height}px 0 -1px color-mix(in oklab, ${keyColor} 55%, #000), 0 14px 22px rgba(0,0,0,0.32)`,
        }}
        transition={spring}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          borderRadius: p.round,
          background: `linear-gradient(180deg, color-mix(in oklab, ${keyColor} 88%, #fff) 0%, ${keyColor} 42%, color-mix(in oklab, ${keyColor} 82%, #000) 100%)`,
        }}
      >
        {/* Sculpted top surface */}
        <span
          className="pointer-events-none absolute rounded-[10px]"
          style={{
            inset: p.topInset,
            background: `radial-gradient(120% 90% at 50% 18%, color-mix(in oklab, ${keyColor} 96%, #fff) 0%, ${keyColor} 55%, color-mix(in oklab, ${keyColor} 90%, #000) 100%)`,
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.18)",
          }}
          aria-hidden
        />
        {/* Top light reflection */}
        <span
          className="pointer-events-none absolute left-0 right-0 top-0 h-1/3 rounded-t-[12px]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }}
          aria-hidden
        />

        {/* Legend */}
        <span
          className="relative z-10 font-mono text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ color: legend, textShadow: legend.startsWith("#f") ? "0 1px 2px rgba(0,0,0,0.4)" : "0 1px 1px rgba(255,255,255,0.4)" }}
        >
          {keyDef.legend}
        </span>

        {/* Glow accent when pressed */}
        {effects && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-[12px]"
            initial={false}
            animate={{ opacity: pressed ? 0.6 : 0 }}
            transition={{ duration: 0.12 }}
            style={{ boxShadow: `inset 0 0 24px 2px ${accent}`, background: `radial-gradient(60% 60% at 50% 50%, ${accent}22, transparent)` }}
            aria-hidden
          />
        )}

        {/* Ripple bursts */}
        {effects && (
          <AnimatePresence>
            {ripples.map((id) => (
              <motion.span
                key={id}
                className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
                initial={{ width: 0, height: 0, opacity: 0.5, x: "-50%", y: "-50%" }}
                animate={{ width: 220, height: 220, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
                aria-hidden
              />
            ))}
          </AnimatePresence>
        )}
      </motion.button>
    </div>
  )
}

export const Keycap = memo(KeycapImpl, (a, b) => a.pressed === b.pressed && a.keyColor === b.keyColor && a.accent === b.accent && a.profile === b.profile && a.effects === b.effects && a.animationSpeed === b.animationSpeed)

Keycap.displayName = "Keycap"
