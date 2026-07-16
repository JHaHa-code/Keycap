"use client"

import { Keycap } from "@/components/keycap"
import { KEYS } from "@/lib/keymap"
import { getSwitch } from "@/lib/switches"
import { useStore } from "@/lib/store"

interface KeyboardProps {
  pressed: boolean[]
  pressKey: (index: number, velocity: number) => void
  releaseKey: (index: number) => void
}

export function Keyboard({ pressed, pressKey, releaseKey }: KeyboardProps) {
  const switchId = useStore((s) => s.switchId)
  const keyColor = useStore((s) => s.keyColor)
  const profile = useStore((s) => s.keycapProfile)
  const effects = useStore((s) => s.effects)
  const animationSpeed = useStore((s) => s.animationSpeed)
  const accent = getSwitch(switchId).color

  return (
    <div
      className="relative rounded-[28px] border border-border/60 p-5 shadow-2xl sm:p-6"
      style={{
        background: "linear-gradient(160deg, color-mix(in oklab, var(--card) 92%, #fff) 0%, var(--card) 60%, color-mix(in oklab, var(--card) 88%, #000) 100%)",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      {/* Aluminium plate rim */}
      <div className="pointer-events-none absolute inset-2 rounded-[22px] border border-border/40" aria-hidden />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {KEYS.map((k) => (
          <Keycap
            key={k.index}
            keyDef={k}
            pressed={pressed[k.index]}
            accent={accent}
            keyColor={keyColor}
            profile={profile}
            effects={effects}
            animationSpeed={animationSpeed}
            onPress={pressKey}
            onRelease={releaseKey}
          />
        ))}
      </div>
    </div>
  )
}
