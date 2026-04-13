'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Users, BookOpen, ChevronDown,
  Check, Zap, Rocket, Sparkles,
  Crown, Star, Shield, Monitor, School, Eye, Award, Video,
  Lock, CreditCard
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// PremiumPage → ASTROVERSE PRO  ($4.99/mes)
// ============================================================
export default function PremiumPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [paypalReady, setPaypalReady] = useState(false)
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('astroverse_pro') === 'true'
    return false
  })

  const togglePro = () => {
    const next = !isPro
    setIsPro(next)
    localStorage.setItem('astroverse_pro', String(next))
    toast.success(next ? '🎓 ¡ASTROVERSE PRO Activado por $4.99/mes!' : 'Plan Básico activado')
  }

  const paypalLoadedRef = useRef(false)

  const renderPaypalButton = useCallback(() => {
    const paypal = (window as any).paypal
    if (!paypal || !paypal.Buttons || !paypalContainerRef.current) return

    setPaypalReady(true)
    paypalContainerRef.current.innerHTML = ''

    paypal.Buttons({
      style: {
        shape: 'pill',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe',
        height: 45,
      },
      createSubscription: function (data: any, actions: any) {
        return actions.subscription.create({
          plan_id: 'P-2YH58611DA4123336NHODNII',
        })
      },
      onApprove: function (data: any) {
        toast.success('¡Suscripción aprobada! Activando AstroVerse PRO...')
        setIsPro(true)
        localStorage.setItem('astroverse_pro', 'true')
      },
      onError: function () {
        toast.error('Error en la suscripción. Intenta de nuevo.')
      },
    }).render('#paypal-button-container')
  }, [])

  // Load PayPal SDK dynamically
  useEffect(() => {
    if (isPro) return
    if (paypalReady) return
    if (typeof window === 'undefined') return
    if (paypalLoadedRef.current) return

    paypalLoadedRef.current = true

    const handleReady = () => renderPaypalButton()

    // If PayPal SDK already loaded (e.g. script tag exists)
    if ((window as any).paypal) {
      // Use microtask to avoid synchronous setState in effect
      setTimeout(handleReady, 0)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.paypal.com/sdk/js?client-id=AVkYiXbBU-3ryFBNnOqTfADMIk-oCwsN6nN-O7cTh8eTRoHOJGXN1BnbOGn5hetdFxqdxw7SIbe4YO_g&vault=true&intent=subscription'
    script.async = true
    script.onload = handleReady
    script.onerror = () => toast.error('Error al cargar PayPal. Intenta de nuevo.')
    document.head.appendChild(script)

    return () => {
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = ''
      }
      paypalLoadedRef.current = false
    }
  }, [isPro, paypalReady, renderPaypalButton])

  const proFeatures = [
    { text: 'Panel de Profesor completo', icon: School },
    { text: 'Crear y gestionar Aulas Virtuales', icon: Users },
    { text: 'Tareas en línea y videos asignados', icon: Video },
    { text: 'Calificaciones automáticas', icon: Award },
    { text: 'Seguimiento de estudiantes en tiempo real', icon: Monitor },
    { text: 'Sistema Solar verificado por NASA', icon: Eye },
    { text: 'Certificados para estudiantes', icon: Shield },
    { text: 'Soporte prioritario 24/7', icon: Zap },
    { text: 'Acceso anticipado a nuevas funciones', icon: Sparkles },
  ]

  const comparison = [
    { feature: 'Simuladores interactivos', basic: true, pro: true },
    { feature: 'Enciclopedia Espacial', basic: true, pro: true },
    { feature: 'Videos educativos', basic: true, pro: true },
    { feature: 'Exploración del catálogo', basic: true, pro: true },
    { feature: 'Modelos 3D interactivos', basic: true, pro: true },
    { feature: 'Crear Aulas Virtuales', basic: false, pro: true },
    { feature: 'Panel de Profesor', basic: false, pro: true },
    { feature: 'Tareas en línea', basic: false, pro: true },
    { feature: 'Calificaciones automáticas', basic: false, pro: true },
    { feature: 'Seguimiento de estudiantes', basic: false, pro: true },
    { feature: 'Sistema Solar NASA', basic: false, pro: true },
    { feature: 'Certificados', basic: false, pro: true },
    { feature: 'Soporte prioritario', basic: false, pro: true },
  ]

  const faqs = [
    { q: '¿Qué es ASTROVERSE PRO?', a: 'Es la versión avanzada con herramientas para profesores: crear aulas virtuales, asignar tareas, calificaciones automáticas, certificados y acceso a datos verificados por la NASA.' },
    { q: '¿Cuánto cuesta?', a: '$4.99 USD al mes. Cancela cuando quieras. Sin contratos ni compromisos.' },
    { q: '¿Qué incluye el plan básico?', a: 'Todo el contenido educativo: simuladores, enciclopedia, videos, modelos 3D y más. ¡Completamente gratis!' },
    { q: '¿Puedo entrar a un aula sin PRO?', a: '¡Sí! Entrar a un aula es gratis. Solo necesitas PRO si quieres CREAR y gestionar aulas como profesor.' },
  ]

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
        <p className="text-white/40">Para profesores · Herramientas avanzadas a <span className="text-cyan-400 font-semibold">$4.99/mes</span></p>
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ASTROVERSE PRO Activo
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-400/15 text-cyan-400 border border-cyan-400/25">ACTIVO</span>
              </h2>
              <p className="text-white/40 text-sm">Suscripción activa a <span className="text-cyan-400 font-medium">$4.99/mes</span> · Acceso completo a todas las funciones.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Aula Virtual', 'Tareas', 'Calificaciones', 'Certificados', 'NASA'].map(f => (
                  <span key={f} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>{f}</span>
                ))}
              </div>
            </div>
            <motion.button onClick={togglePro} className="px-4 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              Cancelar Suscripción
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
            <p className="text-white/30 text-sm mb-4">Todo el contenido educativo gratis</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">Gratis</span>
              <span className="text-white/30 text-sm"> / para siempre</span>
            </div>
            {!isPro && (
              <div className="px-3 py-1.5 rounded-full text-[10px] font-bold inline-block mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                TU PLAN ACTUAL
              </div>
            )}
            {isPro && (
              <motion.button onClick={togglePro} className="w-full py-3 rounded-xl text-sm font-semibold mb-4 text-white/70" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.98 }}>
                Cambiar a Básico
              </motion.button>
            )}
          </div>
          <div className="space-y-3 mt-2">
            {[
              'Simuladores interactivos',
              'Enciclopedia Espacial completa',
              'Videos educativos',
              'Exploración del catálogo',
              'Modelos 3D del sistema solar',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}><Check size={12} className="text-emerald-400" /></div>
                <span className="text-white/60 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PRO Plan — $4.99/mes with shimmer border */}
        <motion.div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ ...cardBase, border: '1px solid rgba(0,212,255,0.2)' }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {/* Spinning conic-gradient shimmer border */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="absolute inset-[-200%] animate-[spin_6s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, rgba(0,212,255,0.2), transparent, rgba(16,185,129,0.2), transparent, rgba(124,58,237,0.15), transparent, rgba(0,212,255,0.2))' }} />
            <div className="absolute inset-[1px] rounded-2xl" style={{ background: 'rgba(5,5,16,0.97)' }} />
          </div>
          {/* RECOMENDADO floating badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider" style={{
              background: 'linear-gradient(135deg, #00d4ff, #10b981)',
              color: 'white',
              boxShadow: '0 0 20px rgba(0,212,255,0.4)',
            }}>
              ★ RECOMENDADO
            </span>
          </div>
          <div className="text-center relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #10b981)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
              <Crown size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
              ASTROVERSE PRO
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-400/15 text-cyan-400 border border-cyan-400/25">PAGO</span>
            </h2>
            <p className="text-white/30 text-sm mb-4">Para profesores · Todo incluido + Aulas</p>
            <div className="mb-2">
              <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">$4.99</span>
            </div>
            <p className="text-white/30 text-xs mb-6">USD / mes · Cancela cuando quieras</p>
            {isPro ? (
              <div className="space-y-3 mb-2">
                <div className="px-4 py-2 rounded-full text-[11px] font-bold inline-flex items-center gap-2" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Sparkles size={12} />
                  </motion.span>
                  ACTIVO — $4.99/mes
                </div>
                <motion.button onClick={togglePro} className="w-full py-2.5 rounded-xl text-xs font-medium text-white/40 flex items-center justify-center gap-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} whileHover={{ scale: 1.01, borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.7)' }} whileTap={{ scale: 0.98 }}>
                  <Lock size={12} />
                  Cancelar Suscripción
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {/* PayPal Subscription Button */}
                <div className="w-full rounded-xl overflow-hidden min-h-[45px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {!paypalReady && (
                    <div className="flex items-center gap-2 py-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <CreditCard size={14} className="text-cyan-400/40" />
                      </motion.div>
                      <span className="text-white/30 text-xs">Cargando PayPal...</span>
                    </div>
                  )}
                  <div ref={paypalContainerRef} id="paypal-button-container" />
                </div>
                {/* Fallback demo toggle */}
                <button
                  onClick={togglePro}
                  className="w-full py-2 rounded-xl text-[11px] text-white/20 hover:text-white/40 transition-all"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  Activar demo (sin pago)
                </button>
              </div>
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
