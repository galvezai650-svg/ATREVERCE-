'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Orbit, Home, Compass, Box, FlaskConical, Crown, User,
  MessageSquare, LogOut, Search, Play, Heart, Star,
  Check, ChevronDown, ChevronUp, Send, Sparkles,
  ArrowRight, Zap, Clock, BookOpen, Globe2, Lock,
  Shield, Eye, X, Menu, Cpu, HelpCircle
} from 'lucide-react'

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
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

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
            <span
              className="text-lg font-bold whitespace-nowrap"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AstroVerse
            </span>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-5 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
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
                }`}
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                  color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <item.icon size={20} className="shrink-0" />
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all ${
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
function HomePage({ userName }: { userName: string }) {
  const videos = [
    { title: 'El Sistema Solar: Un Viaje Increíble', desc: 'Explora los 8 planetas y sus características únicas', gradient: 'from-cyan-500/20 to-violet-500/20', duration: '12:34' },
    { title: 'Agujeros Negros: Misterios del Espacio', desc: 'Descubre qué hay dentro de un agujero negro', gradient: 'from-violet-500/20 to-pink-500/20', duration: '18:45' },
    { title: 'La Vía Láctea: Nuestra Galaxia', desc: 'Un recorrido por nuestra galaxia espiral', gradient: 'from-pink-500/20 to-amber-500/20', duration: '15:22' },
    { title: 'Nebulosas: Fábricas de Estrellas', desc: 'Las cunas donde nacen las estrellas', gradient: 'from-amber-500/20 to-emerald-500/20', duration: '10:18' },
    { title: 'Marte: El Planeta Rojo', desc: 'Todo sobre el planeta que podría albergar vida', gradient: 'from-emerald-500/20 to-cyan-500/20', duration: '14:56' },
    { title: 'Eclipse Solar: Fenómeno Cósmico', desc: 'La ciencia detrás de los eclipses', gradient: 'from-cyan-500/20 to-pink-500/20', duration: '8:33' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Hola, {userName} 👋
        </h1>
        <p className="text-white/40">Bienvenido de vuelta a AstroVerse. ¿Qué quieres explorar hoy?</p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Buscar planetas, galaxias, nebulosas..."
          className="w-full pl-12 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        />
      </div>

      {/* Dato del día */}
      <motion.div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(40px)' }} />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Dato del día</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              La Gran Muralla de Hércules es la estructura más grande conocida en el universo observable,
              con aproximadamente 10 mil millones de años luz de diámetro. ¡Es más grande que el universo
              observable en una fracción significativa de su edad!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Videos grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Videos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, i) => (
            <motion.div
              key={video.title}
              className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Thumbnail */}
              <div className={`relative h-40 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white/80 bg-black/40 backdrop-blur-sm">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{video.title}</h3>
                <p className="text-white/40 text-xs">{video.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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

  const items = [
    { id: '1', title: 'Júpiter', desc: 'El planeta más grande del sistema solar', category: 'Planetas', emoji: '🪐', gradient: 'from-amber-800/30 to-amber-500/10' },
    { id: '2', title: 'Saturno', desc: 'Famoso por sus impresionantes anillos', category: 'Planetas', emoji: '🪐', gradient: 'from-yellow-800/30 to-yellow-500/10' },
    { id: '3', title: 'Venus', desc: 'El planeta más caliente del sistema solar', category: 'Planetas', emoji: '🌙', gradient: 'from-orange-800/30 to-orange-500/10' },
    { id: '4', title: 'Sagitario A*', desc: 'El agujero negro supermasivo del centro de la Vía Láctea', category: 'Agujeros Negros', emoji: '🕳️', gradient: 'from-violet-900/30 to-violet-500/10' },
    { id: '5', title: 'M87*', desc: 'El primer agujero negro fotografiado', category: 'Agujeros Negros', emoji: '🕳️', gradient: 'from-purple-900/30 to-purple-500/10' },
    { id: '6', title: 'Vía Láctea', desc: 'Nuestra galaxia espiral con 200 mil millones de estrellas', category: 'Galaxias', emoji: '🌌', gradient: 'from-cyan-900/30 to-cyan-500/10' },
    { id: '7', title: 'Andrómeda', desc: 'La galaxia más cercana a la Vía Láctea', category: 'Galaxias', emoji: '🌌', gradient: 'from-blue-900/30 to-blue-500/10' },
    { id: '8', title: 'Nebulosa de Orión', desc: 'Una de las nebulosas más brillantes del cielo nocturno', category: 'Nebulosas', emoji: '🌫️', gradient: 'from-pink-900/30 to-pink-500/10' },
    { id: '9', title: 'Nebulosa Cabeza de Caballo', desc: 'Famosa nebulosa oscura en la constelación de Orión', category: 'Nebulosas', emoji: '🌫️', gradient: 'from-red-900/30 to-red-500/10' },
    { id: '10', title: 'Sirio', desc: 'La estrella más brillante vista desde la Tierra', category: 'Estrellas', emoji: '⭐', gradient: 'from-yellow-900/30 to-yellow-500/10' },
  ]

  const filtered = activeCategory === 'Todos' ? items : items.filter(i => i.category === activeCategory)

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explorar</h1>
        <p className="text-white/40">Descubre los misterios del universo</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{
              background: activeCategory === cat ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeCategory === cat ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeCategory === cat ? '#00d4ff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Image placeholder */}
            <div className={`relative h-36 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
              <span className="text-5xl">{item.emoji}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFav(item.id) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all"
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
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-white/40 text-xs">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Models3DPage
// ============================================================
function Models3DPage() {
  const planets = [
    { name: 'Mercurio', gradient: 'from-gray-600 to-gray-800', size: '4,879 km', desc: 'El planeta más pequeño y cercano al Sol' },
    { name: 'Venus', gradient: 'from-orange-400 to-yellow-600', size: '12,104 km', desc: 'El planeta más caliente del sistema solar' },
    { name: 'Tierra', gradient: 'from-cyan-400 to-blue-600', size: '12,756 km', desc: 'Nuestro hogar, el planeta azul' },
    { name: 'Marte', gradient: 'from-red-500 to-red-800', size: '6,792 km', desc: 'El planeta rojo, objetivo de exploración' },
    { name: 'Júpiter', gradient: 'from-amber-500 to-orange-700', size: '142,984 km', desc: 'El gigante gaseoso más grande' },
    { name: 'Saturno', gradient: 'from-yellow-400 to-amber-600', size: '120,536 km', desc: 'Famoso por sus anillos espectaculares' },
    { name: 'Urano', gradient: 'from-cyan-300 to-teal-500', size: '51,118 km', desc: 'El gigante de hielo inclinado' },
    { name: 'Neptuno', gradient: 'from-blue-500 to-indigo-700', size: '49,528 km', desc: 'El planeta más lejano del sistema solar' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Modelos 3D</h1>
        <p className="text-white/40">Visualiza los planetas del sistema solar en tres dimensiones</p>
      </div>

      {/* Coming soon banner */}
      <motion.div
        className="rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden"
        style={{
          background: 'rgba(124,58,237,0.05)',
          border: '1px solid rgba(124,58,237,0.15)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <Box size={24} className="text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Modelos 3D Interactivos - Próximamente</h3>
          <p className="text-white/40 text-sm">Estamos trabajando en modelos 3D detallados de cada planeta. ¡Muy pronto podrás explorarlos!</p>
        </div>
      </motion.div>

      {/* Planet cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {planets.map((planet, i) => (
          <motion.div
            key={planet.name}
            className="rounded-xl p-5 text-center relative overflow-hidden group"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Coming soon badge */}
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium text-violet-400" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              Próximamente
            </div>

            {/* Planet circle */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${planet.gradient} shadow-lg`}
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
      </div>
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
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Simuladores</h1>
        <p className="text-white/40">Experimenta la física espacial de forma interactiva</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all"
            style={{
              background: activeTab === i ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeTab === i ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeTab === i ? '#00d4ff' : 'rgba(255,255,255,0.4)',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

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
    { name: 'Urano', emoji: '⛢', factor: 0.92, gravity: '8.69 m/s²', distance: '2.87B km' },
  ]

  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [weight, setWeight] = useState(70)
  const result = (weight * selectedPlanet.factor).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Cpu size={20} className="text-amber-400" />
        Calculadora de Peso Planetario
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-xs mb-2 block">Tu peso en la Tierra (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value) || 0)}
              className="w-full rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-2 block">Selecciona un planeta</label>
            <div className="grid grid-cols-4 gap-2">
              {planets.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className="rounded-lg px-2 py-2 text-xs transition-all duration-200 text-center"
                  style={{
                    background: selectedPlanet.name === p.name ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedPlanet.name === p.name ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: selectedPlanet.name === p.name ? '#f59e0b' : 'rgba(255,255,255,0.5)',
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
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
          >
            <p className="text-white/40 text-xs mb-1">Tu peso en {selectedPlanet.name}</p>
            <p className="text-4xl font-bold text-amber-400">{selectedPlanet.emoji} {result} kg</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Gravedad</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.gravity}</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Distancia al Sol</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.distance}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Gravity Simulator - Ball bouncing animation
function GravitySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gravity, setGravity] = useState(9.8)
  const ballRef = useRef({ x: 200, y: 50, vy: 0, vx: 2 })
  const gravityRef = useRef(gravity)

  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
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
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
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
      className="rounded-2xl p-6 md:p-8 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Zap size={20} className="text-cyan-400" />
        Simulador de Gravedad
      </h3>
      <p className="text-white/40 text-sm">Ajusta la gravedad y observa cómo cambia la caída de la pelota.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {planetGravities.map(pg => (
          <button
            key={pg.name}
            onClick={() => setGravity(pg.g)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: Math.abs(gravity - pg.g) < 0.1 ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: Math.abs(gravity - pg.g) < 0.1 ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: Math.abs(gravity - pg.g) < 0.1 ? '#00d4ff' : 'rgba(255,255,255,0.4)',
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
    { name: 'Mercurio', emoji: '☿', days: 88, years: 0.24 },
    { name: 'Venus', emoji: '♀', days: 225, years: 0.62 },
    { name: 'Marte', emoji: '♂', days: 687, years: 1.88 },
    { name: 'Júpiter', emoji: '♃', days: 4333, years: 11.86 },
    { name: 'Saturno', emoji: '♄', days: 10759, years: 29.46 },
    { name: 'Urano', emoji: '⛢', days: 30687, years: 84.01 },
    { name: 'Neptuno', emoji: '♆', days: 60190, years: 164.8 },
  ]

  const [earthAge, setEarthAge] = useState(25)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
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
            className="flex-1 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-pink-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <span className="text-white/40 text-sm">años</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {planets.map(p => {
          const ageOnPlanet = (earthAge / p.years).toFixed(2)
          return (
            <div
              key={p.name}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <p className="text-white/60 text-xs">{p.name}</p>
                <p className="text-white font-semibold">
                  {ageOnPlanet} <span className="text-white/40 text-xs">años</span>
                </p>
              </div>
            </div>
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          <span style={{
            background: 'linear-gradient(to right, #f59e0b, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Premium</span>
        </h1>
        <p className="text-white/40">Lleva tu exploración al siguiente nivel</p>
      </div>

      {/* Pricing card */}
      <div className="max-w-lg mx-auto">
        <motion.div
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            <Crown size={40} className="mx-auto mb-4 text-amber-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Plan Premium</h2>
            <p className="text-white/40 text-sm mb-6">Todo lo que necesitas para dominar el espacio</p>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">$4.99</span>
              <span className="text-white/40">/mes</span>
            </div>

            <button
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                boxShadow: '0 0 30px rgba(245,158,11,0.3)',
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
              <div key={i} className="flex items-center gap-3">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span className="text-white/60 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-white/70 text-sm font-medium">{faq.q}</span>
                {faqOpen === i ? <ChevronUp size={16} className="text-white/30 shrink-0" /> : <ChevronDown size={16} className="text-white/30 shrink-0" />}
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
            </div>
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-white/40">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
          <h2 className="text-xl font-bold text-white">{userName}</h2>
          <p className="text-white/40 text-sm mt-1">{userEmail}</p>
          <p className="text-white/20 text-xs mt-2">Miembro desde Enero 2025</p>

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
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Favoritos', value: '12', icon: Heart, color: '#ec4899' },
              { label: 'Videos Vistos', value: '34', icon: Play, color: '#00d4ff' },
              { label: 'Simulaciones', value: '56', icon: Cpu, color: '#f59e0b' },
              { label: 'Logros', value: '8', icon: Star, color: '#7c3aed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
          </div>

          {/* Preferences */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h3 className="text-white font-semibold mb-4">Preferencias</h3>
            <div className="space-y-4">
              {[
                { label: 'Notificaciones por email', desc: 'Recibe actualizaciones sobre nuevo contenido', enabled: true },
                { label: 'Modo oscuro', desc: 'Tema oscuro para la interfaz', enabled: true },
                { label: 'Animaciones', desc: 'Efectos visuales y animaciones', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{pref.label}</p>
                    <p className="text-white/30 text-xs">{pref.desc}</p>
                  </div>
                  <div
                    className="w-10 h-6 rounded-full relative cursor-pointer"
                    style={{ background: pref.enabled ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full transition-all"
                      style={{
                        background: pref.enabled ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                        left: pref.enabled ? '22px' : '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        default: '¡Interesante pregunta! Los datos que tengo indican que el universo es vasto y lleno de misterios. Te recomiendo explorar nuestra sección de simuladores para experimentar esto de forma interactiva. ¿Te gustaría saber algo más específico?',
        jupiter: 'Júpiter es el planeta más grande del sistema solar, con un diámetro de 142,984 km. Su Gran Mancha Roja es una tormenta que ha durado más de 300 años. ¡Podrías meter a la Tierra dentro de Júpiter más de 1,300 veces!',
        marte: 'Marte, el planeta rojo, tiene una temperatura promedio de -60°C. Es el objetivo principal de la exploración humana futura. Su montaña más alta, el Monte Olimpo, es casi 3 veces más alta que el Monte Everest.',
        agujero: 'Los agujeros negros son regiones del espacio-tiempo donde la gravedad es tan fuerte que nada, ni siquiera la luz, puede escapar. El más cercano a la Tierra es Gaia BH1, a aproximadamente 1,560 años luz.',
        estrella: 'Las estrellas se forman en nebulosas a partir de colapsos gravitacionales de gas y polvo. Nuestro Sol es una estrella enana amarilla con aproximadamente 4.6 mil millones de años. ¡Está a la mitad de su vida!',
      }

      let response = responses.default
      const lower = userMsg.toLowerCase()
      if (lower.includes('júpiter') || lower.includes('jupiter')) response = responses.jupiter
      else if (lower.includes('marte') || lower.includes('mars')) response = responses.marte
      else if (lower.includes('agujero') || lower.includes('black hole')) response = responses.agujero
      else if (lower.includes('estrella') || lower.includes('star') || lower.includes('sol') || lower.includes('sun')) response = responses.estrella

      setMessages(prev => [...prev, { role: 'ai', text: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <MessageSquare size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AstroAsistente</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white/30 text-xs">En línea</span>
          </div>
        </div>
      </div>

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
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregúntame sobre el universo..."
          className="flex-1 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <button
          onClick={handleSend}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
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

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage userName={userName} />
      case 'explore': return <ExplorePage />
      case 'models3d': return <Models3DPage />
      case 'simulators': return <SimulatorsPage />
      case 'premium': return <PremiumPage />
      case 'profile': return <ProfilePage userName={userName} userEmail={userEmail} />
      case 'ai-chat': return <AiChatPage />
      default: return <HomePage userName={userName} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
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
          <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10">
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
