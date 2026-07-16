export interface KeyDef {
  /** Grid index 0..8 (row-major). */
  index: number
  /** Legend printed on the keycap. */
  legend: string
  /** Physical keyboard key (event.key, lowercase) that triggers it. */
  code: string
}

/** 3x3 layout mapped to the classic QWE / ASD / ZXC cluster. */
export const KEYS: KeyDef[] = [
  { index: 0, legend: "Q", code: "q" },
  { index: 1, legend: "W", code: "w" },
  { index: 2, legend: "E", code: "e" },
  { index: 3, legend: "A", code: "a" },
  { index: 4, legend: "S", code: "s" },
  { index: 5, legend: "D", code: "d" },
  { index: 6, legend: "Z", code: "z" },
  { index: 7, legend: "X", code: "x" },
  { index: 8, legend: "C", code: "c" },
]

export const CODE_TO_INDEX: Record<string, number> = KEYS.reduce(
  (acc, k) => {
    acc[k.code] = k.index
    return acc
  },
  {} as Record<string, number>,
)
