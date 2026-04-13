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
  X,
  Eye,
  Globe,
  FileText,
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
  description: string
  topics: string[]
}

// ─── 12 Real Courses ────────────────────────────────────────
const courses: Course[] = [
  {
    name: 'Introducción a la Astronomía',
    emoji: '🌌',
    lessons: 12,
    gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    color: '#00d4ff',
    description: 'Fundamentos de la astronomía moderna: historia, herramientas y métodos de observación del cielo nocturno.',
    topics: ['Historia de la Astronomía', 'Coordenadas Celestes', 'Instrumentos Ópticos', 'Mapas Estelares', 'Observación a Ojo Desnudo'],
  },
  {
    name: 'El Sistema Solar',
    emoji: '☀️',
    lessons: 18,
    gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    color: '#f59e0b',
    description: 'Exploración completa de nuestro vecindario cósmico: planetas, lunas, asteroides y cometas.',
    topics: ['Los 8 Planetas', 'Lunas del Sistema Solar', 'Cinturón de Asteroides', 'Cometas y Meteoritos', 'El Sol'],
  },
  {
    name: 'Estrellas y Galaxias',
    emoji: '✨',
    lessons: 15,
    gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    color: '#7c3aed',
    description: 'Nacimiento, vida y muerte de las estrellas, estructura y clasificación de galaxias.',
    topics: ['Clasificación Espectral', 'Evolución Estelar', 'Enanas Blancas', 'Supernovas', 'Tipos de Galaxias', 'Agujeros Negros'],
  },
  {
    name: 'Exploración Espacial',
    emoji: '🚀',
    lessons: 14,
    gradient: 'linear-gradient(135deg, #00d4ff, #10b981)',
    color: '#10b981',
    description: 'Historia de los viajes espaciales: desde el Sputnik hasta las misiones a Marte y más allá.',
    topics: ['La Carrera Espacial', 'Misiones Apollo', 'Estación Espacial', 'Rovers en Marte', 'Misión Artemis', 'Viaje a Marte'],
  },
  {
    name: 'Telescopios y Observación',
    emoji: '🔭',
    lessons: 10,
    gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)',
    color: '#ec4899',
    description: 'Tipos de telescopios, técnicas de observación y astrofotografía para principiantes.',
    topics: ['Refractores vs Reflectores', 'Astrofotografía', 'Filtros Ópticos', 'Cielos Oscuros', 'Calibración'],
  },
  {
    name: 'Astrofísica Básica',
    emoji: '🧪',
    lessons: 16,
    gradient: 'linear-gradient(135deg, #10b981, #00d4ff)',
    color: '#10b981',
    description: 'Principios físicos que gobiernan el universo: gravedad, luz, relatividad y mecánica cuántica.',
    topics: ['Ley de Gravitación', 'Espectroscopía', 'Relatividad General', 'Constantes Fundamentales', 'Materia Oscura'],
  },
  {
    name: 'Exoplanetas y Vida Extraterrestre',
    emoji: '🌍',
    lessons: 11,
    gradient: 'linear-gradient(135deg, #3b82f6, #10b981)',
    color: '#3b82f6',
    description: 'Búsqueda de planetas fuera del sistema solar y las condiciones necesarias para la vida.',
    topics: ['Métodos de Detección', 'Zona Habitable', 'Biosignaturas', 'SETI', 'Proyecto Kepler'],
  },
  {
    name: 'El Universo Profundo',
    emoji: '🔮',
    lessons: 13,
    gradient: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: '#7c3aed',
    description: 'Cosmología moderna: Big Bang, expansión del universo, materia oscura y energía oscura.',
    topics: ['Big Bang', 'Radiación Fondo', 'Expansión Acelerada', 'Materia Oscura', 'Energía Oscura', 'Multiverso'],
  },
  {
    name: 'Mecánica Orbital',
    emoji: '🛰️',
    lessons: 12,
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: '#ef4444',
    description: 'Órbitas planetarias, leyes de Kepler, transferencias orbitales y satélites artificiales.',
    topics: ['Leyes de Kepler', 'Órbitas Transferencia', 'Satélites Geoestacionarios', 'Mecánica de Vuelo', 'Puntos de Lagrange'],
  },
  {
    name: 'Astronomía de Radio',
    emoji: '📡',
    lessons: 9,
    gradient: 'linear-gradient(135deg, #00d4ff, #f59e0b)',
    color: '#f59e0b',
    description: 'El universo en frecuencias de radio: pulsares, quásares y el fondo cósmico de microondas.',
    topics: ['Radiotelescopios', 'Pulsares', 'Quásares', 'CMB', 'ALMA'],
  },
  {
    name: 'El Clima Espacial',
    emoji: '⛈️',
    lessons: 8,
    gradient: 'linear-gradient(135deg, #6366f1, #ec4899)',
    color: '#6366f1',
    description: 'Actividad solar, tormentas geomagnéticas y su impacto en la Tierra y la tecnología.',
    topics: ['Ciclo Solar', 'Eyecciones de Masa', 'Auroras', 'Magnetosfera', 'Impacto en Satélites'],
  },
  {
    name: 'Colonización del Espacio',
    emoji: '🏘️',
    lessons: 10,
    gradient: 'linear-gradient(135deg, #10b981, #f59e0b)',
    color: '#10b981',
    description: 'Futuro de la humanidad en el espacio: hábitats espaciales, terraformación y viajes interestelares.',
    topics: ['Hábitats en Marte', 'Terraformación', 'Vuelo Interestelar', 'Propulsión Avanzada', 'Biodomo Espacial'],
  },
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

// ─── PDF Download Handler ────────────────────────────────────
async function handleDownloadPDF(cert: Certificate, courseInfo: Course | undefined) {
  const element = document.getElementById(`certificate-${cert.id}`)
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
    const courseName = courseInfo?.name || element.getAttribute('data-course-name') || 'certificado'
    pdf.save(`Certificado_AstroVerse_${courseName.replace(/\s+/g, '_')}.pdf`)

    toast.dismiss()
    toast.success('PDF descargado exitosamente')
  } catch {
    toast.dismiss()
    toast.error('Error al generar PDF')
  }
}

// ─── Certificate Preview Modal ──────────────────────────────
function CertificateModal({
  cert,
  userName,
  courseInfo,
  onClose,
}: {
  cert: Certificate
  userName: string
  courseInfo: Course | undefined
  onClose: () => void
}) {
  const dateFormatted = new Date(cert.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
              studentName={userName}
              courseName={cert.courseName}
              courseDescription={courseInfo?.description || cert.description || ''}
              certificateId={cert.certificateId}
              issueDate={dateFormatted}
              certDbId={cert.id}
            />
          </div>

          {/* Download PDF button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDownloadPDF(cert, courseInfo)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: '1px solid rgba(245,158,11,0.5)',
              color: '#ffffff',
            }}
          >
            <Download className="w-4 h-4" />
            Descargar PDF
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
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [completingCourse, setCompletingCourse] = useState<string | null>(null)
  const [confettiCourse, setConfettiCourse] = useState<string | null>(null)
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null)
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Determine completed course names from certificates
  const completedCourseNames = new Set(certificates.map((c) => c.courseName))

  // Helper to get course info by name
  const getCourseInfo = (name: string) => courses.find((c) => c.name === name)

  // ─── Fetch certificates on mount ──────────────────────────
  useEffect(() => {
    if (!userId) return

    const fetchCertificates = async () => {
      try {
        const res = await fetch(`/api/certificates?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setCertificates(Array.isArray(data) ? data : Array.isArray(data?.certificates) ? data.certificates : [])
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
            description: course.description,
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
              profesionales avalados a nivel mundial con contenido basado en datos de la NASA.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              className="flex flex-col items-center gap-2 mb-8"
            >
              {[
                { icon: BookOpen, text: '12 cursos de astronomía con contenido real' },
                { icon: GraduationCap, text: 'Certificados PDF descargables' },
                { icon: Globe, text: 'Avalado a nivel mundial — NASA DATA' },
                { icon: Trophy, text: 'Reconocimiento profesional internacional' },
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
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
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
          Certificados de Estudio
        </h1>
        <p className="text-white/50 text-sm md:text-base mb-2">
          Obtén certificados profesionales al completar cursos en AstroVerse
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.15)',
          color: '#00d4ff',
        }}>
          <Globe className="w-3 h-3" />
          Avalado a Nivel Mundial — NASA DATA
        </div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
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
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
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

                  {/* Description */}
                  <p className="text-white/50 text-xs leading-relaxed mb-3">
                    {course.description}
                  </p>

                  {/* Topics tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: `${course.color}15`,
                          border: `1px solid ${course.color}25`,
                          color: `${course.color}cc`,
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                    {course.topics.length > 3 && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        +{course.topics.length - 3} más
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

                  {/* Action buttons */}
                  <div className="relative">
                    {isCompleted ? (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const cert = certificates.find((c) => c.courseName === course.name)
                            if (cert) setPreviewCert(cert)
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                            border: '1px solid rgba(0,212,255,0.3)',
                            color: '#00d4ff',
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Ver Certificado
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const cert = certificates.find((c) => c.courseName === course.name)
                            if (cert) handleDownloadPDF(cert, course)
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
                            border: '1px solid rgba(16,185,129,0.3)',
                            color: '#10b981',
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {certificates.map((cert) => {
              const courseInfo = getCourseInfo(cert.courseName)
              const dateFormatted = new Date(cert.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })

              return (
                <motion.div
                  key={cert.id}
                  variants={staggerItem}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group"
                  style={cardBase}
                  onClick={() => setPreviewCert(cert)}
                >
                  {/* Gold gradient top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' }}
                  />

                  <div className="relative z-10 p-5">
                    <div className="flex items-start gap-3">
                      {/* Course emoji */}
                      <span className="text-3xl mt-1">{courseInfo?.emoji || '🎓'}</span>

                      <div className="flex-1 min-w-0">
                        {/* Course name */}
                        <h3
                          className="text-base font-bold mb-1 truncate"
                          style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            color: '#fbbf24',
                          }}
                        >
                          {cert.courseName}
                        </h3>

                        {/* Description preview */}
                        <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">
                          {courseInfo?.description || cert.description || 'Curso completado exitosamente'}
                        </p>

                        {/* Details */}
                        <div className="flex items-center gap-3 text-xs mb-3">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" style={{ color: '#ffffff40' }} />
                            <span className="text-white/40 font-mono">{cert.certificateId}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" style={{ color: '#ffffff40' }} />
                            <span className="text-white/40">{dateFormatted}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewCert(cert)
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                              border: '1px solid rgba(0,212,255,0.3)',
                              color: '#00d4ff',
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver Certificado
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadPDF(cert, courseInfo)
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
                              border: '1px solid rgba(16,185,129,0.3)',
                              color: '#10b981',
                            }}
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
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

      {/* ─── Certificate Preview Modal ──────────────────── */}
      <AnimatePresence>
        {previewCert && (
          <CertificateModal
            cert={previewCert}
            userName={userName}
            courseInfo={getCourseInfo(previewCert.courseName)}
            onClose={() => setPreviewCert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
