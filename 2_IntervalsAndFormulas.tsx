/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstrumentType } from '../types';

class GuitarAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Convert standard note string (e.g., "E2", "A2", "C#4") or note name + octave to frequency
   */
  public getFrequency(noteName: string, octave: number = 3): number {
    const semitonesFromA4: { [key: string]: number } = {
      'C': -9, 'C#': -8, 'Db': -8,
      'D': -7, 'D#': -6, 'Eb': -6,
      'E': -5,
      'F': -4, 'F#': -3, 'Gb': -3,
      'G': -2, 'G#': -1, 'Ab': -1,
      'A': 0, 'A#': 1, 'Bb': 1,
      'B': 2
    };

    const cleanNote = noteName.replace(/[0-9]/g, '');
    const diff = semitonesFromA4[cleanNote];
    if (diff === undefined) return 440;

    const octaveDiff = (octave - 4) * 12;
    return 440 * Math.pow(2, (diff + octaveDiff) / 12);
  }

  /**
   * Calculate string open frequency given its standard tuning note
   */
  public getOpenStringFrequency(stringIndex: number, openNote: string): number {
    // stringIndex 0 is 1st string (high e), 5 is 6th string (low E)
    // Default octaves for E A D G B E standard:
    // 6th (index 5): E2 (octave 2)
    // 5th (index 4): A2 (octave 2)
    // 4th (index 3): D3 (octave 3)
    // 3rd (index 2): G3 (octave 3)
    // 2nd (index 1): B3 (octave 3)
    // 1st (index 0): E4 (octave 4)
    const baseOctaves = [4, 3, 3, 3, 2, 2];
    const oct = baseOctaves[stringIndex] || 3;
    return this.getFrequency(openNote, oct);
  }

  /**
   * Play a single frequency with realistic acoustic or electric guitar pluck envelope
   */
  public playTone(
    frequency: number,
    instrument: InstrumentType = 'violao_aco',
    duration: number = 2.2,
    delay: number = 0
  ) {
    if (this.isMuted || frequency <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;

    // Master gain for this note
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.012);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(this.ctx.destination);

    if (instrument === 'violao_nylon') {
      // Nylon string: warmer tone, softer attack, stronger fundamental
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(frequency, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, now); // 1st harmonic
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.25, now);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + duration);

      osc1.connect(filter);
      osc2.connect(gain2);
      gain2.connect(filter);
      filter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } else if (instrument === 'violao_aco') {
      // Steel string acoustic: bright pluck, metallic shimmer
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(frequency, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 1.002, now); // subtle chorus/shimmer

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + duration);
      filter.Q.value = 1.8;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } else {
      // Electric guitar (clean tone with warm sustain)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(frequency, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 0.5, now); // warm sub-harmonic body

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(1100, now + duration);

      const gain2 = this.ctx.createGain();
      gain2.gain.value = 0.35;

      osc1.connect(filter);
      osc2.connect(gain2);
      gain2.connect(filter);
      filter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    }
  }

  /**
   * Play a specific string and fret on the guitar/violão
   */
  public playFret(
    stringIndex: number,
    fretNumber: number,
    tuningNotes: string[] = ['E', 'B', 'G', 'D', 'A', 'E'], // from 1st to 6th string
    instrument: InstrumentType = 'violao_aco'
  ) {
    if (fretNumber < 0) return; // Muted string
    const openFreq = this.getOpenStringFrequency(stringIndex, tuningNotes[stringIndex] || 'E');
    const freq = openFreq * Math.pow(2, fretNumber / 12);
    this.playTone(freq, instrument, 2.5, 0);
  }

  /**
   * Play a specific note on a string where 0 is 6th string (low E) and 5 is 1st string (high e)
   */
  public playNoteOnString(
    stringIdxLowToHigh: number, // 0 = 6th string (E), 5 = 1st string (e)
    fretNumber: number,
    tuningNotesFromHighToLow: string[] = ['E', 'B', 'G', 'D', 'A', 'E'],
    instrument: InstrumentType = 'violao_aco',
    duration: number = 2.0,
    delay: number = 0
  ) {
    if (fretNumber < 0) return;
    const stringIndexHighToLow = 5 - stringIdxLowToHigh;
    const openNote = tuningNotesFromHighToLow[stringIndexHighToLow] || 'E';
    const openFreq = this.getOpenStringFrequency(stringIndexHighToLow, openNote);
    const freq = openFreq * Math.pow(2, fretNumber / 12);
    this.playTone(freq, instrument, duration, delay);
  }

  /**
   * Strum a chord voicing (array of 6 fret numbers from 6th string to 1st string)
   */
  public playChord(
    fretsFromLowToHigh: number[], // index 0 is 6th string (low E), index 5 is 1st string (high e)
    tuningNotesFromHighToLow: string[] = ['E', 'B', 'G', 'D', 'A', 'E'],
    instrument: InstrumentType = 'violao_aco'
  ) {
    if (this.isMuted) return;
    this.initContext();

    fretsFromLowToHigh.forEach((fret, idx) => {
      if (fret >= 0) {
        // Convert from low-to-high order (idx 0 = 6th string) to stringIndex (5 = 6th string)
        const stringIndex = 5 - idx;
        const openNote = tuningNotesFromHighToLow[stringIndex] || 'E';
        const openFreq = this.getOpenStringFrequency(stringIndex, openNote);
        const freq = openFreq * Math.pow(2, fret / 12);

        // Realistic strumming delay (~35ms between strings)
        const strumDelay = idx * 0.035;
        this.playTone(freq, instrument, 3.0, strumDelay);
      }
    });
  }

  /**
   * Arpeggiate scale notes sequentially
   */
  public playScale(
    notes: { stringIndex: number; fretNumber: number }[],
    tuningNotes: string[] = ['E', 'B', 'G', 'D', 'A', 'E'],
    instrument: InstrumentType = 'violao_aco'
  ) {
    if (this.isMuted) return;
    this.initContext();

    notes.forEach((item, idx) => {
      const openNote = tuningNotes[item.stringIndex] || 'E';
      const openFreq = this.getOpenStringFrequency(item.stringIndex, openNote);
      const freq = openFreq * Math.pow(2, item.fretNumber / 12);
      const delay = idx * 0.32; // 320ms between notes
      this.playTone(freq, instrument, 1.8, delay);
    });
  }
}

export const guitarAudio = new GuitarAudioEngine();
