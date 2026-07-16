"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Keyboard, MousePointerClick, SlidersHorizontal } from "lucide-react"
import { useStore } from "@/lib/store"

const STEPS = [
  { icon: <MousePointerClick size={20} />, title: "Tap to type", body: "Click, tap or use your keyboard — the QWE / ASD / ZXC keys are mapped to the pad." },
  { icon: <Keyboard size={20} />, title: "Swap switches", body: "Press 1–9 or pick from the bar to feel Blues, Reds, Topre and more." },
  { icon: <SlidersHorizontal size={20} />, title: "Make it yours", body: "Open settings to tune sound, keycaps, themes and effects. M toggles dark mode." },
]

export function Tutorial() {
  const seen = useStore((s) => s.tutorialSeen)
  const set = useStore((s) => s.set)

  return (
    <AnimatePresence>
      {!seen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <h2 className="text-xl font-semibold tracking-tight text-balance">Welcome to KeyClick Studio</h2>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">A premium mechanical keyboard, right in your browser.</p>

            <ul className="mt-5 space-y-4">
              {STEPS.map((step) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">{step.icon}</span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{step.title}</span>
                    <span className="block text-sm text-muted-foreground text-pretty">{step.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => set("tutorialSeen", true)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start typing
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
