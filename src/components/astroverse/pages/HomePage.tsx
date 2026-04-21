'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, FlaskConical, Search, Play, Sparkles,
  ArrowRight, RefreshCw, Pause, Volume2, VolumeX, Maximize2, Crown,
} from 'lucide-react'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// HomePage - Dashboard
// ============================================================
export default function HomePage({ userName, onNavigate }: { 
  userName: string; 
  onNavigate?: (page: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [factIndex, setFactIndex] = useState(0)

  const videos = [
    {
      id: 'v1',
      src: '/videos/video1.mp4',
      title: 'Exploración Espacial',
      desc: 'Mira la increíble inmensidad del universo y sus fenómenos más impresionantes',
      gradient: 'from-cyan-500/30 to-violet-500/30',
      color: '#00d4ff',
    },
    {
      id: 'v2',
      src: '/videos/video2.mp4',
      title: 'El Cosmos en Movimiento',
      desc: 'Viaja a través de galaxias, nebulosas y sistemas estelares',
      gradient: 'from-violet-500/30 to-pink-500/30',
      color: '#a855f7',
    },
    {
      id: 'v3',
      src: '/videos/artemis2-moon-mission.mp4',
      title: 'Artemis II Moon Mission Complete!',
      desc: 'Mira la histórica misión Artemis II que lleva humanos de vuelta a la órbita de la Luna',
      gradient: 'from-amber-500/30 to-red-500/30',
      color: '#f59e0b',
    },
    {
      id: 'v4',
      src: '/videos/video3.mp4',
      title: '¿Qué pasaría si estuvieras un día en cada uno de los planetas?',
      desc: 'Explora los secretos más fascinantes del espacio profundo y la cosmología moderna',
      gradient: 'from-emerald-500/30 to-cyan-500/30',
      color: '#10b981',
    },
    {
      id: 'v5',
      src: '/videos/kepler-planeta.mp4',
      title: '¿ESTE planeta Kepler es apto para el ser humano?',
      desc: 'Descubre los planetas Kepler y si alguno podría ser habitable para la humanidad',
      gradient: 'from-rose-500/30 to-amber-500/30',
      color: '#f43f5e',
    },
  ]

  const spaceFacts = [
    'La Gran Muralla de Hércules es la estructura más grande conocida en el universo observable, con aproximadamente 10 mil millones de años luz de diámetro.',
    'Un día en Venus es más largo que un año en Venus. Tarda 243 días terrestres en rotar sobre su eje, pero solo 225 días en orbitar el Sol.',
    'Si pudieras conducir un coche a la velocidad de la luz, tardarías 8 minutos y 19 segundos en llegar al Sol.',
    'Neptuno no ha completado ni una sola órbita desde que fue descubierto en 1846. Su año dura 165 años terrestres.',
    'Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra. Se estima que hay 70 sextillones de estrellas.',
    'La estrella más grande conocida, UY Scuti, tiene un radio 1,700 veces mayor que el del Sol.',
  ]

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState<Record<string, boolean>>({ v1: true, v2: true, v3: true, v4: true, v5: true })

  const cycleFact = () => {
    setFactIndex(prev => (prev + 1) % spaceFacts.length)
  }

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id]
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setPlaying(prev => ({ ...prev, [id]: true }))
    } else {
      video.pause()
      setPlaying(prev => ({ ...prev, [id]: false }))
    }
  }

  const toggleMute = (id: string) => {
    const video = videoRefs.current[id]
    if (!video) return
    video.muted = !video.muted
    setMuted(prev => ({ ...prev, [id]: video.muted }))
  }

  const toggleFullscreen = (id: string) => {
    const video = videoRefs.current[id]
    if (!video) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Hola, {userName} 👋
          </h1>
        </div>
        <p className="text-white/40">
          Bienvenido a AstroVerse. Explora el universo con todas las funciones disponibles.
        </p>
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
            { label: 'Modelos 3D', icon: Crown, page: 'models3d', color: '#ec4899' },
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
                if (e.currentTarget) {
                  const c = btn.color
                  e.currentTarget.style.boxShadow = `0 0 20px ${c}15`
                  e.currentTarget.style.background = `${c}18`
                }
              }}
              onMouseLeave={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = `${btn.color}10`
                }
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
        style={{
          ...cardBase,
          borderColor: 'rgba(255,255,255,0.08)',
        }}
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

      {/* Videos Section */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-white">Videos Destacados</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
            {videos.length} videos
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              className="rounded-2xl overflow-hidden relative group"
              style={{
                ...cardBase,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onHoverStart={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.borderColor = `${video.color}30`
                  e.currentTarget.style.boxShadow = `0 0 30px ${video.color}10, 0 8px 32px rgba(0,0,0,0.4)`
                }
              }}
              onHoverEnd={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <CardGradientTop color={`linear-gradient(90deg, ${video.color}, transparent)`} />

              {/* Video Player */}
              <div className={`relative bg-gradient-to-br ${video.gradient}`}>
                <>
                  <video
                    ref={el => { videoRefs.current[video.id] = el }}
                    src={video.src}
                    className="w-full aspect-video object-cover"
                    playsInline
                    preload="metadata"
                    muted={muted[video.id] ?? true}
                    loop
                    onPlay={() => setPlaying(prev => ({ ...prev, [video.id]: true }))}
                    onPause={() => setPlaying(prev => ({ ...prev, [video.id]: false }))}
                  />

                  {/* Overlay controls */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-black/20" />
                    <button
                      onClick={() => togglePlay(video.id)}
                      className="relative z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      {playing[video.id] ? (
                        <Pause size={28} className="text-white" />
                      ) : (
                        <Play size={28} className="text-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Bottom controls bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                    <button
                      onClick={() => toggleMute(video.id)}
                      className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                    >
                      {muted[video.id] ? (
                        <VolumeX size={14} className="text-white/70" />
                      ) : (
                        <Volume2 size={14} className="text-white/70" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleFullscreen(video.id)}
                      className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                    >
                      <Maximize2 size={14} className="text-white/70" />
                    </button>
                  </div>
                </>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-1">{video.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{video.desc}</p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${video.color}15` }}
                  >
                    <Play size={14} style={{ color: video.color }} className="ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
