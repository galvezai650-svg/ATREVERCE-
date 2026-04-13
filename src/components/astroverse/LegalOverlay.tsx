'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import TerminosPage from './pages/TerminosPage'
import PrivacidadPage from './pages/PrivacidadPage'

interface LegalOverlayProps {
  isOpen: boolean
  onClose: () => void
  page: 'terminos' | 'privacidad'
}

export default function LegalOverlay({ isOpen, onClose, page }: LegalOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ backgroundColor: '#050510' }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                }}
              >
                <span className="text-white text-xs font-bold">AV</span>
              </div>
              <span className="text-white/70 text-sm font-medium">
                {page === 'terminos' ? 'Términos y Condiciones' : 'Política de Privacidad'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
            <div className="max-w-4xl mx-auto">
              {page === 'terminos' ? <TerminosPage /> : <PrivacidadPage />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
