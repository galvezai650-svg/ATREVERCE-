'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import CertificateTemplate from '../CertificateTemplate'
import { toast } from 'sonner'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import {
  ClipboardCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Award,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Lock,
  Timer,
  AlertCircle,
  RotateCcw,
  X,
  Sparkles,
  Globe,
  MessageCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface ExamResult {
  id: string
  userId: string
  courseName: string
  score: number
  totalQuestions: number
  correctAnswers: number
  grade: string
  verificationCode: string
  passed: boolean
  timeSpent: number
  createdAt: string
  user: { name: string }
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface CourseInfo {
  name: string
  emoji: string
  gradient: string
  color: string
  description: string
}

// ─── Course Data ─────────────────────────────────────────────
const courses: CourseInfo[] = [
  { name: 'Introducción a la Astronomía', emoji: '🌌', gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: '#00d4ff', description: 'Fundamentos de la astronomía moderna y observación del cielo.' },
  { name: 'El Sistema Solar', emoji: '☀️', gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: '#f59e0b', description: 'Exploración completa de nuestro vecindario cósmico.' },
  { name: 'Estrellas y Galaxias', emoji: '✨', gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#7c3aed', description: 'Vida y muerte de estrellas, estructura galáctica.' },
  { name: 'Exploración Espacial', emoji: '🚀', gradient: 'linear-gradient(135deg, #00d4ff, #10b981)', color: '#10b981', description: 'Historia de los viajes espaciales y misiones futuras.' },
  { name: 'Telescopios y Observación', emoji: '🔭', gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)', color: '#ec4899', description: 'Tipos de telescopios y técnicas de observación.' },
  { name: 'Astrofísica Básica', emoji: '🧪', gradient: 'linear-gradient(135deg, #10b981, #00d4ff)', color: '#10b981', description: 'Principios físicos que gobiernan el universo.' },
  { name: 'Exoplanetas y Vida Extraterrestre', emoji: '🌍', gradient: 'linear-gradient(135deg, #3b82f6, #10b981)', color: '#3b82f6', description: 'Búsqueda de planetas y condiciones para la vida.' },
  { name: 'El Universo Profundo', emoji: '🔮', gradient: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: '#7c3aed', description: 'Cosmología moderna: Big Bang, materia oscura, energía oscura.' },
  { name: 'Mecánica Orbital', emoji: '🛰️', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#ef4444', description: 'Órbitas planetarias, leyes de Kepler, satélites.' },
  { name: 'Astronomía de Radio', emoji: '📡', gradient: 'linear-gradient(135deg, #00d4ff, #f59e0b)', color: '#f59e0b', description: 'El universo en frecuencias de radio y microondas.' },
  { name: 'El Clima Espacial', emoji: '⛈️', gradient: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#6366f1', description: 'Actividad solar y su impacto en la Tierra.' },
  { name: 'Colonización del Espacio', emoji: '🏘️', gradient: 'linear-gradient(135deg, #10b981, #f59e0b)', color: '#10b981', description: 'Futuro de la humanidad en el espacio.' },
]

const TIME_LIMIT = 20 * 60 // 20 minutes in seconds
const PASS_THRESHOLD = 70

type View = 'selection' | 'instructions' | 'exam' | 'results'

// ─── Helper: format time ─────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ─── Helper: get grade info ──────────────────────────────────
function getGradeInfo(grade: string) {
  switch (grade) {
    case 'Maestro Cosmico':
      return { emoji: '🏆', color: '#f59e0b', label: 'Maestro Cósmico' }
    case 'Científico Espacial':
      return { emoji: '🔬', color: '#00d4ff', label: 'Científico Espacial' }
    case 'Explorador Astral':
      return { emoji: '🔭', color: '#10b981', label: 'Explorador Astral' }
    default:
      return { emoji: '⭐', color: '#ffffff80', label: 'Aprendiz Estelar' }
  }
}

// ─── Circular Progress Component ─────────────────────────────
function CircularProgress({ score, passed }: { score: number; passed: boolean }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = passed ? '#10b981' : '#ef4444'

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Progress circle */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {score}%
        </motion.span>
        <span className="text-white/40 text-xs mt-1">Puntuación</span>
      </div>
    </div>
  )
}

// ─── Exam Instructions Modal ─────────────────────────────────
function InstructionsModal({ course, onStart, onClose }: { course: CourseInfo; onStart: () => void; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl"
          style={{ ...cardBase, border: '1px solid rgba(0,212,255,0.15)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <CardGradientTop color={course.gradient} />
          <div className="relative z-10 p-6">
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">{course.emoji}</span>
              <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
              <p className="text-white/40 text-sm">Instrucciones del Examen</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: ClipboardCheck, text: '15 preguntas de opción múltiple', color: '#00d4ff' },
                { icon: Timer, text: '20 minutos de tiempo límite', color: '#f59e0b' },
                { icon: Award, text: `Mínimo ${PASS_THRESHOLD}% para aprobar`, color: '#10b981' },
                { icon: AlertCircle, text: 'No se puede pausar ni reiniciar', color: '#ef4444' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <item.icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                  <span className="text-sm text-white/70">{item.text}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
              style={{ background: course.gradient, color: 'white' }}
            >
              <Sparkles className="w-4 h-4" />
              Comenzar Examen
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Payment Prompt Modal ────────────────────────────────────
function PaymentPromptModal({
  course,
  onClose,
}: {
  course: CourseInfo
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-2xl"
          style={{ ...cardBase, border: '1px solid rgba(245,158,11,0.15)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <CardGradientTop color={course.gradient} />
          <div className="relative z-10 p-6 text-center">
            {/* Course emoji + name */}
            <span className="text-4xl block mb-3">{course.emoji}</span>
            <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
            <p className="text-white/40 text-xs mb-5">Examen de Certificación Oficial</p>

            {/* Price card */}
            <div
              className="relative overflow-hidden rounded-xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <Lock className="w-7 h-7" style={{ color: '#f59e0b' }} />
              </motion.div>
              <div className="text-3xl font-bold text-white mb-1">$4.99 <span className="text-sm font-medium text-white/40">USD</span></div>
              <p className="text-white/50 text-xs">Por este examen de certificación</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6 text-left">
              {[
                { icon: ClipboardCheck, text: '15 preguntas de opción múltiple' },
                { icon: Timer, text: '20 minutos de tiempo límite' },
                { icon: Award, text: 'Certificado avalado por NASA DATA' },
                { icon: Globe, text: 'Código de verificación único' },
              ].map((feat) => (
                <div key={feat.text} className="flex items-center gap-2 text-white/50 text-xs">
                  <feat.icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#f59e0b' }} />
                  {feat.text}
                </div>
              ))}
            </div>

            {/* Go to Premium button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClose()
                window.dispatchEvent(new CustomEvent('astroverse:navigate', { detail: 'pro' }))
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white' }}
            >
              <Sparkles className="w-4 h-4" />
              Ir a AstroVerse PRO
            </motion.button>

            {/* WhatsApp contact */}
            <a
              href="https://wa.me/573026812303?text=Hola%2C%20quiero%20pagar%20por%20un%20examen%20de%20certificaci%C3%B3n%20en%20AstroVerse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium mt-2 transition-all hover:bg-white/[0.06]"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
            >
              <MessageCircle className="w-4 h-4" />
              Contactar por WhatsApp
            </a>

            {/* Cancel link */}
            <button
              onClick={onClose}
              className="mt-3 text-white/30 text-xs hover:text-white/50 transition-colors block w-full"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Certificate Modal ───────────────────────────────────────
function ExamCertificateModal({
  exam,
  userName,
  courseInfo,
  onClose,
}: {
  exam: ExamResult
  userName: string
  courseInfo: CourseInfo | undefined
  onClose: () => void
}) {
  const dateFormatted = new Date(exam.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleDownload = async () => {
    const element = document.getElementById(`certificate-${exam.id}`)
    if (!element) return
    try {
      toast.loading('Generando PDF...')
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0a0e27', logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)
      const imgX = (pdfWidth - canvas.width * ratio) / 2
      const imgY = (pdfHeight - canvas.height * ratio) / 2
      pdf.addImage(imgData, 'PNG', imgX, imgY, canvas.width * ratio, canvas.height * ratio)
      pdf.save(`Certificado_Examen_${exam.courseName.replace(/\s+/g, '_')}.pdf`)
      toast.dismiss()
      toast.success('PDF descargado exitosamente')
    } catch {
      toast.dismiss()
      toast.error('Error al generar PDF')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.95)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[1200px]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-12 right-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium z-10"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}
          >
            <X className="w-4 h-4" />
            Cerrar
          </motion.button>

          <div
            className="overflow-auto rounded-xl"
            style={{ maxHeight: '85vh', border: '1px solid rgba(212,165,55,0.3)', boxShadow: '0 0 60px rgba(212,165,55,0.1), 0 25px 50px rgba(0,0,0,0.5)' }}
          >
            <CertificateTemplate
              studentName={userName}
              courseName={exam.courseName}
              courseDescription={courseInfo?.description || 'Examen de certificación aprobado exitosamente'}
              certificateId={exam.verificationCode}
              issueDate={dateFormatted}
              certDbId={exam.id}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '1px solid rgba(245,158,11,0.5)', color: '#ffffff' }}
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ═════════════════════════════════════════════════════════════
// ─── Main Component ──────────────────────────────────────────
// ═════════════════════════════════════════════════════════════
export default function CertificationExamsPage({
  userId,
  isPremium,
  userName,
}: {
  userId: string
  isPremium: boolean
  userName: string
}) {
  // ─── State ──────────────────────────────────────────────────
  const [view, setView] = useState<View>('selection')
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null)
  const [exams, setExams] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Exam state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [examStarted, setExamStarted] = useState(false)

  // Result state
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([])

  // Modal state
  const [showCertificate, setShowCertificate] = useState(false)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Fetch past exams ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    const fetchExams = async () => {
      try {
        const res = await fetch(`/api/certification-exams?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setExams(Array.isArray(data) ? data : [])
        }
      } catch { /* silent */ } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [userId])

  // ─── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted || view !== 'exam') return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          if (timerRef.current) clearInterval(timerRef.current)
          handleExamSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [examStarted, view])

  // ─── Stats ─────────────────────────────────────────────────
  const totalExams = exams.length
  const bestGrade = exams.length > 0 ? exams.reduce((best, e) => {
    const gradeOrder = ['Maestro Cosmico', 'Científico Espacial', 'Explorador Astral', 'Aprendiz Estelar']
    return gradeOrder.indexOf(e.grade) < gradeOrder.indexOf(best.grade) ? e : best
  }, exams[0]) : null
  const averageScore = exams.length > 0 ? Math.round(exams.reduce((sum, e) => sum + e.score, 0) / exams.length) : 0
  const passedExams = exams.filter(e => e.passed).length

  // Get best score per course
  const bestScores = new Map<string, ExamResult>()
  for (const exam of exams) {
    const existing = bestScores.get(exam.courseName)
    if (!existing || exam.score > existing.score) {
      bestScores.set(exam.courseName, exam)
    }
  }

  // ─── Handlers ──────────────────────────────────────────────
  const handleStartExam = useCallback((course: CourseInfo) => {
    setSelectedCourse(course)
    if (isPremium) {
      // PRO users go directly to the exam, no payment needed
      handleBeginExamDirect(course)
    } else {
      // Free users see the paywall
      setShowPaymentPrompt(true)
    }
  }, [isPremium])

  // Direct exam start for PRO users (no payment wall)
  const handleBeginExamDirect = useCallback((course: CourseInfo) => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/certification-exams?getQuestions=${encodeURIComponent(course.name)}`)
        if (res.ok) {
          const data = await res.json()
          const q: Question[] = data.questions || []
          if (q.length > 0) {
            setQuestions(q)
            setCurrentQuestion(0)
            setAnswers({})
            setTimeLeft(TIME_LIMIT)
            setExamStarted(true)
            setView('exam')
            toast.success('¡Examen iniciado! Incluido en tu plan PRO 🚀')
            return
          }
        }
      } catch { /* silent */ }
      toast.error('No se pudieron cargar las preguntas')
      setView('selection')
    }
    fetchQuestions()
  }, [])

  const handleBeginExam = useCallback(() => {
    // We need questions to start - fetch from a dedicated endpoint
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/certification-exams?getQuestions=${encodeURIComponent(selectedCourse!.name)}`)
        if (res.ok) {
          const data = await res.json()
          const q: Question[] = data.questions || []
          if (q.length > 0) {
            setQuestions(q)
            setCurrentQuestion(0)
            setAnswers({})
            setTimeLeft(TIME_LIMIT)
            setExamStarted(true)
            setView('exam')
            return
          }
        }
      } catch { /* silent */ }

      // If we couldn't fetch questions, show error
      toast.error('No se pudieron cargar las preguntas')
      setView('selection')
    }
    fetchQuestions()
  }, [selectedCourse])

  const handleExamSubmit = useCallback(async () => {
    if (!selectedCourse || !userId || submitting) return

    setSubmitting(true)
    setExamStarted(false)
    if (timerRef.current) clearInterval(timerRef.current)

    const timeSpent = TIME_LIMIT - timeLeft

    try {
      const res = await fetch('/api/certification-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseName: selectedCourse.name,
          answers,
          timeSpent,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setExamResult(result)
        setExams(prev => [...prev, result])
        setView('results')
        toast.success(result.passed ? '🎉 ¡Examen aprobado!' : '📝 Examen completado', {
          description: result.passed ? `Obtuviste ${result.score}% — ${result.grade}` : `Obtuviste ${result.score}% — Necesitas ${PASS_THRESHOLD}% para aprobar`,
          style: {
            background: result.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: result.passed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            color: result.passed ? '#10b981' : '#ef4444',
          },
          duration: 4000,
        })
      } else {
        toast.error('Error al enviar el examen')
        setView('selection')
      }
    } catch {
      toast.error('Error de conexión')
      setView('selection')
    } finally {
      setSubmitting(false)
    }
  }, [selectedCourse, userId, answers, timeLeft, submitting])

  const handleCopyCode = useCallback(() => {
    if (examResult) {
      navigator.clipboard.writeText(examResult.verificationCode)
      toast.success('Código copiado al portapapeles')
    }
  }, [examResult])

  // ─── RENDER ────────────────────────────────────────────────

  // ─── Exam In Progress View ─────────────────────────────────
  if (view === 'exam' && questions.length > 0) {
    const q = questions[currentQuestion]
    const answeredCount = Object.keys(answers).length
    const isLastQuestion = currentQuestion === questions.length - 1
    const timerColor = timeLeft <= 60 ? '#ef4444' : timeLeft <= 300 ? '#f59e0b' : '#00d4ff'

    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        {/* ─── Top Bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm('¿Seguro que deseas abandonar el examen? Se perderá tu progreso.')) {
                  setExamStarted(false)
                  if (timerRef.current) clearInterval(timerRef.current)
                  setView('selection')
                }
              }}
              className="p-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <div>
              <p className="text-white/50 text-xs">{selectedCourse?.emoji} {selectedCourse?.name}</p>
              <p className="text-white/30 text-xs">{answeredCount} de {questions.length} respondidas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Clock className="w-4 h-4" style={{ color: timerColor }} />
            <span className="text-sm font-mono font-bold" style={{ color: timerColor }}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* ─── Question Number Indicator ──────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {questions.map((question, idx) => (
            <motion.button
              key={question.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentQuestion(idx)}
              className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all"
              style={{
                background: idx === currentQuestion
                  ? 'rgba(0,212,255,0.2)'
                  : answers[question.id] !== undefined
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(255,255,255,0.04)',
                border: idx === currentQuestion
                  ? '1px solid rgba(0,212,255,0.4)'
                  : answers[question.id] !== undefined
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                color: idx === currentQuestion
                  ? '#00d4ff'
                  : answers[question.id] !== undefined
                    ? '#10b981'
                    : 'rgba(255,255,255,0.4)',
              }}
            >
              {idx + 1}
            </motion.button>
          ))}
        </div>

        {/* ─── Question Card ────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl p-6 mb-6"
            style={{ ...cardBase, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                Pregunta {currentQuestion + 1}
              </span>
            </div>

            <h3 className="text-white text-base md:text-lg font-medium mb-6 leading-relaxed">
              {q.question}
            </h3>

            <div className="space-y-3">
              {q.options.map((option, idx) => {
                const isSelected = answers[q.id] === idx
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: idx }))}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3"
                    style={{
                      background: isSelected ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: isSelected ? '#00d4ff' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: isSelected ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)',
                        border: isSelected ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: isSelected ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Navigation ────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </motion.button>

          {isLastQuestion ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExamSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white' }}
            >
              {submitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-t-transparent rounded-full" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'transparent' }} />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Enviar Examen
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}

          {!isLastQuestion && answeredCount === questions.length && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExamSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}
            >
              <Send className="w-4 h-4" />
              Enviar
            </motion.button>
          )}
        </div>
      </div>
    )
  }

  // ─── Results View ──────────────────────────────────────────
  if (view === 'results' && examResult) {
    const gradeInfo = getGradeInfo(examResult.grade)

    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ─── Back Button ────────────────────────────────────── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setView('selection'); setExamResult(null); setShowReview(false); setReviewQuestions([]); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Volver a Exámenes
        </motion.button>

        {/* ─── Score Card ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 text-center"
          style={{ ...cardBase, border: `1px solid ${examResult.passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}
        >
          <CardGradientTop color={examResult.passed ? 'linear-gradient(90deg, #10b981, #00d4ff)' : 'linear-gradient(90deg, #ef4444, #f59e0b)'} />

          {/* Pass/Fail Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6"
            style={{
              background: examResult.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: examResult.passed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              color: examResult.passed ? '#10b981' : '#ef4444',
            }}
          >
            {examResult.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {examResult.passed ? '¡EXAMEN APROBADO!' : 'EXAMEN NO APROBADO'}
          </motion.div>

          {/* Course Name */}
          <p className="text-white/50 text-sm mb-2">
            {courses.find(c => c.name === examResult.courseName)?.emoji} {examResult.courseName}
          </p>

          {/* Circular Progress */}
          <div className="my-6">
            <CircularProgress score={examResult.score} passed={examResult.passed} />
          </div>

          {/* Grade */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-4"
          >
            <span className="text-3xl mb-1 block">{gradeInfo.emoji}</span>
            <p className="text-lg font-bold" style={{ color: gradeInfo.color }}>{gradeInfo.label}</p>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/50 mb-6">
            <div className="text-center">
              <p className="text-white font-bold">{examResult.correctAnswers}/{examResult.totalQuestions}</p>
              <p className="text-xs">Correctas</p>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-white font-bold">{formatTime(examResult.timeSpent)}</p>
              <p className="text-xs">Tiempo</p>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-white font-bold">{Math.max(0, examResult.totalQuestions - examResult.correctAnswers)}</p>
              <p className="text-xs">Incorrectas</p>
            </div>
          </div>

          {/* Verification Code */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-white/40 text-xs">Código de Verificación:</span>
            <span className="font-mono text-sm font-bold" style={{ color: '#f59e0b' }}>{examResult.verificationCode}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyCode}
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* ─── Action Buttons ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {examResult.passed && (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCertificate(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '1px solid rgba(245,158,11,0.3)', color: 'white' }}
            >
              <Download className="w-4 h-4" />
              Descargar Certificado
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (!showReview && examResult && reviewQuestions.length === 0) {
                try {
                  const res = await fetch(`/api/certification-exams?getQuestions=${encodeURIComponent(examResult.courseName)}&includeAnswers=true`)
                  if (res.ok) {
                    const data = await res.json()
                    setReviewQuestions(data.questions || [])
                  }
                } catch { /* silent */ }
              }
              setShowReview(prev => !prev)
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          >
            <ClipboardCheck className="w-4 h-4" />
            {showReview ? 'Ocultar Revisión' : 'Revisar Respuestas'}
          </motion.button>
        </div>

        {/* ─── Review Section ────────────────────────────────── */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Revisión de Respuestas
              </h3>
              {reviewQuestions.map((q, idx) => {
                const userAnswer = answers[q.id]
                const isCorrect = userAnswer === q.correctAnswer
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-xl p-4"
                    style={{
                      background: isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                      border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-white/80 mb-2">
                          <span className="text-white/40 font-medium mr-2">{idx + 1}.</span>
                          {q.question}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs" style={{ color: '#ef4444' }}>
                            Tu respuesta: {userAnswer !== undefined ? q.options[userAnswer] : 'Sin responder'}
                          </p>
                        )}
                        <p className="text-xs" style={{ color: '#10b981' }}>
                          Respuesta correcta: {q.options[q.correctAnswer]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── Default Selection View ────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ─── Header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}>
          <ClipboardCheck className="w-7 h-7" style={{ color: '#00d4ff' }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
          Certificaciones Oficiales
        </h1>
        <p className="text-white/50 text-sm md:text-base mb-3">
          Demuestra tu conocimiento con exámenes oficiales de certificación de AstroVerse
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
          💰 $4.99 USD por examen — Incluido con PRO
        </div>
      </motion.div>

      {/* ─── Stats Cards ─────────────────────────────────────── */}
      {!loading && totalExams > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Exámenes Realizados', value: totalExams.toString(), color: '#00d4ff', icon: ClipboardCheck },
            { label: 'Mejor Grado', value: bestGrade ? getGradeInfo(bestGrade.grade).emoji + ' ' + getGradeInfo(bestGrade.grade).label : '—', color: '#f59e0b', icon: Award },
            { label: 'Promedio', value: `${averageScore}%`, color: '#10b981', icon: Globe },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={cardBase}>
              <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: `${stat.color}80` }} />
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ─── Course Grid ─────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {courses.map((course) => {
          const bestExam = bestScores.get(course.name)
          const hasPassed = bestExam?.passed

          return (
            <motion.div
              key={course.name}
              variants={staggerItem}
              className="relative overflow-hidden rounded-2xl"
              style={cardBase}
            >
              <CardGradientTop color={course.gradient} />

              <div className="relative z-10 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{course.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white leading-tight">{course.name}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{course.description}</p>
                  </div>
                </div>

                {/* Best score badge if taken */}
                {bestExam && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                      background: hasPassed ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      border: hasPassed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                      color: hasPassed ? '#10b981' : '#f59e0b',
                    }}>
                      {hasPassed ? <CheckCircle className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      {bestExam.score}% — {getGradeInfo(bestExam.grade).emoji}
                    </span>
                    {!hasPassed && (
                      <span className="text-[10px] text-white/30">Necesitas {PASS_THRESHOLD}%</span>
                    )}
                  </div>
                )}

                {/* Stats if taken */}
                {bestExam && (
                  <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
                    <span>Intentos: {exams.filter(e => e.courseName === course.name).length}</span>
                    <span>•</span>
                    <span>{passedExams}/{totalExams} aprobados</span>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${course.color}20` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartExam(course)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: bestExam ? `${course.color}15` : `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
                    border: `1px solid ${course.color}40`,
                    color: bestExam ? course.color : 'white',
                  }}
                >
                  {bestExam ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Repetir Examen
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-4 h-4" />
                      Iniciar Examen
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ─── Empty State ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'rgba(0,212,255,0.3)', borderTopColor: 'transparent' }} />
        </div>
      ) : totalExams === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-8 text-center" style={cardBase}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Award className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            Aún no has realizado ningún examen de certificación. ¡Selecciona un curso y demuestra tu conocimiento!
          </p>
        </motion.div>
      )}

      {/* ─── Modals ──────────────────────────────────────────── */}
      <AnimatePresence>
        {view === 'instructions' && selectedCourse && (
          <InstructionsModal
            course={selectedCourse}
            onStart={handleBeginExam}
            onClose={() => setView('selection')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentPrompt && selectedCourse && (
          <PaymentPromptModal
            course={selectedCourse}
            onClose={() => setShowPaymentPrompt(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCertificate && examResult && (
          <ExamCertificateModal
            exam={examResult}
            userName={userName}
            courseInfo={courses.find(c => c.name === examResult.courseName)}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
