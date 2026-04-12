'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Gift, Sparkles, Coffee, Globe2, Rocket,
  Users, BookOpen, Star, ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// DonacionesPage — Standalone Donations Page (USD + COP)
// ============================================================
export default function DonacionesPage() {
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')

  const donationsUSD = [
    { amount: 3, label: '$3', desc: 'Una estrella', emoji: '☄️', glow: 'rgba(245,158,11,0.3)' },
    { amount: 5, label: '$5', desc: 'Un cohete', emoji: '🚀', glow: 'rgba(0,212,255,0.3)' },
    { amount: 10, label: '$10', desc: 'Una galaxia', emoji: '🌌', glow: 'rgba(124,58,237,0.3)' },
    { amount: 25, label: '$25', desc: 'Un universo', emoji: '✨', glow: 'rgba(16,185,129,0.3)' },
    { amount: 50, label: '$50', desc: 'Supernova', emoji: '💥', glow: 'rgba(236,72,153,0.3)' },
    { amount: 100, label: '$100', desc: 'Big Bang', emoji: '🔮', glow: 'rgba(245,158,11,0.4)' },
  ]

  const donationsCOP = [
    { amount: 5000, label: '$5.000', desc: 'Una estrella', emoji: '☄️', glow: 'rgba(245,158,11,0.3)' },
    { amount: 10000, label: '$10.000', desc: 'Un cohete', emoji: '🚀', glow: 'rgba(0,212,255,0.3)' },
    { amount: 25000, label: '$25.000', desc: 'Una galaxia', emoji: '🌌', glow: 'rgba(124,58,237,0.3)' },
    { amount: 50000, label: '$50.000', desc: 'Un universo', emoji: '✨', glow: 'rgba(16,185,129,0.3)' },
  ]

  const handleDonate = (amount: number, currency: string) => {
    setSelectedDonation(amount)
    toast.success(`¡Gracias! Donación de ${currency === 'USD' ? '$' : ''}${amount.toLocaleString()} ${currency} registrada ❤️`)
  }

  const handleCustomDonate = () => {
    const amt = parseFloat(customAmount)
    if (!amt || amt <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }
    toast.success(`¡Gracias! Donación de $${amt} USD registrada ❤️`)
    setCustomAmount('')
  }

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

      {/* USD Donations — PRIMARY */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Rocket size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Donar en USD
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/25">INTERNACIONAL</span>
              </h2>
              <p className="text-white/30 text-xs">Tarjeta de crédito, PayPal y más</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {donationsUSD.map((d, i) => (
              <motion.button
                key={`usd-${d.amount}`}
                onClick={() => handleDonate(d.amount, 'USD')}
                className="rounded-2xl p-4 text-center relative overflow-hidden group"
                style={{
                  background: selectedDonation === d.amount ? `${d.glow.replace('0.3', '0.15')}` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedDonation === d.amount ? d.glow : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: selectedDonation === d.amount ? `0 0 30px ${d.glow}, 0 0 60px ${d.glow.replace('0.3', '0.1')}` : 'none',
                  transition: 'box-shadow 0.4s ease',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 35px ${d.glow}, 0 0 70px ${d.glow.replace('0.3', '0.15')}`,
                  borderColor: d.glow,
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${d.glow.replace('0.3', '0.08')}, transparent 70%)` }}
                />
                <div className="relative z-10">
                  <motion.span className="text-2xl block mb-1.5" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}>
                    {d.emoji}
                  </motion.span>
                  <p className="text-white font-black text-lg">{d.label}</p>
                  <p className="text-white/25 text-[9px] mt-0.5">USD · {d.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Custom USD amount + ILLUMINATED Donate Button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                placeholder="Otro monto en USD"
                className="w-full pl-8 pr-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            {/* ILLUMINATED Donate USD Button */}
            <motion.button
              onClick={handleCustomDonate}
              className="px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shrink-0 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                boxShadow: '0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(236,72,153,0.15), 0 4px 15px rgba(0,0,0,0.3)',
                color: 'white',
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 50px rgba(245,158,11,0.5), 0 0 100px rgba(236,72,153,0.25), 0 4px 15px rgba(0,0,0,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)' }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
              <Gift size={16} className="relative z-10" />
              <span className="relative z-10">Donar en USD</span>
              <Heart size={14} className="relative z-10" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* COP Donations — SECONDARY */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <CardGradientTop color="linear-gradient(90deg, #10b981, #00d4ff, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Coffee size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Donar en Pesos Colombianos
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-400/15 text-emerald-400 border border-emerald-400/25">LOCAL</span>
              </h2>
              <p className="text-white/30 text-xs">Nequi, Daviplata, Bancolombia</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {donationsCOP.map((d, i) => (
              <motion.button
                key={`cop-${d.amount}`}
                onClick={() => handleDonate(d.amount, 'COP')}
                className="rounded-2xl p-5 text-center relative overflow-hidden group"
                style={{
                  background: selectedDonation === d.amount ? `${d.glow.replace('0.3', '0.15')}` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedDonation === d.amount ? d.glow : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: selectedDonation === d.amount ? `0 0 30px ${d.glow}, 0 0 60px ${d.glow.replace('0.3', '0.1')}` : 'none',
                  transition: 'box-shadow 0.4s ease',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 35px ${d.glow}, 0 0 70px ${d.glow.replace('0.3', '0.15')}`,
                  borderColor: d.glow,
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${d.glow.replace('0.3', '0.08')}, transparent 70%)` }}
                />
                <div className="relative z-10">
                  <motion.span className="text-3xl block mb-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                    {d.emoji}
                  </motion.span>
                  <p className="text-white font-black text-lg">{d.label}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">COP · {d.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Funding Milestones */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
              <motion.div key={m.goal} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.08 }}>
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
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
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
        transition={{ delay: 0.5 }}
      >
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="inline-block mb-3">
          <span className="text-3xl">🌍</span>
        </motion.div>
        <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
          Cada donación, por pequeña que sea, marca la diferencia. Con <span className="text-amber-400 font-bold">$5 USD</span> ayudás a un estudiante a explorar el universo durante un mes. Con <span className="text-amber-400 font-bold">$10.000 COP</span> puedes mantener un servidor activo por un día.
        </p>
        <p className="text-white/20 text-xs mt-3">
          AstroVerse es un proyecto sin fines de lucro · Todas las donaciones van directamente a la plataforma
        </p>
      </motion.div>
    </div>
  )
}
