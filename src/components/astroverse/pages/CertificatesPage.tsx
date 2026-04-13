'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { toast } from 'sonner'
import {
  Award,
  Lock,
  BookOpen,
  Download,
  Play,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronRight,
  GraduationCap,
  Trophy,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface Certificate {
  id: string
  userId: string
  courseName: string
  certificateId: string
  description: string
  createdAt: string
  user: { name: string }
}

interface Course {
  name: string
  emoji: string
  lessons: number
  gradient: string
  color: string
}

// ─── Course Data ─────────────────────────────────────────────
const courses: Course[] = [
  { name: 'Introducción a la Astronomía', emoji: '🌌', lessons: 4, gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: '#00d4ff' },
  { name: 'El Sistema Solar', emoji: '☀️', lessons: 8, gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: '#f59e0b' },
  { name: 'Estrellas y Galaxias', emoji: '✨', lessons: 6, gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#7c3aed' },
  { name: 'Exploración Espacial', emoji: '🚀', lessons: 5, gradient: 'linear-gradient(135deg, #00d4ff, #10b981)', color: '#10b981' },
  { name: 'Telescopios y Observación', emoji: '🔭', lessons: 4, gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)', color: '#ec4899' },
  { name: 'Astrofísica Básica', emoji: '🧪', lessons: 7, gradient: 'linear-gradient(135deg, #10b981, #00d4ff)', color: '#10b981' },
]

// ─── Confetti Particle Component ─────────────────────────────
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#f59e0b', '#00d4ff', '#7c3aed', '#ec4899', '#10b981', '#fbbf24'][i % 6],
    size: Math.random() * 8 + 4,
    angle: (i / 30) * 360,
    distance: Math.random() * 120 + 60,
    duration: Math.random() * 0.6 + 0.6,
    delay: Math.random() * 0.2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance - 30,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Certificate Card Component ──────────────────────────────
function CertificateCard({ cert, userName }: { cert: Certificate; userName: string }) {
  const dateFormatted = new Date(cert.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      variants={staggerItem}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Gold gradient outer border */}
      <div
        className="rounded-2xl p-[2px]"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b, #d97706, #f59e0b)',
          backgroundSize: '200% 200%',
        }}
      >
        {/* Inner card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(5,5,16,0.95) 50%, rgba(245,158,11,0.04) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Decorative inner border */}
          <div
            className="absolute inset-3 rounded-xl pointer-events-none"
            style={{
              border: '1px solid rgba(245,158,11,0.15)',
            }}
          />

          {/* Corner stars */}
          <div className="absolute top-4 left-4 text-amber-500/20 text-lg">★</div>
          <div className="absolute top-4 right-4 text-amber-500/20 text-lg">★</div>
          <div className="absolute bottom-4 left-4 text-amber-500/20 text-lg">★</div>
          <div className="absolute bottom-4 right-4 text-amber-500/20 text-lg">★</div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-amber-400/80 text-xs font-medium tracking-widest uppercase">
                  Certificado de Estudio
                </span>
                <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
              </div>
              <div
                className="w-16 h-[1px] mx-auto"
                style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
              />
            </div>

            {/* Course name */}
            <h3
              className="text-center text-lg font-bold mb-4"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#fbbf24',
              }}
            >
              {cert.courseName}
            </h3>

            {/* Details */}
            <div className="text-center space-y-2 mb-4">
              <p className="text-white/70 text-sm">
                Otorgado a:{' '}
                <span className="text-white font-semibold">{userName}</span>
              </p>
              <p className="text-white/40 text-xs font-mono">{cert.certificateId}</p>
              <p className="text-white/50 text-xs">{dateFormatted}</p>
            </div>

            {/* AstroVerse branding */}
            <div className="text-center mb-4">
              <span
                className="text-xs font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ASTROVERSE
              </span>
            </div>

            {/* Decorative divider */}
            <div
              className="w-full h-[1px] mb-4"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }}
            />

            {/* Download button */}
            <motion.button
              onClick={() =>
                toast.success('PDF generado', {
                  description: `Certificado de "${cert.courseName}" listo para descargar`,
                  style: {
                    background: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                  },
                })
              }
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.15))',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b',
              }}
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export default function CertificatesPage({
  userId,
  isPremium,
  userName,
}: {
  userId: string
  isPremium: boolean
  userName: string
}) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [completingCourse, setCompletingCourse] = useState<string | null>(null)
  const [confettiCourse, setConfettiCourse] = useState<string | null>(null)
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Determine completed course names from certificates
  const completedCourseNames = new Set(certificates.map((c) => c.courseName))

  // ─── Fetch certificates on mount ──────────────────────────
  useEffect(() => {
    if (!userId) return

    const fetchCertificates = async () => {
      try {
        const res = await fetch(`/api/certificates?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setCertificates(Array.isArray(data) ? data : data.certificates || [])
        }
      } catch {
        // Silently fail — certificates will just show as empty
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [userId])

  // Cleanup confetti timer
  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current)
    }
  }, [])

  // ─── Complete course handler ──────────────────────────────
  const handleCompleteCourse = useCallback(
    async (course: Course) => {
      if (completedCourseNames.has(course.name) || completingCourse) return

      setCompletingCourse(course.name)

      try {
        const res = await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            courseName: course.name,
            description: `Completó el curso "${course.name}" (${course.lessons} lecciones)`,
          }),
        })

        if (res.ok) {
          const newCert = await res.json()
          setCertificates((prev) => [...prev, newCert])
          setConfettiCourse(course.name)

          // Clear confetti after animation
          if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current)
          confettiTimerRef.current = setTimeout(() => setConfettiCourse(null), 1500)

          toast.success('🎉 ¡Certificado obtenido!', {
            description: `Felicidades por completar "${course.name}"`,
            style: {
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
            },
            duration: 4000,
          })
        } else {
          toast.error('Error al crear certificado', {
            description: 'Intenta de nuevo más tarde',
            style: {
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
            },
          })
        }
      } catch {
        toast.error('Error de conexión', {
          description: 'Verifica tu conexión e intenta de nuevo',
          style: {
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
          },
        })
      } finally {
        setCompletingCourse(null)
      }
    },
    [userId, completedCourseNames, completingCourse]
  )

  // ─── PRO Gate ─────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          className="relative overflow-hidden rounded-2xl"
          style={cardBase}
        >
          <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899)" />

          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center">
            {/* Lock Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
                border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <Lock className="w-10 h-10" style={{ color: '#f59e0b' }} />
            </motion.div>

            {/* PRO Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b',
              }}
            >
              <Award className="w-3.5 h-3.5" />
              PRO Only
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="text-2xl md:text-3xl font-bold text-white mb-3"
            >
              Certificados de Estudio
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              className="text-white/50 text-sm md:text-base mb-8 max-w-md mx-auto"
            >
              Los certificados están disponibles para miembros PRO. Completa cursos y obtén certificados
              profesionales de AstroVerse.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              className="flex flex-col items-center gap-2 mb-8"
            >
              {[
                { icon: BookOpen, text: '6 cursos de astronomía' },
                { icon: GraduationCap, text: 'Certificados descargables' },
                { icon: Trophy, text: 'Reconocimiento profesional' },
              ].map((feat) => (
                <div key={feat.text} className="flex items-center gap-2 text-white/60 text-sm">
                  <feat.icon className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  {feat.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245,158,11,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                color: 'white',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Hacerse PRO
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── PRO User View ────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* ─── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        className="text-center mb-2"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Award className="w-7 h-7" style={{ color: '#00d4ff' }} />
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
        >
          Certificados de Estudio
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          Obtén certificados al completar cursos en AstroVerse
        </p>
      </motion.div>

      {/* ─── Course Grid ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: '#00d4ff' }} />
          <h2 className="text-lg font-semibold text-white">Cursos Disponibles</h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
            }}
          >
            {courses.length} cursos
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {courses.map((course) => {
            const isCompleted = completedCourseNames.has(course.name)
            const isCompleting = completingCourse === course.name
            const showConfetti = confettiCourse === course.name

            return (
              <motion.div
                key={course.name}
                variants={staggerItem}
                className="relative overflow-hidden rounded-2xl"
                style={cardBase}
              >
                <CardGradientTop color={course.gradient} />

                <div className="relative z-10 p-5">
                  {/* Course header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.emoji}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-white leading-tight">
                          {course.name}
                        </h3>
                        <p className="text-white/40 text-xs mt-0.5">
                          {course.lessons} lecciones
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    {isCompleted ? (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'rgba(16,185,129,0.15)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          color: '#10b981',
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Completado
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/40 text-xs">Progreso</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isCompleted ? '#10b981' : course.color }}
                      >
                        {isCompleted || isCompleting ? '100' : '0'}%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: isCompleted
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : course.gradient,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: isCompleted || isCompleting ? 1 : 0,
                          transition: {
                            duration: isCompleting ? 1.5 : 0,
                            ease: 'easeOut',
                          },
                        }}
                        originX={0}
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="relative">
                    {isCompleted ? (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          toast.success('PDF generado', {
                            description: `Certificado de "${course.name}" listo para descargar`,
                            style: {
                              background: 'rgba(16,185,129,0.15)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              color: '#10b981',
                            },
                          })
                        }
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
                          border: '1px solid rgba(16,185,129,0.3)',
                          color: '#10b981',
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Descargar
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${course.color}20` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCompleteCourse(course)}
                        disabled={isCompleting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                        style={{
                          background: isCompleting
                            ? `${course.color}15`
                            : `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
                          border: `1px solid ${course.color}50`,
                          color: isCompleting ? course.color : 'white',
                        }}
                      >
                        {isCompleting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-t-transparent rounded-full"
                              style={{ borderColor: `${course.color}60`, borderTopColor: 'transparent' }}
                            />
                            Completando...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Completar Curso
                          </>
                        )}
                      </motion.button>
                    )}

                    {/* Confetti burst */}
                    <AnimatePresence>
                      {showConfetti && <ConfettiBurst active />}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ─── My Certificates Section ─────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
          <h2 className="text-lg font-semibold text-white">Mis Certificados</h2>
          {certificates.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: '#f59e0b',
              }}
            >
              {certificates.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: 'rgba(0,212,255,0.3)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : certificates.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} userName={userName} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-8 text-center"
            style={cardBase}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Award className="w-7 h-7 text-white/20" />
            </div>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Aún no tienes certificados. ¡Completa un curso para obtener tu primero!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
