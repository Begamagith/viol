/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InstrumentType = 'violao_nylon' | 'violao_aco' | 'guitarra';

export interface TuningPreset {
  id: string;
  name: string;
  description: string;
  // Notes from 6th string (low E) to 1st string (high e)
  notes: string[];
}

export type NoteDisplayMode = 'name_pt' | 'name_en' | 'interval' | 'degree' | 'finger';

export interface NoteInfo {
  noteEn: string;
  notePt: string;
  semitoneIndex: number; // 0=C, 1=C#, ..., 11=B
}

export interface FretNote {
  stringIndex: number; // 0 = 1st string (highest e), 5 = 6th string (lowest E)
  fretNumber: number; // 0 = open string, 1 to 24
  noteEn: string;
  notePt: string;
  interval?: string; // e.g. "1", "b3", "5", "b7"
  degree?: string;   // e.g. "I", "iii", "V"
  isRoot?: boolean;
  isInScale?: boolean;
  finger?: string;   // e.g. "1", "2", "3", "4"
  frequency?: number;
}

export interface ScaleDefinition {
  id: string;
  name: string;
  category: 'escala' | 'modo_grego' | 'pentatonica';
  formula: string; // e.g. "1 - 2 - 3 - 4 - 5 - 6 - 7"
  intervals: number[]; // semitone distances from root [0, 2, 4, 5, 7, 9, 11]
  description: string;
  mood: string;
  genreUsage: string;
  cagedPatterns?: {
    shapeName: 'C' | 'A' | 'G' | 'E' | 'D' | 'Desenho 1' | 'Desenho 2' | 'Desenho 3' | 'Desenho 4' | 'Desenho 5';
    startFretOffset: number;
    description: string;
  }[];
}

export interface ChordVoicing {
  name: string;
  shapeType: 'C' | 'A' | 'G' | 'E' | 'D' | 'aberto' | 'pestana' | 'triade' | 'jazz';
  frets: number[]; // array of 6 numbers (from 6th string to 1st string), -1 means muted/X, 0 means open
  fingers?: number[]; // array of 6 numbers (0=none, 1=index, 2=middle, 3=ring, 4=pinky)
  baseFret?: number;
  description?: string;
}

export interface HarmonicFieldChord {
  degreeRoman: string;
  chordName: string;
  chordType: 'Maior' | 'Menor' | 'Diminuto' | 'Dominante' | 'Meio-Diminuto';
  notes: string[];
  voicings: ChordVoicing[];
  functionPt: string; // Tônica, Subdominante, Dominante
}

export interface TriadShape {
  id: string;
  inversionName: string; // 'Estado Fundamental' | '1ª Inversão' | '2ª Inversão'
  stringSet: string; // '1-2-3' | '2-3-4' | '3-4-5' | '4-5-6'
  formula: string;
  // fret offsets relative to root or base
  fretOffsets: { stringIdx: number; offset: number; interval: string }[];
}

export interface QuizQuestion {
  id: string;
  type: 'find_note' | 'identify_interval' | 'scale_degree';
  title: string;
  questionText: string;
  targetNoteEn?: string;
  targetNotePt?: string;
  stringIdx?: number;
  fretNum?: number;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}
