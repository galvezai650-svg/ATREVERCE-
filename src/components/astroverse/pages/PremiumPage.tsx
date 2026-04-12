'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Users, BookOpen, Heart, ChevronDown,
  Gift, Check, Zap, Globe2, Rocket, Sparkles, Coffee,
  Crown, Star, Shield, Monitor, School, Eye, Award, Video
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// PremiumPage → ASTROVERSE PRO
// ============================================================
export default function PremiumPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null)
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('astroverse_pro') === 'true'
    return false
  })

  const togglePro = () => {
    const next = !isPro
    setIsPro(next)
    localStorage.setItem('astroverse_pro', String(next))
    toast.success(next ? '🎓 ¡Activado ASTROVERSE PRO!' : 'Plan Básico activado')
  }

  const proFeatures = [
    { text: 'Panel de Profesor completo', icon: School },
    { text: 'Aula Virtual con código de acceso', icon: Users },
    { text: 'Asignar tareas y ver videos', icon: Video },
    { text: 'Seguimiento en tiempo real', icon: Monitor },
    { text: 'Simuladores para el aula', icon: Rocket },
    { text: 'Modelos 3D del sistema solar', icon: Globe2 },
    { text: 'Calificaciones automáticas', icon: Award },
    { text: 'Certificados para estudiantes', icon: Shield },
    { text: 'Datos verificados por la NASA', icon: Eye },
    { text: 'Contenido sin restricciones', icon: Star },
    { text: 'Soporte prioritario', icon: Zap },
    { text: 'Acceso anticipado a funciones', icon: Sparkles },
  ]

  const comparison = [
    { feature: 'Simuladores básicos', basic: true, pro: true },
    { feature: 'Enciclopedia Espacial', basic: true, pro: true },
    { feature: 'Videos educativos', basic: true, pro: true },
    { feature: 'Exploración del catálogo', basic: true, pro: true },
    { feature: 'Modelos 3D interactivos', basic: false, pro: true },
    { feature: 'Panel de Profesor', basic: false, pro: true },
    { feature: 'Aula Virtual', basic: false, pro: true },
    { feature: 'Tareas en línea', basic: false, pro: true },
    { feature: 'Calificaciones automáticas', basic: false, pro: true },
    { feature: 'Seguimiento de estudiantes', basic: false, pro: true },
    { feature: 'Sistema Solar NASA', basic: false, pro: true },
    { feature: 'Certificados', basic: false, pro: true },
    { feature: 'Soporte prioritario', basic: false, pro: true },
  ]

  const donations = [
    { amount: 5000, label: '$5.000', desc: 'Una estrella', emoji: '☄️', glow: 'rgba(245,158,11,0.3)' },
    { amount: 10000, label: '$10.000', desc: 'Un cohete', emoji: '🚀', glow: 'rgba(0,212,255,0.3)' },
    { amount: 25000, label: '$25.000', desc: 'Una galaxia', emoji: '🌌', glow: 'rgba(124,58,237,0.3)' },
    { amount: 50000, label: '$50.000', desc: 'Un universo', emoji: '✨', glow: 'rgba(16,185,129,0.3)' },
  ]

  const faqs = [
    { q: '¿Qué es ASTROVERSE PRO?', a: 'Es la versión educativa avanzada con herramientas para profesores: aula virtual, tareas en línea, calificaciones, certificados y acceso a todo el contenido.' },
    { q: '¿Cuánto cuesta?', a: 'Es completamente GRATUITO para profesores y estudiantes. Nuestra misión es democratizar la educación espacial en Latinoamérica.' },
    { q: '¿Cómo funciona el Aula Virtual?', a: 'Creas un aula, compartes el código con tus estudiantes, y desde el panel de profesor puedes asignar tareas, ver quién está en línea, calificar y dar seguimiento en tiempo real.' },
    { q: '¿Las donaciones son obligatorias?', a: 'No, son 100% voluntarias. Cada donación nos ayuda a mantener servidores, crear contenido y expandir la plataforma.' },
  ]

  const handleDonate = (amount: number) => {
    setSelectedDonation(amount)
    toast.success(`¡Gracias! Donación de $${amount.toLocaleString()} COP registrada ❤️`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">ASTROVERSE PRO</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(16,185,129,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
            boxShadow: '0 0 12px rgba(0,212,255,0.15)',
          }}>
            <GraduationCap size={10} />
            EDUCATIVO
          </span>
        </div>
        <p className="text-white/40">Para profesores y estudiantes · Herramientas educativas avanzadas</p>
      </motion.div>

      {/* Active PRO Banner */}
      {isPro && (
        <motion.div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            ...cardBase,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(16,185,129,0.06))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.04) 50%, transparent 100%)' }} animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #10b981)', boxShadow: '0 0 25px rgba(0,212,255,0.3)' }}>
              <GraduationCap size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">ASTROVERSE PRO Activo</h2>
              <p className="text-white/40 text-sm">Tienes acceso al panel de profesor, aula virtual y todas las funciones.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Aula Virtual', 'Tareas', 'Calificaciones', 'Certificados'].map(f => (
                  <span key={f} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>{f}</span>
                ))}
              </div>
            </div>
            <motion.button onClick={togglePro} className="px-4 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.95 }}>
              Desactivar
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <motion.div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <Star size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Básico</h2>
            <p className="text-white/30 text-sm mb-4">Todo desbloqueado para explorar</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">Gratis</span>
              <span className="text-white/30 text-sm"> / siempre</span>
            </div>
            {!isPro && (
              <div className="px-3 py-1.5 rounded-full text-[10px] font-bold inline-block mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                TU PLAN ACTUAL
              </div>
            )}
            {isPro && (
              <motion.button onClick={togglePro} className="w-full py-3 rounded-xl text-sm font-semibold mb-4 text-white/70" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.98 }}>
                Cambiar a Básico
              </motion.button>
            )}
          </div>
          <div className="space-y-3 mt-2">
            {[
              'Simuladores interactivos',
              'Enciclopedia Espacial completa',
              'Videos educativos',
              'Catálogo de exploración',
              'Modelos 3D del sistema solar',
              'Contenido actualizado',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}><Check size={12} className="text-emerald-400" /></div>
                <span className="text-white/60 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PRO Plan */}
        <motion.div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ ...cardBase, border: '1px solid rgba(0,212,255,0.2)' }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {/* Shimmer border */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="absolute inset-[-200%] animate-[spin_6s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, rgba(0,212,255,0.15), transparent, rgba(16,185,129,0.15), transparent, rgba(0,212,255,0.15))' }} />
            <div className="absolute inset-[1px] rounded-2xl" style={{ background: 'rgba(5,5,16,0.97)' }} />
          </div>
          <div className="text-center relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #10b981)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
              <GraduationCap size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
              ASTROVERSE PRO
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-400/15 text-cyan-400 border border-cyan-400/25">GRATIS</span>
            </h2>
            <p className="text-white/30 text-sm mb-4">Para profesores · Todo + Aula Virtual</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">Gratis</span>
              <span className="text-white/30 text-sm"> / para educación</span>
            </div>
            {isPro ? (
              <div className="px-3 py-1.5 rounded-full text-[10px] font-bold inline-block mb-4" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                ACTIVO
              </div>
            ) : (
              <motion.button
                onClick={togglePro}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 mb-4"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #10b981)', boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 4px 15px rgba(0,0,0,0.3)' }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,212,255,0.4), 0 4px 15px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <GraduationCap size={16} />
                Activar PRO Gratis
              </motion.button>
            )}
          </div>
          <div className="space-y-3 mt-2 relative z-10">
            {proFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}><Check size={12} className="text-cyan-400" /></div>
                <span className="text-white/60 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparison table */}
      <motion.div className="rounded-2xl overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #10b981, transparent)" />
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-4">Comparar Planes</h2>
          <div className="grid grid-cols-3 gap-4 pb-3 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/40 text-xs font-medium">Funcionalidad</div>
            <div className="text-center text-white/40 text-xs font-medium">Básico</div>
            <div className="text-center text-cyan-400 text-xs font-medium flex items-center justify-center gap-1"><GraduationCap size={12} /> PRO</div>
          </div>
          {comparison.map((f, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-2.5 items-center" style={{ borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <div className="text-white/60 text-sm">{f.feature}</div>
              <div className="text-center">{f.basic ? <Check size={16} className="text-emerald-400 mx-auto" /> : <span className="text-white/15 text-xs">—</span>}</div>
              <div className="text-center"><Check size={16} className="text-cyan-400 mx-auto" /></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Donations Section with GLOWING buttons */}
      <motion.div className="rounded-2xl relative overflow-hidden" style={cardBase} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 0 25px rgba(245,158,11,0.15)',
            }}>
              <Heart size={24} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Apoya AstroVerse
                <Coffee size={18} className="text-amber-400" />
              </h2>
              <p className="text-white/40 text-sm mt-1">AstroVerse es 100% gratuito. Tu donación nos ayuda a mantener servidores, crear contenido y expandir la plataforma para estudiantes de toda Latinoamérica.</p>
            </div>
          </div>

          {/* Glowing donation cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {donations.map((d, i) => (
              <motion.button
                key={d.amount}
                onClick={() => handleDonate(d.amount)}
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
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                {/* Glow pulse background */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${d.glow.replace('0.3', '0.08')}, transparent 70%)`,
                  }}
                />
                <div className="relative z-10">
                  <motion.span
                    className="text-3xl block mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {d.emoji}
                  </motion.span>
                  <p className="text-white font-black text-lg">{d.label}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">COP · {d.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Custom amount + donate button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">$</span>
              <input
                type="number"
                placeholder="Otro monto (COP)"
                className="w-full pl-8 pr-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            {/* ILLUMINATED Donate Button */}
            <motion.button
              onClick={() => toast.success('¡Gracias por apoyar AstroVerse! El proceso de pago estará disponible pronto. ❤️')}
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
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
                }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
              <Gift size={16} className="relative z-10" />
              <span className="relative z-10">Donar Ahora</span>
              <Heart size={14} className="relative z-10" />
            </motion.button>
          </div>

          {/* Impact message */}
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
            <p className="text-white/30 text-xs leading-relaxed">
              💡 Con <span className="text-amber-400 font-bold">$10.000 COP</span> ayudás a un estudiante a explorar el universo durante un mes.
              Cada donación, por pequeña que sea, marca la diferencia. 🌟
            </p>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          Preguntas Frecuentes
        </h2>
        <div className="space-y-2 max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-all">
                <span className="text-white/70 text-sm font-medium">{faq.q}</span>
                <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={16} className="text-white/30" /></motion.div>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <p className="px-4 pb-4 text-white/40 text-sm leading-relaxed">{faq.a}</p>
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
