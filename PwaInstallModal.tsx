/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InstrumentType, NoteDisplayMode } from '../../types';
import { Fretboard } from '../Fretboard';
import {
  TUNINGS,
  CHROMATIC_PT,
  CHROMATIC_EN,
  getNoteAtFret,
  INTERVAL_NAMES_PT,
} from '../../data/musicTheory';
import { guitarAudio } from '../../lib/audio';
import { Award, Volume2, CheckCircle2, XCircle, RefreshCw, Sparkles, Target } from 'lucide-react';

interface QuizTrainerProps {
  instrument: InstrumentType;
  tuningId: string;
}

type QuizMode = 'fret_hunt' | 'interval_ear' | 'scale_degree';

export const QuizTrainer: React.FC<QuizTrainerProps> = ({ instrument, tuningId }) => {
  const [mode, setMode] = useState<QuizMode>('fret_hunt');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  // HUNT MODE STATE
  const [targetHuntNote, setTargetHuntNote] = useState<{
    noteEn: string;
    notePt: string;
    stringIndex: number; // 0 to 5
    stringName: string;
  }>({ noteEn: 'G', notePt: 'Sol', stringIndex: 2, stringName: '3ª corda (G)' });

  // INTERVAL EAR MODE STATE
  const [intervalQuestion, setIntervalQuestion] = useState<{
    rootEn: string;
    targetEn: string;
    semitones: number;
    options: { semitones: number; name: string; short: string }[];
  }>({
    rootEn: 'C',
    targetEn: 'G',
    semitones: 7,
    options: [],
  });

  // SCALE DEGREE MODE STATE
  const [degreeQuestion, setDegreeQuestion] = useState<{
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }>({
    question: '',
    options: [],
    correct: '',
    explanation: '',
  });

  const stringNames = ['1ª corda (e)', '2ª corda (B)', '3ª corda (G)', '4ª corda (D)', '5ª corda (A)', '6ª corda (E)'];

  // GENERATE NEW HUNT QUESTION
  const generateHuntQuestion = () => {
    setFeedback(null);
    const sIdx = Math.floor(Math.random() * 6);
    const targetFret = Math.floor(Math.random() * 12) + 1; // fret 1 to 12
    const openNote = currentTuning.notes[sIdx];
    const info = getNoteAtFret(openNote, targetFret);

    setTargetHuntNote({
      noteEn: info.noteEn,
      notePt: info.notePt,
      stringIndex: sIdx,
      stringName: stringNames[sIdx],
    });
  };

  // GENERATE NEW INTERVAL QUESTION
  const generateIntervalQuestion = () => {
    setFeedback(null);
    const possibleSemitones = [3, 4, 5, 7, 10, 11]; // common intervals
    const targetSem = possibleSemitones[Math.floor(Math.random() * possibleSemitones.length)];
    const rootIdx = Math.floor(Math.random() * 12);
    const rootEn = CHROMATIC_EN[rootIdx];
    const targetEn = CHROMATIC_EN[(rootIdx + targetSem) % 12];

    // Build 4 options
    const shuffledSems = [...possibleSemitones].sort(() => 0.5 - Math.random()).slice(0, 3);
    if (!shuffledSems.includes(targetSem)) {
      shuffledSems[0] = targetSem;
    }
    const finalOptions = shuffledSems
      .map((s) => ({
        semitones: s,
        name: INTERVAL_NAMES_PT[s].name,
        short: INTERVAL_NAMES_PT[s].short,
      }))
      .sort((a, b) => a.semitones - b.semitones);

    setIntervalQuestion({
      rootEn,
      targetEn,
      semitones: targetSem,
      options: finalOptions,
    });
  };

  // GENERATE NEW DEGREE QUESTION
  const generateDegreeQuestion = () => {
    setFeedback(null);
    const questions = [
      {
        question: 'Na Escala Maior de DÓ (C), qual é a nota do 5º Grau Justo (Dominante)?',
        options: ['Sol (G)', 'Fá (F)', 'Lá (A)', 'Si (B)'],
        correct: 'Sol (G)',
        explanation: 'O 5º grau da escala de Dó Maior é o Sol (7 semitons acima da tônica).',
      },
      {
        question: 'Qual é o intervalo entre a 3ª corda (Sol) e a 2ª corda (Si) na afinação padrão?',
        options: ['Terça Maior (3M)', 'Quarta Justa (4J)', 'Quinta Justa (5J)', 'Segunda Maior (2M)'],
        correct: 'Terça Maior (3M)',
        explanation: 'É a única exceção na guitarra e violão: de Sol para Si são 4 semitons (Terça Maior).',
      },
      {
        question: 'No Campo Harmônico Maior, qual é a qualidade padrão do grau "ii"?',
        options: ['Acorde Menor', 'Acorde Maior', 'Acorde Diminuto', 'Acorde Aumentado'],
        correct: 'Acorde Menor',
        explanation: 'O segundo grau (ii) do campo harmônico maior é sempre um acorde Menor (ex: Dm no tom de C).',
      },
      {
        question: 'Qual nota você encontra na 12ª casa de qualquer corda?',
        options: ['A mesma nota da corda solta (Oitava)', 'A Quinta Justa', 'A Terça Maior', 'O Trítono'],
        correct: 'A mesma nota da corda solta (Oitava)',
        explanation: 'A 12ª casa tem 12 semitons (1 oitava exata), repetindo as notas soltas em frequência dobrada!',
      },
    ];

    const pick = questions[Math.floor(Math.random() * questions.length)];
    setDegreeQuestion(pick);
  };

  useEffect(() => {
    if (mode === 'fret_hunt') generateHuntQuestion();
    else if (mode === 'interval_ear') generateIntervalQuestion();
    else generateDegreeQuestion();
  }, [mode]);

  // Handle Fret Hunt Click
  const handleHuntClick = (stringIdx: number, fretNum: number, noteEn: string, notePt: string) => {
    if (stringIdx === targetHuntNote.stringIndex && noteEn === targetHuntNote.noteEn) {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      setFeedback({
        isCorrect: true,
        text: `Mandou bem! A nota ${notePt} fica exatamente na casa ${fretNum} da ${stringNames[stringIdx]}!`,
      });
      setTimeout(() => generateHuntQuestion(), 1600);
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Essa foi ${notePt} (casa ${fretNum}). Procure ${targetHuntNote.notePt} na ${targetHuntNote.stringName}!`,
      });
    }
  };

  // Handle Interval Answer
  const handleIntervalAnswer = (selectedSem: number) => {
    if (selectedSem === intervalQuestion.semitones) {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      setFeedback({
        isCorrect: true,
        text: `Correto! O intervalo de ${INTERVAL_NAMES_PT[selectedSem].name} tem ${selectedSem} semitons.`,
      });
      setTimeout(() => generateIntervalQuestion(), 1800);
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Incorreto. A resposta certa era ${INTERVAL_NAMES_PT[intervalQuestion.semitones].name}. Ouça novamente!`,
      });
    }
  };

  // Handle Degree Answer
  const handleDegreeAnswer = (selected: string) => {
    if (selected === degreeQuestion.correct) {
      setScore((s) => s + 15);
      setStreak((s) => s + 1);
      setFeedback({
        isCorrect: true,
        text: `Perfeito! ${degreeQuestion.explanation}`,
      });
      setTimeout(() => generateDegreeQuestion(), 2200);
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Não foi dessa vez. ${degreeQuestion.explanation}`,
      });
    }
  };

  const playIntervalEarQuestion = () => {
    const rootFreq = guitarAudio.getFrequency(intervalQuestion.rootEn, 3);
    const targetFreq = rootFreq * Math.pow(2, intervalQuestion.semitones / 12);
    guitarAudio.playTone(rootFreq, instrument, 1.8, 0);
    guitarAudio.playTone(targetFreq, instrument, 2.2, 0.7);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header & Gamified Stats */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
            Módulo 6: Treino Prático
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Quiz & Treinador de Ouvido e Braço
          </h2>
          <p className="text-stone-300 text-sm mt-1">
            Ponha sua teoria à prova no braço do violão e guitarra! Ganhe pontos e aumente sua sequência de acertos.
          </p>
        </div>

        {/* Score & Streak Counters */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-3 bg-stone-800 rounded-xl border border-stone-700 text-center">
            <span className="text-xs text-stone-400 block font-mono">PONTUAÇÃO</span>
            <span className="text-2xl font-extrabold text-amber-400">{score}</span>
          </div>
          <div className="px-4 py-3 bg-stone-800 rounded-xl border border-stone-700 text-center">
            <span className="text-xs text-stone-400 block font-mono">SEQUÊNCIA</span>
            <span className="text-2xl font-extrabold text-emerald-400">🔥 {streak}</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode('fret_hunt')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            mode === 'fret_hunt'
              ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Modo 1: Caça-Notas no Braço</span>
        </button>
        <button
          onClick={() => setMode('interval_ear')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            mode === 'interval_ear'
              ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Modo 2: Treino de Ouvido (Intervalos)</span>
        </button>
        <button
          onClick={() => setMode('scale_degree')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            mode === 'scale_degree'
              ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Modo 3: Fórmulas & Graus</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-sm sm:text-base font-bold shadow-lg ${
            feedback.isCorrect
              ? 'bg-emerald-900/90 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-900/90 border border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* MODE 1: FRET HUNT */}
      {mode === 'fret_hunt' && (
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">Desafio do Braço</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Onde fica a nota <span className="text-amber-400">{targetHuntNote.notePt} ({targetHuntNote.noteEn})</span> na{' '}
                <span className="underline decoration-amber-400">{targetHuntNote.stringName}</span>?
              </h3>
              <p className="text-stone-400 text-xs mt-1">
                Clique diretamente na casa correta no braço interativo abaixo!
              </p>
            </div>

            <button
              onClick={generateHuntQuestion}
              className="flex items-center space-x-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl border border-stone-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Outro Desafio</span>
            </button>
          </div>

          <div className="bg-stone-900/90 p-4 sm:p-6 rounded-2xl border border-stone-800 shadow-xl">
            <Fretboard
              instrument={instrument}
              tuningNotes={currentTuning.notes}
              maxFrets={15}
              displayMode="name_pt"
              onFretClick={handleHuntClick}
            />
          </div>
        </div>
      )}

      {/* MODE 2: INTERVAL EAR TRAINER */}
      {mode === 'interval_ear' && (
        <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 space-y-6 max-w-3xl mx-auto text-center">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase">Treinamento Auditivo</span>
            <h3 className="text-2xl font-extrabold text-white mt-2">
              Qual intervalo você ouviu?
            </h3>
            <p className="text-stone-300 text-sm mt-1">
              Clique no botão de áudio abaixo para ouvir 2 notas tocadas em sequência no {instrument === 'violao_nylon' ? 'violão nylon' : instrument === 'violao_aco' ? 'violão aço' : 'guitarra'}.
            </p>
          </div>

          <button
            onClick={playIntervalEarQuestion}
            className="inline-flex items-center space-x-3 px-8 py-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-lg rounded-2xl shadow-xl transition-all transform hover:scale-105"
          >
            <Volume2 className="w-6 h-6" />
            <span>Ouvir Intervalo</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {intervalQuestion.options.map((opt) => (
              <button
                key={opt.semitones}
                onClick={() => handleIntervalAnswer(opt.semitones)}
                className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white font-bold text-base transition-all"
              >
                <span>{opt.name}</span>
                <span className="ml-2 text-xs text-amber-400 font-mono">({opt.short})</span>
              </button>
            ))}
          </div>

          <button
            onClick={generateIntervalQuestion}
            className="text-xs text-stone-400 hover:text-white inline-flex items-center space-x-1 underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pular para próximo intervalo</span>
          </button>
        </div>
      )}

      {/* MODE 3: SCALE DEGREES & THEORY */}
      {mode === 'scale_degree' && (
        <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 space-y-6 max-w-3xl mx-auto">
          <div>
            <span className="text-xs font-mono text-purple-400 uppercase">Quiz Teórico de Violão e Guitarra</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              {degreeQuestion.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {degreeQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleDegreeAnswer(option)}
                className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white font-bold text-left transition-all"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateDegreeQuestion}
              className="text-xs text-stone-400 hover:text-white inline-flex items-center space-x-1 underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Outra Pergunta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
