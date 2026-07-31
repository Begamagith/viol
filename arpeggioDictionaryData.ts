/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import {
  TUNINGS,
  CHROMATIC_PT,
  CHROMATIC_EN,
  INTERVAL_NAMES_PT,
  NOTE_TO_SEMITONE,
  getNoteAtFret,
} from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { Compass, Volume2, Info, ArrowRight } from 'lucide-react';

interface IntervalsAndFormulasProps {
  instrument: InstrumentType;
  tuningId: string;
  displayMode: NoteDisplayMode;
}

export const IntervalsAndFormulas: React.FC<IntervalsAndFormulasProps> = ({
  instrument,
  tuningId,
  displayMode,
}) => {
  const [rootNoteEn, setRootNoteEn] = useState<string>('C');
  const [selectedSemitoneDist, setSelectedSemitoneDist] = useState<number>(7); // Default: Quinta Justa (7 semitones)

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  const rootSem = NOTE_TO_SEMITONE[rootNoteEn] || 0;
  const targetSem = (rootSem + selectedSemitoneDist) % 12;
  const targetNoteEn = CHROMATIC_EN[targetSem];
  const targetNotePt = CHROMATIC_PT[targetSem];
  const intervalInfo = INTERVAL_NAMES_PT[selectedSemitoneDist];

  // Build highlights for the root and target interval across the fretboard
  const highlightedNotes = React.useMemo(() => {
    const list: {
      stringIndex: number;
      fretNumber: number;
      isRoot: boolean;
      color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
      label: string;
    }[] = [];

    currentTuning.notes.forEach((openNote, sIdx) => {
      for (let fret = 0; fret <= 15; fret++) {
        const info = getNoteAtFret(openNote, fret);
        if (info.noteEn === rootNoteEn) {
          list.push({
            stringIndex: sIdx,
            fretNumber: fret,
            isRoot: true,
            color: 'amber',
            label: displayMode === 'name_en' ? rootNoteEn : CHROMATIC_PT[CHROMATIC_EN.indexOf(rootNoteEn)],
          });
        } else if (info.noteEn === targetNoteEn) {
          let color: 'emerald' | 'blue' | 'purple' | 'rose' = 'emerald';
          if (selectedSemitoneDist === 7) color = 'blue';
          else if (selectedSemitoneDist === 10 || selectedSemitoneDist === 11) color = 'purple';
          else if (selectedSemitoneDist === 6) color = 'rose';

          list.push({
            stringIndex: sIdx,
            fretNumber: fret,
            isRoot: false,
            color,
            label: displayMode === 'interval' ? intervalInfo.short : displayMode === 'name_en' ? targetNoteEn : targetNotePt,
          });
        }
      }
    });

    return list;
  }, [rootNoteEn, targetNoteEn, currentTuning, displayMode, selectedSemitoneDist, intervalInfo]);

  const handlePlayInterval = (harmonic: boolean = false) => {
    const rootFreq = guitarAudio.getFrequency(rootNoteEn, 3);
    const targetFreq = rootFreq * Math.pow(2, selectedSemitoneDist / 12);

    if (harmonic) {
      // Play both notes together
      guitarAudio.playTone(rootFreq, instrument, 2.8, 0);
      guitarAudio.playTone(targetFreq, instrument, 2.8, 0.05);
    } else {
      // Play melodic interval
      guitarAudio.playTone(rootFreq, instrument, 2.0, 0);
      guitarAudio.playTone(targetFreq, instrument, 2.5, 0.6);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Controls */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              Módulo 2: Intervalos no Braço
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              A Geometria dos Intervalos
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-3xl">
              Intervalo é a distância sonora e visual entre duas notas. No violão e guitarra, cada intervalo possui um 
              <strong> desenho geométrico característico</strong> que se repete em quase todo o braço!
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePlayInterval(false)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl border border-stone-700 transition-all"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Melódico (Em sequência)</span>
            </button>
            <button
              onClick={() => handlePlayInterval(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Harmônico (Juntos)</span>
            </button>
          </div>
        </div>

        {/* Root Note Picker */}
        <div className="mt-6 pt-5 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            Nota de Referência (Tônica):
          </span>
          {CHROMATIC_EN.map((noteEn, idx) => {
            const notePt = CHROMATIC_PT[idx];
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
                  rootNoteEn === noteEn
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md ring-2 ring-amber-300'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                {notePt} ({noteEn})
              </button>
            );
          })}
        </div>

        {/* Interval Distance Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            Escolha o Intervalo:
          </span>
          {Object.entries(INTERVAL_NAMES_PT).map(([semStr, item]) => {
            const sem = Number(semStr);
            if (sem === 0) return null; // Skip unison button for clarity
            const isSelected = selectedSemitoneDist === sem;
            return (
              <button
                key={sem}
                onClick={() => {
                  setSelectedSemitoneDist(sem);
                  const rootFreq = guitarAudio.getFrequency(rootNoteEn, 3);
                  const targetFreq = rootFreq * Math.pow(2, sem / 12);
                  guitarAudio.playTone(targetFreq, instrument, 1.8, 0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-stone-950 shadow-md ring-2 ring-emerald-300 scale-105'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                <span>{item.name}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-stone-900/60 text-[10px] uppercase font-mono">
                  {item.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Interval Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-stone-900 p-6 rounded-2xl border border-stone-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase">
              Fórmula: {intervalInfo.formula} ({selectedSemitoneDist} semitons)
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {intervalInfo.name}
            </h3>
            <div className="mt-4 flex items-center space-x-3">
              <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center">
                <span className="text-xs text-stone-400 block">Tônica</span>
                <span className="text-lg font-bold text-amber-400">{CHROMATIC_PT[CHROMATIC_EN.indexOf(rootNoteEn)]}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-500" />
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center">
                <span className="text-xs text-stone-400 block">Intervalo ({intervalInfo.short})</span>
                <span className="text-lg font-bold text-emerald-400">{targetNotePt}</span>
              </div>
            </div>
            <p className="text-stone-300 text-sm mt-4 leading-relaxed">
              {selectedSemitoneDist === 7 && 'A Quinta Justa (5J) é o intervalo mais ressonante do instrumento. É a base dos "Power Chords" do Rock e de quase todos os acordes.'}
              {selectedSemitoneDist === 4 && 'A Terça Maior (3M) define o som ALEGRE do acorde ou escala. No braço, fica uma corda abaixo e uma casa atrás (nas 4 cordas graves).'}
              {selectedSemitoneDist === 3 && 'A Terça Menor (3m) define o som MELANCÓLICO ou BLUESY. Fica 3 casas à frente na mesma corda, ou 1 corda abaixo e 2 casas atrás.'}
              {selectedSemitoneDist === 5 && 'A Quarta Justa (4J) fica exatamente na MESMA CASA na corda logo abaixo (exceto entre a 3ª e 2ª corda, onde sobe 1 casa).'}
              {selectedSemitoneDist === 10 && 'A Sétima Menor (b7) cria a tensão dos acordes dominantes (ex: G7). Fica dois trastes atrás da oitava da tônica.'}
              {selectedSemitoneDist === 11 && 'A Sétima Maior (7M) confere o som sofisticado e jazzístico (ex: C7M). Fica apenas 1 casa atrás da oitava da tônica.'}
              {selectedSemitoneDist === 6 && 'O Trítono (b5) é o intervalo do meio da oitava, famoso por sua alta tensão dramática e pela "Blue Note" na escala de Blues.'}
              {![3, 4, 5, 6, 7, 10, 11].includes(selectedSemitoneDist) && 'Este intervalo conecta a tônica a um ponto chave da melodia ou acorde.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400">
            Dica: No violão e guitarra, o desenho da distância entre as cordas só muda ao passar da 
            <strong className="text-amber-400"> 3ª corda (Sol) para a 2ª corda (Si)</strong>, pois lá a afinação tem meio tom a menos!
          </div>
        </div>

        <div className="md:col-span-2 bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-200">
              Visualização de {CHROMATIC_PT[CHROMATIC_EN.indexOf(rootNoteEn)]} até {targetNotePt} ({intervalInfo.short})
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
      </div>
    </div>
  );
};
