'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import {
  Trophy,
  Flame,
  Crown,
  Star,
  Users,
  TrendingUp,
  Clock,
  Medal,
  Sparkles,
  Rocket,
  Brain,
  Globe2,
  Target,
  Award,
  ChevronUp,
  Zap,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface QuizScore {
  id: string
  userId: string
  score: number
  correctCount: number
  totalQuestions: number
  bestStreak: number
  grade: string
  percentage: number
  createdAt: string
  user: { name: string }
}

// ─── Grade helpers ──────────────────────────────────────────
const gradeConfig: Record<string, { color: string; icon: React.ElementType }> = {
  'Maestro del Universo': { color: '#f59e0b', icon: Sparkles },
  'Científico Espacial': { color: '#10b981', icon: Brain },
  Astronauta: { color: '#00d4ff', icon: Rocket },
  'Explorador Novato': { color: '#ec4899', icon: Globe2 },
}

const getGradeStyle = (grade: string) =>
  gradeConfig[grade] || { color: '#00d4ff', icon: Target }

// ─── Relative time ──────────────────────────────────────────
function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days === 1) return 'Ayer'
  if (days < 30) return `Hace ${days}d`
  return `Hace ${Math.floor(days / 30)}M`
}

// ─── Podium animations ──────────────────────────────────────
const podiumBounce = {
  initial: (rank: number) => ({
    opacity: 0,
    y: 80 + (3 - rank) * 20,
    scale: 0.6,
  }),
  animate: (rank: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: (3 - rank) * 0.2 + 0.3,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  }),
}

const crownFloat = {
  animate: {
    y: [0, -4, 0],
    rotate: [0, 3, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

const listRowHover = {
  whileHover: {
    x: 4,
    transition: { duration: 0.2 },
  },
}

// ─── Loading Skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-3">
        <div className="h-8 w-48 mx-auto rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="h-4 w-72 mx-auto rounded bg-white/[0.04] animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4 h-24 animate-pulse"
            style={{ ...cardBase, background: 'rgba(255,255,255,0.03)' }}
          />
        ))}
      </div>

      {/* Podium skeleton */}
      <div className="flex items-end justify-center gap-4 pt-8">
        {[60, 80, 50].map((h, i) => (
          <div key={i} className="w-28 rounded-t-xl animate-pulse" style={{ height: h, background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 h-16 animate-pulse"
            style={{ ...cardBase, background: 'rgba(255,255,255,0.03)' }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────
export default function LeaderboardPage({ currentUserId }: { currentUserId: string }) {
  const [scores, setScores] = useState<QuizScore[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch scores
  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch('/api/quiz-scores')
        if (res.ok) {
          const data = await res.json()
          setScores(Array.isArray(data) ? data : [])
        }
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchScores()
  }, [])

  // Deduplicate: keep best score per user
  const ranked = useMemo(() => {
    const bestByUser = new Map<string, QuizScore>()
    for (const s of scores) {
      const existing = bestByUser.get(s.userId)
      if (!existing || s.score > existing.score) {
        bestByUser.set(s.userId, s)
      }
    }
    return Array.from(bestByUser.values()).sort((a, b) => b.score - a.score)
  }, [scores])

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  // Stats
  const totalPlayers = ranked.length
  const highestScore = ranked.length > 0 ? ranked[0].score : 0
  const averageScore = ranked.length > 0
    ? Math.round(ranked.reduce((sum, s) => sum + s.score, 0) / ranked.length)
    : 0

  // ─── Empty State ──────────────────────────────────────────
  if (!loading && ranked.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }}
          className="relative overflow-hidden rounded-2xl"
          style={cardBase}
        >
          <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
            />
          </div>
          <div className="relative z-10 p-10 md:p-16 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <Trophy className="w-10 h-10" style={{ color: '#f59e0b' }} />
            </motion.div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b, #00d4ff)' }}
            >
              ¡Sin puntuaciones aún!
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">
              ¡Sé el primero! Completa un quiz para aparecer en el ranking.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return <LoadingSkeleton />
  }

  // ─── Podium config ────────────────────────────────────────
  const podiumConfig = [
    {
      rank: 2,
      label: '2do',
      medal: '🥈',
      accent: '#94a3b8',
      glowColor: 'rgba(148,163,184,0.15)',
      borderColor: 'rgba(148,163,184,0.3)',
      height: 'h-32',
      avatarSize: 'w-14 h-14 text-xl',
      order: 'order-1',
      topOffset: 'pt-4',
    },
    {
      rank: 1,
      label: '1ro',
      medal: '🥇',
      accent: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.15)',
      borderColor: 'rgba(245,158,11,0.4)',
      height: 'h-44',
      avatarSize: 'w-20 h-20 text-3xl',
      order: 'order-2',
      topOffset: 'pt-6',
    },
    {
      rank: 3,
      label: '3ro',
      medal: '🥉',
      accent: '#d97706',
      glowColor: 'rgba(217,119,6,0.12)',
      borderColor: 'rgba(217,119,6,0.3)',
      height: 'h-24',
      avatarSize: 'w-12 h-12 text-lg',
      order: 'order-3',
      topOffset: 'pt-2',
    },
  ]

  const sortedTop3 = [...top3].sort((a, b) => b.score - a.score)

  const isMilestoneRank = (rank: number) => [5, 10, 25, 50, 100].includes(rank)

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <Trophy className="w-7 h-7" style={{ color: '#f59e0b' }} />
          <h1
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b, #00d4ff, #7c3aed)' }}
          >
            Ranking Global
          </h1>
          <Trophy className="w-7 h-7" style={{ color: '#f59e0b' }} />
        </div>
        <p className="text-white/50 text-sm">
          Los mejores exploradores del universo
        </p>
      </motion.div>

      {/* ── Stats Summary ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { icon: Users, label: 'Jugadores', value: totalPlayers, color: '#00d4ff' },
          { icon: Zap, label: 'Mayor score', value: highestScore, color: '#f59e0b' },
          { icon: TrendingUp, label: 'Promedio', value: averageScore, color: '#10b981' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl p-4"
            style={cardBase}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${stat.color}00, ${stat.color}30)`} />
            <div className="relative z-10 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: stat.color }} />
              <div className="text-white font-bold text-xl">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Podium (Top 3) ───────────────────────────────── */}
      {top3.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 px-4 pt-12 pb-4">
            {podiumConfig.map((config) => {
              const user = sortedTop3.find((_, idx) => idx === config.rank - 1)
              if (!user) return null

              const gradeStyle = getGradeStyle(user.grade)
              const GradeIcon = gradeStyle.icon
              const isCurrentUser = user.userId === currentUserId

              return (
                <motion.div
                  key={config.rank}
                  custom={config.rank}
                  variants={podiumBounce}
                  initial="initial"
                  animate="animate"
                  className={`flex flex-col items-center ${config.order} flex-1 max-w-[140px]`}
                >
                  {/* Floating crown for #1 */}
                  {config.rank === 1 && (
                    <motion.div
                      variants={crownFloat}
                      animate="animate"
                      className="mb-2"
                    >
                      <Crown className="w-8 h-8" style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} />
                    </motion.div>
                  )}

                  {config.rank === 2 && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      className="mb-2"
                    >
                      <Medal className="w-6 h-6" style={{ color: '#94a3b8', filter: 'drop-shadow(0 0 6px rgba(148,163,184,0.4))' }} />
                    </motion.div>
                  )}

                  {config.rank === 3 && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      className="mb-2"
                    >
                      <Award className="w-5 h-5" style={{ color: '#d97706', filter: 'drop-shadow(0 0 6px rgba(217,119,6,0.4))' }} />
                    </motion.div>
                  )}

                  {/* Avatar */}
                  <motion.div
                    className={`relative rounded-full flex items-center justify-center font-bold text-white ${config.avatarSize}`}
                    style={{
                      background: `linear-gradient(135deg, ${config.accent}40, ${config.accent}10)`,
                      border: `2px solid ${config.borderColor}`,
                      boxShadow: isCurrentUser
                        ? `0 0 20px rgba(0,212,255,0.4), 0 0 40px ${config.glowColor}`
                        : `0 0 30px ${config.glowColor}`,
                    }}
                  >
                    {user.user.name.charAt(0).toUpperCase()}
                    {isCurrentUser && (
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white' }}
                      >
                        TÚ
                      </div>
                    )}
                  </motion.div>

                  {/* Name */}
                  <p className="text-white text-xs sm:text-sm font-semibold mt-2 truncate max-w-full text-center">
                    {user.user.name}
                  </p>

                  {/* Score */}
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="w-3.5 h-3.5" style={{ color: config.accent }} />
                    <span className="text-white font-bold text-sm">{user.score}</span>
                  </div>

                  {/* Grade badge */}
                  <div
                    className="mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: `${gradeStyle.color}15`,
                      border: `1px solid ${gradeStyle.color}30`,
                      color: gradeStyle.color,
                    }}
                  >
                    <GradeIcon className="w-3 h-3" />
                    {user.grade}
                  </div>

                  {/* Pedestal */}
                  <motion.div
                    className={`${config.height} w-full rounded-t-xl mt-3 flex items-start justify-center ${config.topOffset}`}
                    style={{
                      background: `linear-gradient(180deg, ${config.accent}20 0%, ${config.accent}05 100%)`,
                      border: `1px solid ${config.borderColor}`,
                      borderBottom: 'none',
                    }}
                  >
                    <span className="text-2xl sm:text-3xl font-bold" style={{ color: config.accent }}>
                      {config.medal}
                    </span>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ── Ranked List (4+) ──────────────────────────────── */}
      {rest.length > 0 && (
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 px-2 mb-2"
          >
            <ChevronUp className="w-4 h-4" style={{ color: '#00d4ff' }} />
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
              Ranking completo
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {rest.map((entry, idx) => {
              const rank = idx + 4
              const gradeStyle = getGradeStyle(entry.grade)
              const GradeIcon = gradeStyle.icon
              const isCurrentUser = entry.userId === currentUserId
              const milestone = isMilestoneRank(rank)

              return (
                <motion.div
                  key={entry.userId}
                  variants={staggerItem}
                  {...listRowHover}
                  className="relative overflow-hidden rounded-xl group cursor-default"
                  style={{
                    ...cardBase,
                    ...(isCurrentUser
                      ? { border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.03)' }
                      : {}),
                  }}
                >
                  {/* Gradient top line for current user */}
                  {isCurrentUser && (
                    <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed)" />
                  )}

                  <div className="relative z-10 flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                        milestone ? 'ring-1 ring-white/20' : ''
                      }`}
                      style={{
                        background: milestone
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))'
                          : 'rgba(255,255,255,0.04)',
                        color: milestone ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {milestone ? (
                        <Star className="w-4 h-4" />
                      ) : (
                        `#${rank}`
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${gradeStyle.color}30, ${gradeStyle.color}10)`,
                        border: `1px solid ${gradeStyle.color}30`,
                      }}
                    >
                      {entry.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name + Grade */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold truncate">
                          {entry.user.name}
                        </span>
                        {isCurrentUser && (
                          <span
                            className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white' }}
                          >
                            TÚ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <GradeIcon className="w-3 h-3" style={{ color: gradeStyle.color }} />
                        <span className="text-[11px]" style={{ color: `${gradeStyle.color}cc` }}>
                          {entry.grade}
                        </span>
                      </div>
                    </div>

                    {/* Score + Details */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      {/* Correct count */}
                      <span className="text-white/40 text-xs hidden sm:inline">
                        {entry.correctCount}/{entry.totalQuestions}
                      </span>

                      {/* Streak */}
                      {entry.bestStreak > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Flame className="w-3.5 h-3.5" style={{ color: '#ec4899' }} />
                          <span className="text-white/70 text-xs font-medium">{entry.bestStreak}</span>
                        </div>
                      )}

                      {/* Score */}
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
                        <span className="text-white font-bold text-sm">{entry.score}</span>
                      </div>

                      {/* Time */}
                      <div className="hidden sm:flex items-center gap-1 text-white/30 text-xs">
                        <Clock className="w-3 h-3" />
                        {relativeTime(entry.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: isCurrentUser
                        ? 'inset 0 0 0 1px rgba(0,212,255,0.15)'
                        : 'inset 0 0 0 1px rgba(0,212,255,0.08)',
                    }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}
    </div>
  )
}
