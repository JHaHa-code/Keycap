"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getAudioEngine } from "@/lib/audio-engine"
import { getSwitch } from "@/lib/switches"
import { CODE_TO_INDEX } from "@/lib/keymap"
import { useStore } from "@/lib/store"

export interface LiveMetrics {
  kps: number // keys per second (rolling 1s window)
  avgKps: number // session average
  streak: number // current uninterrupted streak
}

/**
 * Central input engine: converts pointer / keyboard / touch events into
 * synchronized audio, haptics, key-down state and live typing metrics.
 */
export function useSimulator() {
  const switchId = useStore((s) => s.switchId)
  const volume = useStore((s) => s.volume)
  const reverb = useStore((s) => s.reverb)
  const pitchRandom = useStore((s) => s.pitchRandom)
  const quality = useStore((s) => s.quality)
  const haptics = useStore((s) => s.haptics)
  const registerHit = useStore((s) => s.registerHit)

  const [pressed, setPressed] = useState<boolean[]>(() => Array(9).fill(false))
  const [metrics, setMetrics] = useState<LiveMetrics>({ kps: 0, avgKps: 0, streak: 0 })

  // Refs so the hot path never depends on React state.
  const heldRef = useRef<Set<number>>(new Set())
  const timestampsRef = useRef<number[]>([]) // recent hit times for kps
  const streakRef = useRef(0)
  const lastHitRef = useRef(0)
  const sessionStartRef = useRef(0)
  const totalRef = useRef(0)

  const engine = getAudioEngine()

  // Keep the audio engine in sync with settings.
  useEffect(() => {
    engine.setSettings({ volume, reverb, pitchRandom, quality })
  }, [engine, volume, reverb, pitchRandom, quality])

  const setKey = useCallback((index: number, down: boolean) => {
    setPressed((prev) => {
      if (prev[index] === down) return prev
      const next = prev.slice()
      next[index] = down
      return next
    })
  }, [])

  const pressKey = useCallback(
    (index: number, velocity = 0.85) => {
      if (index < 0 || index > 8) return
      if (heldRef.current.has(index)) return // ignore auto-repeat
      heldRef.current.add(index)
      setKey(index, true)

      const now = performance.now()
      engine.resume()
      engine.play(getSwitch(switchId), {
        velocity,
        pan: (index % 3) - 1 + (Math.random() * 0.4 - 0.2), // spread by column
        press: true,
      })

      if (haptics && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(getSwitch(switchId).haptic)
      }

      // Streak: consecutive hits within 1s keep the combo alive.
      if (now - lastHitRef.current < 1000) streakRef.current += 1
      else streakRef.current = 1
      lastHitRef.current = now
      if (sessionStartRef.current === 0) sessionStartRef.current = now
      totalRef.current += 1

      timestampsRef.current.push(now)
      registerHit(streakRef.current)
    },
    [engine, switchId, haptics, registerHit, setKey],
  )

  const releaseKey = useCallback(
    (index: number) => {
      if (!heldRef.current.has(index)) return
      heldRef.current.delete(index)
      setKey(index, false)
      engine.play(getSwitch(switchId), {
        velocity: 0.5,
        pan: (index % 3) - 1,
        press: false,
      })
    },
    [engine, switchId, setKey],
  )

  // Physical keyboard handling.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const idx = CODE_TO_INDEX[e.key.toLowerCase()]
      if (idx === undefined) return
      e.preventDefault()
      pressKey(idx)
    }
    const up = (e: KeyboardEvent) => {
      const idx = CODE_TO_INDEX[e.key.toLowerCase()]
      if (idx === undefined) return
      releaseKey(idx)
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [pressKey, releaseKey])

  // Throttled metrics loop (~6fps) to avoid re-render churn on the hot path.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = performance.now()
      timestampsRef.current = timestampsRef.current.filter((t) => now - t < 1000)
      const kps = timestampsRef.current.length
      const elapsed = sessionStartRef.current ? (now - sessionStartRef.current) / 1000 : 0
      const avgKps = elapsed > 0.5 ? totalRef.current / elapsed : 0
      const streak = now - lastHitRef.current < 1000 ? streakRef.current : 0
      setMetrics((prev) =>
        prev.kps === kps && Math.abs(prev.avgKps - avgKps) < 0.05 && prev.streak === streak
          ? prev
          : { kps, avgKps: Math.round(avgKps * 10) / 10, streak },
      )
    }, 160)
    return () => window.clearInterval(id)
  }, [])

  return { pressed, metrics, pressKey, releaseKey }
}
