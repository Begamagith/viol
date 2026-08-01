/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  InstrumentType,
  TuningPreset,
  NoteDisplayMode,
} from '../types';
import { TUNINGS } from '../data/musicTheory';
import { guitarAudio } from '../lib/audio';
import {
  Music,
  Volume2,
  VolumeX,
  Guitar,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  Compass,
  ListMusic,
  Library,
  TrendingUp,
  Menu,
  X,
  Check,
  ChevronRight,
  Download,
  WifiOff,
  Radio,
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { PwaInstallModal } from './PwaInstallModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  instrument: InstrumentType;
  setInstrument: (inst: InstrumentType) => void;
  tuningId: string;
  setTuningId: (id: string) => void;
  displayMode: NoteDisplayMode;
  setDisplayMode: (mode: NoteDisplayMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  instrument,
  setInstrument,
  tuningId,
  setTuningId,
  displayMode,
  setDisplayMode,
}) => {
  const [isMuted, setIsMuted] = useState(guitarAudio.getMuted());
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { canInstall, isInstalled, isOffline } = usePWA();
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    guitarAudio.setMuted(next);
    setIsMuted(next);
    if (!next) {
      guitarAudio.playTone(246.94, instrument, 1.5, 0); // Play B3 to confirm unmute
    }
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const tabs = [
    {
      id: 'notes',
      label: 'Braço & Notas',
      icon: BookOpen,
      description: 'Explore notas, oitavas e posições ao longo de todo o braço',
    },
    {
      id: 'intervals',
      label: 'Intervalos & Fórmulas',
      icon: Compass,
      description: 'Fórmulas de acordes, distâncias e graus intervalares',
    },
    {
      id: 'caged',
      label: 'CAGED & Tríades',
      icon: Layers,
      description: 'Os 5 formatos fundamentais e inversões de tríades',
    },
    {
      id: 'chord_dict',
      label: 'Dicionário de Acordes',
      icon: Library,
      description: '17 tipos de acordes em todos os tons com digitação vertical',
    },
    {
      id: 'arpeggio_dict',
      label: 'Dicionário de Arpejos',
      icon: TrendingUp,
      description: '13 arpejos de 2 oitavas (tríades, tétrades e nonas) no CAGED',
    },
    {
      id: 'scales',
      label: 'Escalas & Modos',
      icon: Music,
      description: 'Pentatônicas, Modos Gregos e Escalas Menores no braço',
    },
    {
      id: 'harmonic_field',
      label: 'Campo Harmônico',
      icon: ListMusic,
      description: 'Funções harmônicas, acordes e progressões por tonalidade',
    },
    {
      id: 'tuner',
      label: 'Afinador',
      icon: Radio,
      highlight: true,
      description: 'Afinador cromático por microfone em tempo real e referências sonoras por corda',
    },
    {
      id: 'quiz',
      label: 'Quiz & Treino',
      icon: Award,
      description: 'Treine seu ouvido, leitura de notas e intervalos interativamente',
    },
    {
      id: 'ai_tutor',
      label: 'Professor IA',
      icon: Sparkles,
      highlight: true,
      description: 'Tire dúvidas de teoria musical e receba dicas personalizadas com IA',
    },
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabObj.icon;

  return (
    <header className="w-full bg-stone-900 border-b border-stone-800 text-stone-100 shadow-xl sticky top-0 z-50">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg text-stone-950">
            <Guitar className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              FretMaster
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Violão & Guitarra
              </span>
            </h1>
            <p className="text-xs text-stone-400 hidden sm:block">
              Teoria musical prática aplicada ao braço do instrumento
            </p>
          </div>
        </div>

        {/* Controls: Instrument, Tuning, Display Mode, Audio */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Instrument Switcher */}
          <div className="flex bg-stone-800/90 p-1 rounded-lg border border-stone-700">
            <button
              onClick={() => {
                setInstrument('violao_nylon');
                guitarAudio.playTone(196, 'violao_nylon', 1.8, 0);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                instrument === 'violao_nylon'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Violão Nylon
            </button>
            <button
              onClick={() => {
                setInstrument('violao_aco');
                guitarAudio.playTone(196, 'violao_aco', 1.8, 0);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                instrument === 'violao_aco'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Violão Aço
            </button>
            <button
              onClick={() => {
                setInstrument('guitarra');
                guitarAudio.playTone(196, 'guitarra', 1.8, 0);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                instrument === 'guitarra'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Guitarra
            </button>
          </div>

          {/* Tuning Preset Selector */}
          <div className="flex items-center space-x-1.5">
            <label htmlFor="tuning-select" className="text-xs font-medium text-stone-400 hidden md:inline">
              Afinação:
            </label>
            <select
              id="tuning-select"
              value={tuningId}
              onChange={(e) => setTuningId(e.target.value)}
              className="bg-stone-800 text-stone-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {TUNINGS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note Display Mode Selector */}
          <div className="flex items-center space-x-1.5">
            <label htmlFor="display-mode-select" className="text-xs font-medium text-stone-400 hidden lg:inline">
              Exibir:
            </label>
            <select
              id="display-mode-select"
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as NoteDisplayMode)}
              className="bg-stone-800 text-stone-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="name_pt">Notas (Dó, Ré, Mi)</option>
              <option value="name_en">Notas (C, D, E)</option>
              <option value="interval">Intervalos (1, 3, 5, b7)</option>
              <option value="degree">Graus (I, III, V)</option>
            </select>
          </div>

          {/* Botão PWA / Instalar App */}
          {!isInstalled ? (
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                canInstall
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-400 shadow-md animate-pulse hover:animate-none hover:scale-105'
                  : 'bg-stone-800 border-stone-700 text-amber-400 hover:bg-stone-700'
              }`}
              title="Instalar aplicativo FretMaster (PWA)"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Instalar App</span>
              {canInstall && (
                <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping" />
              )}
            </button>
          ) : null}

          {/* Indicador de Modo Offline */}
          {isOffline ? (
            <div
              onClick={() => setIsPwaModalOpen(true)}
              className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
              title="Você está offline. O aplicativo está rodando do cache local do PWA!"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline</span>
            </div>
          ) : null}

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Áudio Mudo - Clique para ativar' : 'Áudio Ativado'}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-red-950/40 border-red-800 text-red-400'
                : 'bg-stone-800 border-stone-700 text-amber-400 hover:bg-stone-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Hamburger Module Navigation Bar */}
      <div className="bg-stone-950/90 border-t border-stone-800/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Currently Active Module Indicator */}
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-wider font-bold text-stone-400 hidden sm:inline">
              Módulo Ativo:
            </span>
            <div className="flex items-center space-x-2.5 bg-stone-900 px-3.5 py-1.5 rounded-xl border border-stone-800 shadow-sm">
              <ActiveIcon className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-extrabold text-white">
                {activeTabObj.label}
              </span>
              {activeTabObj.highlight && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  IA
                </span>
              )}
            </div>
          </div>

          {/* Hamburger Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Menu de módulos"
            className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isMenuOpen ? (
              <>
                <X className="w-4 h-4 stroke-[3]" />
                <span>Fechar Menu</span>
              </>
            ) : (
               <>
                 <Menu className="w-4 h-4 stroke-[3]" />
                 <span>Módulos ({tabs.length})</span>
               </>
             )}
          </button>
        </div>
      </div>

      {/* Full Hamburger Menu Modal Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Menu className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    Menu de Módulos FretMaster
                  </h2>
                  <p className="text-xs text-stone-400">
                    Selecione um módulo para consultar ou praticar no braço
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                title="Fechar Menu (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 p-5 max-h-[75vh] overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`group text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg scale-[1.01]'
                        : tab.highlight
                        ? 'bg-stone-900/90 border-amber-500/40 hover:border-amber-500/80 hover:bg-stone-800/80'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60 text-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isActive
                            ? 'bg-amber-500 text-stone-950'
                            : tab.highlight
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-stone-800 text-stone-300 group-hover:text-amber-400 group-hover:bg-stone-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Ativo
                        </span>
                      ) : tab.highlight ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          <Sparkles className="w-3 h-3" />
                          IA
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-stone-400 transition-transform group-hover:translate-x-1" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                        {tab.label}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-950/90 px-6 py-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>
                💡 Dica: Pressione <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Esc</kbd> ou clique fora para fechar
              </span>
              <span className="text-amber-400 font-bold">
                9 Módulos Disponíveis
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Instalação do PWA */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </header>
  );
};
