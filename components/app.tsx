"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Keyboard } from "@/components/keyboard"
import { SceneBackground } from "@/components/scene-background"
import { SettingsPanel } from "@/components/settings-panel"
import { StatsBar } from "@/components/stats-bar"
import { SwitchSelector } from "@/components/switch-selector"
import { Tutorial } from "@/components/tutorial"
import { useSimulator } from "@/hooks/use-simulator"
import { useShortcuts } from "@/hooks/use-shortcuts"
import { useThemeEffect } from "@/hooks/use-theme"

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { pressed, metrics, pressKey, releaseKey } = useSimulator()

  useThemeEffect()
  useShortcuts()

  // Avoid hydration mismatch from persisted (localStorage) settings.
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="min-h-dvh bg-background" />

  return (
    <>
      <SceneBackground />
      <Tutorial />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-8 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <StatsBar metrics={metrics} />

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="w-full max-w-md">
            <Keyboard pressed={pressed} pressKey={pressKey} releaseKey={releaseKey} />
          </div>
          <div className="w-full max-w-2xl">
            <SwitchSelector />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted-foreground">
          <span>Type with <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">Q W E</kbd> <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">A S D</kbd> <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">Z X C</kbd></span>
          <span className="hidden sm:inline">·</span>
          <span><kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">1–9</kbd> switch · <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">M</kbd> theme · <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono">V</kbd> haptics</span>
        </footer>
      </main>
    </>
  )
}
