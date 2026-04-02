import React, { useState, useCallback, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ReferenceLine
} from 'recharts';
import {
  BookOpen, Trophy, ClipboardList, ChevronRight, ChevronDown, Check, X,
  AlertCircle, ArrowRight, RotateCcw, Copy, CheckCircle2, Globe, GraduationCap,
  TreePine, Bug, Leaf, Bird, Fish, Rabbit, Zap, Info, Play, Pause, SkipForward
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════════════════════════ */
const T = {
  welcome: { en: "Welcome to", es: "Bienvenido a" },
  appTitle: { en: "Community Ecology & Species Interactions", es: "Ecología de Comunidades e Interacciones entre Especies" },
  appSubtitle: { en: "AP Biology — Unit 8: Ecology", es: "Biología AP — Unidad 8: Ecología" },
  enterName: { en: "Enter your name to begin", es: "Ingresa tu nombre para comenzar" },
  namePlaceholder: { en: "Your full name", es: "Tu nombre completo" },
  startButton: { en: "Start Learning", es: "Comenzar a aprender" },
  learn: { en: "Learn", es: "Aprender" },
  challenge: { en: "Challenge", es: "Desafío" },
  compileSubmit: { en: "Compile & Submit", es: "Compilar y Enviar" },
  conceptCheck: { en: "Concept Check", es: "Verificación de concepto" },
  checkAnswer: { en: "Check Answer", es: "Verificar respuesta" },
  correct: { en: "Correct!", es: "¡Correcto!" },
  incorrect: { en: "Not quite.", es: "No exactamente." },
  tryAgain: { en: "Try again", es: "Intenta de nuevo" },
  reset: { en: "Reset", es: "Reiniciar" },
  interactiveTitle: { en: "Interactive Activity", es: "Actividad Interactiva" },
  challengeIntro: { en: "Answer each question below using proper AP Biology terminology. Type your response before revealing the model answer.", es: "Responde cada pregunta usando terminología adecuada de Biología AP. Escribe tu respuesta antes de revelar la respuesta modelo." },
  yourAnswer: { en: "Type your answer here...", es: "Escribe tu respuesta aquí..." },
  revealModel: { en: "Reveal Model Answer", es: "Revelar Respuesta Modelo" },
  modelAnswer: { en: "Model Answer", es: "Respuesta Modelo" },
  points: { en: "points", es: "puntos" },
  compileIntro: { en: "Click below to compile all of your Challenge responses alongside the model answers. Then copy to clipboard and paste into your Google Doc for submission.", es: "Haz clic abajo para compilar todas tus respuestas del Desafío junto con las respuestas modelo. Luego copia al portapapeles y pega en tu Google Doc para entregar." },
  compileButton: { en: "Compile Responses", es: "Compilar Respuestas" },
  copyButton: { en: "Copy to Clipboard", es: "Copiar al Portapapeles" },
  copied: { en: "Copied!", es: "¡Copiado!" },
  studentName: { en: "Student Name", es: "Nombre del Estudiante" },
  compiledHeader: { en: "Community Ecology & Species Interactions — Challenge Responses", es: "Ecología de Comunidades — Respuestas del Desafío" },
  question: { en: "Question", es: "Pregunta" },
  myResponse: { en: "My Response", es: "Mi Respuesta" },
  notAnswered: { en: "[No response entered]", es: "[Sin respuesta ingresada]" },
  footerTheme: { en: "AP Biology — Unit 8: Ecology", es: "Biología AP — Unidad 8: Ecología" },
  footerBiozone: { en: "Biozone Activities: 240–242", es: "Actividades Biozone: 240–242" },
  openTextbook: { en: "Open Your Textbook", es: "Abre tu libro de texto" },
  textbookRef: { en: "See Biozone Activities 240–242 for additional examples and exercises.", es: "Consulta las Actividades Biozone 240–242 para ejemplos y ejercicios adicionales." },
  diveDeeper: { en: "Dive Deeper", es: "Profundizar" },
};
const t = (key, lang) => T[key]?.[lang] || T[key]?.en || key;

/* helper: parse **bold** in text */
const RichText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}</>;
};

/* ═══════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function ConceptCheckMCQ({ question, options, correctIndex, explanation, lang }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === correctIndex;
  return (
    <div className="concept-check-box">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="font-bold text-amber-800">{t('conceptCheck', lang)}</span>
      </div>
      <p className="mb-3 font-medium text-gray-800">{question}</p>
      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <button key={i} onClick={() => { if (!revealed) setSelected(i); }}
            className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
              revealed && i === correctIndex ? 'bg-green-100 border-green-400 text-green-800' :
              revealed && i === selected && !isCorrect ? 'bg-red-100 border-red-400 text-red-800' :
              selected === i ? 'bg-brand-100 border-brand-400' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {!revealed && (
        <button onClick={() => { if (selected !== null) setRevealed(true); }}
          disabled={selected === null}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed">
          {t('checkAnswer', lang)}
        </button>
      )}
      {revealed && (
        <div className={`mt-3 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-bold mb-1">{isCorrect ? t('correct', lang) : t('incorrect', lang)}</p>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}

function TextbookReference({ lang }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm">
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <BookOpen className="w-4 h-4" /> {t('openTextbook', lang)}
      </button>
      {open && <p className="mt-2 text-sm text-gray-600 pl-6">{t('textbookRef', lang)}</p>}
    </div>
  );
}

function ChallengeQuestion({ number, questionText, totalPoints, modelAnswerText, responses, setResponses, lang }) {
  const [showModel, setShowModel] = useState(false);
  const key = `q${number}`;
  return (
    <div className="challenge-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-800">{t('question', lang)} {number}</h3>
        <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold">{totalPoints} {t('points', lang)}</span>
      </div>
      <div className="mb-4 text-gray-700 whitespace-pre-line"><RichText text={questionText} /></div>
      <textarea value={responses[key] || ''} onChange={e => setResponses(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={t('yourAnswer', lang)} rows={5}
        className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-y" />
      {!showModel ? (
        <button onClick={() => setShowModel(true)} className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700">
          {t('revealModel', lang)}
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
          <p className="font-bold text-green-800 mb-2">{t('modelAnswer', lang)}</p>
          <div className="text-sm text-gray-700 whitespace-pre-line"><RichText text={modelAnswerText} /></div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE: Species Interaction Classifier
   ═══════════════════════════════════════════════════════════════════ */
const interactionExamples = [
  { id: 1, pair: { en: "Clownfish & Sea Anemone", es: "Pez payaso y Anémona de mar" }, correct: "mutualism", hint: { en: "Both benefit: clownfish gets protection, anemone gets food scraps", es: "Ambos se benefician: el pez payaso obtiene protección, la anémona obtiene restos de comida" } },
  { id: 2, pair: { en: "Remora & Shark", es: "Rémora y Tiburón" }, correct: "commensalism", hint: { en: "Remora benefits from transport/scraps; shark is unaffected", es: "La rémora se beneficia del transporte/restos; el tiburón no se ve afectado" } },
  { id: 3, pair: { en: "Tapeworm & Human", es: "Tenia y Humano" }, correct: "parasitism", hint: { en: "Tapeworm benefits by absorbing nutrients; human is harmed", es: "La tenia se beneficia absorbiendo nutrientes; el humano es perjudicado" } },
  { id: 4, pair: { en: "Wolf & Elk", es: "Lobo y Alce" }, correct: "predation", hint: { en: "Wolf kills and consumes elk for energy", es: "El lobo mata y consume al alce por energía" } },
  { id: 5, pair: { en: "Barnacles competing for rock space", es: "Percebes compitiendo por espacio en roca" }, correct: "competition", hint: { en: "Both species are harmed by reduced access to resources", es: "Ambas especies son perjudicadas por acceso reducido a recursos" } },
  { id: 6, pair: { en: "Mycorrhizal fungi & Plant roots", es: "Hongos micorrícicos y Raíces de planta" }, correct: "mutualism", hint: { en: "Fungi get sugars; plant gets increased mineral absorption", es: "Los hongos obtienen azúcares; la planta obtiene mayor absorción de minerales" } },
  { id: 7, pair: { en: "Cattle Egret & Cattle", es: "Garcilla bueyera y Ganado" }, correct: "commensalism", hint: { en: "Egret eats insects stirred up by cattle; cattle unaffected", es: "La garcilla come insectos que el ganado levanta; el ganado no se ve afectado" } },
  { id: 8, pair: { en: "Lions & Hyenas (over prey)", es: "Leones y Hienas (por presas)" }, correct: "competition", hint: { en: "Both predators compete for the same prey resources", es: "Ambos depredadores compiten por los mismos recursos de presas" } },
];

const interactionTypes = [
  { key: "mutualism", label: { en: "Mutualism (+/+)", es: "Mutualismo (+/+)" }, color: "bg-green-100 border-green-300 text-green-800" },
  { key: "commensalism", label: { en: "Commensalism (+/0)", es: "Comensalismo (+/0)" }, color: "bg-blue-100 border-blue-300 text-blue-800" },
  { key: "parasitism", label: { en: "Parasitism (+/−)", es: "Parasitismo (+/−)" }, color: "bg-purple-100 border-purple-300 text-purple-800" },
  { key: "predation", label: { en: "Predation (+/−)", es: "Depredación (+/−)" }, color: "bg-red-100 border-red-300 text-red-800" },
  { key: "competition", label: { en: "Competition (−/−)", es: "Competencia (−/−)" }, color: "bg-orange-100 border-orange-300 text-orange-800" },
];

function InteractionClassifier({ lang }) {
  const [placements, setPlacements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const unplaced = interactionExamples.filter(ex => !placements[ex.id]);
  const score = Object.entries(placements).filter(([id, type]) => {
    const ex = interactionExamples.find(e => e.id === parseInt(id));
    return ex && ex.correct === type;
  }).length;

  const handlePlace = (exId, type) => {
    setPlacements(prev => ({ ...prev, [exId]: type }));
  };

  return (
    <div className="interactive-box">
      <h4 className="font-bold text-lg text-brand-700 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> {lang === 'es' ? 'Clasificador de Interacciones entre Especies' : 'Species Interaction Classifier'}
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        {lang === 'es' ? 'Clasifica cada par de organismos en el tipo correcto de interacción.' : 'Classify each organism pair into the correct interaction type.'}
      </p>

      {/* Unplaced items */}
      {unplaced.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm mb-2 text-gray-700">{lang === 'es' ? 'Pares por clasificar:' : 'Pairs to classify:'}</p>
          <div className="space-y-2">
            {unplaced.map(ex => (
              <div key={ex.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="font-medium mb-2">{ex.pair[lang]}</p>
                <div className="flex flex-wrap gap-1">
                  {interactionTypes.map(type => (
                    <button key={type.key} onClick={() => handlePlace(ex.id, type.key)}
                      className={`px-2 py-1 rounded text-xs font-semibold border ${type.color} hover:opacity-80 transition`}>
                      {type.label[lang]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placed items grouped by type */}
      {Object.keys(placements).length > 0 && (
        <div className="space-y-3 mb-4">
          {interactionTypes.map(type => {
            const items = interactionExamples.filter(ex => placements[ex.id] === type.key);
            if (items.length === 0) return null;
            return (
              <div key={type.key} className={`border rounded-lg p-3 ${type.color}`}>
                <p className="font-bold text-sm mb-1">{type.label[lang]}</p>
                {items.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between text-sm">
                    <span>{ex.pair[lang]}</span>
                    {showResults && (
                      placements[ex.id] === ex.correct
                        ? <Check className="w-4 h-4 text-green-600" />
                        : <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        {unplaced.length === 0 && !showResults && (
          <button onClick={() => setShowResults(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700">
            {t('checkAnswer', lang)}
          </button>
        )}
        {showResults && (
          <p className="font-bold text-brand-700">{lang === 'es' ? `Puntuación: ${score}/${interactionExamples.length}` : `Score: ${score}/${interactionExamples.length}`}</p>
        )}
        <button onClick={() => { setPlacements({}); setShowResults(false); }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-1">
          <RotateCcw className="w-4 h-4" /> {t('reset', lang)}
        </button>
      </div>

      {showResults && Object.entries(placements).some(([id, type]) => {
        const ex = interactionExamples.find(e => e.id === parseInt(id));
        return ex && ex.correct !== type;
      }) && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-semibold text-amber-800 text-sm mb-2">{lang === 'es' ? 'Correcciones:' : 'Corrections:'}</p>
          {interactionExamples.filter(ex => placements[ex.id] && placements[ex.id] !== ex.correct).map(ex => (
            <p key={ex.id} className="text-sm text-gray-700 mb-1">
              <strong>{ex.pair[lang]}</strong> → {interactionTypes.find(t => t.key === ex.correct)?.label[lang]} — {ex.hint[lang]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE: Predator-Prey Simulator
   ═══════════════════════════════════════════════════════════════════ */
function PredatorPreySimulator({ lang }) {
  const [preyBirthRate, setPreyBirthRate] = useState(0.1);
  const [predationRate, setPredationRate] = useState(0.005);
  const [predatorDeathRate, setPredatorDeathRate] = useState(0.1);
  const [predatorEfficiency, setPredatorEfficiency] = useState(0.001);
  const [generations, setGenerations] = useState(200);

  const data = useMemo(() => {
    const result = [];
    let prey = 100, predator = 20;
    const dt = 0.5;
    for (let i = 0; i <= generations; i++) {
      result.push({ time: i, prey: Math.round(prey), predator: Math.round(predator) });
      const dPrey = (preyBirthRate * prey - predationRate * prey * predator) * dt;
      const dPredator = (predatorEfficiency * prey * predator - predatorDeathRate * predator) * dt;
      prey = Math.max(1, prey + dPrey);
      predator = Math.max(1, predator + dPredator);
      if (prey > 10000) prey = 10000;
      if (predator > 5000) predator = 5000;
    }
    return result;
  }, [preyBirthRate, predationRate, predatorDeathRate, predatorEfficiency, generations]);

  return (
    <div className="interactive-box">
      <h4 className="font-bold text-lg text-brand-700 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> {lang === 'es' ? 'Simulador de Depredador-Presa' : 'Predator-Prey Population Simulator'}
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        {lang === 'es' ? 'Ajusta los parámetros para ver cómo las poblaciones de depredador y presa oscilan a lo largo del tiempo (modelo Lotka-Volterra).' : 'Adjust parameters to see how predator and prey populations oscillate over time (Lotka-Volterra model).'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {lang === 'es' ? 'Tasa de natalidad de presas (α)' : 'Prey birth rate (α)'}: {preyBirthRate.toFixed(2)}
          </label>
          <input type="range" min="0.01" max="0.3" step="0.01" value={preyBirthRate}
            onChange={e => setPreyBirthRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {lang === 'es' ? 'Tasa de depredación (β)' : 'Predation rate (β)'}: {predationRate.toFixed(3)}
          </label>
          <input type="range" min="0.001" max="0.02" step="0.001" value={predationRate}
            onChange={e => setPredationRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {lang === 'es' ? 'Tasa de mortalidad de depredadores (γ)' : 'Predator death rate (γ)'}: {predatorDeathRate.toFixed(2)}
          </label>
          <input type="range" min="0.01" max="0.3" step="0.01" value={predatorDeathRate}
            onChange={e => setPredatorDeathRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {lang === 'es' ? 'Eficiencia del depredador (δ)' : 'Predator efficiency (δ)'}: {predatorEfficiency.toFixed(3)}
          </label>
          <input type="range" min="0.0001" max="0.005" step="0.0001" value={predatorEfficiency}
            onChange={e => setPredatorEfficiency(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data} margin={{ bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: lang === 'es' ? 'Tiempo' : 'Time', position: 'bottom', offset: -5 }} />
          <YAxis label={{ value: lang === 'es' ? 'Población' : 'Population', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line type="monotone" dataKey="prey" stroke="#22c55e" name={lang === 'es' ? 'Presa (Liebre)' : 'Prey (Hare)'} dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="predator" stroke="#ef4444" name={lang === 'es' ? 'Depredador (Lince)' : 'Predator (Lynx)'} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <strong>{lang === 'es' ? 'Observa:' : 'Notice:'}</strong> {lang === 'es'
            ? 'La población de presas (verde) alcanza su pico ANTES que la de depredadores (rojo). Cuando las presas son abundantes, los depredadores se reproducen más. Cuando los depredadores reducen la población de presas, la población de depredadores disminuye después — creando oscilaciones continuas.'
            : 'The prey population (green) peaks BEFORE the predator population (red). When prey are abundant, predators reproduce more. When predators reduce prey numbers, the predator population declines after — creating continuous oscillations.'}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE: Niche Overlap Visualizer
   ═══════════════════════════════════════════════════════════════════ */
function NicheOverlapVisualizer({ lang }) {
  const [species1Center, setSpecies1Center] = useState(40);
  const [species2Center, setSpecies2Center] = useState(60);
  const [species1Width, setSpecies1Width] = useState(25);
  const [species2Width, setSpecies2Width] = useState(25);

  const data = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 100; x++) {
      const y1 = Math.exp(-0.5 * Math.pow((x - species1Center) / (species1Width / 2.5), 2));
      const y2 = Math.exp(-0.5 * Math.pow((x - species2Center) / (species2Width / 2.5), 2));
      points.push({ x, species1: parseFloat(y1.toFixed(3)), species2: parseFloat(y2.toFixed(3)) });
    }
    return points;
  }, [species1Center, species2Center, species1Width, species2Width]);

  const overlap = useMemo(() => {
    let overlapArea = 0, totalArea = 0;
    data.forEach(pt => {
      overlapArea += Math.min(pt.species1, pt.species2);
      totalArea += Math.max(pt.species1, pt.species2);
    });
    return totalArea > 0 ? Math.round((overlapArea / totalArea) * 100) : 0;
  }, [data]);

  const getOutcome = () => {
    if (overlap > 70) return lang === 'es' ? 'Exclusión competitiva probable — una especie probablemente eliminará a la otra' : 'Competitive exclusion likely — one species will likely outcompete the other';
    if (overlap > 30) return lang === 'es' ? 'Se necesita partición de recursos para la coexistencia' : 'Resource partitioning needed for coexistence';
    return lang === 'es' ? 'Nichos suficientemente separados — las especies pueden coexistir' : 'Niches sufficiently separated — species can coexist';
  };

  return (
    <div className="interactive-box">
      <h4 className="font-bold text-lg text-brand-700 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> {lang === 'es' ? 'Visualizador de Superposición de Nichos' : 'Niche Overlap Visualizer'}
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        {lang === 'es' ? 'Ajusta la posición y amplitud de los nichos de dos especies sobre un eje de recursos. Observa cómo la superposición afecta la competencia.'
          : 'Adjust the position and width of two species\' niches along a resource axis. See how overlap affects competition.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-semibold text-blue-700 text-sm mb-2">{lang === 'es' ? 'Especie A (Azul)' : 'Species A (Blue)'}</p>
          <label className="text-xs text-gray-600">{lang === 'es' ? 'Centro del nicho' : 'Niche center'}: {species1Center}</label>
          <input type="range" min="10" max="90" value={species1Center} onChange={e => setSpecies1Center(parseInt(e.target.value))} className="w-full" />
          <label className="text-xs text-gray-600">{lang === 'es' ? 'Amplitud del nicho' : 'Niche breadth'}: {species1Width}</label>
          <input type="range" min="10" max="50" value={species1Width} onChange={e => setSpecies1Width(parseInt(e.target.value))} className="w-full" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-semibold text-red-700 text-sm mb-2">{lang === 'es' ? 'Especie B (Roja)' : 'Species B (Red)'}</p>
          <label className="text-xs text-gray-600">{lang === 'es' ? 'Centro del nicho' : 'Niche center'}: {species2Center}</label>
          <input type="range" min="10" max="90" value={species2Center} onChange={e => setSpecies2Center(parseInt(e.target.value))} className="w-full" />
          <label className="text-xs text-gray-600">{lang === 'es' ? 'Amplitud del nicho' : 'Niche breadth'}: {species2Width}</label>
          <input type="range" min="10" max="50" value={species2Width} onChange={e => setSpecies2Width(parseInt(e.target.value))} className="w-full" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: lang === 'es' ? 'Eje de Recursos' : 'Resource Axis', position: 'bottom' }} />
          <YAxis label={{ value: lang === 'es' ? 'Uso' : 'Usage', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Area type="monotone" dataKey="species1" stroke="#3b82f6" fill="#3b82f680" name={lang === 'es' ? 'Especie A' : 'Species A'} />
          <Area type="monotone" dataKey="species2" stroke="#ef4444" fill="#ef444480" name={lang === 'es' ? 'Especie B' : 'Species B'} />
        </AreaChart>
      </ResponsiveContainer>

      <div className={`mt-3 p-3 rounded-lg border ${overlap > 70 ? 'bg-red-50 border-red-200' : overlap > 30 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
        <p className="font-bold text-sm">{lang === 'es' ? 'Superposición de nichos' : 'Niche Overlap'}: {overlap}%</p>
        <p className="text-sm text-gray-700">{getOutcome()}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE: Succession Timeline Builder
   ═══════════════════════════════════════════════════════════════════ */
const successionStages = [
  {
    name: { en: "Bare Rock / Pioneer Stage", es: "Roca Desnuda / Etapa Pionera" },
    organisms: { en: "Lichens, cyanobacteria, mosses", es: "Líquenes, cianobacterias, musgos" },
    soil: { en: "No soil — organisms break down rock surface", es: "Sin suelo — los organismos descomponen la superficie de roca" },
    biodiversity: 5, years: "0–50",
    emoji: "🪨",
    description: { en: "Pioneer species colonize bare rock. Lichens secrete acids that slowly weather rock into thin soil particles. Mosses trap moisture.", es: "Las especies pioneras colonizan la roca desnuda. Los líquenes secretan ácidos que lentamente erosionan la roca en partículas de suelo delgado. Los musgos atrapan humedad." }
  },
  {
    name: { en: "Herbaceous / Grass Stage", es: "Etapa Herbácea / de Pastos" },
    organisms: { en: "Grasses, wildflowers, insects, small rodents", es: "Pastos, flores silvestres, insectos, pequeños roedores" },
    soil: { en: "Thin soil layer developing", es: "Capa delgada de suelo desarrollándose" },
    biodiversity: 20, years: "50–100",
    emoji: "🌿",
    description: { en: "As pioneer species die and decompose, soil accumulates. Grasses and herbaceous plants can now establish. Animal diversity begins to increase.", es: "A medida que las especies pioneras mueren y se descomponen, el suelo se acumula. Los pastos y plantas herbáceas pueden establecerse. La diversidad animal comienza a aumentar." }
  },
  {
    name: { en: "Shrub Stage", es: "Etapa de Arbustos" },
    organisms: { en: "Shrubs, small trees, birds, reptiles, mammals", es: "Arbustos, árboles pequeños, aves, reptiles, mamíferos" },
    soil: { en: "Deeper soil with organic matter", es: "Suelo más profundo con materia orgánica" },
    biodiversity: 45, years: "100–200",
    emoji: "🌳",
    description: { en: "Deeper soil supports woody shrubs and small trees. Shade-intolerant grasses begin to decline. More habitat complexity supports greater animal diversity.", es: "El suelo más profundo soporta arbustos leñosos y árboles pequeños. Los pastos intolerantes a la sombra comienzan a declinar. Mayor complejidad del hábitat soporta mayor diversidad animal." }
  },
  {
    name: { en: "Young Forest", es: "Bosque Joven" },
    organisms: { en: "Fast-growing trees (aspen, birch), deer, owls, woodpeckers", es: "Árboles de crecimiento rápido (álamo, abedul), ciervos, búhos, pájaros carpinteros" },
    soil: { en: "Rich soil with deep organic layer", es: "Suelo rico con capa orgánica profunda" },
    biodiversity: 70, years: "200–500",
    emoji: "🌲",
    description: { en: "Shade-intolerant pioneer trees establish. These fast-growing species form a canopy but are eventually outcompeted by shade-tolerant species.", es: "Se establecen árboles pioneros intolerantes a la sombra. Estas especies de rápido crecimiento forman un dosel pero eventualmente son superadas por especies tolerantes a la sombra." }
  },
  {
    name: { en: "Climax Community", es: "Comunidad Clímax" },
    organisms: { en: "Mature oaks, maples, complex food webs, high diversity", es: "Robles maduros, arces, redes alimentarias complejas, alta diversidad" },
    soil: { en: "Deep, nutrient-rich, well-developed soil horizons", es: "Suelo profundo, rico en nutrientes, horizontes bien desarrollados" },
    biodiversity: 95, years: "500+",
    emoji: "🏔️",
    description: { en: "The stable end-stage community. Shade-tolerant species dominate. Self-sustaining through nutrient cycling. High biodiversity and complex trophic structure. Remains stable unless disturbed.", es: "La comunidad estable de etapa final. Las especies tolerantes a la sombra dominan. Autosuficiente a través del ciclo de nutrientes. Alta biodiversidad y estructura trófica compleja. Permanece estable a menos que sea perturbada." }
  },
];

function SuccessionTimeline({ lang }) {
  const [activeStage, setActiveStage] = useState(0);
  const stage = successionStages[activeStage];

  return (
    <div className="interactive-box">
      <h4 className="font-bold text-lg text-brand-700 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> {lang === 'es' ? 'Línea de Tiempo de Sucesión' : 'Succession Timeline Builder'}
      </h4>

      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {successionStages.map((s, i) => (
          <button key={i} onClick={() => setActiveStage(i)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              i === activeStage ? 'bg-brand-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50'
            }`}>
            {s.emoji} {i + 1}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="text-center mb-4">
          <span className="text-5xl">{stage.emoji}</span>
          <h5 className="font-bold text-xl text-gray-800 mt-2">{stage.name[lang]}</h5>
          <p className="text-sm text-gray-500">{lang === 'es' ? 'Años' : 'Years'}: {stage.years}</p>
        </div>

        <p className="text-gray-700 mb-4">{stage.description[lang]}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="font-semibold text-green-800 text-sm">{lang === 'es' ? 'Organismos' : 'Organisms'}</p>
            <p className="text-sm text-gray-700">{stage.organisms[lang]}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="font-semibold text-amber-800 text-sm">{lang === 'es' ? 'Desarrollo del suelo' : 'Soil Development'}</p>
            <p className="text-sm text-gray-700">{stage.soil[lang]}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="font-semibold text-blue-800 text-sm">{lang === 'es' ? 'Biodiversidad relativa' : 'Relative Biodiversity'}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
              <div className="bg-brand-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stage.biodiversity}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{stage.biodiversity}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0}
          className="px-3 py-1 bg-gray-200 rounded font-semibold text-sm disabled:opacity-40">←</button>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div className="bg-brand-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((activeStage + 1) / successionStages.length) * 100}%` }}></div>
        </div>
        <button onClick={() => setActiveStage(Math.min(successionStages.length - 1, activeStage + 1))} disabled={activeStage === successionStages.length - 1}
          className="px-3 py-1 bg-gray-200 rounded font-semibold text-sm disabled:opacity-40">→</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE: Trophic Cascade Explorer
   ═══════════════════════════════════════════════════════════════════ */
function TrophicCascadeExplorer({ lang }) {
  const [wolvesPresent, setWolvesPresent] = useState(true);

  const levels = [
    { name: { en: "Wolves (Top Predator)", es: "Lobos (Depredador Tope)" }, emoji: "🐺", withWolves: 100, withoutWolves: 0, color: "#7c3aed" },
    { name: { en: "Elk (Primary Consumer)", es: "Alce (Consumidor Primario)" }, emoji: "🦌", withWolves: 50, withoutWolves: 95, color: "#dc2626" },
    { name: { en: "Willows & Aspens (Producers)", es: "Sauces y Álamos (Productores)" }, emoji: "🌿", withWolves: 85, withoutWolves: 15, color: "#16a34a" },
    { name: { en: "Songbirds (Depend on Vegetation)", es: "Aves Canoras (Dependen de Vegetación)" }, emoji: "🐦", withWolves: 80, withoutWolves: 25, color: "#2563eb" },
    { name: { en: "Beavers (Depend on Willows)", es: "Castores (Dependen de Sauces)" }, emoji: "🦫", withWolves: 75, withoutWolves: 10, color: "#a16207" },
    { name: { en: "Riverbank Stability", es: "Estabilidad de Riberas" }, emoji: "🏞️", withWolves: 90, withoutWolves: 20, color: "#0891b2" },
  ];

  const data = levels.map(l => ({
    name: l.name[lang],
    value: wolvesPresent ? l.withWolves : l.withoutWolves,
    fill: l.color,
  }));

  return (
    <div className="interactive-box">
      <h4 className="font-bold text-lg text-brand-700 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> {lang === 'es' ? 'Explorador de Cascada Trófica — Yellowstone' : 'Trophic Cascade Explorer — Yellowstone'}
      </h4>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <button onClick={() => setWolvesPresent(true)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${wolvesPresent ? 'bg-brand-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50'}`}>
          🐺 {lang === 'es' ? 'Lobos Presentes (después de 1995)' : 'Wolves Present (post-1995)'}
        </button>
        <button onClick={() => setWolvesPresent(false)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${!wolvesPresent ? 'bg-red-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50'}`}>
          ❌ {lang === 'es' ? 'Lobos Removidos (1926–1995)' : 'Wolves Removed (1926–1995)'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} label={{ value: lang === 'es' ? 'Salud Relativa (%)' : 'Relative Health (%)', position: 'bottom' }} />
          <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={`mt-3 p-3 rounded-lg border ${wolvesPresent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <p className="text-sm text-gray-700">
          {wolvesPresent
            ? (lang === 'es'
              ? 'Con lobos presentes: Los alces son controlados, la vegetación ribereña se recupera, los castores regresan, las riberas se estabilizan, la biodiversidad aumenta. Esto es regulación de arriba hacia abajo (top-down).'
              : 'With wolves present: Elk are controlled, riparian vegetation recovers, beavers return, riverbanks stabilize, biodiversity increases. This is top-down regulation.')
            : (lang === 'es'
              ? 'Sin lobos: Las poblaciones de alces explotan, sobrepastoreo de sauces y álamos, los castores pierden su fuente de alimento, las riberas se erosionan, la biodiversidad colapsa. Esto demuestra una cascada trófica.'
              : 'Without wolves: Elk populations explode, willows and aspens are overgrazed, beavers lose food source, riverbanks erode, biodiversity collapses. This demonstrates a trophic cascade.')}
        </p>
      </div>

      <div className="mt-3 text-sm text-brand-600 font-medium">
        <a href="https://yellowstone-ecology-explorer.vercel.app" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline">
          <ArrowRight className="w-4 h-4" /> {t('diveDeeper', lang)}: Yellowstone Ecology Explorer App
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LEARN CONTENT DATA
   ═══════════════════════════════════════════════════════════════════ */
const learnContent = {
  chunk1: {
    title: { en: "Types of Species Interactions", es: "Tipos de Interacciones entre Especies" },
    icon: <Bug className="w-6 h-6 text-brand-600" />,
    content: {
      en: `Every organism in an ecosystem interacts with other species. These interactions shape community structure — determining which species are present, their population sizes, and how energy and nutrients flow through the system. Understanding species interactions is essential for predicting how communities respond to disturbances like habitat loss, invasive species, or climate change.

There are five major types of species interactions, classified by their effect on each species involved (+ = benefits, − = harmed, 0 = unaffected):

**Mutualism (+/+)** — Both species benefit from the interaction. This is not merely coexistence but an active exchange of resources or services. Examples include mycorrhizal fungi providing plants with enhanced mineral absorption in exchange for sugars from photosynthesis, and nitrogen-fixing bacteria (Rhizobium) in legume root nodules providing usable nitrogen to the plant while receiving carbon compounds.

**Commensalism (+/0)** — One species benefits while the other is neither helped nor harmed. The remora fish attaches to sharks and feeds on food scraps — the shark is unaffected. Cattle egrets follow grazing cattle and eat insects disturbed from the grass — the cattle neither benefit nor suffer.

**Parasitism (+/−)** — One species (the parasite) benefits at the expense of the other (the host). The parasite depends on the host for nutrition or habitat. Unlike predation, parasites typically do not kill their host immediately — they benefit from keeping the host alive. Examples include tapeworms, ticks, and mistletoe.

**Predation (+/−)** — One species (the predator) kills and consumes another (the prey). This is a major force in natural selection — it drives the evolution of camouflage, speed, warning coloration, and defensive chemicals. Predation controls prey populations from the "top down" and can prevent any single prey species from monopolizing resources.

**Competition (−/−)** — Both species are negatively affected by the interaction. They compete for the same limited resources (food, space, light, mates). Competition can be **intraspecific** (within the same species) or **interspecific** (between different species). Intense competition leads to either competitive exclusion or resource partitioning.`,
      es: `Cada organismo en un ecosistema interactúa con otras especies. Estas interacciones dan forma a la estructura de la comunidad — determinando qué especies están presentes, sus tamaños poblacionales y cómo fluyen la energía y los nutrientes a través del sistema.

Hay cinco tipos principales de interacciones entre especies, clasificados por su efecto en cada especie involucrada (+ = se beneficia, − = es perjudicada, 0 = no afectada):

**Mutualismo (+/+)** — Ambas especies se benefician de la interacción. Los ejemplos incluyen hongos micorrícicos y bacterias fijadoras de nitrógeno (Rhizobium) en los nódulos radiculares de leguminosas.

**Comensalismo (+/0)** — Una especie se beneficia mientras que la otra no es ayudada ni perjudicada. El pez rémora se adhiere a los tiburones y se alimenta de restos de comida.

**Parasitismo (+/−)** — Una especie (el parásito) se beneficia a expensas de la otra (el huésped). Los ejemplos incluyen tenias, garrapatas y muérdago.

**Depredación (+/−)** — Una especie (el depredador) mata y consume a otra (la presa). La depredación controla las poblaciones de presas desde "arriba hacia abajo".

**Competencia (−/−)** — Ambas especies son afectadas negativamente. Compiten por los mismos recursos limitados. La competencia puede ser **intraespecífica** (dentro de la misma especie) o **interespecífica** (entre especies diferentes).`
    },
    cc: {
      question: { en: "A barnacle (Semibalanus) outcompetes another barnacle (Chthamalus) for space on rocks in the lower intertidal zone. Which interaction type does this represent?", es: "Un percebe (Semibalanus) supera a otro percebe (Chthamalus) por espacio en las rocas en la zona intermareal baja. ¿Qué tipo de interacción representa esto?" },
      options: {
        en: ["Mutualism (+/+)", "Predation (+/−)", "Competition (−/−)", "Commensalism (+/0)"],
        es: ["Mutualismo (+/+)", "Depredación (+/−)", "Competencia (−/−)", "Comensalismo (+/0)"]
      },
      correct: 2,
      explanation: { en: "This is interspecific competition (−/−). Both barnacle species are harmed by reduced access to the same limited resource (rock surface space). Semibalanus can overgrow or crush Chthamalus, restricting it to the upper intertidal zone — a classic example of competitive exclusion.", es: "Esta es competencia interespecífica (−/−). Ambas especies de percebes son perjudicadas por el acceso reducido al mismo recurso limitado." }
    }
  },
  chunk2: {
    title: { en: "Predator-Prey Dynamics", es: "Dinámica Depredador-Presa" },
    icon: <Rabbit className="w-6 h-6 text-brand-600" />,
    content: {
      en: `Predator-prey relationships are one of the most important forces shaping community structure. The populations of predators and their prey are linked in a dynamic cycle — changes in one population directly affect the other.

**The Classic Example: Snowshoe Hare and Canadian Lynx**

One of the best-documented predator-prey cycles comes from nearly 100 years of trapping records by the Hudson's Bay Company in Canada. The snowshoe hare population rises and falls in roughly 10-year cycles, and the Canadian lynx population follows the same pattern — but with a time lag.

**How the cycle works:**
1. When hare numbers are **high**, lynx have abundant food → lynx reproduction increases → lynx population grows
2. As lynx numbers **increase**, more hares are killed → hare population declines
3. When hare numbers **drop**, lynx have less food → lynx reproduction decreases → lynx die of starvation → lynx population declines
4. With **fewer lynx**, hare survival improves → hare population recovers → the cycle begins again

**Key observation:** The prey population peaks BEFORE the predator population. There is always a **time lag** — predators respond to prey abundance, not the other way around.

**The Lotka-Volterra Model** describes this mathematically:
• Prey growth: dN₁/dt = αN₁ − βN₁N₂ (prey grow exponentially but are reduced by predation)
• Predator growth: dN₂/dt = δN₁N₂ − γN₂ (predators grow proportional to prey consumed but die naturally)

Where α = prey birth rate, β = predation rate, γ = predator death rate, δ = predator efficiency.

The model predicts continuous oscillations — neither population ever reaches a stable equilibrium. In reality, environmental variation, refuges for prey, and multiple predator-prey relationships add complexity, but the fundamental oscillation pattern holds true.`,
      es: `Las relaciones depredador-presa son una de las fuerzas más importantes que dan forma a la estructura de la comunidad. Las poblaciones de depredadores y sus presas están vinculadas en un ciclo dinámico.

**El Ejemplo Clásico: Liebre de las Nieves y Lince Canadiense**

La población de liebres sube y baja en ciclos de aproximadamente 10 años, y la población de linces sigue el mismo patrón — pero con un retraso temporal.

**Cómo funciona el ciclo:**
1. Cuando los números de liebres son **altos**, los linces tienen alimento abundante → la población de linces crece
2. A medida que los números de linces **aumentan**, más liebres son cazadas → la población de liebres disminuye
3. Cuando los números de liebres **caen**, los linces tienen menos alimento → la población de linces disminuye
4. Con **menos linces**, la supervivencia de las liebres mejora → el ciclo comienza de nuevo

**Observación clave:** La población de presas alcanza su pico ANTES que la población de depredadores. Siempre hay un **retraso temporal**.

**El Modelo de Lotka-Volterra** describe esto matemáticamente:
• Crecimiento de presas: dN₁/dt = αN₁ − βN₁N₂
• Crecimiento de depredadores: dN₂/dt = δN₁N₂ − γN₂

Donde α = tasa de natalidad de presas, β = tasa de depredación, γ = tasa de mortalidad del depredador, δ = eficiencia del depredador.`
    },
    cc: {
      question: { en: "In a predator-prey cycle, why does the predator population peak AFTER the prey population?", es: "En un ciclo depredador-presa, ¿por qué la población de depredadores alcanza su pico DESPUÉS de la población de presas?" },
      options: {
        en: ["Predators reproduce faster than prey", "Predators need time to find and consume prey before their population can grow", "Prey migrate to new areas first", "Predators evolve new hunting strategies over time"],
        es: ["Los depredadores se reproducen más rápido que las presas", "Los depredadores necesitan tiempo para encontrar y consumir presas antes de que su población pueda crecer", "Las presas migran a nuevas áreas primero", "Los depredadores evolucionan nuevas estrategias de caza con el tiempo"]
      },
      correct: 1,
      explanation: { en: "There is a time lag: predator reproduction depends on having enough food (prey). When prey are abundant, predators eat more, survive longer, and reproduce more — but this takes time. The predator population grows only after a period of high prey availability.", es: "Hay un retraso temporal: la reproducción del depredador depende de tener suficiente alimento (presas). La población de depredadores crece solo después de un período de alta disponibilidad de presas." }
    }
  },
  chunk3: {
    title: { en: "Competition & Niche Partitioning", es: "Competencia y Partición de Nichos" },
    icon: <TreePine className="w-6 h-6 text-brand-600" />,
    content: {
      en: `When two species compete for the same resources, the outcome depends on how similar their ecological niches are.

**The Ecological Niche**

An organism's **ecological niche** is the sum of all the biotic and abiotic resources it uses and the role it plays in its environment — its food sources, activity times, temperature tolerance, nesting sites, interactions with other species, and more. A useful shorthand: if an organism's **habitat** is its "address" (where it lives), then its **niche** is its "job" or "occupation" (what it does there and how it fits into the community).

The **fundamental niche** is the full range of conditions and resources a species COULD use in the absence of competition. The **realized niche** is the portion it ACTUALLY uses when competitors are present — always smaller than the fundamental niche.

**Competitive Exclusion Principle (Gause's Principle)**

In 1934, G.F. Gause grew two species of Paramecium separately and together. When grown together competing for the same food, one species (P. aurelia) always outcompeted the other (P. caudatum), which went extinct. This led to the **competitive exclusion principle**: two species competing for the exact same resources cannot stably coexist — one will always outcompete the other.

**Resource Partitioning**

In nature, species avoid competitive exclusion through **resource partitioning** — dividing up resources so that each species uses a different portion. The classic example is MacArthur's warblers: five warbler species all feed on insects in spruce trees, but each species forages in a different zone of the tree. By specializing in different microhabitats, all five species coexist.

Other examples include:
• Anole lizards on Caribbean islands: different species perch at different heights
• African savanna grazers: zebras eat tall grasses, wildebeest eat medium grasses, gazelles eat short grasses
• Temporal partitioning: some predators hunt at night while similar species hunt during the day

**Character Displacement**

When two competing species live in the same area (sympatry), natural selection favors individuals that differ most from the competitor — their traits diverge over time. For example, Darwin's finches on islands where two species coexist have more different beak sizes than on islands where each species lives alone.`,
      es: `Cuando dos especies compiten por los mismos recursos, el resultado depende de qué tan similares son sus nichos ecológicos.

**El Nicho Ecológico**

El **nicho fundamental** es el rango completo de condiciones y recursos que una especie PODRÍA usar sin competencia. El **nicho realizado** es la porción que REALMENTE usa cuando los competidores están presentes.

**Principio de Exclusión Competitiva (Principio de Gause)**

Dos especies que compiten por exactamente los mismos recursos no pueden coexistir establemente — una siempre superará a la otra.

**Partición de Recursos**

Las especies evitan la exclusión competitiva dividiendo los recursos. El ejemplo clásico son las reinitas de MacArthur: cinco especies buscan alimento en diferentes zonas del mismo árbol.

**Desplazamiento de Caracteres**

Cuando dos especies competidoras viven en la misma área, sus rasgos divergen con el tiempo.`
    },
    cc: {
      question: { en: "Five species of warblers feed on insects in the same spruce trees. How do they avoid competitive exclusion?", es: "Cinco especies de reinitas se alimentan de insectos en los mismos árboles de abeto. ¿Cómo evitan la exclusión competitiva?" },
      options: {
        en: ["They feed at different times of day", "They partition resources by foraging in different zones of the tree", "They are all mutualists with each other", "They are actually the same species"],
        es: ["Se alimentan en diferentes momentos del día", "Particionan los recursos alimentándose en diferentes zonas del árbol", "Son todos mutualistas entre sí", "Son en realidad la misma especie"]
      },
      correct: 1,
      explanation: { en: "MacArthur's warblers demonstrate resource partitioning. Each species forages in a different part of the spruce tree, reducing direct competition. This allows their realized niches to be sufficiently different for coexistence.", es: "Las reinitas de MacArthur demuestran la partición de recursos. Cada especie busca alimento en una parte diferente del árbol." }
    }
  },
  chunk4: {
    title: { en: "Ecological Succession", es: "Sucesión Ecológica" },
    icon: <Leaf className="w-6 h-6 text-brand-600" />,
    content: {
      en: `**Ecological succession** is the process by which the species composition of a community changes over time following a disturbance or the creation of new habitat. It is a directional, predictable process that ultimately leads to a stable **climax community**.

**Primary Succession** occurs on surfaces where no soil exists — bare rock, new volcanic islands, land exposed by retreating glaciers. It begins with **pioneer species** like lichens that secrete acids to weather rock into soil particles. Mosses follow, then grasses, shrubs, and finally trees. Primary succession is extremely slow — reaching a climax community may take hundreds to thousands of years.

**Secondary Succession** occurs after a disturbance that removes vegetation but leaves the soil intact — fire, logging, or agricultural abandonment. Because soil with seeds, roots, fungi, and nutrients is already present, secondary succession is much faster. A disturbed forest can recover in 100–200 years.

**Mt. St. Helens (1980)** provides a real-world example of both types. Where soil survived (secondary succession), recovery was rapid. On lava flows with no soil (primary succession), lichens and mosses are only now beginning to establish after 45+ years.

**Climax Community** — The stable, self-sustaining end-stage dominated by shade-tolerant species that can regenerate under their own canopy. It remains stable unless disrupted by a major disturbance.`,
      es: `La **sucesión ecológica** es el proceso por el cual la composición de especies de una comunidad cambia con el tiempo después de una perturbación.

**Sucesión Primaria** ocurre donde no existe suelo — roca desnuda, nuevas islas volcánicas. Comienza con **especies pioneras** como líquenes. Es extremadamente lenta.

**Sucesión Secundaria** ocurre después de una perturbación que deja el suelo intacto — incendio, tala. Es mucho más rápida porque el suelo ya está presente.

**Comunidad Clímax** — La etapa final estable dominada por especies tolerantes a la sombra.`
    },
    cc: {
      question: { en: "After a forest fire destroys all trees but the soil remains intact, what type of succession occurs, and why is it faster?", es: "Después de un incendio forestal que destruye los árboles pero deja el suelo intacto, ¿qué tipo de sucesión ocurre y por qué es más rápida?" },
      options: {
        en: ["Primary succession — fire enriches the soil", "Secondary succession — soil with seeds and nutrients is already present", "Primary succession — pioneer species grow quickly on burned surfaces", "Secondary succession — fire-adapted species grow faster than pioneers"],
        es: ["Sucesión primaria — el fuego enriquece el suelo", "Sucesión secundaria — el suelo con semillas y nutrientes ya está presente", "Sucesión primaria — las especies pioneras crecen rápido en superficies quemadas", "Sucesión secundaria — las especies adaptadas al fuego crecen más rápido"]
      },
      correct: 1,
      explanation: { en: "This is secondary succession because the soil is already intact. It proceeds faster because the soil already contains seeds, root systems, fungal networks, and nutrients.", es: "Esta es sucesión secundaria porque el suelo ya está intacto. Procede más rápido porque el suelo ya contiene semillas, raíces, redes fúngicas y nutrientes." }
    },
    diveDeeper: {
      url: "https://the-story-of-krakatau-a-case-study.vercel.app/",
      label: { en: "The Story of Krakatau — A Case Study in Ecological Succession", es: "La Historia de Krakatau — Un Caso de Estudio en Sucesión Ecológica" }
    }
  },
  chunk5: {
    title: { en: "Trophic Cascades", es: "Cascadas Tróficas" },
    icon: <Bird className="w-6 h-6 text-brand-600" />,
    content: {
      en: `A **trophic cascade** is a powerful indirect effect that occurs when a predator suppresses its prey, which in turn releases the next lower trophic level from predation pressure. The effects "cascade" down through the food web, often dramatically changing the entire ecosystem.

**Top-Down vs. Bottom-Up Control**

**Top-down control** — Predators regulate the ecosystem from the top. When a top predator is present, it controls herbivore populations, which allows vegetation to flourish. If the top predator is removed, herbivores explode in number and overgraze.

**Bottom-up control** — Nutrient availability and primary production drive the ecosystem from the bottom. More nutrients → more plants → more herbivores → more predators.

Most real ecosystems involve BOTH forces simultaneously.

**The Yellowstone Wolf Reintroduction — A Textbook Trophic Cascade**

Wolves were eliminated from Yellowstone by 1926. Elk surged and overgrazed riparian vegetation. In 1995, 31 wolves were reintroduced. The cascade transformed the ecosystem:

1. **Wolves reduced elk numbers** and changed elk behavior — elk avoided open valleys ("ecology of fear")
2. **Riparian vegetation recovered** — willows and aspens grew back
3. **Songbird populations increased** as nesting habitat returned
4. **Beavers returned** — they had been absent for decades
5. **Beaver dams created pools** supporting fish, amphibians, and insects
6. **Riverbanks stabilized** — root systems held soil, rivers changed course
7. **Scavenger populations benefited** from wolf kills

This demonstrates how a single **keystone species** at the top of the food web can reshape an entire landscape through top-down regulation.`,
      es: `Una **cascada trófica** ocurre cuando un depredador suprime a su presa, lo cual libera al siguiente nivel trófico inferior de la presión.

**Control de arriba hacia abajo (top-down)** — Los depredadores regulan el ecosistema desde arriba.

**Control de abajo hacia arriba (bottom-up)** — Los nutrientes y la producción primaria impulsan el ecosistema desde abajo.

**La Reintroducción de Lobos en Yellowstone**

Los lobos fueron eliminados para 1926. En 1995, 31 lobos fueron reintroducidos. La cascada transformó el ecosistema: los alces disminuyeron, la vegetación se recuperó, los castores regresaron, las riberas se estabilizaron y la biodiversidad aumentó. Esto demuestra el concepto de **especie clave**.`
    },
    cc: {
      question: { en: "When wolves were reintroduced to Yellowstone, elk decreased, willows regrew, and beavers returned. What type of ecological control does this demonstrate?", es: "Cuando los lobos fueron reintroducidos en Yellowstone, los alces disminuyeron, los sauces volvieron a crecer y los castores regresaron. ¿Qué tipo de control ecológico es este?" },
      options: {
        en: ["Bottom-up control — nutrients drove the change", "Top-down control — predators drove the change from the highest trophic level", "Density-dependent regulation", "Competitive exclusion"],
        es: ["Control de abajo hacia arriba — los nutrientes impulsaron el cambio", "Control de arriba hacia abajo — los depredadores impulsaron el cambio", "Regulación dependiente de la densidad", "Exclusión competitiva"]
      },
      correct: 1,
      explanation: { en: "This is top-down control. The wolves (top predators) reduced elk herbivory, which allowed plants to recover, cascading further down to benefit beavers, birds, and river ecosystems.", es: "Este es control de arriba hacia abajo. Los lobos redujeron el herbivorismo de los alces, permitiendo que las plantas se recuperaran." }
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   CHALLENGE QUESTIONS DATA
   ═══════════════════════════════════════════════════════════════════ */
const challengeQuestions = [
  {
    number: 1, totalPoints: 4,
    question: {
      en: `A top predator is removed from a grassland ecosystem. Describe the predicted effects on:

(a) The prey population (1 point)
(b) The prey's food source (1 point)
(c) Competitors of the prey (1 point)
(d) Overall ecosystem stability (1 point)`,
      es: `Un depredador tope es removido de un ecosistema de pradera. Describe los efectos predichos en:

(a) La población de presas (1 punto)
(b) La fuente de alimento de las presas (1 punto)
(c) Los competidores de las presas (1 punto)
(d) La estabilidad general del ecosistema (1 punto)`
    },
    modelAnswer: {
      en: `(a) **Prey population will initially increase** due to reduced predation pressure, leading to exponential or near-exponential growth until other limiting factors take effect. (1 pt)

(b) **The prey's food source (producers/plants) will decline** as the larger prey population increases consumption, potentially leading to overgrazing and habitat degradation. (1 pt)

(c) **Competitors of the prey will decline** because the increased prey population consumes a larger share of shared resources, potentially leading to competitive exclusion. (1 pt)

(d) **Overall ecosystem stability will decrease.** The trophic cascade causes changes across multiple trophic levels. Biodiversity may decline as species are outcompeted or lose food sources. The ecosystem becomes less resilient. This demonstrates why top-down regulation by predators is critical for maintaining community structure. (1 pt)`,
      es: `(a) **La población de presas inicialmente aumentará** debido a la reducción de la presión de depredación. (1 pto)

(b) **La fuente de alimento de las presas disminuirá** a medida que la población más grande aumente el consumo. (1 pto)

(c) **Los competidores de las presas disminuirán** porque la población aumentada consumirá una mayor parte de los recursos compartidos. (1 pto)

(d) **La estabilidad del ecosistema disminuirá.** La cascada trófica causa cambios en múltiples niveles tróficos. La biodiversidad puede disminuir. (1 pto)`
    }
  },
  {
    number: 2, totalPoints: 4,
    question: {
      en: `Explain competitive exclusion and resource partitioning using a specific example.

(a) Define the competitive exclusion principle (1 point)
(b) Describe resource partitioning (1 point)
(c) Provide a specific biological example of resource partitioning with details (1 point)
(d) Explain how resource partitioning relates to fundamental vs. realized niche (1 point)`,
      es: `Explica la exclusión competitiva y la partición de recursos usando un ejemplo específico.

(a) Define el principio de exclusión competitiva (1 punto)
(b) Describe la partición de recursos (1 punto)
(c) Proporciona un ejemplo biológico específico con detalles (1 punto)
(d) Explica cómo la partición de recursos se relaciona con el nicho fundamental vs. realizado (1 punto)`
    },
    modelAnswer: {
      en: `(a) **Competitive exclusion principle** (Gause's Principle): Two species competing for the exact same limiting resources cannot stably coexist — one will always outcompete the other. Demonstrated by Gause using two Paramecium species. (1 pt)

(b) **Resource partitioning** is the division of limited resources among species to reduce interspecific competition. Species evolve to use different portions of the same resource, allowing coexistence. (1 pt)

(c) **MacArthur's warblers**: Five warbler species all feed on insects in spruce trees but each forages in a different zone (crown, middle, base, trunk). This spatial separation allows all five to coexist. (1 pt)

(d) Each warbler has a **fundamental niche** (full range it COULD use without competitors) but competition restricts it to a smaller **realized niche** (zone where it actually forages). Resource partitioning works because each species' realized niche is sufficiently different. (1 pt)`,
      es: `(a) **Principio de exclusión competitiva**: Dos especies que compiten por los mismos recursos no pueden coexistir establemente. (1 pto)

(b) **La partición de recursos** es la división de recursos limitados para reducir la competencia interespecífica. (1 pto)

(c) **Las reinitas de MacArthur**: Cinco especies buscan alimento en diferentes zonas del mismo árbol. (1 pto)

(d) Cada reinita tiene un **nicho fundamental** más amplio pero está restringida a un **nicho realizado** más pequeño por la competencia. (1 pto)`
    }
  },
  {
    number: 3, totalPoints: 4,
    question: {
      en: `Compare and contrast primary and secondary succession.

(a) Define primary succession (1 point)
(b) Define secondary succession (1 point)
(c) Give an example trigger for each type (1 point)
(d) Explain why secondary succession proceeds faster than primary succession (1 point)`,
      es: `Compara y contrasta la sucesión primaria y secundaria.

(a) Define la sucesión primaria (1 punto)
(b) Define la sucesión secundaria (1 punto)
(c) Da un ejemplo de evento desencadenante para cada tipo (1 punto)
(d) Explica por qué la sucesión secundaria procede más rápido (1 punto)`
    },
    modelAnswer: {
      en: `(a) **Primary succession** is the gradual establishment of biological communities where no soil previously existed, beginning with pioneer species colonizing bare rock or lava. (1 pt)

(b) **Secondary succession** is the re-establishment of a community after a disturbance that removes organisms but leaves the soil intact. (1 pt)

(c) **Primary**: Volcanic eruption creating new rock surfaces (Mt. St. Helens lava flows, Surtsey island).
**Secondary**: Forest fire that destroys trees but leaves soil intact, or abandoned agricultural land. (1 pt)

(d) **Secondary succession is faster** because the soil already contains seeds, root systems, fungal networks (mycorrhizae), nutrients, and decomposing organisms. Plants can establish almost immediately. In primary succession, pioneer species must weather bare rock to create soil — a process taking decades to centuries. (1 pt)`,
      es: `(a) **Sucesión primaria**: Establecimiento gradual de comunidades donde no existía suelo. (1 pto)

(b) **Sucesión secundaria**: Restablecimiento después de una perturbación que deja el suelo intacto. (1 pto)

(c) **Primaria**: Erupción volcánica. **Secundaria**: Incendio forestal. (1 pto)

(d) **La sucesión secundaria es más rápida** porque el suelo ya contiene semillas, raíces, hongos y nutrientes. (1 pto)`
    }
  },
  {
    number: 4, totalPoints: 4,
    question: {
      en: `Describe a trophic cascade using the Yellowstone wolf reintroduction.

(a) Define what a trophic cascade is (1 point)
(b) Describe how wolf removal affected elk populations and behavior (1 point)
(c) Explain how changes in elk affected vegetation and other species (1 point)
(d) What does this demonstrate about top-down regulation in ecosystems? (1 point)`,
      es: `Describe una cascada trófica usando la reintroducción de lobos en Yellowstone.

(a) Define qué es una cascada trófica (1 punto)
(b) Describe cómo la remoción de lobos afectó a los alces (1 punto)
(c) Explica cómo los cambios en los alces afectaron la vegetación y otras especies (1 punto)
(d) ¿Qué demuestra esto sobre la regulación top-down? (1 punto)`
    },
    modelAnswer: {
      en: `(a) A **trophic cascade** is an indirect ecological effect where a change at one trophic level causes a chain of effects cascading through multiple levels. Typically, a top predator suppresses herbivores, releasing producers from herbivory pressure. (1 pt)

(b) Without wolves (removed by 1926), **elk populations surged** and **changed behavior** — they lingered in riparian areas, heavily browsing willows, aspens, and cottonwoods year-round instead of moving through quickly. (1 pt)

(c) Overgrazing **devastated riparian vegetation**. Songbirds declined (lost nesting habitat), **beavers disappeared** (no willows for dams), **riverbanks eroded**, and river channels shifted. After wolf reintroduction (1995), vegetation recovered, beavers returned, riverbanks stabilized, and biodiversity increased. (1 pt)

(d) This demonstrates that **top-down regulation** by predators is essential for ecosystem structure. Wolves are a **keystone species** — their impact is disproportionately large relative to their abundance. Predators don't just affect prey directly; they reshape entire landscapes through indirect effects across trophic levels. (1 pt)`,
      es: `(a) Una **cascada trófica** es un efecto ecológico indirecto donde un cambio en un nivel trófico causa una cadena de efectos en múltiples niveles. (1 pto)

(b) Sin lobos, **las poblaciones de alces aumentaron** y cambiaron su comportamiento — permanecían en áreas ribereñas sobrepastoreando. (1 pto)

(c) La vegetación ribereña fue devastada. Los castores desaparecieron, las riberas se erosionaron. Después de reintroducir lobos, todo se recuperó. (1 pto)

(d) Los lobos son una **especie clave** cuyo impacto es desproporcionadamente grande. La **regulación top-down** es esencial para la estructura del ecosistema. (1 pto)`
    }
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [started, setStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('learn');
  const [responses, setResponses] = useState({});
  const [compiled, setCompiled] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleStart = () => { if (studentName.trim()) setStarted(true); };

  const handleCompile = () => {
    const date = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let text = `${t('compiledHeader', lang)}\n`;
    text += `${t('studentName', lang)}: ${studentName}\n`;
    text += `Date: ${date}\n`;
    text += `${'═'.repeat(60)}\n\n`;
    challengeQuestions.forEach(q => {
      text += `${t('question', lang)} ${q.number} (${q.totalPoints} ${t('points', lang)})\n`;
      text += `${q.question[lang]}\n\n`;
      text += `${t('myResponse', lang)}:\n${responses[`q${q.number}`] || t('notAnswered', lang)}\n\n`;
      text += `${t('modelAnswer', lang)}:\n${q.modelAnswer[lang]}\n`;
      text += `${'─'.repeat(60)}\n\n`;
    });
    setCompiled(text);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiled);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch { /* clipboard fallback */ }
  };

  /* ─── LANDING PAGE ──────────────────────────────────────────── */
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-coyote-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <img src="/laughing-coyote-logo.jpg" alt="Laughing Coyote Education" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow-md" />
          <p className="text-gray-500 text-sm mb-1">{t('welcome', lang)}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('appTitle', lang)}</h1>
          <p className="text-brand-600 font-medium mb-6">{t('appSubtitle', lang)}</p>

          <div className="flex justify-center gap-1 mb-6">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-l-full text-sm font-semibold border ${lang === 'en' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}>EN</button>
            <button onClick={() => setLang('es')} className={`px-3 py-1 rounded-r-full text-sm font-semibold border ${lang === 'es' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}>ES</button>
          </div>

          <p className="text-sm text-gray-600 mb-3">{t('enterName', lang)}</p>
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
            placeholder={t('namePlaceholder', lang)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none" />
          <button onClick={handleStart} disabled={!studentName.trim()}
            className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg font-bold text-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            {t('startButton', lang)}
          </button>

          <p className="mt-4 text-xs text-gray-400">Laughing Coyote Education</p>
        </div>
      </div>
    );
  }

  /* ─── MAIN APP ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <img src="/laughing-coyote-logo.jpg" alt="Laughing Coyote Education" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">{t('appTitle', lang)}</h1>
                <p className="text-xs text-gray-500">{studentName}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-l text-xs font-semibold border ${lang === 'en' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-500 border-gray-300'}`}>EN</button>
              <button onClick={() => setLang('es')} className={`px-2 py-1 rounded-r text-xs font-semibold border ${lang === 'es' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-500 border-gray-300'}`}>ES</button>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {[
              { key: 'learn', icon: <BookOpen className="w-4 h-4" />, label: t('learn', lang) },
              { key: 'challenge', icon: <Trophy className="w-4 h-4" />, label: t('challenge', lang) },
              { key: 'compile', icon: <ClipboardList className="w-4 h-4" />, label: t('compileSubmit', lang) },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`nav-tab flex items-center gap-1.5 ${activeTab === tab.key ? 'nav-tab-active' : 'nav-tab-inactive'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'learn' && (
          <div>
            {Object.entries(learnContent).map(([key, chunk], idx) => (
              <div key={key} className="learn-chunk">
                <div className="flex items-center gap-3 mb-4">
                  {chunk.icon}
                  <h2 className="text-xl font-bold text-gray-800">{chunk.title[lang]}</h2>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                  <RichText text={chunk.content[lang]} />
                </div>

                {idx === 0 && <InteractionClassifier lang={lang} />}
                {idx === 1 && <PredatorPreySimulator lang={lang} />}
                {idx === 2 && <NicheOverlapVisualizer lang={lang} />}
                {idx === 3 && <SuccessionTimeline lang={lang} />}
                {idx === 4 && <TrophicCascadeExplorer lang={lang} />}

                <ConceptCheckMCQ
                  question={chunk.cc.question[lang]}
                  options={chunk.cc.options[lang]}
                  correctIndex={chunk.cc.correct}
                  explanation={chunk.cc.explanation[lang]}
                  lang={lang}
                />

                {chunk.diveDeeper && (
                  <div className="mt-3 text-sm text-brand-600 font-medium">
                    <a href={chunk.diveDeeper.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline">
                      <ArrowRight className="w-4 h-4" /> {t('diveDeeper', lang)}: {chunk.diveDeeper.label[lang]}
                    </a>
                  </div>
                )}

                <TextbookReference lang={lang} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenge' && (
          <div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
              <p className="text-brand-700">{t('challengeIntro', lang)}</p>
            </div>
            {challengeQuestions.map(q => (
              <ChallengeQuestion key={q.number} number={q.number}
                questionText={q.question[lang]} totalPoints={q.totalPoints}
                modelAnswerText={q.modelAnswer[lang]} responses={responses}
                setResponses={setResponses} lang={lang} />
            ))}
          </div>
        )}

        {activeTab === 'compile' && (
          <div>
            <div className="learn-chunk">
              <p className="text-gray-700 mb-4">{t('compileIntro', lang)}</p>
              <button onClick={handleCompile}
                className="px-6 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> {t('compileButton', lang)}
              </button>
            </div>
            {compiled && (
              <div className="learn-chunk">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4 max-h-96 overflow-y-auto font-sans">
                  {compiled}
                </pre>
                <button onClick={handleCopy}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition ${
                    copySuccess ? 'bg-green-600 text-white' : 'bg-coyote-500 text-white hover:bg-coyote-600'
                  }`}>
                  {copySuccess ? <><CheckCircle2 className="w-5 h-5" /> {t('copied', lang)}</> : <><Copy className="w-5 h-5" /> {t('copyButton', lang)}</>}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <img src="/laughing-coyote-logo.jpg" alt="Laughing Coyote Education" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm font-medium text-gray-600">Laughing Coyote Education</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('footerTheme', lang)}</p>
            <p className="text-xs text-gray-400">{t('footerBiozone', lang)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
