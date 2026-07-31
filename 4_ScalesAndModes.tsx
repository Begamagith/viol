/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TuningPreset,
  ScaleDefinition,
  HarmonicFieldChord,
  ChordVoicing,
  TriadShape,
} from '../types';

export const CHROMATIC_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_PT = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

export const NOTE_TO_SEMITONE: { [key: string]: number } = {
  'C': 0, 'C#': 1, 'Db': 1, 'Dó': 0, 'Dó#': 1,
  'D': 2, 'D#': 3, 'Eb': 3, 'Ré': 2, 'Ré#': 3,
  'E': 4, 'Mi': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'Fá': 5, 'Fá#': 6,
  'G': 7, 'G#': 8, 'Ab': 8, 'Sol': 7, 'Sol#': 8,
  'A': 9, 'A#': 10, 'Bb': 10, 'Lá': 9, 'Lá#': 10,
  'B': 11, 'Si': 11,
};

export const INTERVAL_NAMES_PT: { [key: number]: { name: string; short: string; formula: string } } = {
  0: { name: 'Tônica (Uníssono)', short: 'T', formula: '1' },
  1: { name: 'Segunda Menor', short: '2m', formula: 'b2' },
  2: { name: 'Segunda Maior', short: '2M', formula: '2' },
  3: { name: 'Terça Menor', short: '3m', formula: 'b3' },
  4: { name: 'Terça Maior', short: '3M', formula: '3' },
  5: { name: 'Quarta Justa', short: '4J', formula: '4' },
  6: { name: 'Trítono (4ª Aum / 5ª Dim)', short: '4# / 5b', formula: 'b5' },
  7: { name: 'Quinta Justa', short: '5J', formula: '5' },
  8: { name: 'Sexta Menor / Quinta Aum', short: '6m', formula: 'b6' },
  9: { name: 'Sexta Maior', short: '6M', formula: '6' },
  10: { name: 'Sétima Menor', short: '7m', formula: 'b7' },
  11: { name: 'Sétima Maior', short: '7M', formula: '7' },
};

/**
 * Standard and alternate guitar / violão tunings (Notes from 1st string high e to 6th string low E)
 */
export const TUNINGS: TuningPreset[] = [
  {
    id: 'standard',
    name: 'Padrão (E-A-D-G-B-E)',
    description: 'A afinação universal para violão e guitarra. Intervalos de quarta justa entre as cordas, exceto da 3ª para a 2ª corda (terça maior).',
    notes: ['E', 'B', 'G', 'D', 'A', 'E'], // 1st string (highest) to 6th string (lowest)
  },
  {
    id: 'drop_d',
    name: 'Drop D (D-A-D-G-B-E)',
    description: 'A 6ª corda é rebaixada em um tom (Mi para Ré), permitindo acordes "Power Chords" com apenas um dedo nas 3 cordas graves. Muito usada no Rock e Blues.',
    notes: ['E', 'B', 'G', 'D', 'A', 'D'],
  },
  {
    id: 'half_step_down',
    name: 'Meio Tom Abaixo (Eb Padrão)',
    description: 'Todas as cordas descem meio tom. Ideal para vocais mais graves e para um timbre de violão mais macio e encorpado (Hendrix, SRV).',
    notes: ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'],
  },
  {
    id: 'open_g',
    name: 'Open G (D-G-D-G-B-D)',
    description: 'Ao tocar as cordas soltas, soa o acorde de Sol Maior. Favorito no Blues, Slide Guitar e The Rolling Stones.',
    notes: ['D', 'B', 'G', 'D', 'G', 'D'],
  },
  {
    id: 'open_d',
    name: 'Open D (D-A-D-F#-A-D)',
    description: 'Afinação aberta que soa um acorde de Ré Maior perfeito. Extremamente ressonante no violão folk.',
    notes: ['D', 'A', 'F#', 'D', 'A', 'D'],
  },
  {
    id: 'dadgad',
    name: 'DADGAD (Celta / Modal)',
    description: 'Afinação modal com som místico e suspenso, sem terça definida. Muito utilizada em música celta e fingerstyle moderno.',
    notes: ['D', 'A', 'G', 'D', 'A', 'D'],
  },
];

/**
 * Comprehensive scales & Greek modes with CAGED box patterns
 */
export const SCALES: ScaleDefinition[] = [
  {
    id: 'pentatonica_menor',
    name: 'Pentatônica Menor',
    category: 'pentatonica',
    formula: '1 - b3 - 4 - 5 - b7',
    intervals: [0, 3, 5, 7, 10],
    description: 'A escala mais essencial da guitarra e violão. Composta por 5 notas, elimina os intervalos de semitom, gerando solos fortes sem notas que "chocam".',
    mood: 'Bluesy, Rock, Melancólica, Direta',
    genreUsage: 'Rock, Blues, Pop, MPB, Solo de Guitarra',
    cagedPatterns: [
      { shapeName: 'Desenho 1', startFretOffset: 0, description: 'O formato clássico com tônica na 6ª e 1ª corda (dedo 1).' },
      { shapeName: 'Desenho 2', startFretOffset: 2, description: 'Tônica na 4ª corda, muito confortável para bends.' },
      { shapeName: 'Desenho 3', startFretOffset: 5, description: 'Formato centralizado na parte média do braço.' },
      { shapeName: 'Desenho 4', startFretOffset: 7, description: 'Tônica na 5ª corda (formato modelo A).' },
      { shapeName: 'Desenho 5', startFretOffset: 9, description: 'Conecta de volta ao Desenho 1 na oitava superior.' },
    ],
  },
  {
    id: 'pentatonica_maior',
    name: 'Pentatônica Maior',
    category: 'pentatonica',
    formula: '1 - 2 - 3 - 5 - 6',
    intervals: [0, 2, 4, 7, 9],
    description: 'A versão alegre da pentatônica. Possui as mesmas notas de sua relativa menor, mas com o centro tonal na tônica maior.',
    mood: 'Alegre, Country, Solar, Envolvente',
    genreUsage: 'Country, Southern Rock, Pop, Gospel, Samba',
    cagedPatterns: [
      { shapeName: 'Desenho 1', startFretOffset: 0, description: 'Tônica no dedo mínimo (4) na 6ª corda.' },
      { shapeName: 'Desenho 2', startFretOffset: 2, description: 'Tônica na 5ª corda no dedo indicador.' },
    ],
  },
  {
    id: 'blues_scale',
    name: 'Escala de Blues (Blues Scale)',
    category: 'pentatonica',
    formula: '1 - b3 - 4 - b5 - 5 - b7',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'A Pentatônica Menor acrescida da famosa "Blue Note" (b5 ou 4ª Aumentada). Cria a tensão expressiva característica do Blues.',
    mood: 'Expressivo, Dissonante, Raiz, Emocional',
    genreUsage: 'Blues, Jazz-Rock, Hard Rock, Soul',
  },
  {
    id: 'maior_jonio',
    name: 'Escala Maior (Modo Jônio)',
    category: 'escala',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'A escala matriz da música ocidental. É o 1º modo grego. Todas as distâncias e fórmulas são medidas em relação a ela.',
    mood: 'Brilhante, Estável, Alegre, Harmonioso',
    genreUsage: 'Todos os estilos: Pop, Erudito, MPB, Rock, Jazz',
    cagedPatterns: [
      { shapeName: 'Desenho 1', startFretOffset: 0, description: 'Formato Modelo E (Tônica na 6ª corda).' },
      { shapeName: 'Desenho 2', startFretOffset: 2, description: 'Formato Modelo D.' },
      { shapeName: 'Desenho 3', startFretOffset: 4, description: 'Formato Modelo C.' },
      { shapeName: 'Desenho 4', startFretOffset: 7, description: 'Formato Modelo A (Tônica na 5ª corda).' },
      { shapeName: 'Desenho 5', startFretOffset: 9, description: 'Formato Modelo G.' },
    ],
  },
  {
    id: 'menor_natural_eolio',
    name: 'Menor Natural (Modo Eólio)',
    category: 'escala',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'O 6º modo grego. É a escala menor padrão, com sonoridade triste e melancólica devido à 3ª, 6ª e 7ª menores.',
    mood: 'Melancólico, Triste, Épico, Reflexivo',
    genreUsage: 'Rock, Metal, Baladas, Música Latina, Pop',
  },
  {
    id: 'modo_dorico',
    name: 'Modo Dórico (Dorian)',
    category: 'modo_grego',
    formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'O 2º modo grego. É uma escala menor, mas com a "6ª Maior" (nota característica dória). Sofisticado e muito usado em Jazz, Funk e Fusion.',
    mood: 'Sofisticado, Jazzy, Suave, Urbano',
    genreUsage: 'Jazz, Funk, Fusion, Rock Progressivo, Santana',
  },
  {
    id: 'modo_frigio',
    name: 'Modo Frígio (Phrygian)',
    category: 'modo_grego',
    formula: '1 - b2 - b3 - 4 - 5 - b6 - b7',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    description: 'O 3º modo grego. Caracterizado pela Segunda Menor (b2), que gera uma sonoridade flamenca, mourisca e dramática.',
    mood: 'Flamenco, Árabe, Tenso, Heavy Metal',
    genreUsage: 'Flamenco, Heavy Metal (Metallica), Música Espanhola',
  },
  {
    id: 'modo_lidio',
    name: 'Modo Lídio (Lydian)',
    category: 'modo_grego',
    formula: '1 - 2 - 3 - #4 - 5 - 6 - 7',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    description: 'O 4º modo grego. Uma escala maior com a 4ª Aumentada (#4), criando uma atmosfera flutuante, espacial e cinematográfica.',
    mood: 'Cinematográfico, Mágico, Espacial, Sonhador',
    genreUsage: 'Trilhas Sonoras (John Williams), Jazz Fusion (Joe Satriani), MPB',
  },
  {
    id: 'modo_mixolidio',
    name: 'Modo Mixolídio (Mixolydian)',
    category: 'modo_grego',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'O 5º modo grego. Escala maior com a 7ª Menor (b7). É o som do Rock and Roll clássico, baião nordestino e acordes dominantes 7.',
    mood: 'Rock Clássico, Baião, Solto, Festivo',
    genreUsage: 'Classic Rock (AC/DC, The Beatles), Baião, Blues-Rock',
  },
  {
    id: 'menor_harmonica',
    name: 'Escala Menor Harmônica',
    category: 'escala',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - 7',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'Escala menor com a 7ª Maior (sensível). O intervalo de 1 tom e meio entre b6 e 7 gera um som exótico, neoclássico e oriental.',
    mood: 'Neoclássico, Oriental, Erudito, Virtuoso',
    genreUsage: 'Metal Neoclássico (Yngwie Malmsteen), Tango, Música Cigana',
  },
];

/**
 * Common CAGED chord shapes and explanations
 */
export const CAGED_SYSTEM_SHAPES = [
  {
    id: 'C',
    name: 'Formato C (Dó)',
    rootString: 5, // 5th string (A string)
    description: 'Acorde com fundamental na 5ª corda. Como pestana, o dedo 1 faz a barra enquanto os dedos 2, 3 e 4 desenham o formato de Dó aberto.',
    openFrets: [ -1, 3, 2, 0, 1, 0 ], // 6th to 1st
  },
  {
    id: 'A',
    name: 'Formato A (Lá)',
    rootString: 5,
    description: 'Um dos formatos de pestana mais usados! Tônica na 5ª corda. Ao andar pelo braço, torna-se Si (casa 2), Dó (casa 3), Ré (casa 5), etc.',
    openFrets: [ -1, 0, 2, 2, 2, 0 ],
  },
  {
    id: 'G',
    name: 'Formato G (Sol)',
    rootString: 6,
    description: 'Formato amplo que abrange 4 casas. Conecta o formato E com o formato A na região grave e aguda.',
    openFrets: [ 3, 2, 0, 0, 0, 3 ],
  },
  {
    id: 'E',
    name: 'Formato E (Mi)',
    rootString: 6,
    description: 'A clássica pestana de violão e guitarra com tônica na 6ª corda! Fá na 1ª casa, Sol na 3ª, Lá na 5ª, Si na 7ª casa.',
    openFrets: [ 0, 2, 2, 1, 0, 0 ],
  },
  {
    id: 'D',
    name: 'Formato D (Ré)',
    rootString: 4, // 4th string (D string)
    description: 'Formato com tônica na 4ª corda. Excelente para tríades e acompanhamentos na região aguda das 4 cordas de baixo.',
    openFrets: [ -1, -1, 0, 2, 3, 2 ],
  },
];

/**
 * Triads across different string sets for Guitarra & Violão
 */
export const TRIAD_SHAPES: TriadShape[] = [
  // Major Triads - Set 1-2-3 (high e, B, G)
  {
    id: 'maj_fund_123',
    inversionName: 'Estado Fundamental',
    stringSet: '1-2-3',
    formula: '1 - 3 - 5',
    fretOffsets: [
      { stringIdx: 2, offset: 0, interval: '1' },
      { stringIdx: 1, offset: 0, interval: '5' },
      { stringIdx: 0, offset: 0, interval: '3' },
    ],
  },
  {
    id: 'maj_1inv_123',
    inversionName: '1ª Inversão (Terça no baixo)',
    stringSet: '1-2-3',
    formula: '3 - 5 - 1',
    fretOffsets: [
      { stringIdx: 2, offset: 0, interval: '3' },
      { stringIdx: 1, offset: 1, interval: '1' },
      { stringIdx: 0, offset: -1, interval: '5' },
    ],
  },
  {
    id: 'maj_2inv_123',
    inversionName: '2ª Inversão (Quinta no baixo)',
    stringSet: '1-2-3',
    formula: '5 - 1 - 3',
    fretOffsets: [
      { stringIdx: 2, offset: 0, interval: '5' },
      { stringIdx: 1, offset: -1, interval: '3' },
      { stringIdx: 0, offset: 0, interval: '1' },
    ],
  },
  // Minor Triads - Set 1-2-3
  {
    id: 'min_fund_123',
    inversionName: 'Estado Fundamental Menor',
    stringSet: '1-2-3',
    formula: '1 - b3 - 5',
    fretOffsets: [
      { stringIdx: 2, offset: 0, interval: '1' },
      { stringIdx: 1, offset: 0, interval: '5' },
      { stringIdx: 0, offset: -1, interval: 'b3' },
    ],
  },
];

/**
 * Complete Harmonic Fields (Campo Harmônico Maior e Menor) for C, G, D, A, E, F, Am, Em, etc.
 */
export const HARMONIC_FIELDS: {
  key: string;
  namePt: string;
  type: 'maior' | 'menor';
  scaleNotes: string[];
  chords: HarmonicFieldChord[];
}[] = [
  {
    key: 'C',
    namePt: 'Dó Maior (C)',
    type: 'maior',
    scaleNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    chords: [
      {
        degreeRoman: 'I',
        chordName: 'C',
        chordType: 'Maior',
        notes: ['C', 'E', 'G'],
        functionPt: 'Tônica (Estabilidade/Repouso)',
        voicings: [
          { name: 'C Aberto', shapeType: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
          { name: 'C Pestana 8ª casa', shapeType: 'E', frets: [8, 10, 10, 9, 8, 8], baseFret: 8 },
        ],
      },
      {
        degreeRoman: 'ii',
        chordName: 'Dm',
        chordType: 'Menor',
        notes: ['D', 'F', 'A'],
        functionPt: 'Subdominante (Movimento suave)',
        voicings: [
          { name: 'Dm Aberto', shapeType: 'aberto', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
          { name: 'Dm Pestana 5ª casa', shapeType: 'A', frets: [-1, 5, 7, 7, 6, 5], baseFret: 5 },
        ],
      },
      {
        degreeRoman: 'iii',
        chordName: 'Em',
        chordType: 'Menor',
        notes: ['E', 'G', 'B'],
        functionPt: 'Tônica (Substitui o I grau)',
        voicings: [
          { name: 'Em Aberto', shapeType: 'aberto', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
          { name: 'Em Pestana 7ª casa', shapeType: 'A', frets: [-1, 7, 9, 9, 8, 7], baseFret: 7 },
        ],
      },
      {
        degreeRoman: 'IV',
        chordName: 'F',
        chordType: 'Maior',
        notes: ['F', 'A', 'C'],
        functionPt: 'Subdominante (Caminho/Abertura)',
        voicings: [
          { name: 'F Pestana 1ª casa', shapeType: 'E', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
          { name: 'F4 cordas simples', shapeType: 'aberto', frets: [-1, -1, 3, 2, 1, 1] },
        ],
      },
      {
        degreeRoman: 'V',
        chordName: 'G',
        chordType: 'Dominante',
        notes: ['G', 'B', 'D'],
        functionPt: 'Dominante (Tensão que pede resolução para Tônica)',
        voicings: [
          { name: 'G Aberto', shapeType: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
          { name: 'G Pestana 3ª casa', shapeType: 'E', frets: [3, 5, 5, 4, 3, 3], baseFret: 3 },
        ],
      },
      {
        degreeRoman: 'vi',
        chordName: 'Am',
        chordType: 'Menor',
        notes: ['A', 'C', 'E'],
        functionPt: 'Tônica (Relativa menor de C)',
        voicings: [
          { name: 'Am Aberto', shapeType: 'aberto', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
          { name: 'Am Pestana 5ª casa', shapeType: 'E', frets: [5, 7, 7, 5, 5, 5], baseFret: 5 },
        ],
      },
      {
        degreeRoman: 'vii°',
        chordName: 'Bm7b5 (ou B°)',
        chordType: 'Meio-Diminuto',
        notes: ['B', 'D', 'F'],
        functionPt: 'Dominante / Sensível (Alta tensão)',
        voicings: [
          { name: 'Bm7b5 Violão', shapeType: 'jazz', frets: [-1, 2, 3, 2, 3, -1], fingers: [0, 1, 2, 1, 3, 0] },
        ],
      },
    ],
  },
  {
    key: 'G',
    namePt: 'Sol Maior (G)',
    type: 'maior',
    scaleNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    chords: [
      {
        degreeRoman: 'I',
        chordName: 'G',
        chordType: 'Maior',
        notes: ['G', 'B', 'D'],
        functionPt: 'Tônica',
        voicings: [
          { name: 'G Aberto', shapeType: 'G', frets: [3, 2, 0, 0, 3, 3] },
          { name: 'G Pestana 3ª casa', shapeType: 'E', frets: [3, 5, 5, 4, 3, 3], baseFret: 3 },
        ],
      },
      {
        degreeRoman: 'ii',
        chordName: 'Am',
        chordType: 'Menor',
        notes: ['A', 'C', 'E'],
        functionPt: 'Subdominante',
        voicings: [{ name: 'Am Aberto', shapeType: 'aberto', frets: [-1, 0, 2, 2, 1, 0] }],
      },
      {
        degreeRoman: 'iii',
        chordName: 'Bm',
        chordType: 'Menor',
        notes: ['B', 'D', 'F#'],
        functionPt: 'Tônica',
        voicings: [{ name: 'Bm Pestana 2ª casa', shapeType: 'A', frets: [-1, 2, 4, 4, 3, 2], baseFret: 2 }],
      },
      {
        degreeRoman: 'IV',
        chordName: 'C',
        chordType: 'Maior',
        notes: ['C', 'E', 'G'],
        functionPt: 'Subdominante',
        voicings: [{ name: 'C Aberto', shapeType: 'C', frets: [-1, 3, 2, 0, 1, 0] }],
      },
      {
        degreeRoman: 'V',
        chordName: 'D',
        chordType: 'Dominante',
        notes: ['D', 'F#', 'A'],
        functionPt: 'Dominante',
        voicings: [{ name: 'D Aberto', shapeType: 'D', frets: [-1, -1, 0, 2, 3, 2] }],
      },
      {
        degreeRoman: 'vi',
        chordName: 'Em',
        chordType: 'Menor',
        notes: ['E', 'G', 'B'],
        functionPt: 'Tônica (Relativa menor)',
        voicings: [{ name: 'Em Aberto', shapeType: 'aberto', frets: [0, 2, 2, 0, 0, 0] }],
      },
      {
        degreeRoman: 'vii°',
        chordName: 'F#m7b5',
        chordType: 'Meio-Diminuto',
        notes: ['F#', 'A', 'C'],
        functionPt: 'Dominante / Sensível',
        voicings: [{ name: 'F#m7b5', shapeType: 'jazz', frets: [2, -1, 2, 2, 1, -1] }],
      },
    ],
  },
  {
    key: 'A',
    namePt: 'Lá Maior (A)',
    type: 'maior',
    scaleNotes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    chords: [
      { degreeRoman: 'I', chordName: 'A', chordType: 'Maior', notes: ['A', 'C#', 'E'], functionPt: 'Tônica', voicings: [{ name: 'A Aberto', shapeType: 'A', frets: [-1, 0, 2, 2, 2, 0] }] },
      { degreeRoman: 'ii', chordName: 'Bm', chordType: 'Menor', notes: ['B', 'D', 'F#'], functionPt: 'Subdominante', voicings: [{ name: 'Bm Pestana', shapeType: 'A', frets: [-1, 2, 4, 4, 3, 2] }] },
      { degreeRoman: 'iii', chordName: 'C#m', chordType: 'Menor', notes: ['C#', 'E', 'G#'], functionPt: 'Tônica', voicings: [{ name: 'C#m Pestana 4ª', shapeType: 'A', frets: [-1, 4, 6, 6, 5, 4] }] },
      { degreeRoman: 'IV', chordName: 'D', chordType: 'Maior', notes: ['D', 'F#', 'A'], functionPt: 'Subdominante', voicings: [{ name: 'D Aberto', shapeType: 'D', frets: [-1, -1, 0, 2, 3, 2] }] },
      { degreeRoman: 'V', chordName: 'E', chordType: 'Dominante', notes: ['E', 'G#', 'B'], functionPt: 'Dominante', voicings: [{ name: 'E Aberto', shapeType: 'E', frets: [0, 2, 2, 1, 0, 0] }] },
      { degreeRoman: 'vi', chordName: 'F#m', chordType: 'Menor', notes: ['F#', 'A', 'C#'], functionPt: 'Tônica (Relativa)', voicings: [{ name: 'F#m Pestana 2ª', shapeType: 'E', frets: [2, 4, 4, 2, 2, 2] }] },
      { degreeRoman: 'vii°', chordName: 'G#m7b5', chordType: 'Meio-Diminuto', notes: ['G#', 'B', 'D'], functionPt: 'Dominante / Sensível', voicings: [{ name: 'G#m7b5', shapeType: 'jazz', frets: [4, -1, 4, 4, 3, -1] }] },
    ],
  },
  {
    key: 'E',
    namePt: 'Mi Maior (E)',
    type: 'maior',
    scaleNotes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    chords: [
      { degreeRoman: 'I', chordName: 'E', chordType: 'Maior', notes: ['E', 'G#', 'B'], functionPt: 'Tônica', voicings: [{ name: 'E Aberto', shapeType: 'E', frets: [0, 2, 2, 1, 0, 0] }] },
      { degreeRoman: 'ii', chordName: 'F#m', chordType: 'Menor', notes: ['F#', 'A', 'C#'], functionPt: 'Subdominante', voicings: [{ name: 'F#m Pestana', shapeType: 'E', frets: [2, 4, 4, 2, 2, 2] }] },
      { degreeRoman: 'iii', chordName: 'G#m', chordType: 'Menor', notes: ['G#', 'B', 'D#'], functionPt: 'Tônica', voicings: [{ name: 'G#m Pestana 4ª', shapeType: 'E', frets: [4, 6, 6, 4, 4, 4] }] },
      { degreeRoman: 'IV', chordName: 'A', chordType: 'Maior', notes: ['A', 'C#', 'E'], functionPt: 'Subdominante', voicings: [{ name: 'A Aberto', shapeType: 'A', frets: [-1, 0, 2, 2, 2, 0] }] },
      { degreeRoman: 'V', chordName: 'B', chordType: 'Dominante', notes: ['B', 'D#', 'F#'], functionPt: 'Dominante', voicings: [{ name: 'B Pestana 2ª', shapeType: 'A', frets: [-1, 2, 4, 4, 4, 2] }] },
      { degreeRoman: 'vi', chordName: 'C#m', chordType: 'Menor', notes: ['C#', 'E', 'G#'], functionPt: 'Tônica (Relativa)', voicings: [{ name: 'C#m Pestana 4ª', shapeType: 'A', frets: [-1, 4, 6, 6, 5, 4] }] },
      { degreeRoman: 'vii°', chordName: 'D#m7b5', chordType: 'Meio-Diminuto', notes: ['D#', 'F#', 'A'], functionPt: 'Dominante / Sensível', voicings: [{ name: 'D#m7b5', shapeType: 'jazz', frets: [-1, 6, 7, 6, 7, -1] }] },
    ],
  },
  {
    key: 'Am',
    namePt: 'Lá Menor Natural (Am)',
    type: 'menor',
    scaleNotes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    chords: [
      { degreeRoman: 'i', chordName: 'Am', chordType: 'Menor', notes: ['A', 'C', 'E'], functionPt: 'Tônica Menor', voicings: [{ name: 'Am Aberto', shapeType: 'aberto', frets: [-1, 0, 2, 2, 1, 0] }] },
      { degreeRoman: 'ii°', chordName: 'Bm7b5', chordType: 'Meio-Diminuto', notes: ['B', 'D', 'F'], functionPt: 'Subdominante Menor', voicings: [{ name: 'Bm7b5', shapeType: 'jazz', frets: [-1, 2, 3, 2, 3, -1] }] },
      { degreeRoman: 'III', chordName: 'C', chordType: 'Maior', notes: ['C', 'E', 'G'], functionPt: 'Relativa Maior', voicings: [{ name: 'C Aberto', shapeType: 'C', frets: [-1, 3, 2, 0, 1, 0] }] },
      { degreeRoman: 'iv', chordName: 'Dm', chordType: 'Menor', notes: ['D', 'F', 'A'], functionPt: 'Subdominante', voicings: [{ name: 'Dm Aberto', shapeType: 'aberto', frets: [-1, -1, 0, 2, 3, 1] }] },
      { degreeRoman: 'v', chordName: 'Em (ou E7)', chordType: 'Menor', notes: ['E', 'G', 'B'], functionPt: 'Dominante (Use E7 para resolução forte)', voicings: [{ name: 'Em Aberto', shapeType: 'aberto', frets: [0, 2, 2, 0, 0, 0] }, { name: 'E7 (Harmônica)', shapeType: 'aberto', frets: [0, 2, 0, 1, 0, 0] }] },
      { degreeRoman: 'VI', chordName: 'F', chordType: 'Maior', notes: ['F', 'A', 'C'], functionPt: 'Subdominante / Abertura', voicings: [{ name: 'F Pestana 1ª', shapeType: 'E', frets: [1, 3, 3, 2, 1, 1] }] },
      { degreeRoman: 'VII', chordName: 'G', chordType: 'Maior', notes: ['G', 'B', 'D'], functionPt: 'Subtônica / Dominante da Relativa', voicings: [{ name: 'G Aberto', shapeType: 'G', frets: [3, 2, 0, 0, 0, 3] }] },
    ],
  },
  {
    key: 'Em',
    namePt: 'Mi Menor Natural (Em)',
    type: 'menor',
    scaleNotes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    chords: [
      { degreeRoman: 'i', chordName: 'Em', chordType: 'Menor', notes: ['E', 'G', 'B'], functionPt: 'Tônica Menor', voicings: [{ name: 'Em Aberto', shapeType: 'aberto', frets: [0, 2, 2, 0, 0, 0] }] },
      { degreeRoman: 'ii°', chordName: 'F#m7b5', chordType: 'Meio-Diminuto', notes: ['F#', 'A', 'C'], functionPt: 'Subdominante Menor', voicings: [{ name: 'F#m7b5', shapeType: 'jazz', frets: [2, -1, 2, 2, 1, -1] }] },
      { degreeRoman: 'III', chordName: 'G', chordType: 'Maior', notes: ['G', 'B', 'D'], functionPt: 'Relativa Maior', voicings: [{ name: 'G Aberto', shapeType: 'G', frets: [3, 2, 0, 0, 0, 3] }] },
      { degreeRoman: 'iv', chordName: 'Am', chordType: 'Menor', notes: ['A', 'C', 'E'], functionPt: 'Subdominante', voicings: [{ name: 'Am Aberto', shapeType: 'aberto', frets: [-1, 0, 2, 2, 1, 0] }] },
      { degreeRoman: 'v', chordName: 'Bm (ou B7)', chordType: 'Menor', notes: ['B', 'D', 'F#'], functionPt: 'Dominante (Use B7 para resolução)', voicings: [{ name: 'Bm Pestana 2ª', shapeType: 'A', frets: [-1, 2, 4, 4, 3, 2] }, { name: 'B7', shapeType: 'aberto', frets: [-1, 2, 1, 2, 0, 2] }] },
      { degreeRoman: 'VI', chordName: 'C', chordType: 'Maior', notes: ['C', 'E', 'G'], functionPt: 'Subdominante', voicings: [{ name: 'C Aberto', shapeType: 'C', frets: [-1, 3, 2, 0, 1, 0] }] },
      { degreeRoman: 'VII', chordName: 'D', chordType: 'Maior', notes: ['D', 'F#', 'A'], functionPt: 'Subtônica / Dominante de G', voicings: [{ name: 'D Aberto', shapeType: 'D', frets: [-1, -1, 0, 2, 3, 2] }] },
    ],
  },
];

/**
 * Utility: Get note name (EN or PT) given a starting open string note and fret number
 */
export function getNoteAtFret(openNoteEn: string, fretNumber: number): { noteEn: string; notePt: string; semitone: number } {
  const baseSemitone = NOTE_TO_SEMITONE[openNoteEn] || 0;
  const currentSemitone = (baseSemitone + fretNumber) % 12;
  const noteEn = CHROMATIC_EN[currentSemitone];
  const notePt = CHROMATIC_PT[currentSemitone];
  return { noteEn, notePt, semitone: currentSemitone };
}

/**
 * Utility: Get interval from a root note
 */
export function getIntervalFromRoot(rootEn: string, targetEn: string): { semitones: number; namePt: string; short: string; formula: string } {
  const rootSem = NOTE_TO_SEMITONE[rootEn] || 0;
  const targetSem = NOTE_TO_SEMITONE[targetEn] || 0;
  const dist = (targetSem - rootSem + 12) % 12;
  const info = INTERVAL_NAMES_PT[dist] || { name: 'Outro', short: '??', formula: '??' };
  return {
    semitones: dist,
    namePt: info.name,
    short: info.short,
    formula: info.formula,
  };
}

/**
 * Utility: Generate all fretboard notes for a given scale and tuning
 */
export function generateScaleFretboard(
  rootNoteEn: string,
  scale: ScaleDefinition,
  tuningNotes: string[] = ['E', 'B', 'G', 'D', 'A', 'E'], // from 1st string to 6th string
  maxFrets: number = 15
): {
  stringIndex: number;
  fretNumber: number;
  noteEn: string;
  notePt: string;
  intervalShort: string;
  formula: string;
  isRoot: boolean;
  isInScale: boolean;
}[] {
  const rootSemitone = NOTE_TO_SEMITONE[rootNoteEn] || 0;
  const scaleSemitones = new Set(
    scale.intervals.map((interv) => (rootSemitone + interv) % 12)
  );

  const results = [];

  for (let stringIdx = 0; stringIdx < tuningNotes.length; stringIdx++) {
    const openNote = tuningNotes[stringIdx];
    for (let fret = 0; fret <= maxFrets; fret++) {
      const { noteEn, notePt, semitone } = getNoteAtFret(openNote, fret);
      const isInScale = scaleSemitones.has(semitone);
      const isRoot = semitone === rootSemitone;
      const intervalInfo = getIntervalFromRoot(rootNoteEn, noteEn);

      results.push({
        stringIndex: stringIdx,
        fretNumber: fret,
        noteEn,
        notePt,
        intervalShort: intervalInfo.short,
        formula: intervalInfo.formula,
        isRoot,
        isInScale,
      });
    }
  }

  return results;
}
