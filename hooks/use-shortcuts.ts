"use client"

import { useEffect } from "react"
import { SWITCHES } from "@/lib/switches"
import { useStore } from "@/lib/store"

/**
 * Global keyboard shortcuts:
 *   M            toggle dark / light
 *   V            toggle haptics
 *   + / =        volume up      - / _   volume down
 *   1 – 9        select switch (by list order)
 */
export function useShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const store = useStore.getState()
      const key = e.key

      if (key === "m" || key === "M") {
        store.set("theme", store.theme === "dark" ? "light" : "dark")
      } else if (key === "v" || key === "V") {
        store.set("haptics", !store.haptics)
      } else if (key === "+" || key === "=") {
        store.set("volume", Math.min(1, Math.round((store.volume + 0.1) * 100) / 100))
      } else if (key === "-" || key === "_") {
        store.set("volume", Math.max(0, Math.round((store.volume - 0.1) * 100) / 100))
      } else if (/^[1-9]$/.test(key)) {
        const idx = parseInt(key, 10) - 1
        if (SWITCHES[idx]) store.set("switchId", SWITCHES[idx].id)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
}
