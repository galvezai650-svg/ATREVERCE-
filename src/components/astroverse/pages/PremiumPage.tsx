'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Check, X, ChevronDown, Sparkles, Star, Zap, Shield, Rocket, RotateCcw, Gift } from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'
import { PlanBadge } from '../shared/PremiumLock'

// ============================================================
// PremiumPage
// ============================================================
export default function PremiumPage({ isPremium, onTogglePlan }: { isPremium: boolean; onTogglePlan: () => void }) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const faqs = [
    { q: '¿Qué incluye el plan Premium?', a: 'Acceso completo a todos los simuladores avanzados, modelos 3D interactivos, contenido educativo exclusivo y datos en tiempo real de la NASA.' },
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, puedes cancelar tu suscripción en cualquier momento sin penalización. Tu plan volverá a Básico.' },
    { q: '¿Hay periodo de prueba gratuito?', a: 'Sí, ofrecemos 7 días de prueba gratuita para que explores todas las funcionalidades Premium.' },
    { q: '¿Acepta métodos de pago locales?', a: 'Aceptamos tarjetas de crédito, débito, PayPal y métodos de pago locales según tu país.' },
  ]

  const comparisonFeatures = [
    { feature: 'Simuladores básicos', free: true, premium: true },
    { feature: 'Exploración del catálogo', free: true, premium: true },
    { feature: 'Enciclopedia Espacial', free: true, premium: true },
    { feature: 'Videos educativos', free: true, premium: true },
    { feature: 'Simuladores avanzados', free: false, premium: true },
    { feature: 'Modelos 3D interactivos', free: false, premium: true },
    { feature: 'Sistema Solar NASA', free: false, premium: true },
    { feature: 'Tierra en 3D', free: false, premium: true },
    { feature: 'Contenido educativo exclusivo', free: false, premium: true },
    { feature: 'Datos NASA en tiempo real', free: false, premium: true },
    { feature: 'Sin anuncios', free: false, premium: true },
    { feature: 'Soporte prioritario', free: false, premium: true },
    { feature: 'Acceso anticipado', free: false, premium: true },
    { feature: 'Insignia Premium exclusiva', free: false, premium: true },
  ]

  const handleTogglePlan = () => {
    if (!isPremium) {
      toast.success('🎉 ¡Bienvenido a Premium! Disfruta 7 días gratis.')
    } else {
      toast.info('Has vuelto al plan Básico.')
    }
    onTogglePlan()
  }

  return (
    <div className="space-y-8">
      {/* Current plan indicator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {isPremium ? 'Tu Plan Premium' : 'Planes'}
          </h1>
          <PlanBadge isPremium={isPremium} size="md" />
        </div>
        <p className="text-white/40">
          {isPremium
            ? 'Estás disfrutando de todos los beneficios Premium ✦'
            : 'Lleva tu exploración al siguiente nivel'
          }
        </p>
      </motion.div>

      {/* Active Premium banner */}
      {isPremium && (
        <motion.div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            ...cardBase,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(236,72,153,0.08))',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.05, type: 'spring', damping: 20 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.05) 50%, transparent 100%)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                boxShadow: '0 0 30px rgba(245,158,11,0.3)',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Crown size={28} className="text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                Plan Premium Activo
              </h2>
              <p className="text-white/40 text-sm mt-1">Tienes acceso completo a todas las funciones de AstroVerse.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Modelos 3D', 'Simuladores Avanzados', 'NASA en Vivo', 'Sin Anuncios'].map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(245,158,11,0.8)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <motion.button
              onClick={handleTogglePlan}
              className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
              whileHover={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={14} />
              Cancelar Plan
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Pricing card - Only show when basic */}
      {!isPremium && (
        <div className="max-w-lg mx-auto">
          <motion.div
            className="relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl"
            style={{
              ...cardBase,
              background: 'rgba(255,255,255,0.03)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
                    border: '1px solid rgba(245,158,11,0.25)',
                    boxShadow: '0 0 30px rgba(245,158,11,0.15)',
                  }}
                >
                  <Crown size={32} className="text-amber-400" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-1">Plan Premium</h2>
              <p className="text-white/40 text-sm mb-6">Todo lo que necesitas para dominar el espacio</p>

              <div className="mb-8">
                <span className="text-5xl font-black text-white">$4.99</span>
                <span className="text-white/40">/mes</span>
              </div>

              <motion.button
                onClick={handleTogglePlan}
                className="w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                  boxShadow: '0 0 25px rgba(245,158,11,0.3), 0 4px 15px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(245,158,11,0.4), 0 4px 15px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Gift size={16} />
                Comenzar Prueba Gratis
              </motion.button>
              <p className="text-white/20 text-xs mt-3">7 días gratis · Cancela cuando quieras</p>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-3">
              {[
                { text: 'Todos los simuladores avanzados', icon: Zap },
                { text: 'Modelos 3D interactivos', icon: Rocket },
                { text: 'Sistema Solar de NASA', icon: Star },
                { text: 'Tierra en 3D', icon: Shield },
                { text: 'Contenido educativo exclusivo', icon: Sparkles },
                { text: 'Datos de la NASA en tiempo real', icon: Crown },
                { text: 'Sin anuncios', icon: Check },
                { text: 'Soporte prioritario', icon: Check },
                { text: 'Acceso anticipado a nuevas funciones', icon: Check },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <feature.icon size={12} className="text-amber-400" />
                  </div>
                  <span className="text-white/60 text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Comparar Planes */}
      <motion.div
        className="max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur-xl relative"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color={isPremium ? 'linear-gradient(90deg, #f59e0b, #ec4899)' : 'linear-gradient(90deg, #f59e0b, #f59e0b00)'} />
        <h2 className="text-xl font-bold text-white mb-4 p-6 pb-0">Comparar Planes</h2>
        <div className="p-6 pt-4">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/40 text-sm font-medium">Funcionalidad</div>
            <div className="text-center text-white/40 text-sm font-medium">Básico</div>
            <div className="text-center text-amber-400 text-sm font-medium flex items-center justify-center gap-1">
              <Crown size={14} />
              Premium
            </div>
          </div>
          {/* Table rows */}
          {comparisonFeatures.map((f, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 py-2.5 items-center"
              style={{
                borderBottom: i < comparisonFeatures.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: !f.free && isPremium ? 'rgba(245,158,11,0.02)' : 'transparent',
              }}
            >
              <div className="text-white/60 text-sm">{f.feature}</div>
              <div className="text-center">
                {f.free ? (
                  <Check size={16} className="text-emerald-400 mx-auto" />
                ) : (
                  <X size={16} className="text-white/20 mx-auto" />
                )}
              </div>
              <div className="text-center">
                <Check size={16} className="text-emerald-400 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
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
                    <p className="px-4 pb-4 text-white/40 text-sm">{faq.a}</p>
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
