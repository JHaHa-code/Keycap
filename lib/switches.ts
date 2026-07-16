export type SwitchType = "linear" | "tactile" | "clicky" | "silent" | "topre"

export interface SwitchSound {
  /** Fundamental frequency of the bottom-out "body" tone (Hz). Lower = thockier. */
  bodyFreq: number
  /** How long the body resonance rings out (seconds). */
  bodyDecay: number
  /** Lowpass cutoff applied to the whole press — controls brightness (Hz). */
  brightness: number
  /** Amount of sharp click transient (0 = none, 1 = very clicky). */
  clickAmount: number
  /** Bandpass center of the click transient (Hz). */
  clickFreq: number
  /** Overall loudness multiplier for this switch. */
  gain: number
  /** Loudness of the up-stroke (release) sound relative to the press. */
  releaseGain: number
  /** Extra high-frequency "spring ping". 0 = none. */
  spring: number
}

export interface KeySwitch {
  id: string
  name: string
  brand: string
  type: SwitchType
  /** Accent color used for the keycap legend + selector chip. */
  color: string
  /** Vibration duration on mobile (ms). */
  haptic: number
  /** Actuation force in cN, shown in the UI for flavor. */
  force: number
  sound: SwitchSound
}

export const SWITCHES: KeySwitch[] = [
  {
    id: "cherry-blue",
    name: "Cherry MX Blue",
    brand: "Cherry",
    type: "clicky",
    color: "#3b82f6",
    haptic: 25,
    force: 60,
    sound: { bodyFreq: 320, bodyDecay: 0.09, brightness: 6500, clickAmount: 0.95, clickFreq: 3400, gain: 1, releaseGain: 0.55, spring: 0.25 },
  },
  {
    id: "cherry-red",
    name: "Cherry MX Red",
    brand: "Cherry",
    type: "linear",
    color: "#ef4444",
    haptic: 12,
    force: 45,
    sound: { bodyFreq: 240, bodyDecay: 0.07, brightness: 4200, clickAmount: 0.12, clickFreq: 2200, gain: 0.85, releaseGain: 0.4, spring: 0.05 },
  },
  {
    id: "cherry-brown",
    name: "Cherry MX Brown",
    brand: "Cherry",
    type: "tactile",
    color: "#a16207",
    haptic: 18,
    force: 55,
    sound: { bodyFreq: 270, bodyDecay: 0.08, brightness: 5000, clickAmount: 0.4, clickFreq: 2600, gain: 0.9, releaseGain: 0.45, spring: 0.1 },
  },
  {
    id: "cherry-black",
    name: "Cherry MX Black",
    brand: "Cherry",
    type: "linear",
    color: "#404040",
    haptic: 20,
    force: 60,
    sound: { bodyFreq: 210, bodyDecay: 0.075, brightness: 3600, clickAmount: 0.1, clickFreq: 1900, gain: 0.9, releaseGain: 0.4, spring: 0.04 },
  },
  {
    id: "cherry-silver",
    name: "Cherry MX Silver",
    brand: "Cherry",
    type: "linear",
    color: "#9ca3af",
    haptic: 10,
    force: 45,
    sound: { bodyFreq: 300, bodyDecay: 0.06, brightness: 4800, clickAmount: 0.15, clickFreq: 2400, gain: 0.8, releaseGain: 0.38, spring: 0.06 },
  },
  {
    id: "cherry-silent-red",
    name: "Cherry MX Silent Red",
    brand: "Cherry",
    type: "silent",
    color: "#f87171",
    haptic: 8,
    force: 45,
    sound: { bodyFreq: 190, bodyDecay: 0.05, brightness: 2600, clickAmount: 0.04, clickFreq: 1500, gain: 0.55, releaseGain: 0.25, spring: 0 },
  },
  {
    id: "cherry-silent-black",
    name: "Cherry MX Silent Black",
    brand: "Cherry",
    type: "silent",
    color: "#525252",
    haptic: 10,
    force: 60,
    sound: { bodyFreq: 170, bodyDecay: 0.05, brightness: 2300, clickAmount: 0.03, clickFreq: 1300, gain: 0.55, releaseGain: 0.22, spring: 0 },
  },
  {
    id: "gateron-yellow",
    name: "Gateron Yellow",
    brand: "Gateron",
    type: "linear",
    color: "#eab308",
    haptic: 12,
    force: 50,
    sound: { bodyFreq: 250, bodyDecay: 0.08, brightness: 4400, clickAmount: 0.1, clickFreq: 2100, gain: 0.9, releaseGain: 0.44, spring: 0.05 },
  },
  {
    id: "gateron-ink-black",
    name: "Gateron Ink Black",
    brand: "Gateron",
    type: "linear",
    color: "#1f2937",
    haptic: 16,
    force: 60,
    sound: { bodyFreq: 200, bodyDecay: 0.095, brightness: 3800, clickAmount: 0.12, clickFreq: 1800, gain: 0.95, releaseGain: 0.5, spring: 0.05 },
  },
  {
    id: "akko-cream-yellow",
    name: "Akko Cream Yellow",
    brand: "Akko",
    type: "linear",
    color: "#fbbf24",
    haptic: 12,
    force: 50,
    sound: { bodyFreq: 230, bodyDecay: 0.085, brightness: 4000, clickAmount: 0.1, clickFreq: 2000, gain: 0.9, releaseGain: 0.46, spring: 0.05 },
  },
  {
    id: "akko-jelly-pink",
    name: "Akko Jelly Pink",
    brand: "Akko",
    type: "linear",
    color: "#ec4899",
    haptic: 12,
    force: 45,
    sound: { bodyFreq: 260, bodyDecay: 0.08, brightness: 4600, clickAmount: 0.14, clickFreq: 2300, gain: 0.88, releaseGain: 0.44, spring: 0.06 },
  },
  {
    id: "kailh-box-white",
    name: "Kailh Box White",
    brand: "Kailh",
    type: "clicky",
    color: "#e5e7eb",
    haptic: 24,
    force: 50,
    sound: { bodyFreq: 340, bodyDecay: 0.085, brightness: 7000, clickAmount: 1, clickFreq: 3800, gain: 1, releaseGain: 0.6, spring: 0.3 },
  },
  {
    id: "holy-panda",
    name: "Holy Panda",
    brand: "Drop",
    type: "tactile",
    color: "#f59e0b",
    haptic: 22,
    force: 67,
    sound: { bodyFreq: 220, bodyDecay: 0.1, brightness: 4800, clickAmount: 0.5, clickFreq: 2700, gain: 1, releaseGain: 0.5, spring: 0.12 },
  },
  {
    id: "ttc-gold-pink",
    name: "TTC Gold Pink",
    brand: "TTC",
    type: "linear",
    color: "#f472b6",
    haptic: 12,
    force: 37,
    sound: { bodyFreq: 280, bodyDecay: 0.075, brightness: 5000, clickAmount: 0.12, clickFreq: 2500, gain: 0.85, releaseGain: 0.42, spring: 0.06 },
  },
  {
    id: "ttc-frozen",
    name: "TTC Frozen",
    brand: "TTC",
    type: "linear",
    color: "#38bdf8",
    haptic: 11,
    force: 45,
    sound: { bodyFreq: 300, bodyDecay: 0.07, brightness: 5400, clickAmount: 0.13, clickFreq: 2600, gain: 0.85, releaseGain: 0.42, spring: 0.07 },
  },
  {
    id: "outemu-blue",
    name: "Outemu Blue",
    brand: "Outemu",
    type: "clicky",
    color: "#2563eb",
    haptic: 25,
    force: 60,
    sound: { bodyFreq: 330, bodyDecay: 0.09, brightness: 6200, clickAmount: 0.9, clickFreq: 3200, gain: 0.95, releaseGain: 0.55, spring: 0.22 },
  },
  {
    id: "zealios",
    name: "Zealios V2",
    brand: "ZealPC",
    type: "tactile",
    color: "#7c3aed",
    haptic: 20,
    force: 65,
    sound: { bodyFreq: 240, bodyDecay: 0.09, brightness: 5200, clickAmount: 0.45, clickFreq: 2800, gain: 0.92, releaseGain: 0.48, spring: 0.1 },
  },
  {
    id: "boba-u4t",
    name: "Boba U4T",
    brand: "Gazzew",
    type: "tactile",
    color: "#78716c",
    haptic: 20,
    force: 62,
    sound: { bodyFreq: 200, bodyDecay: 0.11, brightness: 4600, clickAmount: 0.55, clickFreq: 2500, gain: 1, releaseGain: 0.5, spring: 0.1 },
  },
  {
    id: "topre",
    name: "Topre",
    brand: "Topre",
    type: "topre",
    color: "#14b8a6",
    haptic: 30,
    force: 45,
    sound: { bodyFreq: 180, bodyDecay: 0.13, brightness: 3200, clickAmount: 0.2, clickFreq: 1600, gain: 0.95, releaseGain: 0.6, spring: 0.15 },
  },
]

export const getSwitch = (id: string): KeySwitch => SWITCHES.find((s) => s.id === id) ?? SWITCHES[0]
