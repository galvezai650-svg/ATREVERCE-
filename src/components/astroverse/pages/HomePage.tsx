'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, FlaskConical, Crown, Search, Play, Sparkles,
  ArrowRight, Bookmark, BookmarkCheck, RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// HomePage - Dashboard
// ============================================================
export default function HomePage({ userName, onNavigate }: { userName: string; onNavigate?: (page: string) => void }) {
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
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = `0 0 20px ${btn.color}15`
                  e.currentTarget.style.background = `${btn.color}18`
                }
              }}
              onMouseLeave={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = `0 0 0px ${btn.color}00`
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
                    if (e.currentTarget) {
                      e.currentTarget.style.borderColor = `${video.color}30`
                      e.currentTarget.style.boxShadow = `0 0 25px ${video.color}10, 0 8px 32px rgba(0,0,0,0.3)`
                    }
                  }}
                  onHoverEnd={e => {
                    if (e.currentTarget) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
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
