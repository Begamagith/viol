/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import {
  TUNINGS,
  HARMONIC_FIELDS,
  CHROMATIC_PT,
  CHROMATIC_EN,
  getNoteAtFret,
} from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { ListMusic, Volume2, Sparkles, Play, Award, Check } from 'lucide-react';

interface HarmonicFieldProps {
  instrument: InstrumentType;
  tuningId: string;
  displayMode: NoteDisplayMode;
}

export const HarmonicField: React.FC<HarmonicFieldProps> = ({
  instrument,
  tuningId,
  displayMode,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState<number>(0);

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];
  const currentField = HARMONIC_FIELDS.find((h) => h.key === selectedKey) || HARMONIC_FIELDS[0];
  const currentChord = currentField.chords[selectedChordIndex] || currentField.chords[0];
  const currentVoicing = currentChord.voicings[selectedVoicingIndex] || currentChord.voicings[0];

  // Generate highlights for the selected chord voicing on the fretboard
  const highlightedNotes = React.useMemo(() => {
    const list: {
      stringIndex: number;
      fretNumber: number;
      isRoot: boolean;
      color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
      label: string;
      finger?: string;
    }[] = [];

    if (!currentVoicing || !currentVoicing.frets) return list;

    // frets array is ordered from 6th string (idx 0) to 1st string (idx 5)
    currentVoicing.frets.forEach((fret, lowToHighIdx) => {
      if (fret >= 0) {
        const stringIdx = 5 - lowToHighIdx; // 0 = high e, 5 = low E
        const info = getNoteAtFret(currentTuning.notes[stringIdx], fret);
        const isRoot = info.noteEn === currentChord.notes[0];
        const fingerNum = currentVoicing.fingers ? currentVoicing.fingers[lowToHighIdx] : undefined;
        let fingerLabel = undefined;
        if (fingerNum && fingerNum > 0) fingerLabel = String(fingerNum);

        list.push({
          stringIndex: stringIdx,
          fretNumber: fret,
          isRoot,
          color: isRoot ? 'amber' : 'emerald',
          label:
            displayMode === 'name_en'
              ? info.noteEn
              : displayMode === 'name_pt'
              ? info.notePt
              : displayMode === 'finger' && fingerLabel
              ? fingerLabel
              : info.notePt,
          finger: fingerLabel,
        });
      }
    });

    return list;
  }, [currentVoicing, currentChord, currentTuning, displayMode]);

  const handlePlayChord = () => {
    if (!currentVoicing || !currentVoicing.frets) return;
    guitarAudio.playChord(currentVoicing.frets, currentTuning.notes, instrument);
  };

  const handlePlayProgression = () => {
    // Play I -> vi -> IV -> V (or i -> VI -> III -> VII) progression
    const progressionIndices = [0, 5, 3, 4];
    progressionIndices.forEach((cIdx, step) => {
      setTimeout(() => {
        const chord = currentField.chords[cIdx];
        if (chord && chord.voicings[0]) {
          setSelectedChordIndex(cIdx);
          setSelectedVoicingIndex(0);
          guitarAudio.playChord(chord.voicings[0].frets, currentTuning.notes, instrument);
        }
      }, step * 1600);
    });
  };

  return (
    <div className="space-y-8">
      {/* Title & Controls */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-2">
              Módulo 5: Os Segredos dos Acordes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Campo Harmônico & Acordes do Tom
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-3xl">
              O Campo Harmônico é a família de acordes que combinam perfeitamente dentro de uma tonalidade!
              Selecione o tom abaixo, clique em qualquer acorde para vê-lo no braço e ouça a progressão.
            </p>
          </div>

          <button
            onClick={handlePlayProgression}
            className="flex items-center space-x-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Ouvir Progressão (I - vi - IV - V)</span>
          </button>
        </div>

        {/* Key Picker */}
        <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            Escolha a Tonalidade (Tom):
          </span>
          {HARMONIC_FIELDS.map((hField) => {
            const isSelected = selectedKey === hField.key;
            return (
              <button
                key={hField.key}
                onClick={() => {
                  setSelectedKey(hField.key);
                  setSelectedChordIndex(0);
                  setSelectedVoicingIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300 scale-105'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                <span>{hField.namePt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7 Degree Chords Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {currentField.chords.map((chord, idx) => {
          const isSelected = selectedChordIndex === idx;
          return (
            <button
              key={chord.degreeRoman}
              onClick={() => {
                setSelectedChordIndex(idx);
                setSelectedVoicingIndex(0);
                if (chord.voicings[0] && chord.voicings[0].frets) {
                  guitarAudio.playChord(chord.voicings[0].frets, currentTuning.notes, instrument);
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-stone-900 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                  : 'bg-stone-900 hover:bg-stone-800/90 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  {chord.degreeRoman}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    chord.chordType === 'Maior'
                      ? 'bg-emerald-400'
                      : chord.chordType === 'Menor'
                      ? 'bg-sky-400'
                      : 'bg-rose-400'
                  }`}
                />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">{chord.chordName}</h4>
                <p className="text-[11px] text-stone-400 mt-0.5 truncate">{chord.functionPt}</p>
              </div>

              <div className="text-[10px] font-mono text-stone-500">
                Notas: {chord.notes.join(' - ')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Chord Detail & Fretboard Voicings */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono font-bold px-2.5 py-1 rounded bg-stone-800 text-amber-400">
                Grau {currentChord.degreeRoman}
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                Acorde de {currentChord.chordName} ({currentChord.chordType})
              </h3>
            </div>
            <p className="text-stone-300 text-sm mt-1">
              <strong>Função Harmônica:</strong> {currentChord.functionPt} — Notas que compõem o acorde:{' '}
              <span className="text-amber-400 font-bold">{currentChord.notes.join(', ')}</span>
            </p>
          </div>

          <button
            onClick={handlePlayChord}
            className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition-all"
          >
            <Volume2 className="w-5 h-5" />
            <span>Tocar Acorde de {currentChord.chordName}</span>
          </button>
        </div>

        {/* Voicing selector if multiple voicings */}
        {currentChord.voicings.length > 1 && (
          <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
              Opção de Montagem (Voicing):
            </span>
            {currentChord.voicings.map((voic, vIdx) => (
              <button
                key={vIdx}
                onClick={() => {
                  setSelectedVoicingIndex(vIdx);
                  guitarAudio.playChord(voic.frets, currentTuning.notes, instrument);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedVoicingIndex === vIdx
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {voic.name}
              </button>
            ))}
          </div>
        )}

        {/* Fretboard visualizer for selected voicing */}
        <div className="bg-stone-950/80 p-4 sm:p-6 rounded-2xl border border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-stone-300">
              Visualização no Braço — {currentVoicing.name}
            </h4>
            <span className="text-xs text-stone-400 font-mono">
              Casa inicial: {currentVoicing.baseFret || 1}ª casa
            </span>
          </div>

          <Fretboard
            instrument={instrument}
            tuningNotes={currentTuning.notes}
            maxFrets={15}
            rootNoteEn={currentChord.notes[0]}
            highlightedNotes={highlightedNotes}
            displayMode={displayMode}
          />
        </div>
      </div>
    </div>
  );
};
