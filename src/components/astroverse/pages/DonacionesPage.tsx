'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Sparkles, Globe2,
  Users, BookOpen, Star, ChevronUp, ExternalLink,
} from 'lucide-react'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=APA3FHPTGLR2C'

// ============================================================
// DonacionesPage — Direct PayPal Donate Link
// ============================================================
export default function DonacionesPage() {
  const impactStats = [
    { icon: Users, label: 'Estudiantes impactados', value: '2,500+', color: '#00d4ff' },
    { icon: BookOpen, label: 'Escuelas conectadas', value: '45', color: '#10b981' },
    { icon: Globe2, label: 'Países alcanzados', value: '8', color: '#a855f7' },
    { icon: Star, label: 'Donantes activos', value: '120+', color: '#f59e0b' },
  ]

  const milestones = [
    { goal: '$500 USD', desc: 'Servidor dedicado para video lecciones', progress: 72, emoji: '🖥️', color: '#00d4ff' },
    { goal: '$1.000 USD', desc: 'App móvil de AstroVerse', progress: 38, emoji: '📱', color: '#10b981' },
    { goal: '$5.000 USD', desc: 'Traducción a 5 idiomas + contenido NASA', progress: 15, emoji: '🌍', color: '#a855f7' },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div
          className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(236,72,153,0.08)',
          }}
        >
          <Heart size={36} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)' }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Apoya AstroVerse</h1>
        <p className="text-white/40 max-w-md mx-auto">
          AstroVerse es <span className="text-amber-400 font-semibold">100% gratuito</span>. Tu donación nos ayuda a mantener servidores, crear contenido y expandir la plataforma para estudiantes de toda Latinoamérica.
        </p>
      </motion.div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {impactStats.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl p-4 text-center relative overflow-hidden"
            style={cardBase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-white/25 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* DONATE BUTTON — SINGLE PAYPAL LINK */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed, transparent)" />
        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          <motion.div
            className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 0 30px rgba(245,158,11,0.2)',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <motion.span className="text-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              💫
            </motion.span>
          </motion.div>

          <h2 className="text-xl font-bold text-white mb-2">Dona al proyecto</h2>
          <p className="text-white/40 text-sm mb-8 max-w-sm">
            Elige el monto que quieras en PayPal. Cualquier donación nos ayuda a seguir creciendo.
          </p>

          {/* BIG ILLUMINATED DONATE BUTTON */}
          <motion.a
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899, #f59e0b)',
              backgroundSize: '200% 200%',
              color: 'white',
              boxShadow: '0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(236,72,153,0.2), 0 8px 25px rgba(0,0,0,0.4)',
              border: '1px solid rgba(245,158,11,0.5)',
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 60px rgba(245,158,11,0.6), 0 0 120px rgba(236,72,153,0.3), 0 8px 25px rgba(0,0,0,0.4)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 70%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 70%)',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <Heart size={22} className="relative z-10" fill="white" />
            <span className="relative z-10">Donar con PayPal</span>
            <ExternalLink size={16} className="relative z-10" />
          </motion.a>

          <p className="text-white/20 text-[10px] mt-4">Pago seguro a través de PayPal · Elige tu monto allí</p>
        </div>
      </motion.div>

      {/* Funding Milestones */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronUp size={20} className="text-cyan-400" />
            </motion.div>
            <h2 className="text-lg font-bold text-white">Metas de Financiamiento</h2>
            <span className="text-white/20 text-xs ml-auto">Actualización en tiempo real</span>
          </div>

          <div className="space-y-5">
            {milestones.map((m, i) => (
              <motion.div key={m.goal} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <p className="text-white/80 text-sm font-semibold">{m.desc}</p>
                      <p className="text-white/25 text-[11px]">Meta: {m.goal}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: m.color }}>{m.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.45 + i * 0.1, ease: 'easeOut' }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)' }}
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: i * 0.5 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Impact message */}
      <motion.div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="inline-block mb-3">
          <span className="text-3xl">🌍</span>
        </motion.div>
        <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
          Cada donación, por pequeña que sea, marca la diferencia. Ayudás a que miles de estudiantes puedan <span className="text-amber-400 font-bold">explorar el universo gratis</span>.
        </p>
        <p className="text-white/20 text-xs mt-3">
          AstroVerse es un proyecto sin fines de lucro · Todas las donaciones van directamente a la plataforma
        </p>
      </motion.div>
    </div>
  )
}
