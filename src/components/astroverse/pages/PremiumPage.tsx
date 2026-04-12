'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Check, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// PremiumPage
// ============================================================
export default function PremiumPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const faqs = [
    { q: '¿Qué incluye el plan Premium?', a: 'Acceso completo a todos los simuladores avanzados, modelos 3D interactivos, contenido educativo exclusivo y datos en tiempo real de la NASA.' },
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, puedes cancelar tu suscripción en cualquier momento sin penalización.' },
    { q: '¿Hay periodo de prueba gratuito?', a: 'Sí, ofrecemos 7 días de prueba gratuita para que explores todas las funcionalidades Premium.' },
    { q: '¿Acepta métodos de pago locales?', a: 'Aceptamos tarjetas de crédito, débito, PayPal y métodos de pago locales según tu país.' },
  ]

  const comparisonFeatures = [
    { feature: 'Simuladores básicos', free: true, premium: true },
    { feature: 'Exploración del catálogo', free: true, premium: true },
    { feature: 'Simuladores avanzados', free: false, premium: true },
    { feature: 'Modelos 3D interactivos', free: false, premium: true },
    { feature: 'Contenido educativo exclusivo', free: false, premium: true },
    { feature: 'Datos NASA en tiempo real', free: false, premium: true },
    { feature: 'Sin anuncios', free: false, premium: true },
    { feature: 'Soporte prioritario', free: false, premium: true },
    { feature: 'Acceso anticipado', free: false, premium: true },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          <span style={{
            background: 'linear-gradient(to right, #f59e0b, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Premium</span>
        </h1>
        <p className="text-white/40">Lleva tu exploración al siguiente nivel</p>
      </motion.div>

      {/* Pricing card */}
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
              <Crown size={40} className="mx-auto mb-4 text-amber-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Plan Premium</h2>
            <p className="text-white/40 text-sm mb-6">Todo lo que necesitas para dominar el espacio</p>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">$4.99</span>
              <span className="text-white/40">/mes</span>
            </div>

            <button
              onClick={() => toast.success('¡Bienvenido a Premium! Disfruta 7 días gratis.')}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-200 active:scale-[0.98] shimmer"
              style={{
                background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                boxShadow: '0 0 25px rgba(245,158,11,0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              Comenzar Prueba Gratis
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              'Todos los simuladores avanzados',
              'Modelos 3D interactivos',
              'Contenido educativo exclusivo',
              'Datos de la NASA en tiempo real',
              'Sin anuncios',
              'Soporte prioritario',
              'Acceso anticipado a nuevas funciones',
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span className="text-white/60 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparar Planes */}
      <motion.div
        className="max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur-xl relative"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899)" />
        <h2 className="text-xl font-bold text-white mb-4 p-6 pb-0">Comparar Planes</h2>
        <div className="p-6 pt-4">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/40 text-sm font-medium">Funcionalidad</div>
            <div className="text-center text-white/40 text-sm font-medium">Free</div>
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
              style={{ borderBottom: i < comparisonFeatures.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
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
