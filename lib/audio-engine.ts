import type { KeySwitch } from "./switches"

export interface AudioSettings {
  volume: number // 0..1
  reverb: number // 0..1 wet amount
  pitchRandom: number // 0..1 spread
  quality: "high" | "medium" | "low"
}

interface PlayOptions {
  /** 0..1 how hard the key was hit — affects gain + brightness. */
  velocity: number
  /** Stereo position -1..1. Randomized per key for a wide feel. */
  pan: number
  /** true = press (down), false = release (up-stroke). */
  press: boolean
}

/**
 * Procedural switch-sound synthesizer built on the Web Audio API.
 *
 * Every keystroke is generated on the fly from filtered noise + resonant
 * bodies, so there is no sample looping — pitch, gain, stereo and velocity are
 * randomized on each press and voices overlap naturally when typing fast.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private limiter: DynamicsCompressorNode | null = null
  private dryGain: GainNode | null = null
  private wetGain: GainNode | null = null
  private convolver: ConvolverNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private settings: AudioSettings = { volume: 0.8, reverb: 0.15, pitchRandom: 0.3, quality: "high" }

  /** Lazily create the AudioContext — must run after a user gesture. */
  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctx({ latencyHint: "interactive" })

    this.master = this.ctx.createGain()
    this.master.gain.value = this.settings.volume

    // Gentle glue compression, then a hard limiter to catch overlapping voices.
    this.compressor = this.ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -18
    this.compressor.knee.value = 20
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.002
    this.compressor.release.value = 0.12

    this.limiter = this.ctx.createDynamicsCompressor()
    this.limiter.threshold.value = -3
    this.limiter.knee.value = 0
    this.limiter.ratio.value = 20
    this.limiter.attack.value = 0.001
    this.limiter.release.value = 0.05

    // Reverb send.
    this.dryGain = this.ctx.createGain()
    this.wetGain = this.ctx.createGain()
    this.convolver = this.ctx.createConvolver()
    this.convolver.buffer = this.createImpulse(1.4, 2.2)
    this.applyReverb()

    // Routing: voices -> master -> compressor -> (dry + wet) -> limiter -> out
    this.master.connect(this.compressor)
    this.compressor.connect(this.dryGain)
    this.compressor.connect(this.convolver)
    this.convolver.connect(this.wetGain)
    this.dryGain.connect(this.limiter)
    this.wetGain.connect(this.limiter)
    this.limiter.connect(this.ctx.destination)

    this.noiseBuffer = this.createNoise(0.4)
  }

  /** Ensure the context exists and is running. Safe to call on every gesture. */
  resume() {
    if (!this.ctx) this.init()
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume()
  }

  setSettings(next: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...next }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.settings.volume, this.ctx.currentTime, 0.02)
    }
    this.applyReverb()
  }

  private applyReverb() {
    if (!this.dryGain || !this.wetGain || !this.ctx) return
    const wet = this.settings.reverb
    this.wetGain.gain.setTargetAtTime(wet, this.ctx.currentTime, 0.05)
    this.dryGain.gain.setTargetAtTime(1 - wet * 0.4, this.ctx.currentTime, 0.05)
  }

  private createNoise(seconds: number): AudioBuffer {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  private createImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
      }
    }
    return impulse
  }

  private rand(spread: number): number {
    return 1 + (Math.random() * 2 - 1) * spread
  }

  /**
   * A short filtered-noise burst — the building block of every clack, click
   * and bump. Attack is near-instant so it reads as a percussive transient.
   */
  private burst(
    dest: AudioNode,
    t: number,
    opts: { freq: number; q: number; bright: number; level: number; decay: number; snap?: boolean },
  ) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = opts.freq
    bp.Q.value = opts.q
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = opts.bright
    const g = ctx.createGain()
    if (opts.snap) {
      // Sharp click: instantaneous attack, very fast decay.
      g.gain.setValueAtTime(opts.level, t)
    } else {
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(opts.level, t + 0.0009)
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.decay)
    src.connect(bp)
    bp.connect(lp)
    lp.connect(g)
    g.connect(dest)
    src.start(t)
    src.stop(t + opts.decay + 0.03)
  }

  /** Low sine reinforcement for a deep "thock" body under the clack. */
  private thock(dest: AudioNode, t: number, freq: number, level: number, decay: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(freq * 1.6, t)
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.02)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(level, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    osc.connect(g)
    g.connect(dest)
    osc.start(t)
    osc.stop(t + decay + 0.03)
  }

  /** Play a single switch event (press or release). */
  play(sw: KeySwitch, opts: PlayOptions) {
    if (!this.ctx || !this.master || !this.noiseBuffer) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const s = sw.sound
    const isPress = opts.press
    const isLow = this.settings.quality === "low"
    const isHigh = this.settings.quality === "high"

    // Voice output with stereo positioning.
    const voice = ctx.createGain()
    const panner = ctx.createStereoPanner()
    panner.pan.value = Math.max(-1, Math.min(1, opts.pan))
    voice.connect(panner)
    panner.connect(this.master)

    const velGain = 0.6 + opts.velocity * 0.4
    const pitch = this.rand(this.settings.pitchRandom * 0.4)
    voice.gain.value = s.gain * velGain * this.rand(0.06)

    if (isPress) {
      // --- Down-stroke ---------------------------------------------------
      // 1. Sharp click element (clicky switches) fires first.
      if (s.click > 0.05 && !isLow) {
        this.burst(voice, now, {
          freq: s.clickFreq * pitch,
          q: 1.3,
          bright: 12000,
          level: s.click * 0.9,
          decay: 0.006,
          snap: true,
        })
      }
      // 2. Tactile bump "tick" (tactile switches) just before bottom-out.
      if (s.bump > 0.05 && !isLow) {
        this.burst(voice, now, {
          freq: 900 * pitch,
          q: 2,
          bright: s.clackBright * 0.8,
          level: s.bump * 0.5,
          decay: 0.012,
        })
      }
      // 3. The main bottom-out clack.
      const clackAt = now + (s.click > 0.05 ? 0.004 : 0)
      this.burst(voice, clackAt, {
        freq: s.clackFreq * pitch,
        q: 1.8,
        bright: s.clackBright * (0.75 + opts.velocity * 0.25),
        level: s.clackLevel,
        decay: s.clackDecay,
      })
      // 4. Deep sine body for thocky switches.
      if (s.body > 0.03) {
        this.thock(voice, clackAt, s.clackFreq * 0.7 * pitch, s.body * 0.5, s.clackDecay * 1.6)
      }
      // 5. Spring ping.
      if (s.spring > 0.02 && isHigh) {
        const ping = ctx.createOscillator()
        ping.type = "triangle"
        ping.frequency.value = (1900 + Math.random() * 900) * pitch
        const pingGain = ctx.createGain()
        const pingDur = 0.05 + Math.random() * 0.04
        pingGain.gain.setValueAtTime(s.spring * 0.28, now + 0.005)
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + pingDur)
        ping.connect(pingGain)
        pingGain.connect(voice)
        ping.start(now + 0.005)
        ping.stop(now + pingDur + 0.02)
      }
    } else {
      // --- Up-stroke (top-out): lighter, tighter, a touch brighter --------
      if (s.releaseClick > 0.05 && !isLow) {
        this.burst(voice, now, {
          freq: s.clickFreq * 0.9 * pitch,
          q: 1.3,
          bright: 11000,
          level: s.releaseClick * 0.8,
          decay: 0.005,
          snap: true,
        })
      }
      this.burst(voice, now + (s.releaseClick > 0.05 ? 0.003 : 0), {
        freq: s.clackFreq * 1.25 * pitch,
        q: 1.8,
        bright: s.clackBright * 1.05,
        level: s.clackLevel * s.topLevel,
        decay: s.clackDecay * 0.6,
      })
    }
  }
}

let engine: AudioEngine | null = null
export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine()
  return engine
}
