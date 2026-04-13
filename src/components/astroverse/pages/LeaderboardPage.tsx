'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Wrench, Rocket } from 'lucide-react'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

export default function LeaderboardPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } }}
        className="relative overflow-hidden rounded-2xl"
        style={cardBase}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #00d4ff, #7c3aed)" />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 p-8 md:p-12 text-center">
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(0,212,255,0.15))', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <Trophy className="w-10 h-10" style={{ color: '#f59e0b' }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b, #00d4ff)' }}
          >
            Ranking Global
          </motion.h1>

          {/* Under construction badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Wrench size={16} style={{ color: '#f59e0b' }} />
            </motion.div>
            <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>En Construcción</span>
          </motion.div>

          {/* Description */}
          <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
            Estamos preparando el ranking global donde podrás competir con otros exploradores del universo. ¡Próximamente!
          </p>

          {/* Fun message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-white/30 text-xs"
          >
            <Rocket size={14} />
            <span>Mientras tanto, ¡sigue completando quizzes para prepararte!</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
