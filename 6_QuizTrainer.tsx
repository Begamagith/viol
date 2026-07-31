/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType, NoteDisplayMode } from '../types';
import { getNoteAtFret, getIntervalFromRoot } from '../data/musicTheory';
import { guitarAudio } from '../lib/audio';
import { Volume2, Sparkles, HelpCircle } from 'lucide-react';

interface FretboardProps {
  instrument: InstrumentType;
  tuningNotes: string[]; // ['E', 'B', 'G', 'D', 'A', 'E'] from 1st string (high e) to 6th string (low E)
  maxFrets?: number;
  rootNoteEn?: string; // Optional root note for interval coloring
  highlightedNotes?: {
    stringIndex: number;
    fretNumber: number;
    label?: string;
    isRoot?: boolean;
    color?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';
    finger?: string;
  }[];
  displayMode?: NoteDisplayMode;
  onFretClick?: (stringIdx: number, fretNum: number, noteEn: string, notePt: string) => void;
  showAllNotes?: boolean;
}

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  tuningNotes,
  maxFrets = 13,
  rootNoteEn = 'C',
  highlightedNotes = [],
  displayMode = 'name_pt',
  onFretClick,
  showAllNotes = false,
}) => {
  const [activeFret, setActiveFret] = useState<{ stringIdx: number; fretNum: number } | null>(null);

  // Helper to determine fretboard theme colors
  const getWoodTheme = () => {
    switch (instrument) {
      case 'violao_nylon':
        return {
          boardBg: 'bg-gradient-to-b from-amber-950 via-[#3a2211] to-amber-950',
          boardBorder: 'border-amber-800/80',
          fretWire: 'bg-amber-200/70 shadow-[1px_0_2px_rgba(0,0,0,0.5)]',
          nutStyle: 'bg-amber-100 border-r-2 border-amber-300',
          markerColor: 'bg-amber-100/30',
          stringColors: [
            'bg-amber-100/90 h-[1.5px]', // 1st nylon high
            'bg-amber-100/90 h-[1.8px]', // 2nd nylon
            'bg-amber-100/80 h-[2.2px]', // 3rd nylon
            'bg-amber-300/80 h-[2.5px] shadow-sm', // 4th wound bronze
            'bg-amber-300/90 h-[3.0px] shadow-sm', // 5th wound bronze
            'bg-amber-300/90 h-[3.5px] shadow-sm', // 6th wound bronze
          ],
        };
      case 'violao_aco':
        return {
          boardBg: 'bg-gradient-to-b from-stone-900 via-[#261f1c] to-stone-900',
          boardBorder: 'border-stone-800',
          fretWire: 'bg-slate-300/80 shadow-[1px_0_2px_rgba(0,0,0,0.6)]',
          nutStyle: 'bg-stone-200 border-r-2 border-stone-400',
          markerColor: 'bg-stone-300/40',
          stringColors: [
            'bg-amber-200/80 h-[1.5px]', // 1st steel
            'bg-amber-200/80 h-[1.8px]', // 2nd steel
            'bg-amber-400/90 h-[2.2px] shadow-sm', // 3rd bronze
            'bg-amber-400/90 h-[2.6px] shadow-sm', // 4th bronze
            'bg-amber-500/90 h-[3.0px] shadow-sm', // 5th bronze
            'bg-amber-500/90 h-[3.6px] shadow-sm', // 6th bronze
          ],
        };
      default: // guitarra
        return {
          boardBg: 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950',
          boardBorder: 'border-zinc-800',
          fretWire: 'bg-zinc-300/85 shadow-[1px_0_3px_rgba(0,0,0,0.8)]',
          nutStyle: 'bg-zinc-300 border-r-2 border-zinc-500',
          markerColor: 'bg-zinc-400/40',
          stringColors: [
            'bg-zinc-200/85 h-[1.3px]', // 1st high e
            'bg-zinc-200/85 h-[1.6px]', // 2nd B
            'bg-zinc-300/90 h-[2.0px]', // 3rd G
            'bg-zinc-400/90 h-[2.5px] shadow-sm', // 4th D
            'bg-zinc-400/90 h-[3.0px] shadow-sm', // 5th A
            'bg-zinc-500/95 h-[3.5px] shadow-sm', // 6th low E
          ],
        };
    }
  };

  const theme = getWoodTheme();

  // Fret marker numbers
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

  // Helper to find if a note is highlighted
  const getHighlight = (stringIdx: number, fretNum: number) => {
    return highlightedNotes.find(
      (h) => h.stringIndex === stringIdx && h.fretNumber === fretNum
    );
  };

  // Helper to color tag styles
  const getBadgeClass = (
    isRoot: boolean,
    color?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate',
    isHighlighted: boolean = true
  ) => {
    if (isRoot || color === 'amber') {
      return 'bg-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-200 shadow-amber-500/50 scale-105';
    }
    if (color === 'emerald') {
      return 'bg-emerald-500 text-white font-bold ring-1 ring-emerald-300 shadow-emerald-500/40';
    }
    if (color === 'blue') {
      return 'bg-sky-500 text-white font-bold ring-1 ring-sky-300 shadow-sky-500/40';
    }
    if (color === 'purple') {
      return 'bg-purple-500 text-white font-bold ring-1 ring-purple-300 shadow-purple-500/40';
    }
    if (color === 'rose') {
      return 'bg-rose-500 text-white font-bold ring-1 ring-rose-300 shadow-rose-500/40';
    }
    if (isHighlighted) {
      return 'bg-slate-100 text-slate-900 font-bold ring-1 ring-white/60 shadow-md';
    }
    return 'bg-stone-800/80 text-stone-300 font-medium hover:bg-stone-700/80 border border-stone-600/50';
  };

  const handleFretClick = (stringIdx: number, fretNum: number) => {
    const openNote = tuningNotes[stringIdx] || 'E';
    const { noteEn, notePt } = getNoteAtFret(openNote, fretNum);
    
    // Play sound!
    guitarAudio.playFret(stringIdx, fretNum, tuningNotes, instrument);
    
    setActiveFret({ stringIdx, fretNum });
    setTimeout(() => setActiveFret(null), 450);

    if (onFretClick) {
      onFretClick(stringIdx, fretNum, noteEn, notePt);
    }
  };

  return (
    <div className="w-full select-none flex flex-col items-center">
      {/* Fretboard wrapper with horizontal scroll for responsiveness */}
      <div className="w-full overflow-x-auto pb-4 pt-1 px-1 no-scrollbar">
        <div className="min-w-[780px] w-full flex flex-col">
          
          {/* Top fret numbers */}
          <div className="flex w-full mb-1 pl-12 text-xs font-semibold text-stone-400">
            {Array.from({ length: maxFrets + 1 }).map((_, fretIdx) => (
              <div
                key={fretIdx}
                className="flex-1 text-center font-mono"
              >
                {fretIdx === 0 ? 'Solta' : fretIdx}
              </div>
            ))}
          </div>

          {/* Fretboard Wood Background Container */}
          <div
            className={`relative flex w-full rounded-lg border-2 ${theme.boardBg} ${theme.boardBorder} shadow-2xl overflow-hidden py-1`}
          >
            {/* Strings (from String 1 high e at top to String 6 low E at bottom) */}
            <div className="flex flex-col w-full justify-between relative z-10">
              {tuningNotes.map((openNote, stringIdx) => {
                // String number: stringIdx 0 is 1st string (high e), stringIdx 5 is 6th string (low E)
                const stringNumber = stringIdx + 1;

                return (
                  <div
                    key={stringIdx}
                    className="flex items-center h-11 relative"
                  >
                    {/* String label on the left (e.g. 1ª e / E) */}
                    <div className="w-12 shrink-0 flex items-center justify-center font-mono text-xs font-bold text-stone-300 bg-stone-900/90 border-r border-stone-700 h-full z-20 shadow-md">
                      <span className="text-[10px] text-stone-400 mr-1">{stringNumber}ª</span>
                      <span className="text-amber-400">{openNote}</span>
                    </div>

                    {/* Fret slots */}
                    <div className="flex-1 flex h-full relative">
                      {Array.from({ length: maxFrets + 1 }).map((_, fretIdx) => {
                        const { noteEn, notePt } = getNoteAtFret(openNote, fretIdx);
                        const intervalInfo = getIntervalFromRoot(rootNoteEn, noteEn);
                        const isRoot = noteEn === rootNoteEn;

                        // Check if note is highlighted or if we show all notes
                        const highlight = getHighlight(stringIdx, fretIdx);
                        const isHighlighted = Boolean(highlight);
                        const shouldShowNote = isHighlighted || showAllNotes;

                        // Calculate display text
                        let labelText = '';
                        if (highlight && highlight.label) {
                          labelText = highlight.label;
                        } else if (displayMode === 'name_pt') {
                          labelText = notePt;
                        } else if (displayMode === 'name_en') {
                          labelText = noteEn;
                        } else if (displayMode === 'interval') {
                          labelText = intervalInfo.short;
                        } else if (displayMode === 'degree') {
                          labelText = intervalInfo.formula;
                        } else if (displayMode === 'finger') {
                          labelText = highlight?.finger || notePt;
                        }

                        const isJustClicked = activeFret?.stringIdx === stringIdx && activeFret?.fretNum === fretIdx;

                        return (
                          <div
                            key={fretIdx}
                            onClick={() => handleFretClick(stringIdx, fretIdx)}
                            className={`flex-1 relative flex items-center justify-center cursor-pointer group h-full ${
                              fretIdx === 0 ? `${theme.nutStyle}` : ''
                            }`}
                          >
                            {/* Horizontal String Line */}
                            <div
                              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${theme.stringColors[stringIdx]} z-0`}
                            />

                            {/* Fret Wire on right edge of fret cell (for frets > 0) */}
                            {fretIdx > 0 && (
                              <div
                                className={`absolute right-0 top-0 bottom-0 w-1 ${theme.fretWire} z-10`}
                              />
                            )}

                            {/* Inlaid Fret Markers (Dots) on fretboard wood */}
                            {fretMarkers.includes(fretIdx) && stringIdx === 2 && (
                              <div
                                className={`absolute top-full -translate-y-1/2 w-3.5 h-3.5 rounded-full ${theme.markerColor} z-0 pointer-events-none`}
                              />
                            )}
                            {fretIdx === 12 && stringIdx === 1 && (
                              <div
                                className={`absolute top-full -translate-y-1/2 w-3.5 h-3.5 rounded-full ${theme.markerColor} z-0 pointer-events-none`}
                              />
                            )}
                            {fretIdx === 12 && stringIdx === 3 && (
                              <div
                                className={`absolute top-full -translate-y-1/2 w-3.5 h-3.5 rounded-full ${theme.markerColor} z-0 pointer-events-none`}
                              />
                            )}

                            {/* Note Badge */}
                            {(shouldShowNote || fretIdx === 0) && (
                              <div
                                className={`relative z-20 min-w-[26px] h-6 px-1.5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 shadow-sm ${
                                  shouldShowNote
                                    ? getBadgeClass(isRoot, highlight?.color, isHighlighted)
                                    : 'opacity-0 group-hover:opacity-75 bg-stone-700/80 text-stone-200'
                                } ${isJustClicked ? 'scale-125 ring-4 ring-amber-300' : ''}`}
                              >
                                {labelText}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Fret Dots Legend */}
          <div className="flex w-full mt-1.5 pl-12">
            {Array.from({ length: maxFrets + 1 }).map((_, fretIdx) => (
              <div
                key={fretIdx}
                className="flex-1 flex justify-center items-center h-4"
              >
                {fretMarkers.includes(fretIdx) && (
                  <div className="w-2 h-2 rounded-full bg-stone-500/60" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
