/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import {
  TUNINGS,
  SCALES,
  CHROMATIC_PT,
  CHROMATIC_EN,
  generateScaleFretboard,
} from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { Music, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';

interface ScalesAndModesProps {
  instrument: InstrumentType;
  tuningId: string;
  displayMode: NoteDisplayMode;
}

export const ScalesAndModes: React.FC<ScalesAndModesProps> = ({
  instrument,
  tuningId,
  displayMode,
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>('pentatonica_menor');
  const [rootNoteEn, setRootNoteEn] = useState<string>('A');
  const [cagedBoxIndex, setCagedBoxIndex] = useState<number>(-1); // -1 = All Neck, 0 = Box 1, etc.

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];
  const currentScale = SCALES.find((s) => s.id === selectedScaleId) || SCALES[0];

  // Helper to filter frets by CAGED Box if selected
  const getFretRange = () => {
    if (cagedBoxIndex < 0 || !currentScale.cagedPatterns || !currentScale.cagedPatterns[cagedBoxIndex]) {
      return { min: 0, max: 15 };
    }
    // Calculate start fret based on rootNoteEn position
    // For A Pentatonic Menor, Desenho 1 starts at Fret 5
    const rootSem = CHROMATIC_EN.indexOf(rootNoteEn);
    const offset = currentScale.cagedPatterns[cagedBoxIndex].startFretOffset;
    let baseFret = (rootSem + offset) % 12;
    if (baseFret === 0 && offset > 0) baseFret = 12;
    return { min: Math.max(0, baseFret - 1), max: Math.min(15, baseFret + 4) };
  };

  const fretRange = getFretRange();

  // Generate all fretboard notes for the selected scale
  const highlightedNotes = React.useMemo(() => {
    const allNotes = generateScaleFretboard(
      rootNoteEn,
      currentScale,
      currentTuning.notes,
      15
    );

    return allNotes
      .filter((n) => n.isInScale && n.fretNumber >= fretRange.min && n.fretNumber <= fretRange.max)
      .map((n) => ({
        stringIndex: n.stringIndex,
        fretNumber: n.fretNumber,
        isRoot: n.isRoot,
        color: (n.isRoot ? 'amber' : 'emerald') as 'amber' | 'emerald',
        label:
          displayMode === 'name_en'
            ? n.noteEn
            : displayMode === 'name_pt'
            ? n.notePt
            : displayMode === 'interval'
            ? n.intervalShort
            : n.formula,
      }));
  }, [rootNoteEn, currentScale, currentTuning, fretRange, displayMode]);

  const handlePlayScale = () => {
    // Play scale notes sequentially from 6th string to 1st string
    const sequence = [...highlightedNotes]
      .sort((a, b) => {
        if (a.stringIndex !== b.stringIndex) {
          return b.stringIndex - a.stringIndex; // 6th string (idx 5) first -> 1st string (idx 0)
        }
        return a.fretNumber - b.fretNumber; // ascending frets on the same string
      })
      .map((item) => ({ stringIndex: item.stringIndex, fretNumber: item.fretNumber }));

    // Limit to 12 notes max for a crisp arpeggio
    guitarAudio.playScale(sequence.slice(0, 12), currentTuning.notes, instrument);
  };

  return (
    <div className="space-y-8">
      {/* Title & Controls */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
              Módulo 4: Solos & Melodias
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Escalas & Modos Gregos no Braço
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-3xl">
              As escalas são as paletas de cores da música! Escolha uma escala ou modo grego, 
              selecione o tom raiz e alterne entre o braço inteiro ou os desenhos individuais (CAGED).
            </p>
          </div>

          <button
            onClick={handlePlayScale}
            className="flex items-center space-x-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition-all"
          >
            <Volume2 className="w-5 h-5" />
            <span>Tocar Escala no Braço</span>
          </button>
        </div>

        {/* Root Note Picker */}
        <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            1. Tom Raiz (Tônica):
          </span>
          {CHROMATIC_EN.map((noteEn, idx) => {
            const notePt = CHROMATIC_PT[idx];
            const isSelected = rootNoteEn === noteEn;
            return (
              <button
                key={noteEn}
                onClick={() => {
                  setRootNoteEn(noteEn);
                  guitarAudio.playTone(
                    guitarAudio.getFrequency(noteEn, 3),
                    instrument,
                    1.5,
                    0
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md ring-2 ring-amber-300'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                {notePt} ({noteEn})
              </button>
            );
          })}
        </div>

        {/* Scale Picker */}
        <div className="pt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            2. Escala ou Modo:
          </span>
          {SCALES.map((scale) => {
            const isSelected = selectedScaleId === scale.id;
            return (
              <button
                key={scale.id}
                onClick={() => {
                  setSelectedScaleId(scale.id);
                  setCagedBoxIndex(-1); // reset to All Neck when switching scales
                  handlePlayScale();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-stone-950 shadow-md ring-2 ring-emerald-300 scale-105'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                <span>{scale.name}</span>
              </button>
            );
          })}
        </div>

        {/* CAGED Box Buttons (if scale has defined shapes) */}
        {currentScale.cagedPatterns && (
          <div className="pt-3 border-t border-stone-800/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
              3. Desenho no Braço:
            </span>
            <button
              onClick={() => setCagedBoxIndex(-1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                cagedBoxIndex === -1
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Braço Inteiro (0 a 15)
            </button>
            {currentScale.cagedPatterns.map((pattern, idx) => (
              <button
                key={idx}
                onClick={() => setCagedBoxIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  cagedBoxIndex === idx
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {pattern.shapeName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fretboard Canvas */}
      <div className="bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>
              {currentScale.name} de {CHROMATIC_PT[CHROMATIC_EN.indexOf(rootNoteEn)]} ({rootNoteEn})
            </span>
            {cagedBoxIndex >= 0 && currentScale.cagedPatterns?.[cagedBoxIndex] && (
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                — {currentScale.cagedPatterns[cagedBoxIndex].shapeName}
              </span>
            )}
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            Afinação: {currentTuning.name}
          </span>
        </div>

        <Fretboard
          instrument={instrument}
          tuningNotes={currentTuning.notes}
          maxFrets={15}
          rootNoteEn={rootNoteEn}
          highlightedNotes={highlightedNotes}
          displayMode={displayMode}
        />
      </div>

      {/* Scale Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <span className="text-xs font-mono text-stone-400 uppercase">Fórmula Intervalar</span>
          <h4 className="text-xl font-extrabold text-amber-400 mt-1">{currentScale.formula}</h4>
          <p className="text-stone-300 text-sm mt-3 leading-relaxed">
            {currentScale.description}
          </p>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <span className="text-xs font-mono text-stone-400 uppercase">Sonoridade / Emoção</span>
          <h4 className="text-xl font-extrabold text-emerald-400 mt-1">{currentScale.mood}</h4>
          <p className="text-stone-300 text-sm mt-3">
            <strong>Estilos comuns:</strong> {currentScale.genreUsage}
          </p>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <span className="text-xs font-mono text-stone-400 uppercase">Dica Prática para Improviso</span>
          <h4 className="text-lg font-bold text-white mt-1">Como treinar no instrumento?</h4>
          <p className="text-stone-300 text-sm mt-3 leading-relaxed">
            Comece tocando a nota raiz (<span className="text-amber-400 font-bold">dourada</span>) na 6ª ou 5ª corda. Siga o padrão até a corda mais aguda e termine sempre repousando de volta na tônica para sentir a estabilidade!
          </p>
        </div>
      </div>
    </div>
  );
};
