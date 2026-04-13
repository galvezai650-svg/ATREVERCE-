'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { toast } from 'sonner'
import {
  Rocket,
  Star,
  Trophy,
  Zap,
  Clock,
  RotateCcw,
  Brain,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Flame,
  Award,
  Sparkles,
  Globe2,
  Target,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  category: string
}

type QuizState = 'start' | 'playing' | 'results'

// ─── Quiz Data (15+ questions in Spanish) ────────────────────
const quizQuestions: Question[] = [
  {
    id: 1,
    question: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'],
    correctIndex: 1,
    category: 'Planetas',
  },
  {
    id: 2,
    question: '¿Cuántos planetas tiene nuestro sistema solar?',
    options: ['7', '8', '9', '10'],
    correctIndex: 1,
    category: 'Sistema Solar',
  },
  {
    id: 3,
    question: '¿Qué nave espacial de NASA llegó a Plutón en 2015?',
    options: ['Voyager 1', 'Curiosity', 'New Horizons', 'Cassini'],
    correctIndex: 2,
    category: 'NASA',
  },
  {
    id: 4,
    question: '¿Cuál es la estrella más cercana a la Tierra?',
    options: ['Proxima Centauri', 'Sirio', 'El Sol', 'Alpha Centauri A'],
    correctIndex: 2,
    category: 'Estrellas',
  },
  {
    id: 5,
    question: '¿En qué año llegó el primer ser humano a la Luna?',
    options: ['1965', '1967', '1969', '1971'],
    correctIndex: 2,
    category: 'Historia Espacial',
  },
  {
    id: 6,
    question: '¿Cuál es el nombre del rover de NASA en Marte desde 2021?',
    options: ['Opportunity', 'Spirit', 'Perseverance', 'Sojourner'],
    correctIndex: 2,
    category: 'NASA',
  },
  {
    id: 7,
    question: '¿Qué empresa fundó Elon Musk para explorar el espacio?',
    options: ['Blue Origin', 'SpaceX', 'Virgin Galactic', 'Rocket Lab'],
    correctIndex: 1,
    category: 'SpaceX',
  },
  {
    id: 8,
    question: '¿Cuánto tiempo tarda la luz del Sol en llegar a la Tierra aproximadamente?',
    options: ['1 minuto', '8 minutos', '15 minutos', '30 minutos'],
    correctIndex: 1,
    category: 'Sol',
  },
  {
    id: 9,
    question: '¿Cómo se llama la galaxia más cercana a la Vía Láctea?',
    options: ['Galaxia de Andrómeda', 'Galaxia del Triángulo', 'Nube de Magallanes', 'Galaxia Sombrero'],
    correctIndex: 0,
    category: 'Galaxias',
  },
  {
    id: 10,
    question: '¿Cuál es el planeta más caliente del sistema solar?',
    options: ['Mercurio', 'Venus', 'Marte', 'Júpiter'],
    correctIndex: 1,
    category: 'Planetas',
  },
  {
    id: 11,
    question: '¿Qué cohete de SpaceX fue el primero en aterrizar verticalmente?',
    options: ['Falcon Heavy', 'Starship', 'Falcon 9', 'Falcon 1'],
    correctIndex: 2,
    category: 'SpaceX',
  },
  {
    id: 12,
    question: '¿Cuántas lunas tiene Júpiter aproximadamente?',
    options: ['53', '67', '79', '95'],
    correctIndex: 3,
    category: 'Planetas',
  },
  {
    id: 13,
    question: '¿Cuál es el telescopio espacial lanzado por NASA en 2021?',
    options: ['Hubble', 'Spitzer', 'James Webb', 'Kepler'],
    correctIndex: 2,
    category: 'NASA',
  },
  {
    id: 14,
    question: '¿Qué fenómeno ocurre cuando una estrella masiva colapsa?',
    options: ['Nova', 'Supernova', 'Aurora boreal', 'Eclipse'],
    correctIndex: 1,
    category: 'Estrellas',
  },
  {
    id: 15,
    question: '¿Cuál es la velocidad de la luz en km/s aproximadamente?',
    options: ['150,000', '200,000', '300,000', '400,000'],
    correctIndex: 2,
    category: 'Física Espacial',
  },
  {
    id: 16,
    question: '¿En qué año se fundó NASA?',
    options: ['1950', '1958', '1962', '1969'],
    correctIndex: 1,
    category: 'NASA',
  },
  {
    id: 17,
    question: '¿Cuál es el anillo de asteroides entre Marte y Júpiter?',
    options: ['Cinturón de Kuiper', 'Cinturón de asteroides', 'Nube de Oort', ' Disco de acreción'],
    correctIndex: 1,
    category: 'Sistema Solar',
  },
  {
    id: 18,
    question: '¿Qué planeta tiene los anillos más prominentes?',
    options: ['Júpiter', 'Urano', 'Neptuno', 'Saturno'],
    correctIndex: 3,
    category: 'Planetas',
  },
]

// ─── Constants ───────────────────────────────────────────────
const POINTS_PER_CORRECT = 100
const BONUS_STREAK_MULTIPLIER = 50
const TIMER_DURATION = 15
const QUESTION_COUNT = quizQuestions.length

const getGrade = (score: number, total: number) => {
  const pct = score / total
  if (pct >= 0.9) return { label: 'Maestro del Universo', icon: Sparkles, color: '#f59e0b' }
  if (pct >= 0.7) return { label: 'Científico Espacial', icon: Brain, color: '#10b981' }
  if (pct >= 0.5) return { label: 'Astronauta', icon: Rocket, color: '#00d4ff' }
  return { label: 'Explorador Novato', icon: Globe2, color: '#ec4899' }
}

// ─── Animation Variants ──────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

const optionVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
}

const timerBarVariants = {
  animate: (duration: number) => ({
    scaleX: [1, 0],
    transition: { duration, ease: 'linear' },
  }),
}

// ─── Category Icons ──────────────────────────────────────────
const categoryColors: Record<string, string> = {
  Planetas: '#7c3aed',
  'Sistema Solar': '#f59e0b',
  NASA: '#00d4ff',
  Estrellas: '#f59e0b',
  'Historia Espacial': '#ec4899',
  SpaceX: '#10b981',
  Sol: '#f59e0b',
  Galaxias: '#7c3aed',
  'Física Espacial': '#00d4ff',
}

// ─── Component ───────────────────────────────────────────────
export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const question = quizQuestions[currentQuestion]

  // ─── Refs for external system callbacks ──────────────────
  const onTimeExpiredRef = useRef<(() => void) | null>(null)
  const isAnsweredRef = useRef(false)

  // ─── Handlers ────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleAnswer = useCallback((answerIndex: number | null) => {
    if (isAnswered) return
    clearTimer()
    setIsAnswered(true)
    setSelectedAnswer(answerIndex)

    const isCorrect = answerIndex === question.correctIndex

    if (isCorrect) {
      const streakBonus = currentStreak * BONUS_STREAK_MULTIPLIER
      const pointsEarned = POINTS_PER_CORRECT + streakBonus
      setScore((prev) => prev + pointsEarned)
      setCorrectCount((prev) => prev + 1)
      setCurrentStreak((prev) => prev + 1)
      setBestStreak((prev) => Math.max(prev, currentStreak + 1))
      toast.success(`¡Correcto! +${pointsEarned} puntos${streakBonus > 0 ? ` (racha +${streakBonus})` : ''}`, {
        style: { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' },
      })
    } else {
      setCurrentStreak(0)
      if (answerIndex === null) {
        toast.error('⏰ ¡Se acabó el tiempo!', {
          style: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' },
        })
      } else {
        toast.error('Incorrecto 😔', {
          style: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' },
        })
      }
    }

    setAnswers((prev) => [...prev, answerIndex])

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < QUESTION_COUNT - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setTimeLeft(TIMER_DURATION)
        setIsTimerRunning(true)
      } else {
        setQuizState('results')
        setIsTimerRunning(false)
      }
    }, 2000)
  }, [isAnswered, clearTimer, question.correctIndex, currentStreak, currentQuestion])

  const startQuiz = () => {
    setQuizState('playing')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setCurrentStreak(0)
    setBestStreak(0)
    setCorrectCount(0)
    setTimeLeft(TIMER_DURATION)
    setIsTimerRunning(true)
    setAnswers([])
  }

  // ─── Sync refs with effects (not during render) ──────────
  useEffect(() => {
    isAnsweredRef.current = isAnswered
  }, [isAnswered])

  useEffect(() => {
    onTimeExpiredRef.current = () => {
      if (!isAnsweredRef.current && quizState === 'playing') {
        handleAnswer(null)
      }
    }
  }, [quizState, handleAnswer])

  // ─── Timer Effect ────────────────────────────────────────
  useEffect(() => {
    if (isTimerRunning && !isAnswered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            // Schedule auto-submit via ref callback (safe in external system callback)
            setTimeout(() => {
              onTimeExpiredRef.current?.()
            }, 0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return clearTimer
  }, [isTimerRunning, isAnswered, timeLeft, clearTimer])

  // ─── Render Helpers ──────────────────────────────────────
  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return {
        ...cardBase,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }
    }

    if (index === question.correctIndex) {
      return {
        ...cardBase,
        background: 'rgba(16,185,129,0.15)',
        border: '1px solid rgba(16,185,129,0.5)',
      }
    }

    if (index === selectedAnswer && index !== question.correctIndex) {
      return {
        ...cardBase,
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.5)',
      }
    }

    return {
      ...cardBase,
      opacity: 0.5,
    }
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  // ─── Start Screen ────────────────────────────────────────
  if (quizState === 'start') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } }}
            exit={typeof window !== 'undefined' ? { opacity: 0, scale: 0.9, transition: { duration: 0.3 } } : undefined}
            className="relative overflow-hidden rounded-2xl"
            style={cardBase}
          >
            <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)" />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
              />
            </div>

            <div className="relative z-10 p-8 md:p-12 text-center">
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}
              >
                <Brain className="w-10 h-10" style={{ color: '#00d4ff' }} />
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)' }}
              >
                Quiz Espacial
              </motion.h1>
              <motion.p className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto">
                Pon a prueba tus conocimientos sobre el universo, planetas, misiones espaciales y más. ¡{QUESTION_COUNT} preguntas te esperan!
              </motion.p>

              {/* Stats Row */}
              <div className="flex justify-center gap-6 mb-8">
                {[
                  { icon: Target, label: 'Preguntas', value: QUESTION_COUNT, color: '#00d4ff' },
                  { icon: Clock, label: 'Tiempo', value: `${TIMER_DURATION}s`, color: '#f59e0b' },
                  { icon: Flame, label: 'Rachas', value: 'Bonus', color: '#ec4899' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="text-white font-bold text-lg">{stat.value}</span>
                    <span className="text-white/40 text-xs">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Start Button */}
              <motion.button
                onClick={startQuiz}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,212,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  color: 'white',
                }}
              >
                <Rocket className="w-4 h-4" />
                Comenzar Quiz
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // ─── Results Screen ──────────────────────────────────────
  if (quizState === 'results') {
    const grade = getGrade(correctCount, QUESTION_COUNT)
    const GradeIcon = grade.icon
    const pct = Math.round((correctCount / QUESTION_COUNT) * 100)

    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            exit={typeof window !== 'undefined' ? { opacity: 0, y: -20, transition: { duration: 0.3 } } : undefined}
            className="relative overflow-hidden rounded-2xl"
            style={cardBase}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${grade.color}, #7c3aed)`} />

            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
                style={{ background: `radial-gradient(circle, ${grade.color}15 0%, transparent 70%)` }}
              />
            </div>

            <div className="relative z-10 p-8 md:p-12 text-center">
              {/* Grade Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{
                  background: `linear-gradient(135deg, ${grade.color}20, ${grade.color}08)`,
                  border: `2px solid ${grade.color}40`,
                }}
              >
                <GradeIcon className="w-12 h-12" style={{ color: grade.color }} />
              </motion.div>

              {/* Grade Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: grade.color }}
              >
                {grade.label}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="text-white/50 text-sm mb-8"
              >
                {pct >= 90 && '¡Increíble! Dominas el universo como pocos.'}
                {pct >= 70 && pct < 90 && '¡Gran trabajo! Tienes un amplio conocimiento espacial.'}
                {pct >= 50 && pct < 70 && 'Buen intento. Sigue explorando el cosmos.'}
                {pct < 50 && 'El universo es vasto. ¡Sigue aprendiendo!'}
              </motion.p>

              {/* Score Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Puntuación', value: score, icon: Trophy, color: '#f59e0b' },
                  { label: 'Correctas', value: `${correctCount}/${QUESTION_COUNT}`, icon: Target, color: '#10b981' },
                  { label: 'Mejor racha', value: bestStreak, icon: Flame, color: '#ec4899' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200 } }}
                    className="rounded-xl p-4"
                    style={cardBase}
                  >
                    <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
                    <div className="text-white font-bold text-xl mb-1">{item.value}</div>
                    <div className="text-white/40 text-xs">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Score Bar */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1, transition: { delay: 0.9, duration: 0.6 } }}
                className="w-full h-3 rounded-full mb-8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1, transition: { delay: 1.1, duration: 1, ease: 'easeOut' } }}
                  className="h-full rounded-full origin-left"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${grade.color}, #7c3aed)`,
                  }}
                />
              </motion.div>

              {/* Retry Button */}
              <motion.button
                onClick={startQuiz}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,212,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  color: 'white',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Intentar de Nuevo
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // ─── Playing Screen ──────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentQuestion}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
          exit={typeof window !== 'undefined' ? { opacity: 0, x: -40, transition: { duration: 0.3 } } : undefined}
        >
          {/* Top Stats Bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm font-medium">
                {currentQuestion + 1}
                <span className="text-white/30">/{QUESTION_COUNT}</span>
              </span>
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ((currentQuestion + 1) / QUESTION_COUNT), transition: { duration: 0.4 } }}
                  originX={0}
                />
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <span className="text-white font-semibold">{score}</span>
            </div>

            {/* Streak */}
            {currentStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-sm"
              >
                <Flame className="w-4 h-4" style={{ color: '#ec4899' }} />
                <span className="text-white font-semibold">{currentStreak}</span>
              </motion.div>
            )}
          </div>

          {/* Timer Bar */}
          <div className="relative w-full h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full origin-left"
              style={{
                background:
                  timeLeft <= 5
                    ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                    : 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              }}
              animate={
                isAnswered
                  ? { scaleX: 1 }
                  : { scaleX: [1, 0], transition: { duration: timeLeft, ease: 'linear' } }
              }
              initial={{ scaleX: 1 }}
            />
          </div>

          {/* Timer Number */}
          <div className="flex items-center justify-end mb-4 gap-1">
            <Clock className="w-3.5 h-3.5" style={{ color: timeLeft <= 5 ? '#ef4444' : 'rgba(255,255,255,0.3)' }} />
            <span
              className="text-sm font-mono font-bold tabular-nums"
              style={{ color: timeLeft <= 5 ? '#ef4444' : 'rgba(255,255,255,0.4)' }}
            >
              {timeLeft}s
            </span>
          </div>

          {/* Question Card */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="relative overflow-hidden rounded-2xl mb-6"
            style={cardBase}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${categoryColors[question.category] || '#00d4ff'}, #7c3aed)`} />

            <div className="relative z-10 p-6 md:p-8">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                  background: `${categoryColors[question.category] || '#00d4ff'}15`,
                  border: `1px solid ${categoryColors[question.category] || '#00d4ff'}30`,
                  color: categoryColors[question.category] || '#00d4ff',
                }}
              >
                <Star className="w-3 h-3" />
                {question.category}
              </motion.div>

              {/* Question */}
              <motion.h2
                variants={scaleIn}
                initial="initial"
                animate="animate"
                className="text-lg md:text-xl font-bold text-white leading-relaxed"
              >
                {question.question}
              </motion.h2>
            </div>
          </motion.div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctIndex
              const isSelected = index === selectedAnswer
              const showResult = isAnswered

              return (
                <motion.button
                  key={`${currentQuestion}-${index}`}
                  custom={index}
                  variants={optionVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={!isAnswered ? { scale: 1.02, x: 4 } : undefined}
                  whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                  onClick={() => !isAnswered && handleAnswer(index)}
                  disabled={isAnswered}
                  className="w-full relative overflow-hidden rounded-xl text-left flex items-center gap-4 p-4 transition-all group"
                  style={getOptionStyle(index)}
                >
                  {/* Feedback Overlay */}
                  {showResult && isCorrect && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.08)' }}
                    />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.08)' }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-4 w-full">
                    {/* Letter Badge */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                      style={{
                        background: showResult && isCorrect
                          ? 'rgba(16,185,129,0.2)'
                          : showResult && isSelected && !isCorrect
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(255,255,255,0.06)',
                        border: showResult && isCorrect
                          ? '1px solid rgba(16,185,129,0.4)'
                          : showResult && isSelected && !isCorrect
                            ? '1px solid rgba(239,68,68,0.4)'
                            : '1px solid rgba(255,255,255,0.1)',
                        color: showResult && isCorrect
                          ? '#10b981'
                          : showResult && isSelected && !isCorrect
                            ? '#ef4444'
                            : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {showResult && isCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        optionLetters[index]
                      )}
                    </div>

                    {/* Option Text */}
                    <span
                      className="text-sm md:text-base font-medium transition-colors"
                      style={{
                        color: showResult && isCorrect
                          ? '#10b981'
                          : showResult && isSelected && !isCorrect
                            ? '#ef4444'
                            : 'rgba(255,255,255,0.8)',
                      }}
                    >
                      {option}
                    </span>

                    {/* Points indicator */}
                    {!isAnswered && (
                      <Zap className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#f59e0b' }} />
                    )}

                    {showResult && isCorrect && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto text-xs font-semibold"
                        style={{ color: '#10b981' }}
                      >
                        +{POINTS_PER_CORRECT + (currentStreak > 1 ? (currentStreak - 1) * BONUS_STREAK_MULTIPLIER : 0)}
                      </motion.span>
                    )}
                  </div>

                  {/* Hover border glow */}
                  {!isAnswered && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.2)' }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Streak Bonus Indicator */}
          {currentStreak > 1 && !isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm"
            >
              <Flame className="w-4 h-4" style={{ color: '#ec4899' }} />
              <span style={{ color: '#ec4899' }} className="font-medium">
                ¡Racha de {currentStreak}! +{currentStreak * BONUS_STREAK_MULTIPLIER} bonus
              </span>
              <Award className="w-4 h-4" style={{ color: '#f59e0b' }} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
