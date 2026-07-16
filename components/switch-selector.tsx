"use client"

import { SWITCHES } from "@/lib/switches"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function SwitchSelector() {
  const switchId = useStore((s) => s.switchId)
  const setSwitch = useStore((s) => s.set)

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {SWITCHES.map((sw) => (
          <button
            key={sw.id}
            type="button"
            onClick={() => setSwitch("switchId", sw.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              switchId === sw.id
                ? "border-primary bg-card text-foreground shadow-sm"
                : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: sw.color }} />
            {sw.name}
          </button>
        ))}
      </div>
    </div>
  )
}
