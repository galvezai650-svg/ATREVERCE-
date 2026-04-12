'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, GraduationCap, Play, Check, Clock, Video, BookOpen,
  Plus, Send, Eye, MessageSquare, Star, CircleDot, Trophy,
  ChevronRight, X, Copy, CheckCheck, ClipboardList, Award
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// AulaPage — Teacher's Classroom Dashboard
// ============================================================
export default function AulaPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'tasks' | 'grades'>('overview')
  const [copiedCode, setCopiedCode] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)

  const classroomCode = 'ASTRO-' + 'X7K2M9'

  // Mock students
  const students = [
    { id: '1', name: 'María López', avatar: '👩‍🎓', grade: '9°', progress: 85, online: true, lastSeen: 'Ahora', tasksCompleted: 7, tasksTotal: 8 },
    { id: '2', name: 'Carlos Pérez', avatar: '👨‍🎓', grade: '9°', progress: 72, online: true, lastSeen: 'Ahora', tasksCompleted: 6, tasksTotal: 8 },
    { id: '3', name: 'Ana García', avatar: '👩‍🚀', grade: '10°', progress: 100, online: true, lastSeen: 'Ahora', tasksCompleted: 8, tasksTotal: 8 },
    { id: '4', name: 'Juan Rodríguez', avatar: '🧑‍🎓', grade: '10°', progress: 50, online: false, lastSeen: 'Hace 2h', tasksCompleted: 4, tasksTotal: 8 },
    { id: '5', name: 'Sofía Martínez', avatar: '👩‍💻', grade: '9°', progress: 90, online: true, lastSeen: 'Ahora', tasksCompleted: 7, tasksTotal: 8 },
    { id: '6', name: 'Diego Torres', avatar: '🧑‍🚀', grade: '10°', progress: 38, online: false, lastSeen: 'Hace 5h', tasksCompleted: 3, tasksTotal: 8 },
    { id: '7', name: 'Valentina Ruiz', avatar: '👩‍🔬', grade: '9°', progress: 62, online: false, lastSeen: 'Hace 1h', tasksCompleted: 5, tasksTotal: 8 },
    { id: '8', name: 'Pedro Sánchez', avatar: '👨‍🚀', grade: '10°', progress: 95, online: true, lastSeen: 'Ahora', tasksCompleted: 8, tasksTotal: 8 },
  ]

  const onlineStudents = students.filter(s => s.online)
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)

  // Mock tasks/assignments
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Ver: Exploración Espacial', type: 'video', videoSrc: '/videos/video1.mp4', status: 'active' as const, dueDate: '20 Jul 2025', completions: 6, total: 8, color: '#00d4ff', emoji: '🚀' },
    { id: 't2', title: 'Ver: El Cosmos en Movimiento', type: 'video', videoSrc: '/videos/video2.mp4', status: 'active' as const, dueDate: '22 Jul 2025', completions: 4, total: 8, color: '#a855f7', emoji: '🌌' },
    { id: 't3', title: 'Simulador de Gravedad - Experimento', type: 'simulator', status: 'active' as const, dueDate: '25 Jul 2025', completions: 2, total: 8, color: '#f59e0b', emoji: '⚖️' },
    { id: 't4', title: 'Explorar el Sistema Solar 3D', type: 'interactive', status: 'active' as const, dueDate: '28 Jul 2025', completions: 5, total: 8, color: '#10b981', emoji: '🪐' },
    { id: 't5', title: 'Cuestionario: Planetas del Sistema Solar', type: 'quiz', status: 'completed' as const, dueDate: '15 Jul 2025', completions: 8, total: 8, color: '#ec4899', emoji: '📝' },
    { id: 't6', title: 'Investigación: Agujeros Negros', type: 'research', status: 'completed' as const, dueDate: '10 Jul 2025', completions: 7, total: 8, color: '#7c3aed', emoji: '🕳️' },
  ])

  const tabs = [
    { id: 'overview' as const, label: 'Panel General', icon: ClipboardList },
    { id: 'students' as const, label: 'Estudiantes', icon: Users },
    { id: 'tasks' as const, label: 'Tareas', icon: BookOpen },
    { id: 'grades' as const, label: 'Calificaciones', icon: Trophy },
  ]

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
    setTasks(prev => [{
      id: 't' + Date.now(),
      title: newTaskTitle,
      type: 'video',
      videoSrc: '',
      status: 'active',
      dueDate: '30 Jul 2025',
      completions: 0,
      total: 8,
      color: '#00d4ff',
      emoji: '📋',
    }, ...prev])
    setNewTaskTitle('')
    setNewTaskDesc('')
    setShowNewTask(false)
    toast.success('Tarea creada exitosamente')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="text-emerald-400" />
            Aula Virtual
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
          }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            EN VIVO
          </span>
        </div>
        <p className="text-white/40">Panel del profesor — Gestiona tu aula, estudiantes y tareas</p>
      </motion.div>

      {/* Classroom code bar */}
      <motion.div
        className="rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        style={{
          ...cardBase,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(16,185,129,0.04))',
          border: '1px solid rgba(0,212,255,0.12)',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,255,0.1)' }}>
            <Users size={18} className="text-cyan-400" />
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
          <motion.button
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #10b981)',
              boxShadow: '0 0 20px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
              color: 'white',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {copiedCode ? <CheckCheck size={14} /> : <Copy size={14} />}
            {copiedCode ? '¡Copiado!' : 'Copiar'}
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: activeTab === tab.id ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeTab === tab.id ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeTab === tab.id ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === tab.id ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="overview" students={students} onlineStudents={onlineStudents} avgProgress={avgProgress} tasks={tasks} />}
        {activeTab === 'students' && <StudentsTab key="students" students={students} />}
        {activeTab === 'tasks' && <TasksTab key="tasks" tasks={tasks} showNewTask={showNewTask} setShowNewTask={setShowNewTask} newTaskTitle={newTaskTitle} setNewTaskTitle={setNewTaskTitle} newTaskDesc={newTaskDesc} setNewTaskDesc={setNewTaskDesc} handleCreateTask={handleCreateTask} />}
        {activeTab === 'grades' && <GradesTab key="grades" students={students} />}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// Overview Tab
// ============================================================
function OverviewTab({ students, onlineStudents, avgProgress, tasks }: { students: any[]; onlineStudents: any[]; avgProgress: number; tasks: any[] }) {
  const activeTasks = tasks.filter(t => t.status === 'active')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  const stats = [
    { label: 'Estudiantes Totales', value: students.length, icon: Users, color: '#00d4ff' },
    { label: 'En Línea Ahora', value: onlineStudents.length, icon: CircleDot, color: '#10b981' },
    { label: 'Progreso Promedio', value: `${avgProgress}%`, icon: Trophy, color: '#f59e0b' },
    { label: 'Tareas Activas', value: activeTasks.length, icon: ClipboardList, color: '#a855f7' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ ...cardBase }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onHoverStart={e => { if (e.currentTarget) e.currentTarget.style.borderColor = `${s.color}30` }}
            onHoverEnd={e => { if (e.currentTarget) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              {s.label === 'En Línea Ahora' && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-white/30 text-[11px]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online students */}
        <motion.div className="rounded-2xl p-6 relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CardGradientTop color="linear-gradient(90deg, #10b981, transparent)" />
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CircleDot size={16} className="text-emerald-400" />
            Estudiantes en Línea
            <span className="text-emerald-400 text-xs font-bold ml-auto">{onlineStudents.length} conectados</span>
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {onlineStudents.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.03]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg relative" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  {s.avatar}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: 'rgba(5,5,16,0.95)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium">{s.name}</p>
                  <p className="text-white/25 text-[11px]">{s.grade} · {s.tasksCompleted}/{s.tasksTotal} tareas</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-xs font-bold">{s.progress}%</p>
                  <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active tasks preview */}
        <motion.div className="rounded-2xl p-6 relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <CardGradientTop color="linear-gradient(90deg, #f59e0b, transparent)" />
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-amber-400" />
            Tareas Activas
            <span className="text-amber-400 text-xs font-bold ml-auto">{activeTasks.length} pendientes</span>
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {activeTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-xl">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm font-medium truncate">{t.title}</p>
                  <p className="text-white/25 text-[11px] flex items-center gap-1.5">
                    <Clock size={10} />
                    Entrega: {t.dueDate}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold" style={{ color: t.color }}>{t.completions}/{t.total}</p>
                  <p className="text-white/20 text-[10px]">completadas</p>
                </div>
              </div>
            ))}
            {completedTasks.length > 0 && (
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/20 text-[10px] font-medium mb-2">✅ TAREAS FINALIZADAS ({completedTasks.length})</p>
                {completedTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-2 opacity-50">
                    <span className="text-base">{t.emoji}</span>
                    <p className="text-white/40 text-xs truncate flex-1">{t.title}</p>
                    <Check size={12} className="text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Students Tab
// ============================================================
function StudentsTab({ students }: { students: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="rounded-2xl overflow-hidden" style={cardBase}>
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Users size={18} className="text-cyan-400" />
              Todos los Estudiantes
            </h3>
            <span className="text-white/30 text-xs">{students.length} estudiantes</span>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {students.map((s, i) => (
              <motion.div
                key={s.id}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.03]"
                style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl relative shrink-0" style={{ background: s.online ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  {s.avatar}
                  {s.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: 'rgba(5,5,16,0.95)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-sm font-medium">{s.name}</p>
                    {s.online ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">EN LÍNEA</span>
                    ) : (
                      <span className="text-white/15 text-[9px]">{s.lastSeen}</span>
                    )}
                  </div>
                  <p className="text-white/25 text-xs">{s.grade} · Última actividad: {s.lastSeen}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-white/40 text-[10px]">Tareas</p>
                    <p className="text-white font-bold text-sm">{s.tasksCompleted}/{s.tasksTotal}</p>
                  </div>
                  <div className="text-right w-16">
                    <p className="text-white/40 text-[10px]">Progreso</p>
                    <p className={`text-xs font-bold ${s.progress >= 80 ? 'text-emerald-400' : s.progress >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{s.progress}%</p>
                  </div>
                  <div className="w-20">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: s.progress >= 80 ? '#10b981' : s.progress >= 50 ? '#f59e0b' : '#ef4444' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Tasks Tab
// ============================================================
function TasksTab({ tasks, showNewTask, setShowNewTask, newTaskTitle, setNewTaskTitle, newTaskDesc, setNewTaskDesc, handleCreateTask }: any) {
  const activeTasks = tasks.filter((t: any) => t.status === 'active')
  const completedTasks = tasks.filter((t: any) => t.status === 'completed')

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* New task button */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <BookOpen size={18} className="text-amber-400" />
          Tareas Asignadas
        </h3>
        <motion.button
          onClick={() => setShowNewTask(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{
            background: 'linear-gradient(to right, #00d4ff, #10b981)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2)',
            color: 'white',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} />
          Nueva Tarea
        </motion.button>
      </div>

      {/* New task modal */}
      <AnimatePresence>
        {showNewTask && (
          <motion.div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ ...cardBase, border: '1px solid rgba(0,212,255,0.2)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold text-sm">Crear Nueva Tarea</h4>
              <button onClick={() => setShowNewTask(false)} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Título de la tarea (ej: Ver video sobre Júpiter)"
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <textarea
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                placeholder="Descripción o instrucciones adicionales..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <div className="flex gap-2">
                <motion.button onClick={handleCreateTask} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(to right, #00d4ff, #10b981)', color: 'white' }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Send size={14} />
                  Crear Tarea
                </motion.button>
                <button onClick={() => setShowNewTask(false)} className="px-4 py-2.5 rounded-xl text-sm text-white/40" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active tasks */}
      <div>
        <p className="text-white/30 text-xs font-medium mb-3 tracking-wider">📋 TAREAS ACTIVAS ({activeTasks.length})</p>
        <div className="space-y-3">
          {activeTasks.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              className="rounded-xl p-5 relative overflow-hidden"
              style={{ ...cardBase, borderLeft: `3px solid ${t.color}` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white/90 text-sm font-semibold">{t.title}</h4>
                    {t.type === 'video' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">VIDEO</span>}
                    {t.type === 'simulator' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">SIMULADOR</span>}
                    {t.type === 'interactive' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">INTERACTIVO</span>}
                  </div>
                  <div className="flex items-center gap-4 text-white/30 text-[11px]">
                    <span className="flex items-center gap-1"><Clock size={10} /> {t.dueDate}</span>
                    <span className="flex items-center gap-1"><Check size={10} /> {t.completions}/{t.total} completadas</span>
                  </div>
                  <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: t.color }} initial={{ width: 0 }} animate={{ width: `${(t.completions / t.total) * 100}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all" title="Ver detalles">
                    <Eye size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all" title="Enviar mensaje">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <p className="text-white/20 text-xs font-medium mb-3 tracking-wider">✅ COMPLETADAS ({completedTasks.length})</p>
          <div className="space-y-2 opacity-50">
            {completedTasks.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-lg">{t.emoji}</span>
                <p className="text-white/50 text-sm flex-1">{t.title}</p>
                <span className="text-emerald-400 text-xs font-bold">{t.completions}/{t.total}</span>
                <Award size={14} className="text-amber-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================
// Grades Tab
// ============================================================
function GradesTab({ students }: { students: any[] }) {
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
                  style={{
                    background: i === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
                    border: i === 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.04)',
                  }}
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
          <div className="space-y-2 max-h-80 overflow-y-auto">
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
