"use client"

import { Activity, Flame, Gauge, Hash } from "lucide-react"
import { useStore } from "@/lib/store"
import type { LiveMetrics } from "@/hooks/use-simulator"

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2.5 backdrop-blur">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="font-mono text-base font-semibold tabular-nums text-foreground">{value}</span>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </span>
    </div>
  )
}
