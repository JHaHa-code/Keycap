"use client"

import { Moon, Settings, Sun } from "lucide-react"
import { getSwitch } from "@/lib/switches"
import { useStore } from "@/lib/store"

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  const switchId = useStore((s) => s.switchId)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.set)
  const sw = getSwitch(switchId)

  return (
    <header className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <span className="font-mono text-lg font-bold">K</span>
        </div>
        <div className="leading-tight">
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">KeyClick Studio</h1>
          <p className="text-xs text-muted-foreground">Mechanical keyboard simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur sm:flex">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: sw.color }} />
          <span className="text-sm font-medium">{sw.name}</span>
        </div>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme("theme", theme === "dark" ? "light" : "dark")}
          className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <Sun size={18} className="hidden dark:block" />
          <Moon size={18} className="block dark:hidden" />
        </button>
        <button
          type="button"
          aria-label="Open settings"
          onClick={onOpenSettings}
          className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
