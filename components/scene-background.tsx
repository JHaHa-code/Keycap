"use client"

import { useStore } from "@/lib/store"
import { getSwitch } from "@/lib/switches"

/** Full-bleed backdrop that reacts to the selected background style + switch accent. */
export function SceneBackground() {
  const background = useStore((s) => s.background)
  const switchId = useStore((s) => s.switchId)
  const accent = getSwitch(switchId).color

  if (background === "solid") {
    return <div className="fixed inset-0 -z-10 bg-background" aria-hidden />
  }

  if (background === "carbon") {
    return (
      <div
        className="fixed inset-0 -z-10 bg-background"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in oklab, var(--foreground) 4%, transparent) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, color-mix(in oklab, var(--foreground) 4%, transparent) 0 2px, transparent 2px 6px)",
        }}
      />
    )
  }

  if (background === "wood") {
    return (
      <div
        className="fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "repeating-linear-gradient(92deg, oklch(0.36 0.05 60) 0 6px, oklch(0.33 0.05 55) 6px 13px, oklch(0.38 0.05 62) 13px 21px)",
        }}
      />
    )
  }

  if (background === "glass") {
    return (
      <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(60% 60% at 50% 20%, ${accent}22, transparent 70%)` }}
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>
    )
  }

  // gradient + animated share the same base; animated adds slow drift.
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden>
      <div
        className={background === "animated" ? "absolute -inset-1/4 animate-[drift_18s_ease-in-out_infinite]" : "absolute inset-0"}
        style={{
          background: `radial-gradient(45% 45% at 25% 25%, ${accent}33, transparent 70%), radial-gradient(45% 45% at 75% 70%, color-mix(in oklab, ${accent} 60%, #000)33, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--background) 70%, transparent))" }} />
    </div>
  )
}
