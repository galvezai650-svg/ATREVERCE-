'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Eye, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// ExplorePage
// ============================================================
export default function ExplorePage() {
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
              if (e.currentTarget && activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
              if (e.currentTarget && activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
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
              if (e.currentTarget) {
                e.currentTarget.style.borderColor = `${item.color}30`
                e.currentTarget.style.boxShadow = `0 0 25px ${item.color}10, 0 8px 32px rgba(0,0,0,0.3)`
              }
            }}
            onHoverEnd={e => {
              if (e.currentTarget) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }
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
