'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Filter,
  Sparkles,
  Star,
  Zap,
  Eye,
  Rocket,
  Globe,
  Sun,
  Moon,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Types
// ============================================================

type EventType = 'meteor' | 'eclipse' | 'launch' | 'planetary' | 'other'

interface SpaceEvent {
  id: string
  title: string
  date: Date
  description: string
  type: EventType
  emoji: string
}

// ============================================================
// Constants — Type Config
// ============================================================

const TYPE_CONFIG: Record<EventType, { label: string; color: string; gradient: string; badgeBg: string; badgeBorder: string; icon: React.ReactNode }> = {
  meteor: {
    label: 'Lluvia de Meteoros',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    badgeBg: 'rgba(245,158,11,0.12)',
    badgeBorder: 'rgba(245,158,11,0.3)',
    icon: <Sparkles size={12} />,
  },
  eclipse: {
    label: 'Eclipse',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    badgeBg: 'rgba(124,58,237,0.12)',
    badgeBorder: 'rgba(124,58,237,0.3)',
    icon: <Moon size={12} />,
  },
  launch: {
    label: 'Lanzamiento',
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff, #0891b2)',
    badgeBg: 'rgba(0,212,255,0.12)',
    badgeBorder: 'rgba(0,212,255,0.3)',
    icon: <Rocket size={12} />,
  },
  planetary: {
    label: 'Planetario',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    badgeBg: 'rgba(16,185,129,0.12)',
    badgeBorder: 'rgba(16,185,129,0.3)',
    icon: <Globe size={12} />,
  },
  other: {
    label: 'Otro',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    badgeBg: 'rgba(236,72,153,0.12)',
    badgeBorder: 'rgba(236,72,153,0.3)',
    icon: <Sun size={12} />,
  },
}

const FILTER_TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'meteor', label: 'Lluvias de Meteoros' },
  { key: 'eclipse', label: 'Eclipses' },
  { key: 'launch', label: 'Lanzamientos' },
  { key: 'planetary', label: 'Planetarios' },
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

// ============================================================
// Hardcoded Events — 2025-2026
// ============================================================

function createEvents(): SpaceEvent[] {
  return [
    // --- 2025 ---
    {
      id: 'eta-aquarids-2025',
      title: 'Lluvia de Eta Acuáridas',
      date: new Date('2025-05-05T00:00:00Z'),
      description: 'Pico de la lluvia de meteoros Eta Acuáridas, producida por los restos del cometa Halley. Hasta 50 meteoros por hora bajo cielos oscuros.',
      type: 'meteor',
      emoji: '☄️',
    },
    {
      id: 'solstice-summer-2025',
      title: 'Solsticio de Verano',
      date: new Date('2025-06-21T10:42:00Z'),
      description: 'El día más largo del año en el hemisferio norte. El Sol alcanza su declinación máxima norte.',
      type: 'other',
      emoji: '☀️',
    },
    {
      id: 'spacex-starship-jul-2025',
      title: 'Lanzamiento SpaceX Starship',
      date: new Date('2025-07-15T18:00:00Z'),
      description: 'Misión prevista del Starship de SpaceX para demostración orbital. Tercer vuelo de prueba integrado del sistema de lanzamiento más grande del mundo.',
      type: 'launch',
      emoji: '🚀',
    },
    {
      id: 'saturn-opposition-2025',
      title: 'Oposición de Saturno',
      date: new Date('2025-09-21T00:00:00Z'),
      description: 'Saturno en oposición, más brillante y cercano a la Tierra. Ideal para observación de sus anillos con telescopio.',
      type: 'planetary',
      emoji: '🪐',
    },
    {
      id: 'perseids-2025',
      title: 'Lluvia de Perseidas',
      date: new Date('2025-08-12T21:00:00Z'),
      description: 'Una de las lluvias de meteoros más populares. Hasta 100 meteoros por hora en su pico. No te pierdas las "lágrimas de San Lorenzo".',
      type: 'meteor',
      emoji: '🌠',
    },
    {
      id: 'lunar-eclipse-sep-2025',
      title: 'Eclipse Lunar Total',
      date: new Date('2025-09-07T18:12:00Z'),
      description: 'Eclipse lunar total visible desde Europa, África y Asia. La Luna adquirirá un tono rojizo dramático durante la totalidad.',
      type: 'eclipse',
      emoji: '🌑',
    },
    {
      id: 'equinox-autumn-2025',
      title: 'Equinoccio de Otoño',
      date: new Date('2025-09-22T20:19:00Z'),
      description: 'Inicio del otoño en el hemisferio norte y primavera en el sur. Día y noche de igual duración.',
      type: 'other',
      emoji: '🍂',
    },
    {
      id: 'orionids-2025',
      title: 'Lluvia de Oriónidas',
      date: new Date('2025-10-21T22:00:00Z'),
      description: 'Lluvia producida por los restos del cometa Halley. Hasta 20 meteoros rápidos por hora visibles en el cielo nocturno.',
      type: 'meteor',
      emoji: '💫',
    },
    {
      id: 'nasa-artemis-2025',
      title: 'NASA Artemis III - Anuncio de Tripulación',
      date: new Date('2025-10-01T14:00:00Z'),
      description: 'Anuncio oficial de la tripulación para la misión Artemis III que llevará humanos de vuelta a la Luna por primera vez desde 1972.',
      type: 'launch',
      emoji: '👨‍🚀',
    },
    {
      id: 'solar-eclipse-oct-2025',
      title: 'Eclipse Solar Parcial',
      date: new Date('2025-10-21T18:00:00Z'),
      description: 'Eclipse solar parcial visible desde partes del sur de Sudamérica y la Antártida. Recordar: nunca mirar directamente al Sol.',
      type: 'eclipse',
      emoji: '🕶️',
    },
    {
      id: 'leonids-2025',
      title: 'Lluvia de Leónidas',
      date: new Date('2025-11-17T10:00:00Z'),
      description: 'Lluvia de meteoros asociada al cometa Tempel-Tuttle. Produjo tormentas espectaculares en 1966 y 2001.',
      type: 'meteor',
      emoji: '✨',
    },
    {
      id: 'jupiter-opposition-2025',
      title: 'Oposición de Júpiter',
      date: new Date('2025-12-07T00:00:00Z'),
      description: 'Júpiter en oposición: el planeta más grande del sistema solar brilla en todo su esplendor. Visible toda la noche.',
      type: 'planetary',
      emoji: '🟤',
    },
    {
      id: 'solstice-winter-2025',
      title: 'Solsticio de Invierno',
      date: new Date('2025-12-21T15:03:00Z'),
      description: 'La noche más larga del año en el hemisferio norte. Marca el inicio del invierno astronómico.',
      type: 'other',
      emoji: '❄️',
    },
    {
      id: 'geminids-2025',
      title: 'Lluvia de Gemínidas',
      date: new Date('2025-12-14T02:00:00Z'),
      description: 'La reina de las lluvias de meteoros: hasta 150 meteoros por hora en colores vibrantes. Producida por el asteroide 3200 Faetón.',
      type: 'meteor',
      emoji: '🌟',
    },
    // --- 2026 ---
    {
      id: 'mercury-transit-2026',
      title: 'Tránsito de Mercurio',
      date: new Date('2026-02-17T12:00:00Z'),
      description: 'Mercurio cruza frente al disco del Sol. Evento raro visible en Sudamérica y Norteamérica. Próximo tránsito no hasta 2032.',
      type: 'planetary',
      emoji: '☿️',
    },
    {
      id: 'equinox-spring-2026',
      title: 'Equinoccio de Primavera',
      date: new Date('2026-03-20T03:45:00Z'),
      description: 'Inicio de la primavera en el hemisferio norte. Las horas de luz empiezan a superar las de oscuridad.',
      type: 'other',
      emoji: '🌸',
    },
    {
      id: 'solar-eclipse-aug-2026',
      title: 'Eclipse Solar Total',
      date: new Date('2026-08-12T17:00:00Z'),
      description: 'Eclipse solar total visible desde Islandia, España y partes del Ártico. Uno de los eventos astronómicos más esperados de la década.',
      type: 'eclipse',
      emoji: '🌑',
    },
    {
      id: 'solstice-summer-2026',
      title: 'Solsticio de Verano 2026',
      date: new Date('2026-06-21T16:24:00Z'),
      description: 'El día más largo del año 2026. Celebración del solsticio en culturas de todo el mundo desde la antigüedad.',
      type: 'other',
      emoji: '🔥',
    },
    {
      id: 'spacex-mars-2026',
      title: 'SpaceX - Ventana de Marte',
      date: new Date('2026-08-01T06:00:00Z'),
      description: 'Apertura de la ventana de lanzamiento Tierra-Marte 2026. Posible misión no tripulada de demostración hacia el Planeta Rojo.',
      type: 'launch',
      emoji: '🔴',
    },
    {
      id: 'perseids-2026',
      title: 'Lluvia de Perseidas 2026',
      date: new Date('2025-08-12T21:00:00Z'),
      description: 'Las Perseidas regresan con su espectáculo anual de hasta 100 meteoros por hora. Condiciones de luna favorable en 2026.',
      type: 'meteor',
      emoji: '🌠',
    },
    {
      id: 'venus-conjunction-2026',
      title: 'Gran Conjunción Venus-Júpiter',
      date: new Date('2026-08-23T04:00:00Z'),
      description: 'Venus y Júpiter aparecen extremadamente cercanos en el cielo. Evento visible a simple vista al amanecer.',
      type: 'planetary',
      emoji: '💫',
    },
    {
      id: 'nasa-europa-clipper-2026',
      title: 'NASA Europa Clipper - Sobrevuelo',
      date: new Date('2026-09-01T12:00:00Z'),
      description: 'Primer sobrevuelo de la luna Europa de Júpiter por la sonda Europa Clipper. Búsqueda de condiciones para la vida en el océano subterráneo.',
      type: 'launch',
      emoji: '🛰️',
    },
    {
      id: 'lunar-eclipse-mar-2026',
      title: 'Eclipse Lunar Total',
      date: new Date('2026-03-03T20:34:00Z'),
      description: 'Eclipse lunar total visible desde Asia, Australia y el Pacífico. La Luna se tiñe de rojo cobrizo durante la totalidad.',
      type: 'eclipse',
      emoji: '🌕',
    },
    {
      id: 'geminids-2026',
      title: 'Lluvia de Gemínidas 2026',
      date: new Date('2026-12-14T02:00:00Z'),
      description: 'Cierre del año astronómico con la lluvia más activa: hasta 150 meteoros multicolores por hora. Produce "bolas de fuego" espectaculares.',
      type: 'meteor',
      emoji: '🎇',
    },
  ]
}

// ============================================================
// Helpers
// ============================================================

function getTimeDiff(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isPast: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
    isPast: false,
  }
}

function getDaysAgo(date: Date): number {
  const diff = Date.now() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

// ============================================================
// Countdown Timer Component
// ============================================================

function CountdownTimer({ targetDate, size = 'normal' }: { targetDate: Date; size?: 'hero' | 'normal' | 'small' }) {
  const [time, setTime] = useState(() => getTimeDiff(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeDiff(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (time.isPast) return null

  const isHero = size === 'hero'
  const isSmall = size === 'small'

  const units = [
    { label: 'Días', value: time.days },
    { label: 'Horas', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Seg', value: time.seconds },
  ]

  return (
    <div className="flex items-center gap-1">
      {units.map((unit, i) => (
        <React.Fragment key={unit.label}>
          {i > 0 && (
            <span className={`${isHero ? 'text-white/20 text-2xl mx-1' : isSmall ? 'text-white/20 text-xs mx-0.5' : 'text-white/20 text-sm mx-1'}`}>
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <motion.span
              key={unit.value}
              initial={{ scale: 1.1, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`font-mono font-bold tabular-nums ${
                isHero ? 'text-3xl md:text-5xl text-white' : isSmall ? 'text-xs text-white/80' : 'text-sm text-white/90'
              }`}
              style={
                isHero
                  ? {
                      textShadow: '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)',
                    }
                  : undefined
              }
            >
              {pad(unit.value)}
            </motion.span>
            {!isSmall && (
              <span className={`${isHero ? 'text-[10px] md:text-xs text-white/30 mt-0.5' : 'text-[9px] text-white/25 mt-0.5'} uppercase tracking-wider`}>
                {unit.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

// ============================================================
// Event Card Component
// ============================================================

function EventCard({ event, index }: { event: SpaceEvent; index: number }) {
  const isPast = event.date.getTime() < Date.now()
  const daysAgo = isPast ? getDaysAgo(event.date) : 0
  const config = TYPE_CONFIG[event.type]

  return (
    <motion.div
      className="group rounded-xl overflow-hidden relative transition-opacity"
      style={{
        ...cardBase,
        opacity: isPast ? 0.45 : 1,
      }}
      variants={staggerItem}
      whileHover={!isPast ? { scale: 1.015, y: -2 } : undefined}
      onHoverStart={e => {
        if (e.currentTarget && !isPast) {
          e.currentTarget.style.borderColor = `${config.color}30`
          e.currentTarget.style.boxShadow = `0 0 25px ${config.color}10, 0 8px 32px rgba(0,0,0,0.3)`
        }
      }}
      onHoverEnd={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <CardGradientTop color={`linear-gradient(90deg, ${config.color}, transparent)`} />

      <div className="p-5 space-y-4">
        {/* Header: emoji + title + badge */}
        <div className="flex items-start gap-3">
          <motion.span
            className="text-3xl flex-shrink-0 mt-0.5"
            animate={!isPast ? { rotate: [0, 5, -5, 0] } : {}}
            transition={!isPast ? { duration: 3, repeat: Infinity, repeatDelay: 5 } : undefined}
          >
            {event.emoji}
          </motion.span>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
              {event.title}
            </h3>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Type badge */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider"
                style={{
                  background: config.badgeBg,
                  border: `1px solid ${config.badgeBorder}`,
                  color: config.color,
                }}
              >
                {config.icon}
                {config.label}
              </span>

              {/* Date */}
              <span className="inline-flex items-center gap-1 text-[11px] text-white/30">
                <Calendar size={10} />
                {formatDisplayDate(event.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/35 text-xs leading-relaxed line-clamp-2">{event.description}</p>

        {/* Countdown or past label */}
        <div className="pt-2 border-t border-white/[0.04]">
          {isPast ? (
            <div className="flex items-center gap-1.5 text-white/25 text-xs">
              <Clock size={12} />
              <span>
                Ocurrió hace{' '}
                <span className="text-white/40 font-medium">
                  {daysAgo === 0 ? 'hoy' : daysAgo === 1 ? '1 día' : `${daysAgo} días`}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Timer size={12} className="text-white/20 flex-shrink-0" />
              <CountdownTimer targetDate={event.date} size="small" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Main Page Component
// ============================================================

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [now, setNow] = useState(Date.now())

  // Tick every second for reactivity
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Create events once
  const events = useMemo(() => createEvents(), [])

  // Sort and filter
  const sortedAndFiltered = useMemo(() => {
    let filtered = activeFilter === 'all' ? events : events.filter(e => e.type === activeFilter)

    const upcoming = filtered
      .filter(e => e.date.getTime() >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    const past = filtered
      .filter(e => e.date.getTime() < now)
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return { upcoming, past }
  }, [events, activeFilter, now])

  const nextEvent = useMemo(() => {
    return events
      .filter(e => e.date.getTime() >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null
  }, [events, now])

  const heroConfig = nextEvent ? TYPE_CONFIG[nextEvent.type] : null

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Calendar className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Eventos Espaciales</h1>
            <p className="text-white/40 text-sm">Calendario astronómico y lanzamientos espaciales</p>
          </div>
        </div>
      </motion.div>

      {/* Próximo Evento Hero */}
      <AnimatePresence>
        {nextEvent && heroConfig && (
          <motion.div
            key={nextEvent.id}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              ...cardBase,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Glow background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${heroConfig.color}08 0%, transparent 60%)`,
              }}
            />

            <CardGradientTop color={`linear-gradient(90deg, ${heroConfig.color}, ${heroConfig.color}00 70%)`} />

            <div className="relative p-6 md:p-8">
              {/* Hero badge */}
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Próximo Evento</span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                {/* Left: Event info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span
                      className="text-5xl md:text-6xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {nextEvent.emoji}
                    </motion.span>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{nextEvent.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            background: heroConfig.badgeBg,
                            border: `1px solid ${heroConfig.badgeBorder}`,
                            color: heroConfig.color,
                          }}
                        >
                          {heroConfig.icon}
                          {heroConfig.label}
                        </span>
                        <span className="text-white/30 text-xs">{formatDisplayDate(nextEvent.date)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/40 text-sm leading-relaxed max-w-lg">{nextEvent.description}</p>
                </div>

                {/* Right: Big countdown */}
                <motion.div
                  className="flex-shrink-0 rounded-2xl p-5 md:p-6"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(12px)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, type: 'spring', damping: 20 }}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <Timer size={14} className="text-cyan-400" />
                    <span className="text-[11px] text-white/30 uppercase tracking-widest font-medium">Cuenta Regresiva</span>
                  </div>
                  <CountdownTimer targetDate={nextEvent.date} size="hero" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Filter size={14} className="text-white/20 mr-1" />
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.key
          const tabColor = tab.key === 'all' ? '#00d4ff' : TYPE_CONFIG[tab.key as EventType]?.color ?? '#00d4ff'
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: isActive ? `${tabColor}15` : 'rgba(255,255,255,0.03)',
                border: isActive ? `1px solid ${tabColor}40` : '1px solid rgba(255,255,255,0.06)',
                color: isActive ? tabColor : 'rgba(255,255,255,0.4)',
                boxShadow: isActive ? `0 0 15px ${tabColor}10` : 'none',
              }}
              onMouseEnter={e => {
                if (e.currentTarget && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                if (e.currentTarget && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              {tab.label}
            </button>
          )
        })}

        {/* Event count */}
        <div className="ml-auto text-[11px] text-white/20">
          {sortedAndFiltered.upcoming.length + sortedAndFiltered.past.length} eventos
        </div>
      </motion.div>

      {/* Upcoming Events */}
      {sortedAndFiltered.upcoming.length > 0 && (
        <div className="space-y-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star size={14} className="text-amber-400" />
            <h2 className="text-lg font-semibold text-white/70">Próximos Eventos</h2>
            <div className="flex-1 h-px bg-white/[0.04] ml-2" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={`upcoming-${activeFilter}`}
          >
            {sortedAndFiltered.upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Past Events */}
      {sortedAndFiltered.past.length > 0 && (
        <div className="space-y-4">
          <motion.button
            className="flex items-center gap-2 w-full text-left group/past"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Clock size={14} className="text-white/20" />
            <h2 className="text-lg font-semibold text-white/30 group-hover/past:text-white/50 transition-colors">
              Eventos Pasados
            </h2>
            <span className="text-[11px] text-white/15 bg-white/[0.03] px-2 py-0.5 rounded-full">
              {sortedAndFiltered.past.length}
            </span>
            <div className="flex-1 h-px bg-white/[0.04] ml-2" />
          </motion.button>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={`past-${activeFilter}`}
          >
            {sortedAndFiltered.past.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Empty state */}
      {sortedAndFiltered.upcoming.length === 0 && sortedAndFiltered.past.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Eye size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/20 text-sm">No hay eventos en esta categoría</p>
        </motion.div>
      )}
    </div>
  )
}
