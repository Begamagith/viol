/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstrumentType } from '../../types';
import { TUNINGS } from '../../data/musicTheory';
import { Sparkles, Send, HelpCircle, BookOpen, Loader2, Guitar } from 'lucide-react';

interface AiMusicTutorProps {
  instrument: InstrumentType;
  tuningId: string;
}

export const AiMusicTutor: React.FC<AiMusicTutorProps> = ({ instrument, tuningId }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

  const currentTuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];

  const quickQuestions = [
    'Como solar num Blues em Lá Menor usando a Pentatônica?',
    'Qual a diferença visual no braço entre o Modo Dórico e a Escala Menor Natural?',
    'Como fazer o acorde Bm7 (Si Menor 7) sem usar pestana no violão?',
    'Como memorizar as notas na 5ª e 6ª cordas rapidamente?',
    'Como usar o Sistema CAGED para criar solos que acompanham os acordes?',
    'O que são Tríades e por que são tão usadas no Funk e Soul nas cordas agudas?',
  ];

  const handleSendPrompt = async (questionText?: string) => {
    const textToSend = questionText || prompt;
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          instrument,
          tuning: currentTuning.name,
          topic: 'Teoria no Violão e Guitarra',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
        setHistory((prev) => [{ question: textToSend, answer: data.response }, ...prev]);
        if (!questionText) setPrompt('');
      } else {
        setResponse('Erro: ' + (data.error || 'Falha ao consultar a IA.'));
      }
    } catch (err) {
      console.error(err);
      setResponse('Não foi possível conectar ao servidor. Verifique se o servidor backend está ativo.');
    } finally {
      setLoading(false);
    }
  };

  const instrumentLabel =
    instrument === 'violao_nylon'
      ? 'Violão Nylon'
      : instrument === 'violao_aco'
      ? 'Violão Aço'
      : 'Guitarra Elétrica';

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professor IA Powered by Gemini</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tire suas Dúvidas de Teoria no Braço do Instrumento
            </h2>
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl">
              Pergunte qualquer coisa sobre teoria musical, escalas, acordes, improvisação, digitações ou tablaturas. O Professor IA responderá com foco no 
              <strong className="text-amber-400"> {instrumentLabel}</strong> e afinação 
              <strong className="text-amber-400"> {currentTuning.name}</strong>.
            </p>
          </div>

          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 shrink-0 text-xs text-stone-400 space-y-1">
            <div className="font-bold text-stone-200">Contexto do Instrumento:</div>
            <div>🎸 {instrumentLabel}</div>
            <div>🎼 {currentTuning.name}</div>
          </div>
        </div>

        {/* Quick Question Pills */}
        <div className="mt-6 pt-6 border-t border-stone-800/80">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
            Perguntas Frequentes (Clique para perguntar):
          </span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(q)}
                disabled={loading}
                className="text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-800/80 hover:bg-amber-500/10 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 border border-stone-700/80 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Como criar uma linha de baixo para acompanhar acordes no violão?"
            disabled={loading}
            className="flex-1 bg-stone-950/90 text-white placeholder-stone-500 text-sm sm:text-base rounded-xl px-4 py-3.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Consultando IA...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Perguntar</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Answer Area */}
      {loading && (
        <div className="bg-stone-900 p-12 rounded-2xl border border-stone-800 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-stone-300 font-bold">
            O Professor IA está elaborando sua resposta com dicas práticas no braço...
          </p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Guitar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Resposta do Professor IA</h3>
                <span className="text-xs text-stone-400">
                  Adaptado para {instrumentLabel} — {currentTuning.name}
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-stone-200 leading-relaxed space-y-4 text-sm sm:text-base whitespace-pre-line">
            {response}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="space-y-4 pt-6 border-t border-stone-800">
          <h3 className="text-base font-bold text-stone-300">
            Perguntas Anteriores nesta Sessão
          </h3>
          <div className="space-y-4">
            {history.slice(1).map((item, index) => (
              <div
                key={index}
                className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800/80 space-y-2"
              >
                <div className="text-sm font-bold text-amber-400">
                  Perguntado: {item.question}
                </div>
                <div className="text-xs text-stone-300 line-clamp-3">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
