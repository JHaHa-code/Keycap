"use client"

import { memo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { KeyDef } from "@/lib/keymap"
import type { KeycapProfile } from "@/lib/store"

interface KeycapProps {
  keyDef: KeyDef
  pressed: boolean
  accent: string
  /** The switch's signature color — shown on the cross stem inside the housing. */
  switchColor: string
  keyColor: string
  profile: KeycapProfile
  effects: boolean
  animationSpeed: number
  onPress: (index: number, velocity: number) => void
  onRelease: (index: number) => void
}

/** Per-profile sculpt tuning: press depth (px) and cap height feel. */
const PROFILE: Record<KeycapProfile, { depth: number; height: number; round: number }> = {
  GMK: { depth: 8, height: 14, round: 12 },
  Cherry: { depth: 8, height: 12, round: 12 },
  PBT: { depth: 8, height: 14, round: 12 },
  ABS: { depth: 8, height: 13, round: 12 },
  OEM: { depth: 9, height: 16, round: 12 },
  SA: { depth: 10, height: 20, round: 16 },
  XDA: { depth: 7, height: 16, round: 14 },
  DSA: { depth: 6, height: 12, round: 16 },
}

/** The colored MX-style "+" cross stem that sits inside the switch housing. */
function CrossStem({ color }: { color: string }) {
  const bar = "absolute rounded-[2px]"
  const fill = `linear-gradient(150deg, color-mix(in oklab, ${color} 78%, #fff) 0%, ${color} 45%, color-mix(in oklab, ${color} 70%, #000) 100%)`
  const shadow = "0 1px 2px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.35)"
  return (
    <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2" aria-hidden>
      {/* vertical bar */}
      <span className={`${bar} left-1/2 top-0 h-full w-[26%] -translate-x-1/2`} style={{ background: fill, boxShadow: shadow }} />
      {/* horizontal bar */}
      <span className={`${bar} left-0 top-1/2 h-[26%] w-full -translate-y-1/2`} style={{ background: fill, boxShadow: shadow }} />
    </div>
  )
}

function KeycapImpl({
  keyDef,
  pressed,
  accent,
  switchColor,
  keyColor,
  profile,
  effects,
  animationSpeed,
  onPress,
  onRelease,
}: KeycapProps) {
  const [ripples, setRipples] = useState<number[]>([])
  const p = PROFILE[profile]

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
      {/* --- Switch housing (fixed): dark socket with the colored cross stem --- */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(180deg, #2a2a30 0%, #17171b 100%)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 2px rgba(255,255,255,0.06)",
          transform: `translateY(${p.height}px)`,
        }}
        aria-hidden
      >
        {/* Recessed plate around the stem */}
        <div
          className="absolute inset-[14%] rounded-xl"
          style={{ background: "radial-gradient(120% 120% at 50% 30%, #34343c 0%, #1c1c21 70%)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)" }}
        />
        {/* Glow behind the stem when pressed */}
        <motion.div
          className="absolute inset-[18%] rounded-lg"
          initial={false}
          animate={{ opacity: pressed ? 0.9 : 0.25 }}
          transition={{ duration: 0.12 }}
          style={{ background: `radial-gradient(circle at 50% 50%, ${switchColor}, transparent 70%)`, filter: "blur(4px)" }}
        />
        <CrossStem color={switchColor} />
      </div>

      {/* --- Translucent keycap that sinks onto the switch --- */}
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
            ? `0 ${p.height - p.depth}px 0 -2px rgba(120,120,130,0.35), 0 3px 8px rgba(0,0,0,0.3)`
            : `0 ${p.height}px 0 -2px rgba(120,120,130,0.35), 0 14px 22px rgba(0,0,0,0.3)`,
        }}
        transition={spring}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden border outline-none backdrop-blur-[3px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          borderRadius: p.round,
          borderColor: "rgba(255,255,255,0.35)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 100%)",
        }}
      >
        {/* Faint keycap color tint (kept low so the stem shows through) */}
        <span className="pointer-events-none absolute inset-0" style={{ background: keyColor, opacity: 0.12, borderRadius: p.round }} aria-hidden />
        {/* Top light reflection */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-2/5"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5), transparent)", borderRadius: `${p.round}px ${p.round}px 0 0` }}
          aria-hidden
        />
        {/* Inner edge sheen */}
        <span
          className="pointer-events-none absolute inset-[6%] rounded-[8px]"
          style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -6px 10px rgba(0,0,0,0.15)" }}
          aria-hidden
        />

        {/* Legend */}
        <span
          className="relative z-10 font-mono text-2xl font-semibold tracking-tight drop-shadow-sm sm:text-3xl"
          style={{ color: "color-mix(in oklab, var(--foreground) 82%, transparent)", textShadow: "0 1px 2px rgba(255,255,255,0.35)" }}
        >
          {keyDef.legend}
        </span>

        {/* Accent glow when pressed */}
        {effects && (
          <motion.span
            className="pointer-events-none absolute inset-0"
            initial={false}
            animate={{ opacity: pressed ? 0.55 : 0 }}
            transition={{ duration: 0.12 }}
            style={{ borderRadius: p.round, boxShadow: `inset 0 0 22px 2px ${accent}` }}
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

export const Keycap = memo(
  KeycapImpl,
  (a, b) =>
    a.pressed === b.pressed &&
    a.keyColor === b.keyColor &&
    a.accent === b.accent &&
    a.switchColor === b.switchColor &&
    a.profile === b.profile &&
    a.effects === b.effects &&
    a.animationSpeed === b.animationSpeed,
)

Keycap.displayName = "Keycap"
