'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { toast } from 'sonner'
import {
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Star,
  Clock,
  Flame,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface Mission {
  id: string
  name: string
  emoji: string
  description: string
  xp: number
  progress: number
  completed: boolean
}

interface MissionProgress {
  missionId: string
  progress: number
  completed: boolean
}

// ─── Mission Pool (10 missions) ─────────────────────────────
const ALL_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    emoji: '🧭',
    description: 'Visita 3 páginas diferentes en AstroVerse',
    xp: 50,
  },
  {
    id: 'brain-power',
    name: 'Brain Power',
    emoji: '🧠',
    description: 'Completa 1 quiz espacial',
    xp: 100,
  },
  {
    id: 'star-gazer',
    name: 'Star Gazer',
    emoji: '🔭',
    description: 'Mira 3 imágenes en la Galería NASA',
    xp: 75,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    emoji: '📰',
    description: 'Lee 2 artículos de noticias espaciales',
    xp: 75,
  },
  {
    id: 'social-star',
    name: 'Social Star',
    emoji: '💬',
    description: 'Lee 5 publicaciones de la comunidad',
    xp: 50,
  },
  {
    id: 'simulator-pro',
    name: 'Simulator Pro',
    emoji: '⚡',
    description: 'Usa cualquier simulador espacial',
    xp: 50,
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    emoji: '🌟',
    description: 'Obtén 100% en un quiz',
    xp: 150,
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    emoji: '🔥',
    description: 'Consigue una racha de 5+ respuestas correctas',
    xp: 100,
  },
  {
    id: 'encyclopedia',
    name: 'Encyclopedia',
    emoji: '📚',
    description: 'Visita la Enciclopedia Espacial',
    xp: 50,
  },
  {
    id: 'event-watcher',
    name: 'Event Watcher',
    emoji: '📅',
    description: 'Revisa los eventos espaciales próximos',
    xp: 50,
  },
]

const MAX_DAILY_XP = 500
const MISSIONS_PER_DAY = 5

// ─── Helper: Pick 5 daily missions ──────────────────────────
function getDailyMissions(): Omit<Mission, 'progress' | 'completed'>[] {
  const dayIndex = Math.floor(Date.now() / 86400000) % ALL_MISSIONS.length
  const picked: Omit<Mission, 'progress' | 'completed'>[] = []
  for (let i = 0; i < MISSIONS_PER_DAY; i++) {
    picked.push(ALL_MISSIONS[(dayIndex + i) % ALL_MISSIONS.length])
  }
  return picked
}

// ─── Animation Variants ──────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const floatingXpVariant = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 0, y: -60, scale: 1.3, transition: { duration: 1.2, ease: 'easeOut' } },
  exit: { opacity: 0 },
}

// ─── Component ───────────────────────────────────────────────
export default function DailyMissionsPage({ userId }: { userId: string }) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [displayXp, setDisplayXp] = useState(0)
  const [floatingXp, setFloatingXp] = useState<{ id: number; value: number; x: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const floatingIdRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  // ─── Derived state ────────────────────────────────────────
  const totalXpEarned = missions.reduce((sum, m) => sum + (m.completed ? m.xp : 0), 0)
  const maxAvailableXp = missions.reduce((sum, m) => sum + m.xp, 0)
  const completedCount = missions.filter((m) => m.completed).length
  const allComplete = completedCount === MISSIONS_PER_DAY

  // ─── Animate XP counter ───────────────────────────────────
  useEffect(() => {
    if (displayXp === totalXpEarned) return

    const start = displayXp
    const end = totalXpEarned
    const duration = 600
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplayXp(current)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [totalXpEarned, displayXp])

  // ─── Fetch progress on mount ──────────────────────────────
  useEffect(() => {
    const dailyMissions = getDailyMissions()

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/missions?userId=${userId}`)
        if (res.ok) {
          const data: MissionProgress[] = await res.json()
          const progressMap = new Map(data.map((d) => [d.missionId, d]))
          const merged: Mission[] = dailyMissions.map((m) => ({
            ...m,
            progress: progressMap.get(m.id)?.progress ?? 0,
            completed: progressMap.get(m.id)?.completed ?? false,
          }))
          setMissions(merged)
        } else {
          // API not available, use fresh missions
          setMissions(dailyMissions.map((m) => ({ ...m, progress: 0, completed: false })))
        }
      } catch {
        setMissions(dailyMissions.map((m) => ({ ...m, progress: 0, completed: false })))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  // ─── Complete mission handler ─────────────────────────────
  const completeMission = useCallback(
    async (missionId: string, xp: number, clickX?: number) => {
      // Optimistic update
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, progress: 100, completed: true } : m))
      )

      // Floating XP animation
      if (clickX !== undefined) {
        const id = ++floatingIdRef.current
        setFloatingXp({ id, value: xp, x: clickX })
        setTimeout(() => {
          setFloatingXp((prev) => (prev?.id === id ? null : prev))
        }, 1300)
      }

      // Toast notification
      toast.success(`¡Misión completada! +${xp} XP`, {
        icon: '🎉',
        description: '¡Sigue así, explorador espacial!',
        style: {
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          color: '#f59e0b',
        },
        duration: 3000,
      })

      // Save to API (fire and forget)
      try {
        await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, missionId, progress: 100, completed: true }),
        })
      } catch {
        // Silently fail - progress is saved optimistically in state
      }

      // Check if all complete
      const updatedMissions = missions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m
      )
      const allDone = updatedMissions.filter((m) => m.completed || m.id === missionId).length === MISSIONS_PER_DAY
      if (allDone && !allComplete) {
        setTimeout(() => {
          toast.success('🏆 ¡Todas las misiones diarias completadas!', {
            description: `Has ganado ${maxAvailableXp} XP hoy`,
            style: {
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981',
            },
            duration: 5000,
          })
        }, 800)
      }
    },
    [userId, missions, allComplete, maxAvailableXp]
  )

  // ─── Reset handler ────────────────────────────────────────
  const resetMissions = useCallback(async () => {
    const dailyMissions = getDailyMissions()
    setMissions(dailyMissions.map((m) => ({ ...m, progress: 0, completed: false })))
    setDisplayXp(0)

    try {
      await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reset: true }),
      })
    } catch {
      // Silently fail
    }

    toast.info('Misiones reiniciadas', {
      description: 'Tu progreso de hoy ha sido borrado',
      style: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
      },
    })
  }, [userId])

  // ─── Loading state ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#00d4ff', borderRightColor: '#7c3aed' }}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      {/* Floating XP Animation */}
      <AnimatePresence>
        {floatingXp && (
          <motion.div
            key={floatingXp.id}
            variants={floatingXpVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed pointer-events-none z-50"
            style={{ left: floatingXp.x, top: '50%' }}
          >
            <span className="text-2xl font-bold" style={{ color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.6)' }}>
              +{floatingXp.value} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Header ───────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="text-center mb-8"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Target className="w-8 h-8" style={{ color: '#00d4ff' }} />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent">
          <span style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
            Misiones Diarias
          </span>
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">
          Completa misiones cada día para ganar XP y desbloquear logros
        </p>
      </motion.div>

      {/* ─── XP Progress Bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5 } }}
        className="relative overflow-hidden rounded-2xl mb-8"
        style={cardBase}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed)" />

        <div className="relative z-10 p-6">
          {/* Top row: XP info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider font-medium">XP de Hoy</p>
                <p className="text-white font-bold text-lg">
                  <span style={{ color: '#f59e0b' }}>{displayXp}</span>
                  <span className="text-white/30 text-sm font-normal"> / {maxAvailableXp}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
                <span className="text-white/60">
                  {completedCount}/{MISSIONS_PER_DAY}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4" style={{ color: '#ec4899' }} />
                <span className="text-white/60">Día</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full origin-left relative overflow-hidden"
              style={{
                width: `${maxAvailableXp > 0 ? (totalXpEarned / maxAvailableXp) * 100 : 0}%`,
                background: allComplete
                  ? 'linear-gradient(90deg, #10b981, #00d4ff)'
                  : 'linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed)',
                boxShadow: allComplete
                  ? '0 0 20px rgba(16,185,129,0.4)'
                  : '0 0 20px rgba(245,158,11,0.3)',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 } }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            </motion.div>
          </div>

          {/* All complete message */}
          <AnimatePresence>
            {allComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { delay: 0.3 } }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-sm font-medium" style={{ color: '#10b981' }}>
                  ¡Todas las misiones completadas! 🎉
                </span>
                <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Mission Cards ────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {missions.map((mission) => (
            <motion.div
              key={mission.id}
              variants={staggerItem}
              className="relative overflow-hidden rounded-2xl transition-all duration-300"
              style={{
                ...cardBase,
                ...(mission.completed
                  ? {
                      boxShadow: '0 0 30px rgba(16,185,129,0.12), 0 8px 32px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(16,185,129,0.25)',
                    }
                  : {}),
              }}
            >
              {/* Top gradient accent */}
              <CardGradientTop
                color={
                  mission.completed
                    ? 'linear-gradient(90deg, #10b981, #00d4ff)'
                    : 'linear-gradient(90deg, #00d4ff, #7c3aed)'
                }
              />

              {/* Completed glow background */}
              {mission.completed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.6 } }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.06) 0%, transparent 60%)',
                  }}
                />
              )}

              <div className="relative z-10 p-5 md:p-6">
                {/* Top row: emoji, name, XP badge, status */}
                <div className="flex items-start gap-4 mb-3">
                  {/* Emoji */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: mission.completed
                        ? 'rgba(16,185,129,0.1)'
                        : 'rgba(0,212,255,0.08)',
                      border: mission.completed
                        ? '1px solid rgba(16,185,129,0.2)'
                        : '1px solid rgba(0,212,255,0.12)',
                    }}
                  >
                    {mission.emoji}
                  </div>

                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-bold text-base"
                        style={{ color: mission.completed ? '#10b981' : 'rgba(255,255,255,0.9)' }}
                      >
                        {mission.name}
                      </h3>

                      {/* Status badge */}
                      {mission.completed ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(16,185,129,0.15)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            color: '#10b981',
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Completada
                        </span>
                      ) : (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(0,212,255,0.1)',
                            border: '1px solid rgba(0,212,255,0.25)',
                            color: '#00d4ff',
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          En progreso
                        </motion.span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm mt-0.5">{mission.description}</p>
                  </div>

                  {/* XP Badge */}
                  <div
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.25)',
                    }}
                  >
                    <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span className="font-bold text-sm" style={{ color: '#f59e0b' }}>
                      {mission.xp}
                    </span>
                    <span className="text-white/30 text-xs">XP</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/30 text-xs">Progreso</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: mission.completed ? '#10b981' : 'rgba(255,255,255,0.5)' }}
                    >
                      {mission.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full origin-left"
                      style={{
                        width: `${mission.progress}%`,
                        background: mission.completed
                          ? 'linear-gradient(90deg, #10b981, #00d4ff)'
                          : 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
                    />
                  </div>
                </div>

                {/* Action button */}
                {!mission.completed && (
                  <motion.button
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                      completeMission(mission.id, mission.xp, rect.left + rect.width / 2)
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,212,255,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: '#00d4ff',
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Simular Completar
                  </motion.button>
                )}

                {mission.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.15)',
                      color: '#10b981',
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>+{mission.xp} XP Ganados</span>
                    <Star className="w-3 h-3" style={{ color: '#f59e0b' }} />
                  </motion.div>
                )}
              </div>
            </motion.div>
        ))}
      </motion.div>

      {/* ─── Reset Debug Button ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
        className="mt-8 text-center"
      >
        <button
          onClick={resetMissions}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          <RotateCcw className="w-3 h-3" />
          Reset Misiones
        </button>
      </motion.div>
    </div>
  )
}
