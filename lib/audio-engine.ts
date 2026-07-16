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

  /** Play a single switch event (press or release). */
  play(sw: KeySwitch, opts: PlayOptions) {
    if (!this.ctx || !this.master || !this.noiseBuffer) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const s = sw.sound
    const isPress = opts.press

    // Voice output with stereo positioning.
    const voice = ctx.createGain()
    const panner = ctx.createStereoPanner()
    panner.pan.value = Math.max(-1, Math.min(1, opts.pan))
    voice.connect(panner)
    panner.connect(this.master)

    const velGain = 0.55 + opts.velocity * 0.45
    const pitchMul = this.rand(this.settings.pitchRandom * 0.5)
    const overall = s.gain * (isPress ? 1 : s.releaseGain) * velGain * this.rand(0.08)
    voice.gain.value = overall

    const isLow = this.settings.quality === "low"

    // --- Body / bottom-out resonance (filtered noise burst) ---
    const body = ctx.createBufferSource()
    body.buffer = this.noiseBuffer
    const bodyFilter = ctx.createBiquadFilter()
    bodyFilter.type = "bandpass"
    bodyFilter.frequency.value = s.bodyFreq * pitchMul * (isPress ? 1 : 1.15)
    bodyFilter.Q.value = 3.5
    const tone = ctx.createBiquadFilter()
    tone.type = "lowpass"
    tone.frequency.value = s.brightness * (0.7 + opts.velocity * 0.3)
    const bodyGain = ctx.createGain()
    const decay = s.bodyDecay * (isPress ? 1 : 0.7)
    bodyGain.gain.setValueAtTime(0.0001, now)
    bodyGain.gain.exponentialRampToValueAtTime(0.9, now + 0.002)
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + decay)
    body.connect(bodyFilter)
    bodyFilter.connect(tone)
    tone.connect(bodyGain)
    bodyGain.connect(voice)
    body.start(now)
    body.stop(now + decay + 0.05)

    // --- Click transient (clicky/tactile) ---
    if (s.clickAmount > 0.05 && !isLow) {
      const click = ctx.createBufferSource()
      click.buffer = this.noiseBuffer
      const clickFilter = ctx.createBiquadFilter()
      clickFilter.type = "bandpass"
      clickFilter.frequency.value = s.clickFreq * pitchMul
      clickFilter.Q.value = 1.6
      const clickGain = ctx.createGain()
      const clickAmt = s.clickAmount * (isPress ? 1 : 0.4)
      const clickDur = 0.018
      clickGain.gain.setValueAtTime(clickAmt, now)
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + clickDur)
      click.connect(clickFilter)
      clickFilter.connect(clickGain)
      clickGain.connect(voice)
      click.start(now)
      click.stop(now + clickDur + 0.02)
    }

    // --- Spring ping (subtle high resonance) ---
    if (s.spring > 0.02 && this.settings.quality === "high") {
      const ping = ctx.createOscillator()
      ping.type = "triangle"
      ping.frequency.value = (1800 + Math.random() * 900) * pitchMul
      const pingGain = ctx.createGain()
      const pingDur = 0.05 + Math.random() * 0.04
      pingGain.gain.setValueAtTime(s.spring * 0.3, now + 0.004)
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + pingDur)
      ping.connect(pingGain)
      pingGain.connect(voice)
      ping.start(now + 0.004)
      ping.stop(now + pingDur + 0.02)
    }
  }
}

let engine: AudioEngine | null = null
export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine()
  return engine
}
