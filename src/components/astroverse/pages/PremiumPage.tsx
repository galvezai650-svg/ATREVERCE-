'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Users, School, BookOpen, Heart, Star, ChevronDown,
  Gift, Monitor, Check, Zap, Globe2, Rocket, Sparkles, Coffee, ExternalLink, Copy, CheckCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// PremiumPage → ASTROVERSE PRO
// ============================================================
export default function PremiumPage({ isPremium, onTogglePlan }: { isPremium: boolean; onTogglePlan: () => void }) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null)

  const teacherFeatures = [
    { text: 'Panel de control para gestionar estudiantes', icon: Users },
    { text: 'Asignar tareas y actividades espaciales', icon: BookOpen },
    { text: 'Seguimiento del progreso de cada estudiante', icon: Monitor },
    { text: 'Contenido adaptado para niveles educativos', icon: GraduationCap },
    { text: 'Simuladores interactivos para el aula', icon: Rocket },
    { text: 'Acceso a todos los modelos 3D del sistema solar', icon: Globe2 },
    { text: 'Enciclopedia espacial con datos verificados por la NASA', icon: Sparkles },
    { text: 'Certificados de finalización para estudiantes', icon: Check },
  ]

  const donations = [
    { amount: 5000, label: '$5.000 COP', desc: 'Una estrella ☄️', emoji: '☄️' },
    { amount: 10000, label: '$10.000 COP', desc: 'Un cohete 🚀', emoji: '🚀' },
    { amount: 25000, label: '$25.000 COP', desc: 'Una galaxia 🌌', emoji: '🌌' },
    { amount: 50000, label: '$50.000 COP', desc: 'Un universo completo ✨', emoji: '✨' },
  ]

  const faqs = [
    { q: '¿Qué es ASTROVERSE PRO?', a: 'ASTROVERSE PRO es la versión educativa avanzada de AstroVerse, diseñada especialmente para profesores y estudiantes de colegio. Incluye herramientas de gestión del aula, seguimiento de progreso y contenido adaptado a cada nivel educativo.' },
    { q: '¿Cómo funciona el Modo Profesor?', a: 'El Modo Profesor te permite crear un aula virtual, invitar a tus estudiantes con un código único, asignar actividades sobre astronomía y ver el progreso individual de cada alumno. Es como un LMS pero enfocado en la exploración espacial.' },
    { q: '¿ASTROVERSE PRO es gratuito?', a: 'Sí, ASTROVERSE PRO es completamente gratuito para profesores y estudiantes. Nuestra misión es democratizar la educación espacial. Sin embargo, aceptamos donaciones voluntarias para mantener la plataforma activa y seguir creando contenido.' },
    { q: '¿Para qué edades es recomendable?', a: 'AstroVerse está diseñado para estudiantes de primaria, secundaria y preparatoria (8-18 años). El Modo Profesor permite adaptar la dificultad del contenido según el nivel educativo.' },
    { q: '¿Las donaciones son obligatorias?', a: 'No, las donaciones son 100% voluntarias. Cada contribución nos ayuda a mantener servidores, crear nuevo contenido educativo y seguir expandiendo la plataforma. ¡Cualquier aporte es bienvenido!' },
  ]

  const handleCopyCode = () => {
    const code = 'ASTRO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedLink(true)
      toast.success('Código de aula copiado al portapapeles')
      setTimeout(() => setCopiedLink(false), 2000)
    }).catch(() => {
      toast.success(`Tu código de aula es: ${code}`)
    })
  }

  const handleDonate = (amount: number) => {
    setSelectedDonation(amount)
    toast.success('¡Gracias por tu interés en donar! Esta función estará disponible pronto.', {
      description: `Donación de $${amount.toLocaleString()} COP procesada.`,
    })
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
            <Zap size={10} />
            EDUCATIVO
          </span>
        </div>
        <p className="text-white/40">Herramientas educativas para profesores y estudiantes</p>
      </motion.div>

      {/* Teacher Mode Hero Card */}
      <motion.div
        className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
        style={{
          ...cardBase,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(16,185,129,0.06), rgba(124,58,237,0.04))',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.05, type: 'spring', damping: 20 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.04) 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #10b981)',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
            }}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            <GraduationCap size={32} className="text-white" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-1">
              <School size={20} className="text-emerald-400" />
              Modo Profesor
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl">
              Crea aulas virtuales, asigna actividades sobre astronomía, sigue el progreso de tus estudiantes y usa simuladores interactivos en clase. Todo adaptado al currículo escolar.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Gestión de Aulas', 'Seguimiento', 'Simuladores', 'Certificados', 'Gratuito'].map(f => (
                <span key={f} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold" style={{
                  background: 'rgba(0,212,255,0.1)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  color: 'rgba(0,212,255,0.8)',
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Teacher Features Grid */}
      <motion.div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #10b981, transparent)" />
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-cyan-400" />
          Funciones del Modo Profesor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teacherFeatures.map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.15)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,212,255,0.08)' }}>
                <feature.icon size={18} className="text-cyan-400" />
              </div>
              <span className="text-white/60 text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create Classroom Card */}
      <motion.div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #10b981, transparent)" />
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Users size={20} className="text-emerald-400" />
          Crear un Aula
        </h2>
        <p className="text-white/40 text-sm mb-6">Genera un código para que tus estudiantes se unan a tu aula virtual de astronomía.</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 rounded-xl p-4 text-center" style={{
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <p className="text-white/30 text-xs mb-1">Código del aula</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 tracking-wider">
              ASTRO-{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </p>
          </div>
          <motion.button
            onClick={handleCopyCode}
            className="px-6 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #10b981)',
              boxShadow: '0 0 25px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
              color: 'white',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(0,212,255,0.3), 0 4px 15px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedLink ? <CheckCheck size={16} /> : <Copy size={16} />}
            {copiedLink ? '¡Copiado!' : 'Copiar Código'}
          </motion.button>
        </div>
      </motion.div>

      {/* Donations Section */}
      <motion.div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, transparent)" />
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
          }}>
            <Heart size={24} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Apoya AstroVerse
              <Coffee size={18} className="text-amber-400" />
            </h2>
            <p className="text-white/40 text-sm mt-1">
              AstroVerse es un proyecto educativo gratuito. Tu donación nos ayuda a mantener servidores, crear contenido nuevo y seguir expandiendo la plataforma para estudiantes de toda Latinoamérica.
            </p>
          </div>
        </div>

        {/* Donation amounts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {donations.map((d, i) => (
            <motion.button
              key={d.amount}
              onClick={() => handleDonate(d.amount)}
              className="rounded-xl p-4 text-center transition-all duration-200 relative"
              style={{
                background: selectedDonation === d.amount ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                border: selectedDonation === d.amount ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(245,158,11,0.25)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <span className="text-2xl block mb-1">{d.emoji}</span>
              <p className="text-white font-bold text-sm">{d.label}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{d.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Custom donation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">$</span>
            <input
              type="number"
              placeholder="Otro monto (COP)"
              className="w-full pl-8 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>
          <motion.button
            onClick={() => toast.info('¡Gracias por tu interés en donar! El proceso de pago estará disponible pronto.')}
            className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
            style={{
              background: 'linear-gradient(to right, #f59e0b, #ec4899)',
              boxShadow: '0 0 25px rgba(245,158,11,0.2), 0 4px 15px rgba(0,0,0,0.3)',
              color: 'white',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(245,158,11,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Gift size={16} />
            Donar Ahora
          </motion.button>
        </div>

        {/* Impact message */}
        <motion.div
          className="mt-6 rounded-xl p-4 text-center"
          style={{
            background: 'rgba(245,158,11,0.03)',
            border: '1px solid rgba(245,158,11,0.1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/30 text-xs leading-relaxed">
            💡 Con <span className="text-amber-400 font-semibold">$10.000 COP</span> puedes ayudar a un estudiante a explorar el universo durante un mes.
            Cada donación, por pequeña que sea, marca la diferencia. 🌟
          </p>
        </motion.div>
      </motion.div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
          <Star size={18} className="text-amber-400" />
          Preguntas Frecuentes
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
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
