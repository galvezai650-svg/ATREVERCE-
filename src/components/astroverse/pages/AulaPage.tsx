'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, GraduationCap, Play, Check, Clock, Video, BookOpen,
  Plus, Send, Eye, MessageSquare, Star, CircleDot, Trophy,
  X, Copy, CheckCheck, ClipboardList, Award, Lock, LogIn,
  DoorOpen
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Mock Data
// ============================================================
const mockStudents = [
  { id: '1', name: 'María López', avatar: '👩‍🎓', grade: '9°', progress: 85, online: true, lastSeen: 'Ahora', tasksCompleted: 7, tasksTotal: 8 },
  { id: '2', name: 'Carlos Pérez', avatar: '👨‍🎓', grade: '9°', progress: 72, online: true, lastSeen: 'Ahora', tasksCompleted: 6, tasksTotal: 8 },
  { id: '3', name: 'Ana García', avatar: '👩‍🚀', grade: '10°', progress: 100, online: true, lastSeen: 'Ahora', tasksCompleted: 8, tasksTotal: 8 },
  { id: '4', name: 'Juan Rodríguez', avatar: '🧑‍🎓', grade: '10°', progress: 50, online: false, lastSeen: 'Hace 2h', tasksCompleted: 4, tasksTotal: 8 },
  { id: '5', name: 'Sofía Martínez', avatar: '👩‍💻', grade: '9°', progress: 90, online: true, lastSeen: 'Ahora', tasksCompleted: 7, tasksTotal: 8 },
  { id: '6', name: 'Diego Torres', avatar: '🧑‍🚀', grade: '10°', progress: 38, online: false, lastSeen: 'Hace 5h', tasksCompleted: 3, tasksTotal: 8 },
  { id: '7', name: 'Valentina Ruiz', avatar: '👩‍🔬', grade: '9°', progress: 62, online: false, lastSeen: 'Hace 1h', tasksCompleted: 5, tasksTotal: 8 },
  { id: '8', name: 'Pedro Sánchez', avatar: '👨‍🚀', grade: '10°', progress: 95, online: true, lastSeen: 'Ahora', tasksCompleted: 8, tasksTotal: 8 },
]

const mockTasks = [
  { id: 't1', title: 'Ver: Exploración Espacial', type: 'video', videoSrc: '/videos/video1.mp4', status: 'active' as const, dueDate: '20 Jul 2025', completions: 6, total: 8, color: '#00d4ff', emoji: '🚀' },
  { id: 't2', title: 'Ver: El Cosmos en Movimiento', type: 'video', videoSrc: '/videos/video2.mp4', status: 'active' as const, dueDate: '22 Jul 2025', completions: 4, total: 8, color: '#a855f7', emoji: '🌌' },
  { id: 't3', title: 'Simulador de Gravedad - Experimento', type: 'simulator', status: 'active' as const, dueDate: '25 Jul 2025', completions: 2, total: 8, color: '#f59e0b', emoji: '⚖️' },
  { id: 't4', title: 'Explorar el Sistema Solar 3D', type: 'interactive', status: 'active' as const, dueDate: '28 Jul 2025', completions: 5, total: 8, color: '#10b981', emoji: '🪐' },
  { id: 't5', title: 'Cuestionario: Planetas del Sistema Solar', type: 'quiz', status: 'completed' as const, dueDate: '15 Jul 2025', completions: 8, total: 8, color: '#ec4899', emoji: '📝' },
  { id: 't6', title: 'Investigación: Agujeros Negros', type: 'research', status: 'completed' as const, dueDate: '10 Jul 2025', completions: 7, total: 8, color: '#7c3aed', emoji: '🕳️' },
]

const gradeOptions = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°', '12°']
const subjectOptions = ['Ciencias', 'Matemáticas', 'Física', 'Astronomía', 'Biología', 'Química']

// ============================================================
// AulaPage — Dual-Mode Classroom System
// ============================================================
export default function AulaPage() {
  const [activeTab, setActiveTab] = useState<'enter' | 'create'>('enter')
  const [joinedClassroom, setJoinedClassroom] = useState(false)
  const [createdClassroom, setCreatedClassroom] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [classroomName, setClassroomName] = useState('')
  const [classroomGrade, setClassroomGrade] = useState('')
  const [classroomSubject, setClassroomSubject] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [tasks] = useState(mockTasks)
  const [studentCompletedTasks, setStudentCompletedTasks] = useState<Set<string>>(new Set())
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('astroverse_pro') === 'true'
    }
    return false
  })

  const handleJoin = () => {
    if (!joinCode.trim()) {
      toast.error('Ingresa el código del aula')
      return
    }
    setJoinedClassroom(true)
    toast.success('¡Te has unido al aula exitosamente!')
  }

  const handleCreate = () => {
    if (!classroomName.trim()) {
      toast.error('Ingresa un nombre para el aula')
      return
    }
    if (!classroomGrade) {
      toast.error('Selecciona un grado')
      return
    }
    setCreatedClassroom(true)
    toast.success('¡Aula creada exitosamente!')
  }

  const handleCompleteTask = (taskId: string) => {
    setStudentCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
    toast.success(studentCompletedTasks.has(taskId) ? 'Tarea marcada como pendiente' : '¡Tarea completada!')
  }

  const mainTabs = [
    { id: 'enter' as const, label: 'Entrar a Aula', icon: LogIn, color: '#10b981' },
    { id: 'create' as const, label: 'Crear Aula', icon: Plus, color: '#00d4ff' },
  ]

  const onlineStudents = mockStudents.filter(s => s.online)
  const classroomCode = 'ASTRO-X7K2M9'
  const overallProgress = tasks.length > 0 ? Math.round((studentCompletedTasks.size / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="text-emerald-400" />
            Aula Virtual
          </h1>
        </div>
        <p className="text-white/40">Únete a un aula existente o crea la tuya propia</p>
      </motion.div>

      {/* Main Tabs */}
      <div className="flex gap-3">
        {mainTabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab.id ? `${tab.color}18` : 'rgba(255,255,255,0.03)',
              border: activeTab === tab.id ? `1px solid ${tab.color}40` : '1px solid rgba(255,255,255,0.06)',
              color: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === tab.id ? `0 0 20px ${tab.color}15` : 'none',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.id === 'enter' && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981',
              }}>FREE</span>
            )}
            {tab.id === 'create' && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{
                background: 'rgba(0,212,255,0.15)',
                border: '1px solid rgba(0,212,255,0.3)',
                color: '#00d4ff',
              }}>PRO</span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'enter' ? (
          <motion.div key="enter" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
            {!joinedClassroom ? (
              <EnterClassroomSection joinCode={joinCode} setJoinCode={setJoinCode} onJoin={handleJoin} />
            ) : (
              <StudentDashboard
                tasks={tasks}
                studentCompletedTasks={studentCompletedTasks}
                onCompleteTask={handleCompleteTask}
                playingVideo={playingVideo}
                setPlayingVideo={setPlayingVideo}
                overallProgress={overallProgress}
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="create" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
            {!isPro ? (
              <ProLockSection />
            ) : !createdClassroom ? (
              <CreateClassroomForm
                classroomName={classroomName}
                setClassroomName={setClassroomName}
                classroomGrade={classroomGrade}
                setClassroomGrade={setClassroomGrade}
                classroomSubject={classroomSubject}
                setClassroomSubject={setClassroomSubject}
                onCreate={handleCreate}
              />
            ) : (
              <TeacherDashboard
                classroomCode={classroomCode}
                students={mockStudents}
                onlineStudents={onlineStudents}
                tasks={tasks}
                showNewTask={showNewTask}
                setShowNewTask={setShowNewTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                newTaskDesc={newTaskDesc}
                setNewTaskDesc={setNewTaskDesc}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// 1. ENTER CLASSROOM SECTION (FREE)
// ============================================================
function EnterClassroomSection({ joinCode, setJoinCode, onJoin }: { joinCode: string; setJoinCode: (v: string) => void; onJoin: () => void }) {
  return (
    <motion.div
      className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
      style={cardBase}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <CardGradientTop color="linear-gradient(90deg, #10b981, #00d4ff, transparent)" />

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <motion.div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DoorOpen size={36} className="text-emerald-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Entrar a un Aula</h2>
          <p className="text-white/40 text-sm mb-1">Accede a tu clase ingresando el código proporcionado</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold mt-3 mb-6" style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981',
          }}>
            <Check size={12} />
            GRATUITO para todos los estudiantes
          </span>
        </motion.div>

        <motion.div className="w-full space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ClipboardList size={16} className="text-white/20" />
            </div>
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && onJoin()}
              placeholder="Código del aula, ej: ASTRO-X7K2M9"
              className="w-full pl-11 pr-4 py-4 rounded-xl text-white text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-white/20 placeholder:font-sans placeholder:tracking-normal transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <motion.button
            onClick={onJoin}
            className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 0 25px rgba(16,185,129,0.2), 0 4px 15px rgba(0,0,0,0.3)',
              color: 'white',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogIn size={18} />
            Unirme al Aula
          </motion.button>
        </motion.div>

        <motion.div className="flex items-center gap-6 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 text-white/25 text-xs">
            <Video size={14} />
            <span>Video lecciones</span>
          </div>
          <div className="flex items-center gap-2 text-white/25 text-xs">
            <BookOpen size={14} />
            <span>Tareas</span>
          </div>
          <div className="flex items-center gap-2 text-white/25 text-xs">
            <Star size={14} />
            <span>Progreso</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================================
// 2. STUDENT DASHBOARD (after joining)
// ============================================================
function StudentDashboard({ tasks, studentCompletedTasks, onCompleteTask, playingVideo, setPlayingVideo, overallProgress }: {
  tasks: typeof mockTasks
  studentCompletedTasks: Set<string>
  onCompleteTask: (id: string) => void
  playingVideo: string | null
  setPlayingVideo: (v: string | null) => void
  overallProgress: number
}) {
  const activeTasks = tasks.filter(t => t.status === 'active')

  return (
    <div className="space-y-6">
      {/* Classroom Info Header */}
      <motion.div className="rounded-2xl p-6 relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <CardGradientTop color="linear-gradient(90deg, #10b981, #059669, transparent)" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <GraduationCap size={28} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Exploración del Universo</h2>
            <p className="text-white/40 text-sm mt-0.5">Prof. Alejandro Vega · Grado 9° · Astronomía</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider">Mi Progreso</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }} initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
              <span className="text-emerald-400 font-bold text-sm">{overallProgress}%</span>
            </div>
            <p className="text-white/20 text-[11px] mt-1">{studentCompletedTasks.size}/{tasks.length} tareas</p>
          </div>
        </div>
      </motion.div>

      {/* Video Player Overlay */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div className="rounded-2xl overflow-hidden relative" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <CardGradientTop color="linear-gradient(90deg, #00d4ff, #10b981, transparent)" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Video size={16} className="text-cyan-400" />
                  Reproduciendo video
                </h3>
                <motion.button onClick={() => setPlayingVideo(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X size={16} />
                </motion.button>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: '#000', aspectRatio: '16/9' }}>
                <video controls className="w-full h-full" autoPlay>
                  <source src={playingVideo} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ClipboardList size={16} className="text-amber-400" />
          Tareas Asignadas
          <span className="text-emerald-400 text-xs font-bold ml-auto">{studentCompletedTasks.size}/{tasks.length} completadas</span>
        </h3>
        <div className="space-y-3">
          {tasks.map((t, i) => {
            const isCompleted = studentCompletedTasks.has(t.id)
            return (
              <motion.div
                key={t.id}
                className="rounded-xl p-5 relative overflow-hidden"
                style={{
                  ...cardBase,
                  borderLeft: `3px solid ${t.color}`,
                  opacity: t.status === 'completed' ? 0.5 : 1,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: t.status === 'completed' ? 0.5 : 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <motion.button
                    onClick={() => onCompleteTask(t.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all"
                    style={{
                      background: isCompleted ? `${t.color}20` : 'rgba(255,255,255,0.05)',
                      border: isCompleted ? `1px solid ${t.color}40` : '1px solid rgba(255,255,255,0.1)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isCompleted ? <Check size={16} style={{ color: t.color }} /> : <div className="w-3 h-3 rounded-sm" style={{ border: `2px solid rgba(255,255,255,0.2)` }} />}
                  </motion.button>
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}>{t.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-white/25 text-[11px]">
                      <span className="flex items-center gap-1"><Clock size={10} /> {t.dueDate}</span>
                      {t.type === 'video' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">VIDEO</span>}
                    </div>
                  </div>
                  {t.type === 'video' && t.videoSrc && (
                    <motion.button
                      onClick={() => setPlayingVideo(t.videoSrc)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00d4ff, #0ea5e9)', color: 'white', boxShadow: '0 0 15px rgba(0,212,255,0.15)' }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Play size={12} fill="white" />
                      Ver Video
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 3. PRO LOCK SECTION (when not PRO)
// ============================================================
function ProLockSection() {
  return (
    <motion.div
      className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
      style={cardBase}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm z-10" style={{ background: 'rgba(5,5,16,0.5)' }} />

      <div className="flex flex-col items-center text-center max-w-md mx-auto relative z-20">
        <motion.div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Lock size={36} className="text-cyan-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold mb-4" style={{
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            color: '#00d4ff',
          }}>
            <Star size={12} fill="#00d4ff" />
            ASTROVERSE PRO
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Crear Aula</h2>
          <p className="text-white/40 text-sm mb-6">Necesitas AstroVerse PRO para crear y gestionar aulas</p>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-3 w-full mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {[
            { icon: Users, label: 'Hasta 50 estudiantes' },
            { icon: Video, label: 'Video lecciones' },
            { icon: ClipboardList, label: 'Gestión de tareas' },
            { icon: Trophy, label: 'Calificaciones' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <f.icon size={14} className="text-cyan-400/60" />
              <span className="text-white/30 text-[11px]">{f.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          onClick={() => toast.info('Redirigiendo a la página de suscripción... (demo)')}
          className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            boxShadow: '0 0 30px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
            color: 'white',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Star size={16} fill="white" />
          Obtener PRO — $4.99/mes
        </motion.button>

        <p className="text-white/15 text-[11px] mt-4">Cancela cuando quieras · Acceso inmediato</p>
      </div>
    </motion.div>
  )
}

// ============================================================
// 4. CREATE CLASSROOM FORM (PRO users)
// ============================================================
function CreateClassroomForm({ classroomName, setClassroomName, classroomGrade, setClassroomGrade, classroomSubject, setClassroomSubject, onCreate }: {
  classroomName: string; setClassroomName: (v: string) => void
  classroomGrade: string; setClassroomGrade: (v: string) => void
  classroomSubject: string; setClassroomSubject: (v: string) => void
  onCreate: () => void
}) {
  return (
    <motion.div
      className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
      style={cardBase}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, #10b981, transparent)" />

      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="max-w-lg mx-auto">
        <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Plus size={22} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Crear Nueva Aula</h2>
            <p className="text-white/30 text-xs">Configura tu aula virtual</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            color: '#00d4ff',
          }}>
            <Star size={10} fill="#00d4ff" />
            PRO
          </span>
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div>
            <label className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-2 block">Nombre del Aula</label>
            <input
              type="text"
              value={classroomName}
              onChange={e => setClassroomName(e.target.value)}
              placeholder="ej: Exploración del Sistema Solar"
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-2 block">Grado</label>
              <select
                value={classroomGrade}
                onChange={e => setClassroomGrade(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 appearance-none cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <option value="" className="bg-[#0a0a1e]">Seleccionar...</option>
                {gradeOptions.map(g => <option key={g} value={g} className="bg-[#0a0a1e]">{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-2 block">Materia</label>
              <select
                value={classroomSubject}
                onChange={e => setClassroomSubject(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 appearance-none cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <option value="" className="bg-[#0a0a1e]">Seleccionar...</option>
                {subjectOptions.map(s => <option key={s} value={s} className="bg-[#0a0a1e]">{s}</option>)}
              </select>
            </div>
          </div>

          <motion.button
            onClick={onCreate}
            className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-6"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #10b981)',
              boxShadow: '0 0 25px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
              color: 'white',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Send size={16} />
            Crear Aula
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================================
// 5. TEACHER DASHBOARD (after creating classroom)
// ============================================================
function TeacherDashboard({ classroomCode, students, onlineStudents, tasks, showNewTask, setShowNewTask, newTaskTitle, setNewTaskTitle, newTaskDesc, setNewTaskDesc }: {
  classroomCode: string
  students: typeof mockStudents
  onlineStudents: typeof mockStudents
  tasks: typeof mockTasks
  showNewTask: boolean
  setShowNewTask: (v: boolean) => void
  newTaskTitle: string
  setNewTaskTitle: (v: string) => void
  newTaskDesc: string
  setNewTaskDesc: (v: string) => void
}) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [teacherTab, setTeacherTab] = useState<'students' | 'tasks' | 'grades'>('students')
  const activeTasks = tasks.filter(t => t.status === 'active')
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(classroomCode).then(() => {
      setCopiedCode(true)
      toast.success('Código copiado al portapapeles')
      setTimeout(() => setCopiedCode(false), 2000)
    }).catch(() => {
      toast.success(`Código: ${classroomCode}`)
    })
  }

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error('Escribe un título para la tarea')
      return
    }
    toast.success('Tarea creada exitosamente')
    setNewTaskTitle('')
    setNewTaskDesc('')
    setShowNewTask(false)
  }

  const teacherTabs = [
    { id: 'students' as const, label: 'Estudiantes', icon: Users, color: '#10b981' },
    { id: 'tasks' as const, label: 'Tareas', icon: BookOpen, color: '#00d4ff' },
    { id: 'grades' as const, label: 'Calificaciones', icon: Trophy, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-6">
      {/* Classroom header */}
      <motion.div
        className="rounded-2xl p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        style={{ ...cardBase, background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(16,185,129,0.04))', border: '1px solid rgba(0,212,255,0.12)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,255,0.1)' }}>
            <GraduationCap size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-white/50 text-[10px] font-medium">CÓDIGO DEL AULA</p>
            <p className="text-xl font-mono font-bold text-white tracking-widest">{classroomCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {onlineStudents.slice(0, 4).map((s, i) => (
              <div key={s.id} className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 relative" style={{ background: '#0a0a1e', borderColor: '#0a0a1e', zIndex: 4 - i }}>
                {s.avatar}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a1e]" />
              </div>
            ))}
            {onlineStudents.length > 4 && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 relative" style={{ background: 'rgba(0,212,255,0.2)', borderColor: '#0a0a1e', zIndex: 0 }}>
                +{onlineStudents.length - 4}
              </div>
            )}
          </div>
          <span className="text-white/30 text-xs">{onlineStudents.length}/{students.length} online</span>
          <motion.button
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
            style={{ background: 'linear-gradient(to right, #00d4ff, #10b981)', boxShadow: '0 0 20px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)', color: 'white' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {copiedCode ? <CheckCheck size={14} /> : <Copy size={14} />}
            {copiedCode ? '¡Copiado!' : 'Copiar'}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Estudiantes', value: students.length, icon: Users, color: '#00d4ff' },
          { label: 'Progreso Prom.', value: `${avgProgress}%`, icon: Trophy, color: '#f59e0b' },
          { label: 'Tareas Activas', value: activeTasks.length, icon: ClipboardList, color: '#a855f7' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-4 relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}15` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-white/25 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Teacher sub-tabs */}
      <div className="flex gap-2">
        {teacherTabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setTeacherTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: teacherTab === tab.id ? `${tab.color}15` : 'rgba(255,255,255,0.03)',
              border: teacherTab === tab.id ? `1px solid ${tab.color}30` : '1px solid rgba(255,255,255,0.06)',
              color: teacherTab === tab.id ? tab.color : 'rgba(255,255,255,0.4)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <tab.icon size={14} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {teacherTab === 'students' && (
          <motion.div key="t-students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="rounded-2xl overflow-hidden" style={cardBase}>
              <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
              <div className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  Estudiantes del Aula
                  <span className="text-white/20 text-xs font-normal ml-auto">{students.length} total · {onlineStudents.length} en línea</span>
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {students.map((s, i) => (
                    <motion.div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all"
                      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl relative shrink-0" style={{ background: s.online ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}>
                        {s.avatar}
                        {s.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: 'rgba(5,5,16,0.95)' }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white/80 text-sm font-medium">{s.name}</p>
                          {s.online ? <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">ONLINE</span> : <span className="text-white/15 text-[9px]">{s.lastSeen}</span>}
                        </div>
                        <p className="text-white/25 text-[11px]">{s.grade} · {s.tasksCompleted}/{s.tasksTotal} tareas</p>
                      </div>
                      <div className="w-20 shrink-0">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div className="h-full rounded-full" style={{ background: s.progress >= 80 ? '#10b981' : s.progress >= 50 ? '#f59e0b' : '#ef4444' }} initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 0.6, delay: i * 0.04 }} />
                        </div>
                        <p className={`text-[10px] font-bold mt-1 text-right ${s.progress >= 80 ? 'text-emerald-400' : s.progress >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{s.progress}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {teacherTab === 'tasks' && (
          <motion.div key="t-tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BookOpen size={16} className="text-cyan-400" />
                Tareas del Aula
              </h3>
              <motion.button
                onClick={() => setShowNewTask(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: 'linear-gradient(to right, #00d4ff, #10b981)', boxShadow: '0 0 20px rgba(0,212,255,0.15)', color: 'white' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={14} />
                Nueva Tarea
              </motion.button>
            </div>

            <AnimatePresence>
              {showNewTask && (
                <motion.div className="rounded-2xl p-6 relative overflow-hidden" style={{ ...cardBase, border: '1px solid rgba(0,212,255,0.2)' }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold text-sm">Crear Nueva Tarea</h4>
                    <button onClick={() => setShowNewTask(false)} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
                  </div>
                  <div className="space-y-3">
                    <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Título de la tarea (ej: Ver video sobre Júpiter)" className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Descripción o instrucciones adicionales..." rows={3} className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div className="flex gap-2">
                      <motion.button onClick={handleCreateTask} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(to right, #00d4ff, #10b981)', color: 'white' }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Send size={14} />
                        Crear Tarea
                      </motion.button>
                      <button onClick={() => setShowNewTask(false)} className="px-4 py-2.5 rounded-xl text-sm text-white/40" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancelar</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {tasks.map((t, i) => (
                <motion.div key={t.id} className="rounded-xl p-5 relative overflow-hidden" style={{ ...cardBase, borderLeft: `3px solid ${t.color}`, opacity: t.status === 'completed' ? 0.5 : 1 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: t.status === 'completed' ? 0.5 : 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white/90 text-sm font-semibold">{t.title}</h4>
                        {t.type === 'video' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">VIDEO</span>}
                        {t.type === 'quiz' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-400/10 text-pink-400 border border-pink-400/20">QUIZ</span>}
                      </div>
                      <div className="flex items-center gap-4 text-white/30 text-[11px]">
                        <span className="flex items-center gap-1"><Clock size={10} /> {t.dueDate}</span>
                        <span className="flex items-center gap-1"><Check size={10} /> {t.completions}/{t.total} completadas</span>
                      </div>
                      <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div className="h-full rounded-full" style={{ background: t.color }} initial={{ width: 0 }} animate={{ width: `${(t.completions / t.total) * 100}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"><Eye size={14} /></button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"><MessageSquare size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {teacherTab === 'grades' && (
          <GradesPodium key="t-grades" students={students} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// 6. GRADES PODIUM (Teacher view)
// ============================================================
function GradesPodium({ students }: { students: typeof mockStudents }) {
  const sortedStudents = [...students].sort((a, b) => b.progress - a.progress)
  const getGrade = (p: number) => p >= 90 ? 'A' : p >= 80 ? 'B' : p >= 70 ? 'C' : p >= 60 ? 'D' : 'F'
  const getGradeColor = (g: string) => g === 'A' ? '#10b981' : g === 'B' ? '#00d4ff' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : '#ef4444'

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="rounded-2xl overflow-hidden" style={cardBase}>
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, transparent)" />
        <div className="p-6">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            Calificaciones del Curso
          </h3>
          <p className="text-white/30 text-xs mb-6">Basado en el progreso general de tareas completadas</p>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {sortedStudents.slice(0, 3).map((s, i) => {
              const medal = ['🥇', '🥈', '🥉'][i]
              const grade = getGrade(s.progress)
              return (
                <motion.div
                  key={s.id}
                  className="rounded-xl p-4 text-center relative overflow-hidden"
                  style={{ background: i === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.04)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-2xl">{medal}</span>
                  <p className="text-2xl mt-1">{s.avatar}</p>
                  <p className="text-white/80 text-xs font-medium mt-1 truncate">{s.name}</p>
                  <p className="text-3xl font-black mt-1" style={{ color: getGradeColor(grade) }}>{grade}</p>
                  <p className="text-white/30 text-[10px]">{s.progress}%</p>
                </motion.div>
              )
            })}
          </div>

          {/* Full list */}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {sortedStudents.map((s, i) => {
              const grade = getGrade(s.progress)
              return (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-all" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="text-white/20 text-xs font-mono w-5 text-center">{i + 1}</span>
                  <span className="text-lg">{s.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm">{s.name}</p>
                    <p className="text-white/20 text-[10px]">{s.grade} · {s.tasksCompleted}/{s.tasksTotal} tareas</p>
                  </div>
                  <div className="w-20">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: getGradeColor(grade) }} />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: `${getGradeColor(grade)}15`, color: getGradeColor(grade), border: `1px solid ${getGradeColor(grade)}25` }}>
                    {grade}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
