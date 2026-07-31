/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import {
  TUNINGS,
  CAGED_SYSTEM_SHAPES,
  TRIAD_SHAPES,
  CHROMATIC_PT,
  CHROMATIC_EN,
  getNoteAtFret,
} from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { Layers, Volume2, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface CagedAndTriadsProps {
  instrument: InstrumentType;
  tuningId: string;
  displayMode: NoteDisplayMode;
}

export const CagedAndTriads: React.FC<CagedAndTriadsProps> = ({
  instrument,
  tuningId,
  displayMode,
}) => {
  const [activeSection, setActiveSection] = useState<'caged' | 'triads'>('caged');
  const [selectedShapeId, setSelectedShapeId] = useState<string>('C');
  const [cagedRootNote, setCagedRootNote] = useState<string>('C');
  const [triadRootNote, setTriadRootNote] = useState<string>('G');
  const [selectedTriadId, setSelectedTriadId] = useState<string>('maj_fund_123');

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  // Helper to calculate barre fret offset for a CAGED shape given rootNote
  const getCagedBarreFret = (shapeId: string, rootEn: string) => {
    // Open root string notes in Standard EADGBE:
    // C shape -> 5th string (A string = 'A')
    // A shape -> 5th string ('A')
    // G shape -> 6th string ('E')
    // E shape -> 6th string ('E')
    // D shape -> 4th string ('D')
    const stringOpenNotes: { [key: string]: string } = {
      'C': 'A',
      'A': 'A',
      'G': 'E',
      'E': 'E',
      'D': 'D',
    };
    const openNote = stringOpenNotes[shapeId] || 'E';

    // Find first fret on that string that matches rootEn
    for (let f = 0; f <= 15; f++) {
      const info = getNoteAtFret(openNote, f);
      if (info.noteEn === rootEn) {
        return f;
      }
    }
    return 0;
  };

  const currentShape = CAGED_SYSTEM_SHAPES.find((s) => s.id === selectedShapeId) || CAGED_SYSTEM_SHAPES[0];
  const barreFret = getCagedBarreFret(selectedShapeId, cagedRootNote);

  // Generate CAGED notes for the Fretboard
  const cagedHighlightedNotes = React.useMemo(() => {
    const list: {
      stringIndex: number;
      fretNumber: number;
      isRoot: boolean;
      color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
      label: string;
      finger?: string;
    }[] = [];

    // openFrets are from 6th string (index 0) to 1st string (index 5)
    currentShape.openFrets.forEach((openOffset, lowToHighIdx) => {
      if (openOffset >= 0) {
        const stringIdx = 5 - lowToHighIdx; // Convert to stringIndex (0 = high e, 5 = low E)
        const actualFret = barreFret + openOffset;
        if (actualFret <= 16) {
          const info = getNoteAtFret(currentTuning.notes[stringIdx], actualFret);
          const isRoot = info.noteEn === cagedRootNote;
          list.push({
            stringIndex: stringIdx,
            fretNumber: actualFret,
            isRoot,
            color: isRoot ? 'amber' : 'emerald',
            label: displayMode === 'name_en' ? info.noteEn : info.notePt,
          });
        }
      }
    });

    return list;
  }, [currentShape, barreFret, cagedRootNote, currentTuning, displayMode]);

  const handlePlayCagedChord = () => {
    // Collect frets from low (6th string) to high (1st string)
    const fretsFromLowToHigh = currentShape.openFrets.map((openOffset) => {
      if (openOffset < 0) return -1;
      return barreFret + openOffset;
    });
    guitarAudio.playChord(fretsFromLowToHigh, currentTuning.notes, instrument);
  };

  // Generate Triad highlights
  const currentTriad = TRIAD_SHAPES.find((t) => t.id === selectedTriadId) || TRIAD_SHAPES[0];
  const getTriadBaseFret = (rootEn: string) => {
    // Find root on 3rd string ('G') or 1st string ('E') for triad positioning
    for (let f = 1; f <= 13; f++) {
      const info = getNoteAtFret('G', f);
      if (info.noteEn === rootEn) return f;
    }
    return 3;
  };

  const triadBaseFret = getTriadBaseFret(triadRootNote);
  const triadHighlightedNotes = React.useMemo(() => {
    const list: {
      stringIndex: number;
      fretNumber: number;
      isRoot: boolean;
      color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
      label: string;
    }[] = [];

    currentTriad.fretOffsets.forEach((item) => {
      const fretNum = Math.max(1, Math.min(15, triadBaseFret + item.offset));
      const info = getNoteAtFret(currentTuning.notes[item.stringIdx], fretNum);
      const isRoot = item.interval === '1';
      list.push({
        stringIndex: item.stringIdx,
        fretNumber: fretNum,
        isRoot,
        color: isRoot ? 'amber' : item.interval === '3' || item.interval === 'b3' ? 'emerald' : 'blue',
        label:
          displayMode === 'interval'
            ? item.interval
            : displayMode === 'name_en'
            ? info.noteEn
            : info.notePt,
      });
    });

    return list;
  }, [currentTriad, triadBaseFret, triadRootNote, currentTuning, displayMode]);

  const handlePlayTriad = () => {
    const sequence = triadHighlightedNotes
      .sort((a, b) => b.stringIndex - a.stringIndex)
      .map((item) => ({ stringIndex: item.stringIndex, fretNumber: item.fretNumber }));
    guitarAudio.playScale(sequence, currentTuning.notes, instrument);
  };

  return (
    <div className="space-y-8">
      {/* Title & Section Switcher */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
              Módulo 3: O Mapa Secreto
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sistema CAGED & Tríades no Braço
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-3xl">
              O Sistema <strong>CAGED</strong> mostra como os 5 acordes abertos básicos (C, A, G, E, D) 
              se conectam como peças de um quebra-cabeça para tocar qualquer tom em todo o braço!
            </p>
          </div>

          {/* Sub-tab toggle */}
          <div className="flex bg-stone-800 p-1.5 rounded-xl border border-stone-700">
            <button
              onClick={() => setActiveSection('caged')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeSection === 'caged'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Sistema CAGED (5 Desenhos)
            </button>
            <button
              onClick={() => setActiveSection('triads')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeSection === 'triads'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Tríades & Inversões
            </button>
          </div>
        </div>
      </div>

      {activeSection === 'caged' ? (
        /* CAGED Section */
        <div className="space-y-6">
          {/* Controls: Select Root Note + Shape */}
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
                  1. Escolha o Tom (Acorde):
                </span>
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((noteEn) => {
                  const pt = CHROMATIC_PT[CHROMATIC_EN.indexOf(noteEn)];
                  return (
                    <button
                      key={noteEn}
                      onClick={() => setCagedRootNote(noteEn)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        cagedRootNote === noteEn
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md ring-2 ring-amber-300'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      {pt} ({noteEn})
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handlePlayCagedChord}
                className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition-all"
              >
                <Volume2 className="w-5 h-5" />
                <span>Tocar Acorde de {CHROMATIC_PT[CHROMATIC_EN.indexOf(cagedRootNote)]} Maior</span>
              </button>
            </div>

            {/* Shape buttons */}
            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
                2. Escolha o Formato (Desenho CAGED):
              </span>
              {CAGED_SYSTEM_SHAPES.map((shape) => {
                const isSelected = selectedShapeId === shape.id;
                return (
                  <button
                    key={shape.id}
                    onClick={() => {
                      setSelectedShapeId(shape.id);
                      handlePlayCagedChord();
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300 scale-105'
                        : 'bg-stone-800/90 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                    }`}
                  >
                    <span>{shape.name}</span>
                    <span className="ml-2 text-xs opacity-80">
                      (Tônica {shape.rootString}ª corda)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CAGED Fretboard Visualizer */}
          <div className="bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-200">
                Acorde de {CHROMATIC_PT[CHROMATIC_EN.indexOf(cagedRootNote)]} Maior — {currentShape.name} {barreFret > 0 ? `(Pestana na ${barreFret}ª casa)` : '(Acorde Aberto)'}
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                Afinação: {currentTuning.name}
              </span>
            </div>

            <Fretboard
              instrument={instrument}
              tuningNotes={currentTuning.notes}
              maxFrets={15}
              rootNoteEn={cagedRootNote}
              highlightedNotes={cagedHighlightedNotes}
              displayMode={displayMode}
            />
          </div>

          {/* Explanation Banner */}
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Como funciona este {currentShape.name}?
              </h4>
              <p className="text-stone-300 text-sm mt-1 leading-relaxed">
                {currentShape.description} Ao deslocar este formato com uma pestana para a casa 
                <strong className="text-amber-400"> {barreFret}</strong>, você produz o acorde de 
                <strong className="text-amber-400"> {CHROMATIC_PT[CHROMATIC_EN.indexOf(cagedRootNote)]} Maior ({cagedRootNote})</strong>!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* TRIADS SECTION */
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
                  1. Tônica da Tríade:
                </span>
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((noteEn) => {
                  const pt = CHROMATIC_PT[CHROMATIC_EN.indexOf(noteEn)];
                  return (
                    <button
                      key={noteEn}
                      onClick={() => setTriadRootNote(noteEn)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        triadRootNote === noteEn
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md ring-2 ring-amber-300'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                    >
                      {pt}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handlePlayTriad}
                className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-all"
              >
                <Volume2 className="w-5 h-5" />
                <span>Arpejar Tríade de {CHROMATIC_PT[CHROMATIC_EN.indexOf(triadRootNote)]}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
                2. Estado / Inversão (Cordas 1ª, 2ª e 3ª):
              </span>
              {TRIAD_SHAPES.map((triad) => {
                const isSelected = selectedTriadId === triad.id;
                return (
                  <button
                    key={triad.id}
                    onClick={() => {
                      setSelectedTriadId(triad.id);
                      handlePlayTriad();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-stone-950 shadow-md ring-2 ring-emerald-300 scale-105'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                    }`}
                  >
                    <span>{triad.inversionName}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-stone-900/60 text-[10px] font-mono">
                      {triad.formula}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-200">
                Tríade de {CHROMATIC_PT[CHROMATIC_EN.indexOf(triadRootNote)]} — {currentTriad.inversionName} (Cordas Agudas)
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                Afinação: {currentTuning.name}
              </span>
            </div>

            <Fretboard
              instrument={instrument}
              tuningNotes={currentTuning.notes}
              maxFrets={15}
              rootNoteEn={triadRootNote}
              highlightedNotes={triadHighlightedNotes}
              displayMode={displayMode}
            />
          </div>

          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
            <h4 className="text-lg font-bold text-white mb-2">
              O Poder das Tríades nas 3 Cordas Agudas
            </h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Tocar tríades (acordes puros de 3 notas: Tônica, 3ª e 5ª) nas 3 cordas mais agudas é o segredo dos maiores guitarristas de Funk, Soul, R&B e Rock para não embolar o som com o contrabaixo e teclado! Experimente alternar entre o Estado Fundamental, 1ª e 2ª Inversão ao longo do braço.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
