'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Globe2, ArrowRight, Bell, X, Orbit, ExternalLink, Maximize2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

const NASA_SOLAR_SYSTEM_URL = 'https://eyes.nasa.gov/apps/solar-system/#/home?interactPrompt=true&surfaceMapTiling=true&hd=true&maxSessionTime=100&spout=true'

// ============================================================
// Solar System Viewer — Fullscreen NASA Explorer
// ============================================================
function SolarSystemViewer({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(5,5,16,0.97) 0%, rgba(5,5,16,0.8) 80%, transparent 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 25px rgba(0,212,255,0.4), 0 0 50px rgba(124,58,237,0.2)' }}>
            <Orbit size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm md:text-base flex items-center gap-2">
              Explorador del Sistema Solar
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' }}>
                NASA LIVE
              </span>
            </h2>
            <p className="text-white/30 text-[10px] md:text-xs">Eyes on the Solar System — Datos en tiempo real de la NASA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/40 text-[10px]">Conectado a servidores NASA</span>
          </div>
          <button
            onClick={() => {
              toast.info('Abriendo en pantalla completa...')
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white transition-all duration-200 active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Maximize2 size={12} />
            <span>Pantalla completa</span>
          </button>
          <button
            onClick={() => {
              onClose()
              toast.info('Explorador cerrado')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-200 active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowRight size={14} className="rotate-180" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {!loaded && (
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5"
          style={{ background: 'rgba(5,5,16,0.95)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(124,58,237,0.15)' }}
            >
              <Orbit size={40} className="text-white" />
            </div>
            {/* Orbiting ring */}
            <div className="absolute inset-[-12px] rounded-full border border-cyan-400/20" style={{ animation: 'spin 4s linear infinite' }} />
            <div className="absolute inset-[-24px] rounded-full border border-violet-400/10" style={{ animation: 'spin 7s linear infinite reverse' }} />
            {/* Dots on ring */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'spin 4s linear infinite', transformOrigin: '0 48px' }} />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: 'spin 7s linear infinite reverse', transformOrigin: '0 -60px' }} />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">Cargando Sistema Solar</p>
            <p className="text-white/30 text-sm mt-1">Iniciando NASA Eyes on the Solar System...</p>
          </div>
          <div className="flex items-center gap-6 text-white/20 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Cargando órbitas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span>Sincronizando datos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span>Cargando texturas HD</span>
            </div>
          </div>
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* NASA Solar System iframe */}
      <div className="flex-1 relative">
        <iframe
          src={NASA_SOLAR_SYSTEM_URL}
          className="absolute inset-0 w-full h-full border-0"
          style={{ background: '#000' }}
          onLoad={() => {
            setLoaded(true)
            toast.success('¡Sistema Solar NASA cargado! Explora libremente 🌌')
          }}
          title="NASA Eyes on the Solar System"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 shrink-0" style={{ background: 'linear-gradient(0deg, rgba(5,5,16,0.97) 0%, rgba(5,5,16,0.8) 80%, transparent 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-[10px]">NASA JPL</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-white/20 text-[10px]">
            <Globe2 size={10} />
            <span>Datos oficiales en tiempo real</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/15 text-[10px] hidden sm:inline">🖱️ Clic para navegar · Scroll para zoom · Arrastra para rotar</span>
          <div className="flex items-center gap-1 text-white/20 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
            <span>Sol</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50 ml-1" />
            <span>Mercurio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400/50 ml-1" />
            <span>Venus</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50 ml-1" />
            <span>Tierra</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/50 ml-1" />
            <span>Marte</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 ml-1" />
            <span className="hidden md:inline">Júpiter</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  )
}

// ============================================================
// Models3DPage
// ============================================================
export default function Models3DPage() {
  const [notifyEmail, setNotifyEmail] = useState('')
  const [selectedPlanet, setSelectedPlanet] = useState<typeof planets[0] | null>(null)
  const [viewer3D, setViewer3D] = useState<string | null>(null)
  const [viewer3DTitle, setViewer3DTitle] = useState('Modelo 3D')
  const [viewerLoading, setViewerLoading] = useState(false)
  const [showSolarSystem, setShowSolarSystem] = useState(false)

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

      {/* ===== FEATURED: NASA Solar System Explorer ===== */}
      <motion.div
        className="rounded-2xl overflow-hidden relative cursor-pointer group"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(236,72,153,0.05) 100%)',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        whileHover={{ scale: 1.005 }}
        onClick={() => {
          setShowSolarSystem(true)
          toast.success('Iniciando Explorador del Sistema Solar...')
        }}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl" style={{ padding: '1px', background: 'linear-gradient(135deg, #00d4ff33, #7c3aed33, #ec489933)', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' }} />

        {/* Background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00d4ff, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Animated solar system icon */}
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(124,58,237,0.15)',
                }}
              >
                <Orbit size={36} className="text-white md:w-10 md:h-10" />
              </div>
              {/* Orbiting dot */}
              <div className="absolute inset-[-8px] rounded-full border border-cyan-400/20" style={{ animation: 'orbit 6s linear infinite' }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 6px #00d4ff' }} />
              </div>
              <div className="absolute inset-[-16px] rounded-full border border-violet-400/10" style={{ animation: 'orbit 10s linear infinite reverse' }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-300" style={{ boxShadow: '0 0 6px #7c3aed' }} />
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-bold text-lg md:text-xl">Explorador del Sistema Solar</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  NASA LIVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                  HD
                </span>
              </div>
              <p className="text-white/50 text-sm md:text-base leading-relaxed mb-3">
                Explora el sistema solar completo en 3D con datos en tiempo real de la NASA. Navega entre planetas, lunas, asteroides y naves espaciales con <span className="text-cyan-400 font-medium">NASA Eyes on the Solar System</span>.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['🪐 8 Planetas', '🌙 Lunas', '🛸 Naves Espaciales', '📊 Datos en Tiempo Real', '🌐 Órbitas Interactivas'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] text-white/50" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                    boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 4px 20px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ boxShadow: '0 0 50px rgba(0,212,255,0.4), 0 8px 30px rgba(0,0,0,0.4)' }}
                >
                  <Orbit size={16} />
                  Explorar Sistema Solar
                  <ArrowRight size={14} />
                </motion.button>
                <span className="text-white/20 text-xs hidden sm:inline">Powered by NASA JPL</span>
              </div>
            </div>

            {/* Mini planet previews on the right */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {['from-amber-500 to-orange-600', 'from-cyan-400 to-blue-600', 'from-red-500 to-red-700', 'from-yellow-400 to-amber-500', 'from-blue-400 to-indigo-600'].map((g, i) => (
                <motion.div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${g}`}
                  style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1), inset -3px -2px 6px rgba(0,0,0,0.4)' }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes orbit { to { transform: rotate(360deg); } }
        `}</style>
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
              <h3 className="text-white font-semibold">Modelos 3D Individuales</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                🌍 Tierra disponible
              </span>
            </div>
            <p className="text-white/40 text-sm mt-1">Clic en la tarjeta de la Tierra para ver su modelo 3D individual. Más planetas próximamente.</p>
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
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 active:scale-[0.98]"
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
        {planets.map((planet) => (
          <motion.div
            key={planet.name}
            className="rounded-xl p-5 text-center relative overflow-hidden group cursor-pointer backdrop-blur-xl"
            style={cardBase}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            onHoverStart={e => {
              if (e.currentTarget) {
                e.currentTarget.style.borderColor = `${planet.color}30`
                e.currentTarget.style.boxShadow = `0 0 25px ${planet.color}10, 0 8px 32px rgba(0,0,0,0.3)`
              }
            }}
            onHoverEnd={e => {
              if (e.currentTarget) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
            onClick={() => {
              if ((planet as any).has3D && nasa3DModels[planet.name]) {
                setViewer3DTitle(`Modelo 3D — ${planet.name}`)
                setViewerLoading(true)
                setViewer3D(nasa3DModels[planet.name])
              } else {
                setSelectedPlanet(planet)
              }
            }}
          >
            <CardGradientTop color={`linear-gradient(90deg, ${planet.color}, transparent)`} />
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
            {(planet as any).has3D && (
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${planet.color}08` }} />
            )}

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

      {/* ===== SOLAR SYSTEM VIEWER (Fullscreen) ===== */}
      <AnimatePresence>
        {showSolarSystem && (
          <>
            <motion.div
              className="fixed inset-0 z-[79] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <SolarSystemViewer onClose={() => setShowSolarSystem(false)} />
          </>
        )}
      </AnimatePresence>

      {/* ===== INDIVIDUAL 3D VIEWER MODAL ===== */}
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
                    <h2 className="text-white font-bold text-sm">{viewer3DTitle}</h2>
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
                      <p className="text-white font-semibold text-sm">Cargando Modelo 3D</p>
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
                    toast.success('¡Modelo 3D cargado!')
                  }}
                  title="NASA 3D Model"
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes orbit { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
