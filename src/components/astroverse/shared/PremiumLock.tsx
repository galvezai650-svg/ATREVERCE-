'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Lock, Sparkles } from 'lucide-react'

// ============================================================
// PremiumLock - Overlay for locked premium features
// ============================================================
export function PremiumLock({ 
  onUpgrade, 
  label = 'Contenido Premium',
  message = 'Desbloquea acceso completo',
  children 
}: { 
  onUpgrade?: () => void
  label?: string
  message?: string
  children: React.ReactNode 
}) {
  return (
    <div className="relative group">
      {children}
      {/* Lock overlay */}
      <motion.div
        className="absolute inset-0 z-20 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
        style={{
          background: 'rgba(5,5,16,0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onUpgrade}
        whileHover={{ 
          background: 'rgba(5,5,16,0.8)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 30px rgba(245,158,11,0.15)',
          }}
        >
          <Crown size={26} className="text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Lock size={12} className="text-amber-400/60" />
            {label}
          </p>
          <p className="text-white/30 text-xs mt-1">{message}</p>
        </div>
        <motion.button
          className="px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
          style={{
            background: 'linear-gradient(to right, #f59e0b, #ec4899)',
            boxShadow: '0 0 15px rgba(245,158,11,0.25)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={12} />
          Obtener Premium
        </motion.button>
      </motion.div>
    </div>
  )
}

// ============================================================
// PlanBadge - Small badge showing current plan
// ============================================================
export function PlanBadge({ isPremium, size = 'sm' }: { isPremium: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { padding: '2px 6px', fontSize: '8px', icon: 10, radius: '6px' },
    md: { padding: '3px 10px', fontSize: '10px', icon: 12, radius: '8px' },
    lg: { padding: '4px 14px', fontSize: '11px', icon: 14, radius: '10px' },
  }
  const s = sizes[size]

  if (isPremium) {
    return (
      <motion.span
        className="inline-flex items-center gap-1 font-bold shrink-0"
        style={{
          padding: s.padding,
          fontSize: s.fontSize,
          borderRadius: s.radius,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
          border: '1px solid rgba(245,158,11,0.3)',
          color: '#f59e0b',
          boxShadow: '0 0 12px rgba(245,158,11,0.15)',
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <Crown size={s.icon} />
        PREMIUM
      </motion.span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 font-bold shrink-0"
      style={{
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.35)',
      }}
    >
      BÁSICO
    </span>
  )
}

// ============================================================
// UpgradeBanner - Top banner for basic users
// ============================================================
export function UpgradeBanner({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <motion.div
      className="rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(236,72,153,0.08))',
        border: '1px solid rgba(245,158,11,0.2)',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      onClick={onUpgrade}
      whileHover={{ 
        borderColor: 'rgba(245,158,11,0.4)',
        boxShadow: '0 0 25px rgba(245,158,11,0.1)',
      }}
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
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <Crown size={20} className="text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm font-semibold">Desbloquea Premium</p>
        <p className="text-white/35 text-xs">Accede a modelos 3D, simuladores avanzados y más. 7 días gratis.</p>
      </div>
      <motion.button
        className="px-4 py-2 rounded-lg text-xs font-bold text-white shrink-0 flex items-center gap-1.5"
        style={{
          background: 'linear-gradient(to right, #f59e0b, #ec4899)',
          boxShadow: '0 0 15px rgba(245,158,11,0.25)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={12} />
        Mejorar Plan
      </motion.button>
    </motion.div>
  )
}
