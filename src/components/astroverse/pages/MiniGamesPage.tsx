'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { toast } from 'sonner'
import {
  Gamepad2,
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  Trophy,
  Timer,
  MousePointerClick,
  Sparkles,
  Star,
  CheckCircle2,
  XCircle,
  Brain,
  Shuffle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
type Screen = 'selection' | 'adivina' | 'memoria'

interface PlanetClue {
  name: string
  emoji: string
  clues: string[]
  color: string
}

interface MemoryCard {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

// ─── Planet Data (8 planets with 3 clues each) ───────────────
const planetData: PlanetClue[] = [
  {
    name: 'Mercurio',
    emoji: '☿️',
    clues: [
      'Soy el planeta más cercano al Sol en todo el sistema solar.',
      'No tengo atmósfera y mis temperaturas son extremas: desde -180°C hasta 430°C.',
      'Mis cráteres llevan nombres de artistas famosos como Bach, Beethoven y Mozart. Soy el planeta más pequeño.',
    ],
    color: '#9ca3af',
  },
  {
    name: 'Venus',
    emoji: '♀️',
    clues: [
      'Soy conocido como el "gemelo" de la Tierra por mi tamaño similar.',
      'Roto al revés que los demás planetas: el Sol sale por el oeste en mi superficie.',
      'Tengo la atmósfera más gruesa del sistema solar, llena de CO₂, y soy el planeta más caliente con 465°C.',
    ],
    color: '#f59e0b',
  },
  {
    name: 'Tierra',
    emoji: '🌍',
    clues: [
      'Soy el único lugar conocido en todo el universo que alberga vida.',
      'El 71% de mi superficie está cubierta de agua líquida.',
      'Tengo un campo magnético que protege toda vida de la radiación solar, y solo tengo una luna.',
    ],
    color: '#00d4ff',
  },
  {
    name: 'Marte',
    emoji: '🔴',
    clues: [
      'Se me conoce como el "planeta rojo" por mi color característico.',
      'Tengo dos lunas pequeñas llamadas Fobos y Deimos, y el volcán más grande del sistema solar: el Monte Olimpo.',
      'Soy el objetivo principal de futuras misiones de colonización humana.',
    ],
    color: '#ef4444',
  },
  {
    name: 'Júpiter',
    emoji: '🟠',
    clues: [
      'Soy el planeta más grande del sistema solar, tan grande que cabrían más de 1,300 Tierras dentro de mí.',
      'Tengo una tormenta gigante llamada la "Gran Mancha Roja" que lleva siglos activa.',
      'Soy un gigante gaseoso y tengo más de 95 lunas descubiertas hasta ahora.',
    ],
    color: '#f97316',
  },
  {
    name: 'Saturno',
    emoji: '🪐',
    clues: [
      'Mis anillos son los más famosos y reconocibles de todo el sistema solar.',
      'Si encontraras una bañera lo suficientemente grande, ¡yo flotaría en el agua! Soy el menos denso.',
      'Tengo más de 146 lunas, y una de ellas, Titán, tiene una atmósfera espesa con lagos de metano.',
    ],
    color: '#eab308',
  },
  {
    name: 'Urano',
    emoji: '🔵',
    clues: [
      'Roto "acostado" sobre mi eje, con una inclinación de 98 grados. ¡Parezco rodar por el espacio!',
      'Soy un gigante helado con un hermoso color azul verdoso.',
      'Tengo 27 lunas conocidas, todas nombradas en honor a personajes de obras de Shakespeare y Alexander Pope.',
    ],
    color: '#06b6d4',
  },
  {
    name: 'Neptuno',
    emoji: '🫧',
    clues: [
      'Tengo los vientos más rápidos de todo el sistema solar, ¡superando los 2,000 km/h!',
      'Soy un gigante helado de un intenso color azul profundo, el más lejano del Sol.',
      'Mi luna más grande, Tritón, orbita en dirección contraria y es uno de los lugares más fríos del sistema solar.',
    ],
    color: '#3b82f6',
  },
]

const allPlanets = planetData.map((p) => p.name)

// ─── Memory Game Data ────────────────────────────────────────
const memoryEmojis = ['🌍', '🌙', '⭐', '🚀', '🪐', '☄️', '🛸', '🌌']

// ─── Animation Variants ──────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// ─── Shuffle Helper ──────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Component ───────────────────────────────────────────────
export default function MiniGamesPage() {
  const [screen, setScreen] = useState<Screen>('selection')

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <AnimatePresence mode="wait">
        {screen === 'selection' && (
          <SelectionScreen key="selection" onSelect={(s: Screen) => setScreen(s)} />
        )}
        {screen === 'adivina' && (
          <AdivinaElPlaneta key="adivina" onBack={() => setScreen('selection')} />
        )}
        {screen === 'memoria' && (
          <MemoriaEspacial key="memoria" onBack={() => setScreen('selection')} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Selection Screen ────────────────────────────────────────
function SelectionScreen({ onSelect }: { onSelect: (screen: Screen) => void }) {
  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <Gamepad2 className="w-8 h-8" style={{ color: '#00d4ff' }} />
        </motion.div>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)' }}
        >
          Mini Juegos
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">
          Juegos espaciales divertidos para poner a prueba tu conocimiento
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            emoji: '🪐',
            title: 'Adivina el Planeta',
            desc: 'Descubre el planeta oculto con pistas',
            color: '#7c3aed',
            gradient: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            target: 'adivina' as Screen,
          },
          {
            emoji: '🧩',
            title: 'Memoria Espacial',
            desc: 'Encuentra las parejas de cartas espaciales',
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)',
            target: 'memoria' as Screen,
          },
        ].map((game, i) => (
          <motion.button
            key={game.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1, duration: 0.5, ease: 'easeOut' } }}
            whileHover={{ scale: 1.03, y: -4, boxShadow: `0 0 40px ${game.color}20, 0 12px 40px rgba(0,0,0,0.3)` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(game.target)}
            className="relative overflow-hidden rounded-2xl text-left p-6 md:p-8 cursor-pointer transition-all group w-full"
            style={cardBase}
          >
            <CardGradientTop color={game.gradient} />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${game.color}10 0%, transparent 60%)` }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                className="text-5xl mb-4"
              >
                {game.emoji}
              </motion.div>
              <h2
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: game.color }}
              >
                {game.title}
              </h2>
              <p className="text-white/50 text-sm mb-4">{game.desc}</p>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: `${game.color}15`, border: `1px solid ${game.color}30`, color: game.color }}
              >
                <Sparkles className="w-3 h-3" />
                Jugar ahora
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Helper: generate 4 planet options ────────────────────────
function getOptionsForPlanet(correctPlanet: string): string[] {
  const others = allPlanets.filter((p) => p !== correctPlanet)
  const randomOthers = shuffle(others).slice(0, 3)
  return shuffle([correctPlanet, ...randomOthers])
}

// ─── Game 1: Adivina el Planeta ──────────────────────────────
function AdivinaElPlaneta({ onBack }: { onBack: () => void }) {
  const ROUNDS = 8

  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing')
  const [currentRound, setCurrentRound] = useState(0)
  const [cluesRevealed, setCluesRevealed] = useState(1)
  const [score, setScore] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [shuffledPlanets, setShuffledPlanets] = useState<PlanetClue[]>(() => shuffle(planetData))
  const [options, setOptions] = useState<string[]>(() => getOptionsForPlanet(shuffle(planetData)[0].name))

  const currentPlanet = shuffledPlanets[currentRound]

  // Initialize game (retry button)
  const initGame = useCallback(() => {
    const shuffled = shuffle(planetData)
    setShuffledPlanets(shuffled)
    setOptions(getOptionsForPlanet(shuffled[0].name))
    setCurrentRound(0)
    setCluesRevealed(1)
    setScore(0)
    setHasAnswered(false)
    setSelectedPlanet(null)
    setGameState('playing')
    setRoundScores([])
  }, [])

  // Reveal next clue
  const revealNextClue = () => {
    if (cluesRevealed < 3 && !hasAnswered) {
      setCluesRevealed((prev) => prev + 1)
    }
  }

  // Handle guess
  const handleGuess = (planetName: string) => {
    if (hasAnswered || !currentPlanet) return
    setHasAnswered(true)
    setSelectedPlanet(planetName)

    const isCorrect = planetName === currentPlanet.name
    let pointsEarned = 0

    if (isCorrect) {
      pointsEarned = 4 - cluesRevealed // 3, 2, or 1
      setScore((prev) => prev + pointsEarned)
      toast.success(`¡Correcto! +${pointsEarned} ${pointsEarned === 1 ? 'punto' : 'puntos'} ${currentPlanet.emoji}`, {
        style: { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' },
      })
    } else {
      toast.error(`Era ${currentPlanet.name} ${currentPlanet.emoji}`, {
        style: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' },
      })
    }

    setRoundScores((prev) => [...prev, pointsEarned])

    // Advance after delay
    setTimeout(() => {
      if (currentRound < ROUNDS - 1) {
        const nextPlanet = shuffledPlanets[currentRound + 1]
        setCurrentRound((prev) => prev + 1)
        setCluesRevealed(1)
        setHasAnswered(false)
        setSelectedPlanet(null)
        setOptions(getOptionsForPlanet(nextPlanet.name))
      } else {
        setGameState('ended')
      }
    }, 2000)
  }

  // ─── End Screen ──────────────────────────────────────────
  if (gameState === 'ended') {
    const maxScore = ROUNDS * 3
    const pct = score / maxScore
    let title = 'Explorador Novato'
    let message = '¡El universo es vasto! Sigue estudiando los planetas.'
    let resultColor = '#ec4899'

    if (pct >= 0.9) {
      title = 'Maestro del Sistema Solar'
      message = '¡Increíble! Conoces cada rincón de nuestro vecindario cósmico.'
      resultColor = '#f59e0b'
    } else if (pct >= 0.7) {
      title = 'Científico Espacial'
      message = '¡Gran trabajo! Tienes un amplio conocimiento planetario.'
      resultColor = '#10b981'
    } else if (pct >= 0.5) {
      title = 'Astronauta en Entrenamiento'
      message = 'Buen intento. ¡Cada pista te acerca más al conocimiento!'
      resultColor = '#00d4ff'
    }

    return (
      <motion.div
        key="adivina-end"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
        className="w-full"
      >
        <BackButton onBack={onBack} />

        <div className="relative overflow-hidden rounded-2xl" style={cardBase}>
          <CardGradientTop color={`linear-gradient(90deg, ${resultColor}, #7c3aed)`} />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
              style={{ background: `radial-gradient(circle, ${resultColor}15 0%, transparent 70%)` }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
              style={{
                background: `linear-gradient(135deg, ${resultColor}20, ${resultColor}08)`,
                border: `2px solid ${resultColor}40`,
              }}
            >
              <Trophy className="w-12 h-12" style={{ color: resultColor }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: resultColor }}
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className="text-white/50 text-sm mb-8"
            >
              {message}
            </motion.p>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.6, type: 'spring', stiffness: 200 } }}
              className="inline-flex flex-col items-center gap-1 rounded-xl px-8 py-6 mb-8"
              style={cardBase}
            >
              <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${resultColor}, #7c3aed)` }}>
                {score}
              </span>
              <span className="text-white/40 text-sm">de {maxScore} puntos posibles</span>
            </motion.div>

            {/* Round breakdown */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-8 max-w-lg mx-auto">
              {roundScores.map((pts, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.8 + i * 0.05 } }}
                  className="flex flex-col items-center gap-1 rounded-lg p-2"
                  style={{
                    background: pts > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: pts > 0 ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <span className="text-white/40 text-[10px]">R{i + 1}</span>
                  <span className="font-bold text-sm" style={{ color: pts > 0 ? '#10b981' : '#ef4444' }}>
                    {pts > 0 ? `+${pts}` : '0'}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={initGame}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white' }}
            >
              <RotateCcw className="w-4 h-4" />
              Jugar de Nuevo
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ─── Playing Screen ─────────────────────────────────────
  if (!currentPlanet) return null

  return (
    <motion.div
      key="adivina-play"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
      className="w-full"
    >
      <BackButton onBack={onBack} />

      {/* Top Stats */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm font-medium">
            Ronda {currentRound + 1}
            <span className="text-white/30">/{ROUNDS}</span>
          </span>
          <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (currentRound + 1) / ROUNDS, transition: { duration: 0.4 } }}
              originX={0}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <span className="text-white font-semibold">{score}</span>
          <span className="text-white/30 text-xs">pts</span>
        </div>
      </div>

      {/* Clues Card */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative overflow-hidden rounded-2xl mb-6"
        style={cardBase}
      >
        <CardGradientTop color="linear-gradient(90deg, #7c3aed, #3b82f6)" />

        {/* Hidden planet glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
            style={{ background: `radial-gradient(circle, ${currentPlanet.color}20 0%, transparent 70%)` }}
          />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: '#7c3aed' }} />
              <span className="text-sm font-medium" style={{ color: '#7c3aed' }}>
                ¿Qué planeta soy?
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Lightbulb className="w-3.5 h-3.5" />
              Pista {cluesRevealed}/3
            </div>
          </div>

          {/* Clues */}
          <div className="space-y-3 mb-6">
            {currentPlanet.clues.map((clue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: i < cluesRevealed ? 1 : 0,
                  x: i < cluesRevealed ? 0 : -20,
                  height: i < cluesRevealed ? 'auto' : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `rgba(124,58,237,${0.05 + i * 0.05})`, border: `1px solid rgba(124,58,237,${0.1 + i * 0.1})` }}>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(124,58,237,0.2)', color: '#7c3aed' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/80 leading-relaxed">{clue}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reveal next clue button */}
          {cluesRevealed < 3 && !hasAnswered && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={revealNextClue}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#7c3aed' }}
            >
              <Lightbulb className="w-4 h-4" />
              Siguiente pista
              <span className="text-xs opacity-60">(-1 punto)</span>
            </motion.button>
          )}

          {/* Points indicator */}
          {!hasAnswered && (
            <div className="flex items-center justify-center gap-3 mt-3 text-xs text-white/30">
              <span className={cluesRevealed === 1 ? 'text-amber-400/80 font-medium' : ''}>Pista 1: 3 pts</span>
              <span>•</span>
              <span className={cluesRevealed === 2 ? 'text-amber-400/80 font-medium' : ''}>Pista 2: 2 pts</span>
              <span>•</span>
              <span className={cluesRevealed === 3 ? 'text-amber-400/80 font-medium' : ''}>Pista 3: 1 pt</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Planet Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((planet, index) => {
          const isCorrect = planet === currentPlanet.name
          const isSelected = planet === selectedPlanet

          let bgStyle = { ...cardBase, cursor: hasAnswered ? 'default' : 'pointer', transition: 'all 0.2s ease' }

          if (hasAnswered && isCorrect) {
            bgStyle = { ...cardBase, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.5)' }
          } else if (hasAnswered && isSelected && !isCorrect) {
            bgStyle = { ...cardBase, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)' }
          } else if (hasAnswered) {
            bgStyle = { ...cardBase, opacity: 0.4 }
          }

          return (
            <motion.button
              key={`${currentRound}-${planet}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: index * 0.06, duration: 0.3 } }}
              whileHover={!hasAnswered ? { scale: 1.03, boxShadow: '0 0 20px rgba(124,58,237,0.15)' } : undefined}
              whileTap={!hasAnswered ? { scale: 0.97 } : undefined}
              onClick={() => handleGuess(planet)}
              disabled={hasAnswered}
              className="relative overflow-hidden rounded-xl p-4 text-center group"
              style={bgStyle}
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                {hasAnswered && isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                ) : hasAnswered && isSelected && !isCorrect ? (
                  <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                ) : (
                  <Shuffle className="w-4 h-4 opacity-30" />
                )}
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: hasAnswered && isCorrect
                      ? '#10b981'
                      : hasAnswered && isSelected && !isCorrect
                        ? '#ef4444'
                        : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {planet}
                </span>
              </div>
              {!hasAnswered && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.3)' }} />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Helper: create shuffled memory cards ─────────────────────
function createShuffledCards(): MemoryCard[] {
  const pairs = [...memoryEmojis, ...memoryEmojis]
  const shuffled = shuffle(pairs)
  return shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

// ─── Game 2: Memoria Espacial ───────────────────────────────
function MemoriaEspacial({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>(createShuffledCards)
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing')
  const [timer, setTimer] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize game (retry button)
  const initGame = useCallback(() => {
    setCards(createShuffledCards())
    setFlippedIds([])
    setMoves(0)
    setMatchedPairs(0)
    setTimer(0)
    setGameState('playing')
    setIsChecking(false)
  }, [])

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState])

  // Handle card flip
  const handleFlip = (cardId: number) => {
    if (isChecking) return
    const card = cards.find((c) => c.id === cardId)
    if (!card || card.flipped || card.matched) return
    if (flippedIds.length >= 2) return

    const newFlipped = [...flippedIds, cardId]
    setFlippedIds(newFlipped)
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c)))

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1)
      setIsChecking(true)

      const [firstId, secondId] = newFlipped
      const firstCard = cards.find((c) => c.id === firstId)!
      const secondCard = cards.find((c) => c.id === secondId)!

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true, flipped: true } : c
            )
          )
          setFlippedIds([])
          setIsChecking(false)
          setMatchedPairs((prev) => prev + 1)
          const newPairsCount = matchedPairs + 1
          if (newPairsCount === memoryEmojis.length) {
            setTimeout(() => {
              setGameState('ended')
              toast.success('¡Encontraste todas las parejas! 🎉', {
                style: { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' },
              })
            }, 200)
          }
        }, 400)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
            )
          )
          setFlippedIds([])
          setIsChecking(false)
        }, 800)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getStars = (m: number) => {
    if (m <= 12) return { count: 3, label: '¡Perfecto!', color: '#f59e0b' }
    if (m <= 20) return { count: 2, label: '¡Muy bien!', color: '#00d4ff' }
    return { count: 1, label: '¡Buen intento!', color: '#ec4899' }
  }

  // ─── End Screen ──────────────────────────────────────────
  if (gameState === 'ended') {
    const stars = getStars(moves)
    return (
      <motion.div
        key="memoria-end"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
        className="w-full"
      >
        <BackButton onBack={onBack} />

        <div className="relative overflow-hidden rounded-2xl" style={cardBase}>
          <CardGradientTop color={`linear-gradient(90deg, #ec4899, #f59e0b)`} />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: '#ec4899' }}
            >
              ¡Felicidades!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              className="text-white/50 text-sm mb-6"
            >
              Encontraste todas las parejas espaciales
            </motion.p>

            {/* Stars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, type: 'spring', stiffness: 200 } }}
              className="text-3xl mb-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: i < stars.count ? 1 : 0.2, scale: i < stars.count ? 1 : 0.8, transition: { delay: 0.6 + i * 0.15, type: 'spring', stiffness: 300 } }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
            <p className="text-sm font-medium mb-8" style={{ color: stars.color }}>
              {stars.label}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
              <div className="rounded-xl p-4" style={cardBase}>
                <MousePointerClick className="w-5 h-5 mx-auto mb-2" style={{ color: '#ec4899' }} />
                <div className="text-white font-bold text-xl">{moves}</div>
                <div className="text-white/40 text-xs">Movimientos</div>
              </div>
              <div className="rounded-xl p-4" style={cardBase}>
                <Timer className="w-5 h-5 mx-auto mb-2" style={{ color: '#f59e0b' }} />
                <div className="text-white font-bold text-xl">{formatTime(timer)}</div>
                <div className="text-white/40 text-xs">Tiempo</div>
              </div>
            </div>

            {/* Rating guide */}
            <div className="flex items-center justify-center gap-4 mb-8 text-xs text-white/30">
              <span>⭐⭐⭐ &lt;12 mov</span>
              <span>⭐⭐ &lt;20 mov</span>
              <span>⭐ 20+ mov</span>
            </div>

            <motion.button
              onClick={initGame}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(236,72,153,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', color: 'white' }}
            >
              <RotateCcw className="w-4 h-4" />
              Jugar de Nuevo
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ─── Playing Screen ─────────────────────────────────────
  return (
    <motion.div
      key="memoria-play"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
      className="w-full"
    >
      <BackButton onBack={onBack} />

      {/* Top Stats */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <MousePointerClick className="w-4 h-4" style={{ color: '#ec4899' }} />
          <span className="text-white text-sm font-medium">
            {moves} <span className="text-white/30">movimientos</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <span className="text-white text-sm font-mono tabular-nums">
            {formatTime(timer)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" style={{ color: '#10b981' }} />
          <span className="text-white text-sm font-medium">
            {matchedPairs}/<span className="text-white/30">{memoryEmojis.length}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #ec4899, #f59e0b)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: matchedPairs / memoryEmojis.length, transition: { duration: 0.4 } }}
          originX={0}
        />
      </div>

      {/* Cards Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto"
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            variants={staggerItem}
            whileHover={!card.flipped && !card.matched && !isChecking ? { scale: 1.06 } : undefined}
            whileTap={!card.flipped && !card.matched && !isChecking ? { scale: 0.94 } : undefined}
            onClick={() => handleFlip(card.id)}
            disabled={card.flipped || card.matched || isChecking}
            className="relative aspect-square w-full rounded-xl cursor-pointer"
            style={{
              perspective: '600px',
            }}
          >
            <motion.div
              animate={{
                rotateY: card.flipped || card.matched ? 180 : 0,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Back (face down) */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center transition-all"
                style={{
                  ...cardBase,
                  backfaceVisibility: 'hidden',
                  border: card.matched
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Card Front (face up) */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center"
                style={{
                  ...cardBase,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: card.matched
                    ? 'rgba(16,185,129,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  border: card.matched
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(236,72,153,0.3)',
                }}
              >
                <span className="text-2xl sm:text-3xl">{card.emoji}</span>
              </div>
            </motion.div>

            {/* Matched overlay glow */}
            {card.matched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ─── Shared Back Button ──────────────────────────────────────
function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver
    </motion.button>
  )
}
