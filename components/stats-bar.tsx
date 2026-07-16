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

export function StatsBar({ metrics }: { metrics: LiveMetrics }) {
  const stats = useStore((s) => s.stats)
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <Stat icon={<Activity size={16} />} label="Keys / sec" value={String(metrics.kps)} />
      <Stat icon={<Gauge size={16} />} label="Avg /sec" value={metrics.avgKps.toFixed(1)} />
      <Stat icon={<Flame size={16} />} label="Streak" value={String(Math.max(metrics.streak, stats.maxStreak))} />
      <Stat icon={<Hash size={16} />} label="Today" value={stats.today.toLocaleString()} />
      <Stat icon={<Hash size={16} />} label="All time" value={stats.total.toLocaleString()} />
      <Stat icon={<Flame size={16} />} label="Best streak" value={stats.maxStreak.toLocaleString()} />
    </div>
  )
}
