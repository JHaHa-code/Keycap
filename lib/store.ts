import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeMode = "light" | "dark" | "auto"
export type KeycapProfile = "GMK" | "PBT" | "ABS" | "SA" | "OEM" | "Cherry" | "XDA" | "DSA"
export type BackgroundStyle = "solid" | "gradient" | "glass" | "wood" | "carbon" | "animated"
export type SoundQuality = "high" | "medium" | "low"

export interface Settings {
  theme: ThemeMode
  switchId: string
  volume: number // 0..1
  haptics: boolean
  animationSpeed: number // 0.5 (fast) .. 1.5 (slow) multiplier
  reverb: number // 0..1
  pitchRandom: number // 0..1
  quality: SoundQuality
  keycapProfile: KeycapProfile
  keyColor: string
  background: BackgroundStyle
  effects: boolean
  tutorialSeen: boolean
}

export interface Stats {
  today: number
  todayDate: string
  total: number
  maxStreak: number
}

interface StoreState extends Settings {
  stats: Stats
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  registerHit: (streak: number) => void
  resetStats: () => void
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      theme: "auto",
      switchId: "holy-panda",
      volume: 0.8,
      haptics: true,
      animationSpeed: 1,
      reverb: 0.15,
      pitchRandom: 0.3,
      quality: "high",
      keycapProfile: "GMK",
      keyColor: "#f5f5f4",
      background: "gradient",
      effects: true,
      tutorialSeen: false,
      stats: { today: 0, todayDate: todayKey(), total: 0, maxStreak: 0 },

      set: (key, value) => set({ [key]: value } as Partial<StoreState>),

      registerHit: (streak) =>
        set((state) => {
          const key = todayKey()
          const sameDay = state.stats.todayDate === key
          return {
            stats: {
              today: sameDay ? state.stats.today + 1 : 1,
              todayDate: key,
              total: state.stats.total + 1,
              maxStreak: Math.max(state.stats.maxStreak, streak),
            },
          }
        }),

      resetStats: () => set({ stats: { today: 0, todayDate: todayKey(), total: 0, maxStreak: 0 } }),
    }),
    {
      name: "keyclick-studio",
      version: 1,
    },
  ),
)
