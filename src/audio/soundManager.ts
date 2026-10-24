/**
 * Synthesized Web Audio API sound engine for "Cóc Kiện Trời"
 * Pure programmatic sound design - no external audio file dependencies.
 */

import { storage } from '../utils/storage';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;

  constructor() {
    // Check saved settings safely
    const savedMute = storage.getItem('coc_sound_muted');
    this.isMuted = savedMute === 'true';
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain = this.ctx.createGain();

        this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
        this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);

        this.sfxGain.connect(this.ctx.destination);
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    storage.setItem('coc_sound_muted', String(this.isMuted));
    if (this.ctx && this.sfxGain && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, now);
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, now);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playJump(power: number = 0.5) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    // Pitch sweep upward for springy toad leap
    const baseFreq = 160 + power * 120;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playLotusBounce() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Resonant high bell chime for sacred lotus
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (vietnamese pentatonic harmony)
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);
      gain.gain.setValueAtTime(0.2, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.42);
    });
  }

  public playThunderDrum() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Low Dong Son Bronze drum strike
    const osc = ctx.createOscillator();
    const drumGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    drumGain.gain.setValueAtTime(0.8, now);
    drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(drumGain);
    drumGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);

    // Add noise crackle for thunder
    try {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.linearRampToValueAtTime(0, now + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
    } catch {
      // fallback safe
    }
  }

  public playWaterCollect() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playCroak() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Characteristic deep throat croak: "Ộp... ộp!"
    [0, 0.14].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now + delay);
      osc.frequency.linearRampToValueAtTime(95, now + delay + 0.09);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now + delay);

      gain.gain.setValueAtTime(0.35, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + delay);
      osc.stop(now + delay + 0.11);
    });
  }

  public playTeethGrind() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Rhythmic teeth grinding ("Nghiến răng gọi sấm giông")
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600 + (i % 2) * 80, now + delay);
      gain.gain.setValueAtTime(0.25, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    }
  }

  public playPlatformBreak() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playPlatformRegen() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Ascending warm wooden / magical chime as cracked platform heals
    const notes = [293.66, 369.99, 440.0, 587.33]; // D4, F#4, A4, D5 (Pentatonic rise)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.18, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.24);
    });
  }

  public playAirDash() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Resonant wind woosh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.19);

    // Auspicious cloud chime
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(659.25, now);
    chime.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    chimeGain.gain.setValueAtTime(0.2, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    chime.connect(chimeGain);
    chimeGain.connect(this.sfxGain);
    chime.start(now);
    chime.stop(now + 0.16);
  }

  public playRainSummon() {
    if (this.isMuted) return;
    this.playTeethGrind();
    setTimeout(() => {
      this.playThunderDrum();
    }, 280);
  }

  public startFolkBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.bgmPlaying = true;
    // Vietnamese pentatonic scale (Do Re Fa Sol La / C D F G A)
    // Notes: C4, D4, F4, G4, A4, C5, D5
    const notes = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33];
    const phrase = [
      0, 2, 3, 4, 3, 2, 0, 1, 
      2, 4, 5, 4, 2, 3, 2, 0,
      3, 4, 5, 6, 5, 4, 3, 2
    ];
    let noteIndex = 0;

    const playNext = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      const noteFreq = notes[phrase[noteIndex % phrase.length]];
      noteIndex++;

      // Gentle plucked lute / zither (Đàn Tranh) timbre
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      // Add a quiet subtle overtone harmonic
      const harm = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harm.type = 'triangle';
      harm.frequency.setValueAtTime(noteFreq * 2, now);
      harmGain.gain.setValueAtTime(0.04, now);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      harm.connect(harmGain);
      harmGain.connect(this.bgmGain);

      osc.start(now);
      harm.start(now);
      osc.stop(now + 0.48);
      harm.stop(now + 0.28);

      this.bgmTimer = window.setTimeout(playNext, 460);
    };

    playNext();
  }

  public stopFolkBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundManager = new SoundManager();
