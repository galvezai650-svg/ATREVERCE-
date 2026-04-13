'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import CertificateTemplate from '../CertificateTemplate'
import { toast } from 'sonner'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import {
  Award,
  Search,
  Download,
  Star,
  Globe,
  FileText,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Copy,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────
interface VerifiedExam {
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

// ─── PDF Download Handler ────────────────────────────────────
async function handleDownloadPDF(exam: VerifiedExam) {
  const element = document.getElementById(`certificate-${exam.id}`)
  if (!element) return

  try {
    toast.loading('Generando PDF...')
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0e27',
      logging: false,
    })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = (pdfHeight - imgHeight * ratio) / 2

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    const courseName = exam.courseName || 'certificado'
    pdf.save(`Diploma_AstroVerse_${courseName.replace(/\s+/g, '_')}.pdf`)

    toast.dismiss()
    toast.success('📄 PDF descargado exitosamente', {
      description: `Diploma de "${exam.courseName}"`,
    })
  } catch {
    toast.dismiss()
    toast.error('Error al generar PDF')
  }
}

// ─── Certificate Preview Modal ──────────────────────────────
function CertificateModal({
  exam,
  onClose,
}: {
  exam: VerifiedExam
  onClose: () => void
}) {
  const dateFormatted = new Date(exam.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const courseDescriptions: Record<string, string> = {
    'Introducción a la Astronomía': 'Fundamentos de la astronomía moderna: historia, herramientas y métodos de observación del cielo nocturno.',
    'El Sistema Solar': 'Exploración completa de nuestro vecindario cósmico: planetas, lunas, asteroides y cometas.',
    'Estrellas y Galaxias': 'Nacimiento, vida y muerte de las estrellas, estructura y clasificación de galaxias.',
    'Exploración Espacial': 'Historia de los viajes espaciales: desde el Sputnik hasta las misiones a Marte y más allá.',
    'Telescopios y Observación': 'Tipos de telescopios, técnicas de observación y astrofotografía.',
    'Astrofísica Básica': 'Principios físicos que gobiernan el universo: gravedad, luz, relatividad.',
    'Exoplanetas y Vida Extraterrestre': 'Búsqueda de planetas fuera del sistema solar y condiciones para la vida.',
    'El Universo Profundo': 'Cosmología moderna: Big Bang, expansión, materia oscura y energía oscura.',
    'Mecánica Orbital': 'Órbitas planetarias, leyes de Kepler, transferencias orbitales.',
    'Astronomía de Radio': 'El universo en frecuencias de radio: pulsares, quásares y CMB.',
    'El Clima Espacial': 'Actividad solar, tormentas geomagnéticas y su impacto en la Tierra.',
    'Colonización del Espacio': 'Futuro de la humanidad en el espacio: hábitats, terraformación.',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.97)' }}
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
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-12 right-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium z-10"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
            }}
          >
            <X className="w-4 h-4" />
            Cerrar
          </motion.button>

          {/* Certificate - scrollable on mobile */}
          <div
            className="overflow-auto rounded-xl"
            style={{
              maxHeight: '85vh',
              border: '1px solid rgba(212, 165, 55, 0.3)',
              boxShadow: '0 0 60px rgba(212, 165, 55, 0.1), 0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <CertificateTemplate
              studentName={exam.user.name}
              courseName={exam.courseName}
              courseDescription={courseDescriptions[exam.courseName] || `Examen de certificación en ${exam.courseName}`}
              certificateId={exam.verificationCode}
              issueDate={dateFormatted}
              certDbId={exam.id}
            />
          </div>

          {/* Download PDF button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDownloadPDF(exam)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: '1px solid rgba(245,158,11,0.5)',
              color: '#ffffff',
            }}
          >
            <Download className="w-4 h-4" />
            Descargar Diploma PDF
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [codeInput, setCodeInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifiedExam, setVerifiedExam] = useState<VerifiedExam | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<VerifiedExam[]>([])
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('astroverse_verified_diplomas')
      if (saved) setHistory(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  // Save history to localStorage
  const saveHistory = (exams: VerifiedExam[]) => {
    setHistory(exams)
    try {
      localStorage.setItem('astroverse_verified_diplomas', JSON.stringify(exams))
    } catch { /* ignore */ }
  }

  // ─── Verify Code Handler ──────────────────────────────────
  const handleVerify = useCallback(async () => {
    const code = codeInput.trim().toUpperCase()
    if (!code) {
      setError('Ingresa un código de certificación')
      return
    }

    setVerifying(true)
    setError(null)
    setVerifiedExam(null)

    try {
      const res = await fetch(`/api/certification-exams?verificationCode=${encodeURIComponent(code)}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Código no encontrado. Verifica que lo hayas escrito correctamente.')
        } else {
          setError('Error al verificar el código. Intenta de nuevo.')
        }
        setVerifying(false)
        return
      }

      const exam: VerifiedExam = await res.json()
      setVerifiedExam(exam)

      // Add to history if not already there
      setHistory(prev => {
        const exists = prev.find(e => e.verificationCode === exam.verificationCode)
        if (!exists) {
          const updated = [exam, ...prev]
          try {
            localStorage.setItem('astroverse_verified_diplomas', JSON.stringify(updated))
          } catch { /* ignore */ }
          return updated
        }
        return prev
      })

      toast.success('🎉 ¡Diploma verificado!', {
        description: `"${exam.courseName}" — ${exam.grade}`,
        duration: 4000,
      })
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setVerifying(false)
    }
  }, [codeInput])

  // ─── Copy Code Handler ───────────────────────────────────
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Código copiado')
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Remove from History ─────────────────────────────────
  const handleRemoveHistory = (code: string) => {
    const updated = history.filter(e => e.verificationCode !== code)
    saveHistory(updated)
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  const getGradeColor = (grade: string) => {
    if (grade.includes('Maestro')) return '#f59e0b'
    if (grade.includes('Científico')) return '#00d4ff'
    if (grade.includes('Explorador')) return '#10b981'
    return '#94a3b8'
  }

  // ─── FREE for everyone ────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* ─── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        className="text-center mb-2"
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
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
          Diplomas ASTROVERSE
        </h1>
        <p className="text-white/50 text-sm md:text-base mb-3">
          Ingresa tu código de certificación para ver y descargar tu diploma profesional
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff' }}>
          <Globe className="w-3 h-3" />
          Avalado a Nivel Mundial — NASA DATA
        </div>
      </motion.div>

      {/* ─── Code Verification Card ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          ...cardBase,
          border: '2px solid rgba(0,212,255,0.2)',
        }}
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed)" />

        {/* Glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <Search className="w-5 h-5" style={{ color: '#00d4ff' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Verificar Diplomas</h2>
              <p className="text-white/40 text-xs">Obtén tu código en la sección de Certificaciones Oficiales</p>
            </div>
          </div>

          {/* Input + Button */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase())
                  setError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="CERT-XXXXXXXX"
                maxLength={14}
                className="w-full px-4 py-3.5 rounded-xl text-white text-lg font-mono tracking-wider focus:outline-none transition-all duration-200 placeholder:text-white/20 placeholder:font-mono placeholder:text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : verifiedExam ? 'rgba(16,185,129,0.4)' : 'rgba(0,212,255,0.2)'}`,
                  boxShadow: verifiedExam ? '0 0 20px rgba(16,185,129,0.1)' : undefined,
                  color: verifiedExam ? '#10b981' : '#ffffff',
                }}
              />
              {verifiedExam && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleVerify}
              disabled={verifying || !codeInput.trim()}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                color: 'white',
              }}
            >
              {verifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }}
                  />
                  Verificando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Verificar
                </>
              )}
            </motion.button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <XCircle className="w-4 h-4 shrink-0" style={{ color: '#ef4444' }} />
                <span className="text-sm" style={{ color: '#ef4444' }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
            {[
              { step: '1', text: 'Toma tu examen de certificación', icon: '📝' },
              { step: '2', text: 'Obtén tu código CERT-XXXXXXXX', icon: '🏆' },
              { step: '3', text: 'Verifica y descarga tu diploma', icon: '📄' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <span className="text-white/30 text-[10px] font-bold block">PASO {item.step}</span>
                  <span className="text-white/70 text-xs">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Verified Exam Result ─────────────────────────── */}
      <AnimatePresence>
        {verifiedExam && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl"
            style={{
              ...cardBase,
              border: verifiedExam.passed ? '2px solid rgba(16,185,129,0.3)' : '2px solid rgba(245,158,11,0.3)',
            }}
          >
            {/* Passed banner */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
              style={{ background: verifiedExam.passed ? 'linear-gradient(90deg, #10b981, #34d399, #10b981)' : 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' }}
            />

            <div className="relative z-10 p-6 md:p-8">
              {/* Status badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: verifiedExam.passed ? '#10b981' : '#f59e0b' }} />
                  <span className="text-sm font-semibold" style={{ color: verifiedExam.passed ? '#10b981' : '#f59e0b' }}>
                    {verifiedExam.passed ? '✅ Diploma Verificado' : '⚠️ Examen No Aprobado'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: `${getGradeColor(verifiedExam.grade)}20`,
                      border: `1px solid ${getGradeColor(verifiedExam.grade)}40`,
                      color: getGradeColor(verifiedExam.grade),
                    }}
                  >
                    {verifiedExam.grade}
                  </span>
                </div>
              </div>

              {/* Exam details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#fbbf24' }}
                  >
                    {verifiedExam.courseName}
                  </h3>
                  <p className="text-white/50 text-xs">{verifiedExam.user.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#00d4ff' }}>{verifiedExam.score}%</div>
                    <div className="text-white/40 text-[10px] mt-1">Puntuación</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{verifiedExam.correctAnswers}/{verifiedExam.totalQuestions}</div>
                    <div className="text-white/40 text-[10px] mt-1">Correctas</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{Math.floor(verifiedExam.timeSpent / 60)}:{String(verifiedExam.timeSpent % 60).padStart(2, '0')}</div>
                    <div className="text-white/40 text-[10px] mt-1">Tiempo</div>
                  </div>
                </div>
              </div>

              {/* Code + Date */}
              <div className="flex items-center justify-between mb-5 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: '#00d4ff' }} />
                  <span className="text-white/40 text-xs">Código de Verificación:</span>
                  <span className="font-mono text-sm font-bold text-white">{verifiedExam.verificationCode}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopyCode(verifiedExam.verificationCode)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copiado' : 'Copiar'}
                </motion.button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,212,255,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                    border: '1px solid rgba(0,212,255,0.3)',
                    color: '#00d4ff',
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Ver Diploma Completo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(16,185,129,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownloadPDF(verifiedExam)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: '1px solid rgba(245,158,11,0.5)',
                    color: '#ffffff',
                  }}
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Previous Diplomas History ─────────────────────── */}
      {history.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
            <h2 className="text-lg font-semibold text-white">Diplomas Verificados</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
              {history.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((exam) => (
              <motion.div
                key={exam.verificationCode}
                variants={staggerItem}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={cardBase}
                onClick={() => { setVerifiedExam(exam); setCodeInput(exam.verificationCode) }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, ${getGradeColor(exam.grade)}, ${getGradeColor(exam.grade)}80)` }}
                />

                <div className="relative z-10 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate mb-0.5"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {exam.courseName}
                      </h3>
                      <p className="text-white/40 text-xs">{exam.user.name}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2"
                      style={{
                        background: `${getGradeColor(exam.grade)}20`,
                        color: getGradeColor(exam.grade),
                      }}
                    >
                      {exam.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" style={{ color: '#00d4ff' }} />
                      <span className="text-white/60 font-bold">{exam.score}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" style={{ color: '#10b981' }} />
                      <span className="text-white/60">{exam.correctAnswers}/{exam.totalQuestions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" style={{ color: '#ffffff40' }} />
                      <span className="text-white/40 font-mono text-[10px]">{exam.verificationCode}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-[10px]">{formatDate(exam.createdAt)}</span>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setVerifiedExam(exam); setShowModal(true) }}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        Ver
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadPDF(exam)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveHistory(exam.verificationCode)}
                        className="px-2 py-1.5 rounded-lg text-[10px]"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Empty State (no history) ────────────────────────── */}
      {history.length === 0 && !verifiedExam && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 text-center"
          style={cardBase}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Award className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/40 text-sm max-w-sm mx-auto mb-2">
            Aún no has verificado ningún diploma.
          </p>
          <p className="text-white/25 text-xs max-w-xs mx-auto">
            Ve a la sección de <span className="text-cyan-400">Certificaciones Oficiales</span>, toma un examen y obtén tu código.
          </p>
        </motion.div>
      )}

      {/* ─── Certificate Preview Modal ──────────────────── */}
      <AnimatePresence>
        {showModal && verifiedExam && (
          <CertificateModal
            exam={verifiedExam}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
