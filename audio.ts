/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from './types';
import { Navbar } from './components/Navbar';
import { NotesOnFretboard } from './components/modules/1_NotesOnFretboard';
import { IntervalsAndFormulas } from './components/modules/2_IntervalsAndFormulas';
import { CagedAndTriads } from './components/modules/3_CagedAndTriads';
import { ChordDictionary } from './components/modules/8_ChordDictionary';
import { ArpeggioDictionary } from './components/modules/9_ArpeggioDictionary';
import { ScalesAndModes } from './components/modules/4_ScalesAndModes';
import { HarmonicField } from './components/modules/5_HarmonicField';
import { QuizTrainer } from './components/modules/6_QuizTrainer';
import { AiMusicTutor } from './components/modules/7_AiMusicTutor';
import { GuitarTuner } from './components/modules/10_GuitarTuner';
import { TUNINGS } from './data/musicTheory';
import { guitarAudio } from './lib/audio';
import { Guitar, Volume2, HelpCircle, Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [instrument, setInstrument] = useState<InstrumentType>('violao_aco');
  const [tuningId, setTuningId] = useState<string>('standard');
  const [displayMode, setDisplayMode] = useState<NoteDisplayMode>('name_pt');

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  const handlePlayOpenStrings = () => {
    // Strum all open strings from 6th (low E) to 1st (high e)
    const openFrets = [0, 0, 0, 0, 0, 0];
    guitarAudio.playChord(openFrets, currentTuning.notes, instrument);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navbar & Module Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        instrument={instrument}
        setInstrument={setInstrument}
        tuningId={tuningId}
        setTuningId={setTuningId}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Quick Tuning & Audio Strum Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-stone-900/80 px-5 py-3 rounded-xl border border-stone-800 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-stone-300">
            <span className="font-bold text-amber-400">Afinação atual:</span>
            <span>{currentTuning.name}</span>
            <span className="text-stone-500 hidden sm:inline">— {currentTuning.description}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('tuner')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 font-bold rounded-lg border transition-all ${
                activeTab === 'tuner'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                  : 'bg-stone-800/90 text-amber-400 hover:bg-amber-500 hover:text-stone-950 border-amber-500/30'
              }`}
              title="Abrir Afinador interativo (por microfone ou por cordas soltas)"
            >
              <Radio className="w-4 h-4" />
              <span>Afinador</span>
            </button>

            <button
              onClick={handlePlayOpenStrings}
              className="flex items-center space-x-2 px-4 py-1.5 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-bold rounded-lg border border-stone-700 transition-all text-amber-400"
              title="Tocar todas as cordas soltas desta afinação"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir Cordas ({currentTuning.notes.join('-')})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Module Rendering */}
        <div className="transition-all duration-200">
          {activeTab === 'notes' && (
            <NotesOnFretboard
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'intervals' && (
            <IntervalsAndFormulas
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'caged' && (
            <CagedAndTriads
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'chord_dict' && (
            <ChordDictionary
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'arpeggio_dict' && (
            <ArpeggioDictionary
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'scales' && (
            <ScalesAndModes
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'harmonic_field' && (
            <HarmonicField
              instrument={instrument}
              tuningId={tuningId}
              displayMode={displayMode}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTrainer
              instrument={instrument}
              tuningId={tuningId}
            />
          )}

          {activeTab === 'ai_tutor' && (
            <AiMusicTutor
              instrument={instrument}
              tuningId={tuningId}
            />
          )}

          {activeTab === 'tuner' && (
            <GuitarTuner
              instrument={instrument}
              tuningId={tuningId}
              setTuningId={setTuningId}
              displayMode={displayMode}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-stone-900/90 border-t border-stone-800/80 py-6 text-center text-xs text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Guitar className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-stone-200">FretMaster — Teoria para Violão e Guitarra</span>
          </div>
          <div className="text-stone-500">
            Desenvolvido com síntese de áudio realista (Web Audio API), Sistema CAGED e Inteligência Artificial.
          </div>
        </div>
      </footer>
    </div>
  );
}
