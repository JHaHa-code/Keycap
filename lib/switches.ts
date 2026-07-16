export type SwitchType = "linear" | "tactile" | "clicky" | "silent" | "topre"

export interface SwitchSound {
  /** Dominant resonance of the bottom-out "clack" (Hz). Low = thocky, high = clacky. */
  clackFreq: number
  /** How long the clack rings out (seconds). Short = tight, long = resonant. */
  clackDecay: number
  /** Lowpass cutoff for the clack (Hz). Low = muted/dampened, high = bright. */
  clackBright: number
  /** Loudness of the bottom-out clack. */
  clackLevel: number
  /** Low sine reinforcement for a deep "thock" body (0 = none, 1 = strong). */
  body: number
  /** Sharpness of the click element on the down-stroke (0 = none, 1 = very clicky). */
  click: number
  /** Bandpass center of the click transient (Hz). */
  clickFreq: number
  /** Click on the up-stroke too — gives clicky switches their double "찰칵찰칵" feel. */
  releaseClick: number
  /** Tactile bump "tick" just before bottom-out (0 = none, 1 = strong). */
  bump: number
  /** Loudness of the up-stroke (top-out) relative to the press. */
  topLevel: number
  /** High-frequency spring ping (0 = none). */
  spring: number
  /** Overall loudness multiplier for this switch. */
  gain: number
}

export interface KeySwitch {
  id: string
  name: string
  brand: string
  type: SwitchType
  /** Accent color used for the keycap legend, cross stem, and selector chip. */
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
    // Sharp, bright single click then a mid clack — the classic "찰칵".
    sound: { clackFreq: 300, clackDecay: 0.03, clackBright: 6200, clackLevel: 0.6, body: 0.1, click: 0.95, clickFreq: 3900, releaseClick: 0.2, bump: 0, topLevel: 0.55, spring: 0.22, gain: 1 },
  },
  {
    id: "cherry-red",
    name: "Cherry MX Red",
    brand: "Cherry",
    type: "linear",
    color: "#ef4444",
    haptic: 12,
    force: 45,
    // Quiet, smooth, muted bottom-out. No click at all.
    sound: { clackFreq: 250, clackDecay: 0.024, clackBright: 3200, clackLevel: 0.42, body: 0.15, click: 0, clickFreq: 2200, releaseClick: 0, bump: 0, topLevel: 0.34, spring: 0.03, gain: 0.8 },
  },
  {
    id: "cherry-brown",
    name: "Cherry MX Brown",
    brand: "Cherry",
    type: "tactile",
    color: "#a16207",
    haptic: 18,
    force: 55,
    // Soft tactile bump then a mid clack — no sharp click.
    sound: { clackFreq: 265, clackDecay: 0.027, clackBright: 4200, clackLevel: 0.5, body: 0.12, click: 0, clickFreq: 2600, releaseClick: 0, bump: 0.38, topLevel: 0.42, spring: 0.06, gain: 0.9 },
  },
  {
    id: "cherry-black",
    name: "Cherry MX Black",
    brand: "Cherry",
    type: "linear",
    color: "#404040",
    haptic: 20,
    force: 60,
    // Deep, heavy, dark linear thock.
    sound: { clackFreq: 175, clackDecay: 0.032, clackBright: 2800, clackLevel: 0.6, body: 0.4, click: 0, clickFreq: 1900, releaseClick: 0, bump: 0, topLevel: 0.36, spring: 0.03, gain: 0.9 },
  },
  {
    id: "cherry-silver",
    name: "Cherry MX Silver",
    brand: "Cherry",
    type: "linear",
    color: "#9ca3af",
    haptic: 10,
    force: 45,
    // Fast, light, short speed-switch tick.
    sound: { clackFreq: 300, clackDecay: 0.018, clackBright: 3900, clackLevel: 0.4, body: 0.08, click: 0, clickFreq: 2400, releaseClick: 0, bump: 0, topLevel: 0.34, spring: 0.05, gain: 0.78 },
  },
  {
    id: "cherry-silent-red",
    name: "Cherry MX Silent Red",
    brand: "Cherry",
    type: "silent",
    color: "#f87171",
    haptic: 8,
    force: 45,
    // Heavily dampened — a soft muffled thud, almost no highs.
    sound: { clackFreq: 200, clackDecay: 0.016, clackBright: 1800, clackLevel: 0.26, body: 0.18, click: 0, clickFreq: 1500, releaseClick: 0, bump: 0, topLevel: 0.24, spring: 0, gain: 0.6 },
  },
  {
    id: "cherry-silent-black",
    name: "Cherry MX Silent Black",
    brand: "Cherry",
    type: "silent",
    color: "#525252",
    haptic: 10,
    force: 60,
    // Deepest, most muffled silent thud.
    sound: { clackFreq: 165, clackDecay: 0.018, clackBright: 1600, clackLevel: 0.3, body: 0.28, click: 0, clickFreq: 1300, releaseClick: 0, bump: 0, topLevel: 0.22, spring: 0, gain: 0.62 },
  },
  {
    id: "gateron-yellow",
    name: "Gateron Yellow",
    brand: "Gateron",
    type: "linear",
    color: "#eab308",
    haptic: 12,
    force: 50,
    // Smooth, slightly thocky budget-favorite linear.
    sound: { clackFreq: 220, clackDecay: 0.03, clackBright: 3500, clackLevel: 0.55, body: 0.25, click: 0, clickFreq: 2100, releaseClick: 0, bump: 0, topLevel: 0.4, spring: 0.03, gain: 0.9 },
  },
  {
    id: "gateron-ink-black",
    name: "Gateron Ink Black",
    brand: "Gateron",
    type: "linear",
    color: "#1f2937",
    haptic: 16,
    force: 60,
    // Deep, rounded, premium "thock".
    sound: { clackFreq: 165, clackDecay: 0.038, clackBright: 3000, clackLevel: 0.62, body: 0.5, click: 0, clickFreq: 1800, releaseClick: 0, bump: 0, topLevel: 0.44, spring: 0.03, gain: 0.95 },
  },
  {
    id: "akko-cream-yellow",
    name: "Akko Cream Yellow",
    brand: "Akko",
    type: "linear",
    color: "#fbbf24",
    haptic: 12,
    force: 50,
    sound: { clackFreq: 230, clackDecay: 0.03, clackBright: 3400, clackLevel: 0.54, body: 0.28, click: 0, clickFreq: 2000, releaseClick: 0, bump: 0, topLevel: 0.42, spring: 0.03, gain: 0.9 },
  },
  {
    id: "akko-jelly-pink",
    name: "Akko Jelly Pink",
    brand: "Akko",
    type: "linear",
    color: "#ec4899",
    haptic: 12,
    force: 45,
    sound: { clackFreq: 260, clackDecay: 0.026, clackBright: 4000, clackLevel: 0.5, body: 0.15, click: 0, clickFreq: 2300, releaseClick: 0, bump: 0, topLevel: 0.4, spring: 0.05, gain: 0.86 },
  },
  {
    id: "kailh-box-white",
    name: "Kailh Box White",
    brand: "Kailh",
    type: "clicky",
    color: "#e5e7eb",
    haptic: 24,
    force: 50,
    // Crispest click — snaps on BOTH down and up-stroke ("찰칵찰칵").
    sound: { clackFreq: 340, clackDecay: 0.026, clackBright: 7800, clackLevel: 0.6, body: 0.08, click: 1, clickFreq: 4700, releaseClick: 0.75, bump: 0, topLevel: 0.6, spring: 0.28, gain: 1 },
  },
  {
    id: "holy-panda",
    name: "Holy Panda",
    brand: "Drop",
    type: "tactile",
    color: "#f59e0b",
    haptic: 22,
    force: 67,
    // Big, snappy tactile bump into a full clack — no click element.
    sound: { clackFreq: 225, clackDecay: 0.036, clackBright: 4800, clackLevel: 0.72, body: 0.3, click: 0, clickFreq: 2700, releaseClick: 0, bump: 0.7, topLevel: 0.5, spring: 0.08, gain: 1 },
  },
  {
    id: "ttc-gold-pink",
    name: "TTC Gold Pink",
    brand: "TTC",
    type: "linear",
    color: "#f472b6",
    haptic: 12,
    force: 37,
    sound: { clackFreq: 280, clackDecay: 0.024, clackBright: 4400, clackLevel: 0.46, body: 0.12, click: 0, clickFreq: 2500, releaseClick: 0, bump: 0, topLevel: 0.38, spring: 0.05, gain: 0.82 },
  },
  {
    id: "ttc-frozen",
    name: "TTC Frozen",
    brand: "TTC",
    type: "linear",
    color: "#38bdf8",
    haptic: 11,
    force: 45,
    sound: { clackFreq: 300, clackDecay: 0.022, clackBright: 4800, clackLevel: 0.46, body: 0.12, click: 0, clickFreq: 2600, releaseClick: 0, bump: 0, topLevel: 0.38, spring: 0.06, gain: 0.82 },
  },
  {
    id: "outemu-blue",
    name: "Outemu Blue",
    brand: "Outemu",
    type: "clicky",
    color: "#2563eb",
    haptic: 25,
    force: 60,
    // Slightly lower, chunkier click than Cherry Blue.
    sound: { clackFreq: 290, clackDecay: 0.032, clackBright: 5600, clackLevel: 0.62, body: 0.14, click: 0.88, clickFreq: 3300, releaseClick: 0.18, bump: 0, topLevel: 0.52, spring: 0.18, gain: 0.95 },
  },
  {
    id: "zealios",
    name: "Zealios V2",
    brand: "ZealPC",
    type: "tactile",
    color: "#7c3aed",
    haptic: 20,
    force: 65,
    // Sharp, rounded tactile bump.
    sound: { clackFreq: 240, clackDecay: 0.03, clackBright: 5000, clackLevel: 0.58, body: 0.2, click: 0, clickFreq: 2800, releaseClick: 0, bump: 0.55, topLevel: 0.46, spring: 0.07, gain: 0.92 },
  },
  {
    id: "boba-u4t",
    name: "Boba U4T",
    brand: "Gazzew",
    type: "tactile",
    color: "#78716c",
    haptic: 20,
    force: 62,
    // Strong "thocky" tactile — deep bump and clack.
    sound: { clackFreq: 190, clackDecay: 0.04, clackBright: 4200, clackLevel: 0.68, body: 0.38, click: 0, clickFreq: 2500, releaseClick: 0, bump: 0.65, topLevel: 0.48, spring: 0.07, gain: 1 },
  },
  {
    id: "topre",
    name: "Topre",
    brand: "Topre",
    type: "topre",
    color: "#14b8a6",
    haptic: 30,
    force: 45,
    // Rubber-dome "thock" — deep, soft, rounded with a gentle bump.
    sound: { clackFreq: 165, clackDecay: 0.05, clackBright: 2900, clackLevel: 0.62, body: 0.55, click: 0, clickFreq: 1600, releaseClick: 0, bump: 0.3, topLevel: 0.55, spring: 0.1, gain: 0.95 },
  },
]

export const getSwitch = (id: string): KeySwitch => SWITCHES.find((s) => s.id === id) ?? SWITCHES[0]
