/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import { TUNINGS, CHROMATIC_PT, CHROMATIC_EN, getNoteAtFret } from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { BookOpen, Sparkles, Volume2, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface NotesOnFretboardProps {
  instrument: InstrumentType;
  tuningId: string;
  displayMode: NoteDisplayMode;
}

export const NotesOnFretboard: React.FC<NotesOnFretboardProps> = ({
  instrument,
  tuningId,
  displayMode,
}) => {
  const [selectedNoteEn, setSelectedNoteEn] = useState<string>('C');
  const [showOctaveHint, setShowOctaveHint] = useState<boolean>(true);

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  // Generate highlights for all positions of selectedNoteEn
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
        if (info.noteEn === selectedNoteEn) {
          list.push({
            stringIndex: sIdx,
            fretNumber: fret,
            isRoot: true,
            color: 'amber',
            label: displayMode === 'name_en' ? info.noteEn : info.notePt,
          });
        }
      }
    });

    return list;
  }, [selectedNoteEn, currentTuning, displayMode]);

  const handlePlayAllOccurrences = () => {
    // Play each occurrence of the note from low to high
    highlightedNotes.forEach((h, idx) => {
      setTimeout(() => {
        guitarAudio.playFret(h.stringIndex, h.fretNumber, currentTuning.notes, instrument);
      }, idx * 400);
    });
  };

  return (
    <div className="space-y-8">
      {/* Module Title & Hero Info */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
              Módulo 1: Fundamentos do Braço
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Onde Ficam as Notas no Braço?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-3xl">
              No violão e na guitarra, a mesma nota musical pode ser tocada em várias cordas diferentes! 
              Selecione uma nota abaixo para ver todas as suas posições no braço e aprender os truques de memorização.
            </p>
          </div>

          <button
            onClick={handlePlayAllOccurrences}
            className="flex items-center justify-center space-x-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Volume2 className="w-5 h-5" />
            <span>Ouvir em Todos os Trastes</span>
          </button>
        </div>

        {/* Note Selector Pills */}
        <div className="mt-6 pt-5 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">
            Escolha a Nota:
          </span>
          {CHROMATIC_EN.map((noteEn, idx) => {
            const notePt = CHROMATIC_PT[idx];
            const isSelected = selectedNoteEn === noteEn;
            return (
              <button
                key={noteEn}
                onClick={() => {
                  setSelectedNoteEn(noteEn);
                  guitarAudio.playTone(
                    guitarAudio.getFrequency(noteEn, 3),
                    instrument,
                    1.8,
                    0
                  );
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                {displayMode === 'name_en' ? noteEn : `${notePt} (${noteEn})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Fretboard */}
      <div className="bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Posições de {displayMode === 'name_en' ? selectedNoteEn : CHROMATIC_PT[CHROMATIC_EN.indexOf(selectedNoteEn)]} no Braço (Clique nas casas para ouvir)
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            Afinação: {currentTuning.name}
          </span>
        </div>

        <Fretboard
          instrument={instrument}
          tuningNotes={currentTuning.notes}
          maxFrets={15}
          rootNoteEn={selectedNoteEn}
          highlightedNotes={highlightedNotes}
          displayMode={displayMode}
          showAllNotes={false}
        />
      </div>

      {/* Essential Fretboard Secrets & Memory Tricks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">
            1
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            A Regra do "Tom e Semitom"
          </h4>
          <p className="text-stone-300 text-sm leading-relaxed">
            Entre cada casa do violão ou guitarra existe exatamente <strong>1 semitom</strong>. 
            Entre todas as notas naturais (Dó, Ré, Mi...) há distância de <strong>2 casas (1 Tom)</strong>, exceto entre 
            <span className="text-amber-400 font-bold"> Mi-Fá</span> e <span className="text-amber-400 font-bold">Si-Dó</span>, que ficam em casas vizinhas (1 semitom)!
          </p>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
            2
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            O Truque da Oitava (2 Cordas + 2 Casas)
          </h4>
          <p className="text-stone-300 text-sm leading-relaxed">
            Para encontrar a mesma nota mais aguda a partir da 6ª ou 5ª corda: pule <strong>2 cordas para baixo</strong> e avance <strong>2 casas para a direita</strong>!
            <em> (Exemplo: Dó na 5ª corda, casa 3 → é o mesmo Dó na 3ª corda, casa 5).</em>
          </p>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">
            3
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            Os Trastes Marcados (Bolinhas)
          </h4>
          <p className="text-stone-300 text-sm leading-relaxed">
            As marcações nas casas <strong>3, 5, 7, 9 e 12</strong> são seus guias visuais. A <strong>12ª casa</strong> (dois pontos) repete exatamente as mesmas notas das cordas soltas, uma oitava acima!
          </p>
        </div>
      </div>
    </div>
  );
};
