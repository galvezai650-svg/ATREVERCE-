'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Orbit, Home, Compass, Box, FlaskConical, Crown, User,
  MessageSquare, LogOut, Search, Play, Heart, Star,
  Check, ChevronDown, ChevronUp, Send, Sparkles,
  ArrowRight, Zap, Clock, BookOpen, Globe2, Lock,
  Shield, Eye, X, Menu, Cpu, HelpCircle, Bookmark,
  BookmarkCheck, RefreshCw, ArrowUpDown, Bell,
  Edit3, Save, RotateCcw, Rocket, BarChart3, Activity
} from 'lucide-react'
import { toast } from 'sonner'

// ============================================================
// Shared Styles & Helpers
// ============================================================

const cardBase = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(24px)',
}

const cardHoverStyle = (color: string = 'rgba(0,212,255,0.4)') => ({
  boxShadow: `0 0 30px ${color.replace('0.4', '0.08')}, 0 8px 32px rgba(0,0,0,0.3)`,
})

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Gradient top line component for cards
function CardGradientTop({ color = 'linear-gradient(90deg, #00d4ff, #7c3aed)' }: { color?: string }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60"
      style={{ background: color }}
    />
  )
}

// ============================================================
// Sidebar Navigation
// ============================================================
const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'models3d', label: 'Modelos 3D', icon: Box },
  { id: 'simulators', label: 'Simuladores', icon: FlaskConical },
  { id: 'premium', label: 'Premium', icon: Crown },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'ai-chat', label: 'Asistente IA', icon: MessageSquare },
]

function Sidebar({
  activePage, onNavigate, userName, onLogout, collapsed, onToggleCollapse
}: {
  activePage: string
  onNavigate: (id: string) => void
  userName: string
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onToggleCollapse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        } transition-all duration-300`}
        style={{
          background: 'rgba(5,5,16,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}
          >
            <Orbit size={20} className="text-white" />
          </div>
          {!collapsed && (
            <motion.span
              className="text-lg font-bold whitespace-nowrap"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              AstroVerse
            </motion.span>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-5 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          <X size={18} />
        </button>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); if (window.innerWidth < 1024) onToggleCollapse() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? '' : 'hover:bg-white/[0.04]'}`}
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                  color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
                }}
              >
                <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-white/30 text-xs truncate">Explorador</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-200 active:scale-[0.98] ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ============================================================
// HomePage - Dashboard
// ============================================================
function HomePage({ userName, onNavigate }: { userName: string; onNavigate?: (page: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [factIndex, setFactIndex] = useState(0)

  const videos = [
    { id: 'v1', title: 'El Sistema Solar: Un Viaje Increíble', desc: 'Explora los 8 planetas y sus características únicas', gradient: 'from-cyan-500/20 to-violet-500/20', duration: '12:34', color: '#00d4ff' },
    { id: 'v2', title: 'Agujeros Negros: Misterios del Espacio', desc: 'Descubre qué hay dentro de un agujero negro', gradient: 'from-violet-500/20 to-pink-500/20', duration: '18:45', color: '#7c3aed' },
    { id: 'v3', title: 'La Vía Láctea: Nuestra Galaxia', desc: 'Un recorrido por nuestra galaxia espiral', gradient: 'from-pink-500/20 to-amber-500/20', duration: '15:22', color: '#ec4899' },
    { id: 'v4', title: 'Nebulosas: Fábricas de Estrellas', desc: 'Las cunas donde nacen las estrellas', gradient: 'from-amber-500/20 to-emerald-500/20', duration: '10:18', color: '#f59e0b' },
    { id: 'v5', title: 'Marte: El Planeta Rojo', desc: 'Todo sobre el planeta que podría albergar vida', gradient: 'from-emerald-500/20 to-cyan-500/20', duration: '14:56', color: '#10b981' },
    { id: 'v6', title: 'Eclipse Solar: Fenómeno Cósmico', desc: 'La ciencia detrás de los eclipses', gradient: 'from-cyan-500/20 to-pink-500/20', duration: '8:33', color: '#00d4ff' },
  ]

  const spaceFacts = [
    'La Gran Muralla de Hércules es la estructura más grande conocida en el universo observable, con aproximadamente 10 mil millones de años luz de diámetro.',
    'Un día en Venus es más largo que un año en Venus. Tarda 243 días terrestres en rotar sobre su eje, pero solo 225 días en orbitar el Sol.',
    'Si pudieras conducir un coche a la velocidad de la luz, tardarías 8 minutos y 19 segundos en llegar al Sol.',
    'Neptuno no ha completado ni una sola órbita desde que fue descubierto en 1846. Su año dura 165 años terrestres.',
    'Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra. Se estima que hay 70 sextillones de estrellas.',
    'El sonido viaja aproximadamente 4.3 veces más rápido en el agua que en el aire. En el espacio no hay sonido porque no hay medio para propagarse.',
    'La estrella más grande conocida, UY Scuti, tiene un radio 1,700 veces mayor que el del Sol.',
  ]

  const filteredVideos = searchQuery.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : videos

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast.info('Eliminado de marcadores')
      } else {
        next.add(id)
        toast.success('Añadido a marcadores')
      }
      return next
    })
  }

  const cycleFact = () => {
    setFactIndex(prev => (prev + 1) % spaceFacts.length)
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Hola, {userName} 👋
        </h1>
        <p className="text-white/40">Bienvenido de vuelta a AstroVerse. ¿Qué quieres explorar hoy?</p>
      </motion.div>

      {/* Search bar */}
      <motion.div className="relative max-w-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar planetas, galaxias, nebulosas..."
          className="w-full pl-12 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-white/20 transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        />
      </motion.div>

      {/* Quick action buttons */}
      {onNavigate && (
        <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {[
            { label: 'Explorar', icon: Compass, page: 'explore', color: '#00d4ff' },
            { label: 'Simuladores', icon: FlaskConical, page: 'simulators', color: '#f59e0b' },
            { label: 'Premium', icon: Crown, page: 'premium', color: '#ec4899' },
          ].map(btn => (
            <button
              key={btn.page}
              onClick={() => onNavigate(btn.page)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: `${btn.color}10`,
                border: `1px solid ${btn.color}25`,
                color: btn.color,
                boxShadow: `0 0 0px ${btn.color}00`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 20px ${btn.color}15`
                e.currentTarget.style.background = `${btn.color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = `0 0 0px ${btn.color}00`
                e.currentTarget.style.background = `${btn.color}10`
              }}
            >
              <btn.icon size={16} />
              {btn.label}
              <ArrowRight size={14} className="opacity-50" />
            </button>
          ))}
        </motion.div>
      )}

      {/* Dato del día */}
      <motion.div
        className="rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #f59e0b00)" />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(40px)' }} />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-sm">Dato del día</h3>
              <button
                onClick={cycleFact}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-400/60 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200 active:scale-90"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                className="text-white/50 text-sm leading-relaxed"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {spaceFacts[factIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Videos grid */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-xl font-bold text-white mb-4">Videos Destacados</h2>
        <AnimatePresence mode="wait">
          {filteredVideos.length === 0 ? (
            <motion.div
              key="empty"
              className="rounded-2xl p-12 text-center backdrop-blur-xl"
              style={cardBase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Search size={40} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/40 text-lg font-medium">No se encontraron resultados</p>
              <p className="text-white/20 text-sm mt-1">Intenta con otros términos de búsqueda</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  className="group cursor-pointer rounded-xl overflow-hidden backdrop-blur-xl relative"
                  style={{
                    ...cardBase,
                  }}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={e => {
                    e.currentTarget.style.borderColor = `${video.color}30`
                    e.currentTarget.style.boxShadow = `0 0 25px ${video.color}10, 0 8px 32px rgba(0,0,0,0.3)`
                  }}
                  onHoverEnd={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => toast.info(`Reproduciendo: ${video.title}`)}
                >
                  <CardGradientTop color={`linear-gradient(90deg, ${video.color}, transparent)`} />
                  {/* Thumbnail */}
                  <div className={`relative h-40 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110">
                      <Play size={20} className="text-white ml-0.5" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white/80 bg-black/40 backdrop-blur-sm">
                      {video.duration}
                    </div>
                    {/* Bookmark button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(video.id) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all duration-200 active:scale-90 hover:scale-110"
                    >
                      {bookmarks.has(video.id) ? (
                        <BookmarkCheck size={16} className="text-amber-400" />
                      ) : (
                        <Bookmark size={16} className="text-white/50" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{video.title}</h3>
                    <p className="text-white/40 text-xs">{video.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ============================================================
// ExplorePage
// ============================================================
function ExplorePage() {
  const categories = ['Todos', 'Planetas', 'Agujeros Negros', 'Galaxias', 'Nebulosas', 'Estrellas']
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'recent'>('recent')
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null)

  const items = [
    { id: '1', title: 'Júpiter', desc: 'El planeta más grande del sistema solar. Su Gran Mancha Roja es una tormenta que ha durado más de 300 años. Tiene 79 lunas conocidas.', category: 'Planetas', emoji: '🪐', gradient: 'from-amber-800/30 to-amber-500/10', color: '#f59e0b' },
    { id: '2', title: 'Saturno', desc: 'Famoso por sus impresionantes anillos compuestos de hielo y roca. Es el segundo planeta más grande del sistema solar.', category: 'Planetas', emoji: '🪐', gradient: 'from-yellow-800/30 to-yellow-500/10', color: '#eab308' },
    { id: '3', title: 'Venus', desc: 'El planeta más caliente del sistema solar con temperaturas de hasta 465°C. Su atmósfera es densa y tóxica.', category: 'Planetas', emoji: '🌙', gradient: 'from-orange-800/30 to-orange-500/10', color: '#f97316' },
    { id: '4', title: 'Sagitario A*', desc: 'El agujero negro supermasivo del centro de la Vía Láctea. Tiene una masa de 4 millones de veces la del Sol.', category: 'Agujeros Negros', emoji: '🕳️', gradient: 'from-violet-900/30 to-violet-500/10', color: '#7c3aed' },
    { id: '5', title: 'M87*', desc: 'El primer agujero negro fotografiado en 2019. Está a 55 millones de años luz en la galaxia Messier 87.', category: 'Agujeros Negros', emoji: '🕳️', gradient: 'from-purple-900/30 to-purple-500/10', color: '#a855f7' },
    { id: '6', title: 'Vía Láctea', desc: 'Nuestra galaxia espiral con 200 mil millones de estrellas. Tiene un diámetro de aproximadamente 100,000 años luz.', category: 'Galaxias', emoji: '🌌', gradient: 'from-cyan-900/30 to-cyan-500/10', color: '#00d4ff' },
    { id: '7', title: 'Andrómeda', desc: 'La galaxia más cercana a la Vía Láctea. Se encuentra a 2.5 millones de años luz y se acerca a nosotros.', category: 'Galaxias', emoji: '🌌', gradient: 'from-blue-900/30 to-blue-500/10', color: '#3b82f6' },
    { id: '8', title: 'Nebulosa de Orión', desc: 'Una de las nebulosas más brillantes del cielo nocturno. Es una cuna estelar donde nacen nuevas estrellas.', category: 'Nebulosas', emoji: '🌫️', gradient: 'from-pink-900/30 to-pink-500/10', color: '#ec4899' },
    { id: '9', title: 'Nebulosa Cabeza de Caballo', desc: 'Famosa nebulosa oscura en la constelación de Orión. Tiene una forma que recuerda a un caballo.', category: 'Nebulosas', emoji: '🌫️', gradient: 'from-red-900/30 to-red-500/10', color: '#ef4444' },
    { id: '10', title: 'Sirio', desc: 'La estrella más brillante vista desde la Tierra. Es un sistema estelar doble a 8.6 años luz.', category: 'Estrellas', emoji: '⭐', gradient: 'from-yellow-900/30 to-yellow-500/10', color: '#f59e0b' },
  ]

  let filtered = activeCategory === 'Todos' ? items : items.filter(i => i.category === activeCategory)
  if (sortBy === 'az') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
  else if (sortBy === 'za') filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title))

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast.info('Eliminado de favoritos')
      } else {
        next.add(id)
        toast.success('Añadido a favoritos')
      }
      return next
    })
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explorar</h1>
        <p className="text-white/40">Descubre los misterios del universo</p>
      </motion.div>

      {/* Category filters + Sort */}
      <motion.div className="flex flex-wrap items-center gap-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: activeCategory === cat ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeCategory === cat ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeCategory === cat ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeCategory === cat ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            {cat}
          </button>
        ))}

        {/* Sort divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Sort buttons */}
        {([
          { label: 'Nombre A-Z', value: 'az' as const },
          { label: 'Nombre Z-A', value: 'za' as const },
          { label: 'Recientes', value: 'recent' as const },
        ]).map(sort => (
          <button
            key={sort.value}
            onClick={() => setSortBy(sort.value)}
            className="px-3 py-2 rounded-xl text-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5"
            style={{
              background: sortBy === sort.value ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
              border: sortBy === sort.value ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: sortBy === sort.value ? '#a78bfa' : 'rgba(255,255,255,0.4)',
            }}
          >
            <ArrowUpDown size={12} />
            {sort.label}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        key={`${activeCategory}-${sortBy}`}
      >
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            className="group cursor-pointer rounded-xl overflow-hidden backdrop-blur-xl relative"
            style={cardBase}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            onHoverStart={e => {
              e.currentTarget.style.borderColor = `${item.color}30`
              e.currentTarget.style.boxShadow = `0 0 25px ${item.color}10, 0 8px 32px rgba(0,0,0,0.3)`
            }}
            onHoverEnd={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => setSelectedItem(item)}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${item.color}, transparent)`} />
            {/* Image placeholder */}
            <div className={`relative h-36 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFav(item.id) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all duration-200 active:scale-90 hover:scale-110"
              >
                <Heart
                  size={16}
                  className={favorites.has(item.id) ? 'text-pink-400 fill-pink-400' : 'text-white/60'}
                />
              </button>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs text-white/70 bg-black/30 backdrop-blur-sm">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              <p className="text-white/40 text-xs line-clamp-2">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-[61] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-lg rounded-2xl overflow-hidden relative backdrop-blur-xl"
                style={{
                  ...cardBase,
                  background: 'rgba(10,10,30,0.95)',
                }}
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <CardGradientTop color={`linear-gradient(90deg, ${selectedItem.color}, ${selectedItem.color}00)`} />
                <div className={`relative h-48 bg-gradient-to-br ${selectedItem.gradient} flex items-center justify-center`}>
                  <motion.span
                    className="text-7xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                  >
                    {selectedItem.emoji}
                  </motion.span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all duration-200 active:scale-90"
                  >
                    <X size={16} />
                  </button>
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-medium text-white/80 bg-black/30 backdrop-blur-sm">
                    {selectedItem.category}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                    <p className="text-white/50 text-sm leading-relaxed">{selectedItem.desc}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        toggleFav(selectedItem.id)
                        setSelectedItem(null)
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: favorites.has(selectedItem.id) ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${favorites.has(selectedItem.id) ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: favorites.has(selectedItem.id) ? '#ec4899' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Heart size={16} className={favorites.has(selectedItem.id) ? 'fill-pink-400' : ''} />
                      {favorites.has(selectedItem.id) ? 'En favoritos' : 'Añadir a favoritos'}
                    </button>
                    <button
                      onClick={() => {
                        toast.info(`Explorando: ${selectedItem.title}`)
                        setSelectedItem(null)
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium shimmer flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: `linear-gradient(135deg, ${selectedItem.color}, ${selectedItem.color}99)`,
                        color: 'white',
                        boxShadow: `0 0 25px ${selectedItem.color}30, 0 4px 15px rgba(0,0,0,0.3)`,
                      }}
                    >
                      <Eye size={16} />
                      Ver más
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// Models3DPage
// ============================================================
function Models3DPage() {
  const [notifyEmail, setNotifyEmail] = useState('')
  const [selectedPlanet, setSelectedPlanet] = useState<typeof planets[0] | null>(null)
  const [viewer3D, setViewer3D] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)

  const nasa3DModels: Record<string, string> = {
    'Tierra': 'https://solarsystem.nasa.gov/gltf_embed/2393/',
  }

  const planets = [
    { name: 'Mercurio', gradient: 'from-gray-600 to-gray-800', size: '4,879 km', desc: 'El planeta más pequeño y cercano al Sol. No tiene atmósfera y sus temperaturas varían entre -180°C y 430°C.', moons: 0, dayLength: '59 días', color: '#9ca3af' },
    { name: 'Venus', gradient: 'from-orange-400 to-yellow-600', size: '12,104 km', desc: 'El planeta más caliente del sistema solar. Su densa atmósfera de CO2 crea un efecto invernadero extremo.', moons: 0, dayLength: '243 días', color: '#f97316' },
    { name: 'Tierra', gradient: 'from-cyan-400 to-blue-600', size: '12,756 km', desc: 'Nuestro hogar, el planeta azul. Único planeta conocido con vida y agua líquida en su superficie.', moons: 1, dayLength: '24 horas', color: '#00d4ff', has3D: true },
    { name: 'Marte', gradient: 'from-red-500 to-red-800', size: '6,792 km', desc: 'El planeta rojo, objetivo de exploración humana. Tiene el volcán más alto del sistema solar: Monte Olimpo.', moons: 2, dayLength: '24.6 horas', color: '#ef4444' },
    { name: 'Júpiter', gradient: 'from-amber-500 to-orange-700', size: '142,984 km', desc: 'El gigante gaseoso más grande. Su Gran Mancha Roja es una tormenta mayor que la Tierra.', moons: 95, dayLength: '10 horas', color: '#f59e0b' },
    { name: 'Saturno', gradient: 'from-yellow-400 to-amber-600', size: '120,536 km', desc: 'Famoso por sus anillos espectaculares compuestos de hielo y roca. Es menos denso que el agua.', moons: 146, dayLength: '10.7 horas', color: '#eab308' },
    { name: 'Urano', gradient: 'from-cyan-300 to-teal-500', size: '51,118 km', desc: 'El gigante de hielo inclinado. Rota de lado con una inclinación de 98 grados.', moons: 27, dayLength: '17 horas', color: '#14b8a6' },
    { name: 'Neptuno', gradient: 'from-blue-500 to-indigo-700', size: '49,528 km', desc: 'El planeta más lejano del sistema solar. Tiene los vientos más rápidos, hasta 2,100 km/h.', moons: 16, dayLength: '16 horas', color: '#6366f1' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Modelos 3D</h1>
        <p className="text-white/40">Visualiza los planetas del sistema solar en tres dimensiones</p>
      </motion.div>

      {/* Coming soon banner with notification */}
      <motion.div
        className="rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl"
        style={{
          background: 'rgba(124,58,237,0.05)',
          border: '1px solid rgba(124,58,237,0.15)',
          backdropFilter: 'blur(24px)',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #7c3aed, transparent)" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <Box size={24} className="text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">Modelos 3D Interactivos</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                🌍 Tierra disponible
              </span>
            </div>
            <p className="text-white/40 text-sm mt-1">¡La Tierra ya tiene su modelo 3D interactivo! Haz clic en la tarjeta para explorarla. Más planetas próximamente.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <input
              type="email"
              value={notifyEmail}
              onChange={e => setNotifyEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 sm:w-48 px-3 py-2 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button
              onClick={() => {
                if (notifyEmail.includes('@')) {
                  toast.success('¡Te notificaremos cuando esté listo!')
                  setNotifyEmail('')
                } else {
                  toast.error('Por favor, introduce un email válido')
                }
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 active:scale-[0.98] shimmer"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white',
                boxShadow: '0 0 25px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <Bell size={14} />
              Notificarme
            </button>
          </div>
        </div>
      </motion.div>

      {/* Planet cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {planets.map((planet, i) => (
          <motion.div
            key={planet.name}
            className="rounded-xl p-5 text-center relative overflow-hidden group cursor-pointer backdrop-blur-xl"
            style={cardBase}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            onHoverStart={e => {
              e.currentTarget.style.borderColor = `${planet.color}30`
              e.currentTarget.style.boxShadow = `0 0 25px ${planet.color}10, 0 8px 32px rgba(0,0,0,0.3)`
            }}
            onHoverEnd={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => {
              if ((planet as any).has3D && nasa3DModels[planet.name]) {
                setViewerLoading(true)
                setViewer3D(nasa3DModels[planet.name])
              } else {
                setSelectedPlanet(planet)
              }
            }}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${planet.color}, transparent)`} />
            {/* Badge: 3D Disponible or Próximamente */}
            {(planet as any).has3D ? (
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                <Box size={10} />
                3D Listo
              </div>
            ) : (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium text-violet-400" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                Próximamente
              </div>
            )}
            {/* 3D Glow ring for Earth */}
            {(planet as any).has3D && (
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${planet.color}08` }} />
            )}

            {/* Planet circle with hover rotation */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${planet.gradient} shadow-lg planet-spin`}
                style={{
                  boxShadow: `0 0 30px rgba(0,0,0,0.3), inset -8px -4px 15px rgba(0,0,0,0.4)`,
                }}
              />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{planet.name}</h3>
            <p className="text-white/30 text-xs mb-2">{planet.size}</p>
            <p className="text-white/40 text-xs leading-relaxed">{planet.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== 3D VIEWER MODAL ===== */}
      <AnimatePresence>
        {viewer3D && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed inset-0 z-[71] flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Viewer Header Bar */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0" style={{ background: 'rgba(5,5,16,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                    <Box size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm">Modelo 3D — Tierra</h2>
                    <p className="text-white/30 text-[10px]">Cortesía de NASA Solar System Exploration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setViewer3D(null)
                      setViewerLoading(false)
                      toast.info('Visor 3D cerrado')
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-200 active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <ArrowRight size={14} className="rotate-180" />
                    Volver
                  </button>
                  <button
                    onClick={() => setViewer3D(null)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* 3D Content Area */}
              <div className="flex-1 relative">
                {viewerLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(5,5,16,0.9)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                      <Globe2 size={28} className="text-white animate-pulse" />
                      <div className="absolute inset-0 rounded-2xl" style={{ animation: 'spin 3s linear infinite', background: 'conic-gradient(from 0deg, transparent, rgba(0,212,255,0.3), transparent)', padding: '2px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm">Cargando Modelo 3D de la Tierra</p>
                      <p className="text-white/30 text-xs mt-1">Conectando con NASA Solar System...</p>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <iframe
                  src={viewer3D}
                  className="w-full h-full border-0"
                  style={{ background: '#050510' }}
                  onLoad={() => {
                    setViewerLoading(false)
                    toast.success('¡Modelo 3D de la Tierra cargado!')
                  }}
                  title="NASA 3D Model - Earth"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>

              {/* Viewer Bottom Bar */}
              <div className="flex items-center justify-between px-4 md:px-6 py-2.5 shrink-0" style={{ background: 'rgba(5,5,16,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/30 text-[10px]">Conectado a NASA</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-white/20 text-[10px]">
                    <Globe2 size={10} />
                    <span>Datos oficiales de la NASA</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/20 text-[10px]">🖱️ Arrastra para rotar · Scroll para zoom</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Planet detail modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedPlanet(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-[61] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-2xl overflow-hidden relative backdrop-blur-xl"
                style={{
                  ...cardBase,
                  background: 'rgba(10,10,30,0.95)',
                }}
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <CardGradientTop color={`linear-gradient(90deg, ${selectedPlanet.color}, transparent)`} />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedPlanet.gradient} shadow-lg`}
                        style={{
                          boxShadow: `0 0 40px ${selectedPlanet.color}30, inset -8px -4px 15px rgba(0,0,0,0.4)`,
                        }}
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPlanet.name}</h2>
                        <p className="text-white/40 text-sm">{selectedPlanet.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPlanet(null)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{selectedPlanet.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Diámetro', value: selectedPlanet.size },
                      { label: 'Lunas', value: String(selectedPlanet.moons) },
                      { label: 'Duración del día', value: selectedPlanet.dayLength },
                      { label: 'Estado', value: 'Próximamente' },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-white/30 text-[10px] mb-0.5">{stat.label}</p>
                        <p className="text-white/70 text-sm font-medium">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// SimulatorsPage
// ============================================================
function SimulatorsPage() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: 'Peso Planetario', icon: Globe2 },
    { label: 'Gravedad', icon: Zap },
    { label: 'Edad Espacial', icon: Clock },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Simuladores</h1>
        <p className="text-white/40">Experimenta la física espacial de forma interactiva</p>
      </motion.div>

      {/* Tabs */}
      <motion.div className="flex gap-2 overflow-x-auto pb-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: activeTab === i ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeTab === i ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeTab === i ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === i ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 0 && <WeightCalculatorEnhanced key="weight" />}
        {activeTab === 1 && <GravitySimulator key="gravity" />}
        {activeTab === 2 && <AgeInSpaceCalculator key="age" />}
      </AnimatePresence>
    </div>
  )
}

// Weight Calculator (enhanced version)
function WeightCalculatorEnhanced() {
  const planets = [
    { name: 'Mercurio', emoji: '☿', factor: 0.38, gravity: '3.7 m/s²', distance: '57.9M km' },
    { name: 'Venus', emoji: '♀', factor: 0.91, gravity: '8.87 m/s²', distance: '108.2M km' },
    { name: 'Marte', emoji: '♂', factor: 0.38, gravity: '3.72 m/s²', distance: '227.9M km' },
    { name: 'Júpiter', emoji: '♃', factor: 2.34, gravity: '24.79 m/s²', distance: '778.6M km' },
    { name: 'Saturno', emoji: '♄', factor: 1.06, gravity: '10.44 m/s²', distance: '1.43B km' },
    { name: 'Luna', emoji: '🌙', factor: 0.16, gravity: '1.62 m/s²', distance: '384K km' },
    { name: 'Neptuno', emoji: '♆', factor: 1.19, gravity: '11.15 m/s²', distance: '4.5B km' },
    { name: 'Urano', emoji: ' us', factor: 0.92, gravity: '8.69 m/s²', distance: '2.87B km' },
  ]

  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [weight, setWeight] = useState(70)
  const [showComparison, setShowComparison] = useState(false)
  const result = (weight * selectedPlanet.factor).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #f59e0b, transparent)" />
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Cpu size={20} className="text-amber-400" />
          Calculadora de Peso Planetario
        </h3>
        <button
          onClick={() => {
            setShowComparison(!showComparison)
            if (!showComparison) toast.info('Tabla de comparación activada')
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]"
          style={{
            background: showComparison ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
            border: showComparison ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
            color: showComparison ? '#f59e0b' : 'rgba(255,255,255,0.6)',
          }}
        >
          <BarChart3 size={16} />
          Comparar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-xs mb-2 block">Tu peso en la Tierra (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value) || 0)}
              className="w-full rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-2 block">Selecciona un planeta</label>
            <div className="grid grid-cols-4 gap-2">
              {planets.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className="rounded-lg px-2 py-2 text-xs transition-all duration-200 text-center hover:scale-[1.05] active:scale-[0.95]"
                  style={{
                    background: selectedPlanet.name === p.name ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedPlanet.name === p.name ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: selectedPlanet.name === p.name ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                    boxShadow: selectedPlanet.name === p.name ? '0 0 12px rgba(245,158,11,0.1)' : 'none',
                  }}
                >
                  <div className="text-lg mb-0.5">{p.emoji}</div>
                  <div className="truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
            key={selectedPlanet.name + result}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
          >
            <p className="text-white/40 text-xs mb-1">Tu peso en {selectedPlanet.name}</p>
            <p className="text-4xl font-bold text-amber-400">{selectedPlanet.emoji} {result} kg</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Gravedad</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.gravity}</p>
            </div>
            <div className="rounded-lg p-3 text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Distancia al Sol</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.distance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <h4 className="text-white/60 text-sm font-medium mb-3">Tu peso en todos los planetas:</h4>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Planeta</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Gravedad</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Tu Peso</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Distancia</div>
                {planets.map(p => (
                  <React.Fragment key={p.name}>
                    <div className="p-2.5 text-center text-sm flex items-center justify-center gap-1" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.7)' }}>
                      <span>{p.emoji}</span>
                      <span className="text-xs">{p.name}</span>
                    </div>
                    <div className="p-2.5 text-center text-xs font-mono" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.5)' }}>
                      {p.gravity}
                    </div>
                    <div className="p-2.5 text-center text-sm font-bold" style={{ background: 'rgba(10,10,25,0.9)', color: '#f59e0b' }}>
                      {(weight * p.factor).toFixed(1)} kg
                    </div>
                    <div className="p-2.5 text-center text-xs font-mono" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)' }}>
                      {p.distance}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Gravity Simulator - Ball bouncing animation
function GravitySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gravity, setGravity] = useState(9.8)
  const ballRef = useRef({ x: 200, y: 50, vy: 0, vx: 2 })
  const gravityRef = useRef(gravity)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])

  const resetBall = useCallback(() => {
    ballRef.current = { x: 200, y: 50, vy: 0, vx: 2 }
    toast.info('Pelota reiniciada')
  }, [])

  const launchBall = useCallback(() => {
    ballRef.current.vy = -(Math.random() * 8 + 5)
    ballRef.current.vx = (Math.random() - 0.5) * 6
    toast.success('¡Pelota lanzada!')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setupCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    setupCanvas()
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    const ball = ballRef.current
    const radius = 12
    let animId: number

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Ground line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h - 20)
      ctx.lineTo(w, h - 20)
      ctx.stroke()

      // Physics
      ball.vy += gravityRef.current * 0.05
      ball.y += ball.vy
      ball.x += ball.vx

      // Bounce
      if (ball.y + radius > h - 20) {
        ball.y = h - 20 - radius
        ball.vy *= -0.75
      }
      if (ball.x + radius > w || ball.x - radius < 0) {
        ball.vx *= -1
        ball.x = Math.max(radius, Math.min(w - radius, ball.x))
      }

      // Ball glow
      const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, radius * 3)
      gradient.addColorStop(0, 'rgba(0,212,255,0.3)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Ball
      const ballGradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, radius)
      ballGradient.addColorStop(0, '#00d4ff')
      ballGradient.addColorStop(1, '#7c3aed')
      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        setupCanvas()
      }, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
    }
  }, [])

  const planetGravities = [
    { name: 'Luna', g: 1.62 },
    { name: 'Marte', g: 3.72 },
    { name: 'Tierra', g: 9.8 },
    { name: 'Júpiter', g: 24.79 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-4 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Zap size={20} className="text-cyan-400" />
          Simulador de Gravedad
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetBall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={launchBall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium shimmer transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: 'white',
              boxShadow: '0 0 25px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <Rocket size={14} />
            Lanzar
          </button>
        </div>
      </div>
      <p className="text-white/40 text-sm">Ajusta la gravedad y observa cómo cambia la caída de la pelota.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {planetGravities.map(pg => (
          <button
            key={pg.name}
            onClick={() => setGravity(pg.g)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.95]"
            style={{
              background: Math.abs(gravity - pg.g) < 0.1 ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: Math.abs(gravity - pg.g) < 0.1 ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: Math.abs(gravity - pg.g) < 0.1 ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: Math.abs(gravity - pg.g) < 0.1 ? '0 0 12px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            {pg.name} ({pg.g} m/s²)
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
      />

      <div className="flex items-center gap-4">
        <label className="text-white/40 text-xs shrink-0">Gravedad: {gravity.toFixed(2)} m/s²</label>
        <input
          type="range"
          min={0.5}
          max={30}
          step={0.1}
          value={gravity}
          onChange={e => setGravity(Number(e.target.value))}
          className="flex-1 accent-cyan-500"
        />
      </div>
    </motion.div>
  )
}

// Age in Space Calculator
function AgeInSpaceCalculator() {
  const planets = [
    { name: 'Mercurio', emoji: '☿', days: 88, years: 0.24, color: '#9ca3af' },
    { name: 'Venus', emoji: '♀', days: 225, years: 0.62, color: '#f97316' },
    { name: 'Marte', emoji: '♂', days: 687, years: 1.88, color: '#ef4444' },
    { name: 'Júpiter', emoji: '♃', days: 4333, years: 11.86, color: '#f59e0b' },
    { name: 'Saturno', emoji: '♄', days: 10759, years: 29.46, color: '#eab308' },
    { name: 'Urano', emoji: ' us', days: 30687, years: 84.01, color: '#14b8a6' },
    { name: 'Neptuno', emoji: '♆', days: 60190, years: 164.8, color: '#6366f1' },
  ]

  const [earthAge, setEarthAge] = useState(25)
  const maxAge = Math.max(...planets.map(p => earthAge / p.years))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #ec4899, transparent)" />
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Clock size={20} className="text-pink-400" />
        Calculadora de Edad Espacial
      </h3>
      <p className="text-white/40 text-sm">Descubre tu edad en cada planeta del sistema solar.</p>

      <div className="max-w-xs">
        <label className="text-white/40 text-xs mb-2 block">Tu edad en la Tierra</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={earthAge}
            onChange={e => setEarthAge(Number(e.target.value) || 0)}
            className="flex-1 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <span className="text-white/40 text-sm">años</span>
        </div>
      </div>

      {/* Visual bar chart */}
      <div>
        <h4 className="text-white/50 text-xs font-medium mb-3 flex items-center gap-1.5">
          <Activity size={14} className="text-pink-400" />
          Comparativa visual de edades
        </h4>
        <div className="space-y-2.5">
          {planets.map(p => {
            const ageOnPlanet = earthAge / p.years
            const barWidth = maxAge > 0 ? Math.min((ageOnPlanet / maxAge) * 100, 100) : 0
            return (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-lg w-6 text-center shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white/50 text-xs">{p.name}</span>
                    <span className="text-white/70 text-xs font-mono">{ageOnPlanet.toFixed(1)} años</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Planet cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {planets.map(p => {
          const ageOnPlanet = (earthAge / p.years).toFixed(2)
          return (
            <motion.div
              key={p.name}
              className="rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={e => {
                e.currentTarget.style.borderColor = `${p.color}30`
                e.currentTarget.style.boxShadow = `0 0 15px ${p.color}10`
              }}
              onHoverEnd={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onClick={() => toast.info(`En ${p.name} tendrías ${ageOnPlanet} años`)}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <p className="text-white/60 text-xs">{p.name}</p>
                <p className="text-white font-semibold">
                  {ageOnPlanet} <span className="text-white/40 text-xs">años</span>
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ============================================================
// PremiumPage
// ============================================================
function PremiumPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const faqs = [
    { q: '¿Qué incluye el plan Premium?', a: 'Acceso completo a todos los simuladores avanzados, modelos 3D interactivos, contenido educativo exclusivo y datos en tiempo real de la NASA.' },
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, puedes cancelar tu suscripción en cualquier momento sin penalización.' },
    { q: '¿Hay periodo de prueba gratuito?', a: 'Sí, ofrecemos 7 días de prueba gratuita para que explores todas las funcionalidades Premium.' },
    { q: '¿Acepta métodos de pago locales?', a: 'Aceptamos tarjetas de crédito, débito, PayPal y métodos de pago locales según tu país.' },
  ]

  const comparisonFeatures = [
    { feature: 'Simuladores básicos', free: true, premium: true },
    { feature: 'Exploración del catálogo', free: true, premium: true },
    { feature: 'Simuladores avanzados', free: false, premium: true },
    { feature: 'Modelos 3D interactivos', free: false, premium: true },
    { feature: 'Contenido educativo exclusivo', free: false, premium: true },
    { feature: 'Datos NASA en tiempo real', free: false, premium: true },
    { feature: 'Sin anuncios', free: false, premium: true },
    { feature: 'Soporte prioritario', free: false, premium: true },
    { feature: 'Acceso anticipado', free: false, premium: true },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          <span style={{
            background: 'linear-gradient(to right, #f59e0b, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Premium</span>
        </h1>
        <p className="text-white/40">Lleva tu exploración al siguiente nivel</p>
      </motion.div>

      {/* Pricing card */}
      <div className="max-w-lg mx-auto">
        <motion.div
          className="relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl"
          style={{
            ...cardBase,
            background: 'rgba(255,255,255,0.03)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Gradient border */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(236,72,153,0.3))',
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Crown size={40} className="mx-auto mb-4 text-amber-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Plan Premium</h2>
            <p className="text-white/40 text-sm mb-6">Todo lo que necesitas para dominar el espacio</p>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">$4.99</span>
              <span className="text-white/40">/mes</span>
            </div>

            <button
              onClick={() => toast.success('¡Bienvenido a Premium! Disfruta 7 días gratis.')}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-200 active:scale-[0.98] shimmer"
              style={{
                background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                boxShadow: '0 0 25px rgba(245,158,11,0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              Comenzar Prueba Gratis
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              'Todos los simuladores avanzados',
              'Modelos 3D interactivos',
              'Contenido educativo exclusivo',
              'Datos de la NASA en tiempo real',
              'Sin anuncios',
              'Soporte prioritario',
              'Acceso anticipado a nuevas funciones',
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span className="text-white/60 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparar Planes */}
      <motion.div
        className="max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur-xl relative"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899)" />
        <h2 className="text-xl font-bold text-white mb-4 p-6 pb-0">Comparar Planes</h2>
        <div className="p-6 pt-4">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/40 text-sm font-medium">Funcionalidad</div>
            <div className="text-center text-white/40 text-sm font-medium">Free</div>
            <div className="text-center text-amber-400 text-sm font-medium flex items-center justify-center gap-1">
              <Crown size={14} />
              Premium
            </div>
          </div>
          {/* Table rows */}
          {comparisonFeatures.map((f, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 py-2.5 items-center"
              style={{ borderBottom: i < comparisonFeatures.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="text-white/60 text-sm">{f.feature}</div>
              <div className="text-center">
                {f.free ? (
                  <Check size={16} className="text-emerald-400 mx-auto" />
                ) : (
                  <X size={16} className="text-white/20 mx-auto" />
                )}
              </div>
              <div className="text-center">
                <Check size={16} className="text-emerald-400 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left transition-all duration-200 hover:bg-white/[0.02]"
              >
                <span className="text-white/70 text-sm font-medium">{faq.q}</span>
                <motion.div
                  animate={{ rotate: faqOpen === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-white/30 shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-white/40 text-sm">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// ProfilePage
// ============================================================
function ProfilePage({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [prefs, setPrefs] = useState({ email: true, darkMode: true, animations: true })
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(userName)
  const [editEmail, setEditEmail] = useState(userEmail)

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    const labels: Record<keyof typeof prefs, string> = { email: 'Notificaciones', darkMode: 'Modo oscuro', animations: 'Animaciones' }
    toast.success(`${labels[key]} ${!prefs[key] ? 'activado' : 'desactivado'}`)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success('Perfil actualizado correctamente')
  }

  const recentActivity = [
    { action: 'Viste "El Sistema Solar"', time: 'Hace 2 horas', icon: Play, color: '#00d4ff' },
    { action: 'Usaste el Simulador de Gravedad', time: 'Hace 5 horas', icon: FlaskConical, color: '#f59e0b' },
    { action: 'Añadiste Júpiter a favoritos', time: 'Ayer', icon: Heart, color: '#ec4899' },
    { action: 'Calculaste tu edad en Marte', time: 'Hace 2 días', icon: Clock, color: '#a78bfa' },
    { action: 'Exploraste la Nebulosa de Orión', time: 'Hace 3 días', icon: Compass, color: '#10b981' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-white/40">Gestiona tu cuenta y preferencias</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div
          className="rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-xl"
          style={cardBase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)" />
          {/* Gradient border for avatar */}
          <div
            className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)',
              padding: '3px',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: '#050510' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                className="space-y-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.97] shimmer"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Save size={14} />
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-sm transition-all duration-200 active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-white/40 text-sm mt-1">{userEmail}</p>
                <p className="text-white/20 text-xs mt-2">Miembro desde Enero 2025</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
                >
                  <Edit3 size={14} />
                  Editar Perfil
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium badge */}
          <div
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}
          >
            <Crown size={12} />
            Free Plan
          </div>
        </motion.div>

        {/* Stats and info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { label: 'Favoritos', value: '12', icon: Heart, color: '#ec4899' },
              { label: 'Videos Vistos', value: '34', icon: Play, color: '#00d4ff' },
              { label: 'Simulaciones', value: '56', icon: Cpu, color: '#f59e0b' },
              { label: 'Logros', value: '8', icon: Star, color: '#7c3aed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm cursor-default"
                style={{ ...cardBase }}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                onHoverStart={e => {
                  e.currentTarget.style.borderColor = `${stat.color}30`
                  e.currentTarget.style.boxShadow = `0 0 20px ${stat.color}10`
                }}
                onHoverEnd={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}10` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-white/30 text-xs">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Preferences */}
          <motion.div
            className="rounded-2xl p-6 backdrop-blur-xl relative"
            style={cardBase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />
            <h3 className="text-white font-semibold mb-4">Preferencias</h3>
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Notificaciones por email', desc: 'Recibe actualizaciones sobre nuevo contenido' },
                { key: 'darkMode' as const, label: 'Modo oscuro', desc: 'Tema oscuro para la interfaz' },
                { key: 'animations' as const, label: 'Animaciones', desc: 'Efectos visuales y animaciones' },
              ].map(pref => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{pref.label}</p>
                    <p className="text-white/30 text-xs">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(pref.key)}
                    className="w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 active:scale-95"
                    style={{
                      background: prefs[pref.key] ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                      boxShadow: prefs[pref.key] ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full toggle-dot"
                      style={{
                        background: prefs[pref.key] ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                        left: prefs[pref.key] ? '24px' : '4px',
                        boxShadow: prefs[pref.key] ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity / Historial */}
          <motion.div
            className="rounded-2xl p-6 backdrop-blur-xl relative"
            style={cardBase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardGradientTop color="linear-gradient(90deg, #10b981, transparent)" />
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              Historial reciente
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.04)', x: 4 }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${activity.color}10` }}
                  >
                    <activity.icon size={14} style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-sm truncate">{activity.action}</p>
                    <p className="text-white/25 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// AiChatPage
// ============================================================
function AiChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: '¡Hola! Soy AstroAsistente 🤖. Estoy aquí para ayudarte a explorar el universo. Pregúntame sobre planetas, galaxias, estrellas o cualquier tema espacial. ¿En qué puedo ayudarte hoy?',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = [
    'Cuéntame sobre Júpiter',
    '¿Qué es un agujero negro?',
    'Edad en Marte',
    '¿Cuántas estrellas hay?',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return
    setMessages(prev => [...prev, { role: 'user', text: textToSend }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        default: '¡Interesante pregunta! Los datos que tengo indican que el universo es vasto y lleno de misterios. Te recomiendo explorar nuestra sección de simuladores para experimentar esto de forma interactiva. ¿Te gustaría saber algo más específico?',
        jupiter: 'Júpiter es el planeta más grande del sistema solar, con un diámetro de 142,984 km. Su Gran Mancha Roja es una tormenta que ha durado más de 300 años. ¡Podrías meter a la Tierra dentro de Júpiter más de 1,300 veces! Júpiter tiene 95 lunas conocidas, incluyendo las cuatro lunas galileanas: Io, Europa, Ganímedes y Calisto.',
        marte: 'Marte, el planeta rojo, tiene una temperatura promedio de -60°C. Es el objetivo principal de la exploración humana futura. Su montaña más alta, el Monte Olimpo, es casi 3 veces más alta que el Monte Everest con 21.9 km de altura. Un día en Marte dura 24 horas y 37 minutos, muy similar al nuestro.',
        agujero: 'Los agujeros negros son regiones del espacio-tiempo donde la gravedad es tan fuerte que nada, ni siquiera la luz, puede escapar. El más cercano a la Tierra es Gaia BH1, a aproximadamente 1,560 años luz. El agujero negro supermasivo en el centro de nuestra galaxia, Sagitario A*, tiene una masa de 4 millones de soles.',
        estrella: 'Las estrellas se forman en nebulosas a partir de colapsos gravitacionales de gas y polvo. Nuestro Sol es una estrella enana amarilla con aproximadamente 4.6 mil millones de años. ¡Está a la mitad de su vida! Se estima que hay aproximadamente 70 sextillones (7 × 10²²) de estrellas en el universo observable.',
        edad: 'Si tienes 25 años en la Tierra, en Marte tendrías aproximadamente 13.3 años, ya que un año marciano dura 1.88 años terrestres. En Júpiter solo tendrías 2.1 años, y en Mercurio tendrías más de 104 años. ¡Puedes calcular tu edad espacial en nuestro simulador!',
      }

      let response = responses.default
      const lower = textToSend.toLowerCase()
      if (lower.includes('júpiter') || lower.includes('jupiter')) response = responses.jupiter
      else if (lower.includes('marte') || lower.includes('mars')) response = responses.marte
      else if (lower.includes('agujero') || lower.includes('black hole')) response = responses.agujero
      else if (lower.includes('estrella') || lower.includes('star') || lower.includes('cuántas estrellas') || lower.includes('cuantas estrellas')) response = responses.estrella
      else if (lower.includes('edad') || lower.includes('age')) response = responses.edad

      setMessages(prev => [...prev, { role: 'ai', text: response }])
      setIsTyping(false)
    }, 1500)
  }

  const showSuggestions = messages.length <= 1

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <MessageSquare size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AstroAsistente</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-xs">En línea</span>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              style={{
                background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(124,58,237,0.1)',
                border: msg.role === 'user'
                  ? '1px solid rgba(0,212,255,0.15)'
                  : '1px solid rgba(124,58,237,0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={12} className="text-violet-400" />
                  <span className="text-violet-400 text-[10px] font-medium">AstroAsistente</span>
                </div>
              )}
              <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white/80' : 'text-white/60'}`}>
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Quick suggestions */}
        {showSuggestions && !isTyping && (
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {quickSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#a78bfa',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.15)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(124,58,237,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Sparkles size={12} className="inline mr-1.5 opacity-60" />
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-violet-400 text-[10px] font-medium">AstroAsistente</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400/50"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregúntame sobre el universo..."
          className="flex-1 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder:text-white/20 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
        />
        <button
          onClick={() => handleSend()}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-[1.05] active:scale-90 shimmer"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            boxShadow: '0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}

// ============================================================
// MAIN AstroVerseLayout
// ============================================================
export default function AstroVerseLayout({
  userName, userEmail, onLogout
}: {
  userName: string
  userEmail: string
  onLogout: () => void
}) {
  const [activePage, setActivePage] = useState('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const handleNavigate = useCallback((page: string) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage userName={userName} onNavigate={handleNavigate} />
      case 'explore': return <ExplorePage />
      case 'models3d': return <Models3DPage />
      case 'simulators': return <SimulatorsPage />
      case 'premium': return <PremiumPage />
      case 'profile': return <ProfilePage userName={userName} userEmail={userEmail} />
      case 'ai-chat': return <AiChatPage />
      default: return <HomePage userName={userName} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        userName={userName}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <main
        className={`transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 p-4" style={{ background: 'rgba(5,5,16,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
            <Menu size={20} />
          </button>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
          >
            <Orbit size={16} className="text-white" />
          </div>
          <span
            className="text-sm font-bold"
            style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            AstroVerse
          </span>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
