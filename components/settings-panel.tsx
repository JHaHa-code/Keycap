"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Monitor, Moon, RotateCcw, Sun, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { SWITCHES } from "@/lib/switches"
import {
  useStore,
  type BackgroundStyle,
  type KeycapProfile,
  type SoundQuality,
  type ThemeMode,
} from "@/lib/store"
import { cn } from "@/lib/utils"

const KEY_COLORS = ["#f5f5f4", "#e7e5e4", "#1c1917", "#3b82f6", "#ef4444", "#22c55e", "#eab308", "#ec4899", "#14b8a6", "#a855f7"]
const PROFILES: KeycapProfile[] = ["GMK", "Cherry", "PBT", "ABS", "OEM", "SA", "XDA", "DSA"]
const BACKGROUNDS: BackgroundStyle[] = ["gradient", "solid", "glass", "wood", "carbon", "animated"]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3.5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-xl border border-border/60 bg-secondary/50 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Settings"
            aria-modal="true"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
              <Section title="Appearance">
                <Segmented<ThemeMode>
                  value={s.theme}
                  onChange={(v) => s.set("theme", v)}
                  options={[
                    { value: "light", label: <><Sun size={15} /> Light</> },
                    { value: "dark", label: <><Moon size={15} /> Dark</> },
                    { value: "auto", label: <><Monitor size={15} /> Auto</> },
                  ]}
                />
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Background</p>
                  <div className="grid grid-cols-3 gap-2">
                    {BACKGROUNDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => s.set("background", b)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-xs capitalize transition-colors",
                          s.background === b ? "border-primary bg-secondary text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Keycaps">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Profile</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PROFILES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => s.set("keycapProfile", p)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-xs transition-colors",
                          s.keycapProfile === p ? "border-primary bg-secondary text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Keycap color</p>
                  <div className="flex flex-wrap gap-2">
                    {KEY_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Keycap color ${c}`}
                        onClick={() => s.set("keyColor", c)}
                        className={cn(
                          "h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110",
                          s.keyColor === c ? "border-primary" : "border-border/60",
                        )}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Switch">
                <div className="grid grid-cols-2 gap-2">
                  {SWITCHES.map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => s.set("switchId", sw.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                        s.switchId === sw.id ? "border-primary bg-secondary" : "border-border/60 hover:bg-secondary/50",
                      )}
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: sw.color }} />
                      <span className="flex flex-col leading-tight">
                        <span className="font-medium text-foreground">{sw.name}</span>
                        <span className="capitalize text-muted-foreground">{sw.type}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Sound">
                <Slider label="Volume" min={0} max={1} step={0.01} value={s.volume} onChange={(v) => s.set("volume", v)} format={(v) => `${Math.round(v * 100)}%`} />
                <Slider label="Reverb" min={0} max={1} step={0.01} value={s.reverb} onChange={(v) => s.set("reverb", v)} format={(v) => `${Math.round(v * 100)}%`} />
                <Slider label="Pitch randomization" min={0} max={1} step={0.01} value={s.pitchRandom} onChange={(v) => s.set("pitchRandom", v)} format={(v) => `${Math.round(v * 100)}%`} />
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Sound quality</p>
                  <Segmented<SoundQuality>
                    value={s.quality}
                    onChange={(v) => s.set("quality", v)}
                    options={[
                      { value: "high", label: "High" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" },
                    ]}
                  />
                </div>
              </Section>

              <Section title="Feel">
                <Slider label="Animation speed" min={0.5} max={1.5} step={0.05} value={s.animationSpeed} onChange={(v) => s.set("animationSpeed", v)} format={(v) => (v < 0.9 ? "Fast" : v > 1.1 ? "Slow" : "Normal")} />
                <Toggle id="haptics" label="Haptics" description="Vibration feedback on mobile" checked={s.haptics} onChange={(v) => s.set("haptics", v)} />
                <Toggle id="effects" label="Visual effects" description="Ripple, glow & particles" checked={s.effects} onChange={(v) => s.set("effects", v)} />
              </Section>

              <Section title="Statistics">
                <button
                  type="button"
                  onClick={() => s.resetStats()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <RotateCcw size={15} /> Reset statistics
                </button>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
