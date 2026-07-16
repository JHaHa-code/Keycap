"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

/**
 * Applies the resolved theme (light/dark) to <html>, honoring the "auto"
 * setting by following the OS preference and reacting to live changes.
 */
export function useThemeEffect() {
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia("(prefers-color-scheme: dark)")

    const apply = () => {
      const dark = theme === "dark" || (theme === "auto" && mq.matches)
      root.classList.toggle("dark", dark)
      root.classList.toggle("light", !dark)
    }

    apply()
    if (theme === "auto") {
      mq.addEventListener("change", apply)
      return () => mq.removeEventListener("change", apply)
    }
  }, [theme])
}
