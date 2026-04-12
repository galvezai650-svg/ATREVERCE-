'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Orbit } from 'lucide-react'
import LandingPage from '@/components/astroverse/LandingPage'
import AuthModal from '@/components/astroverse/AuthModal'
import AstroVerseLayout from '@/components/astroverse/AstroVerseLayout'

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    setAuthMode('login')
    setShowAuth(true)
  }

  const handleRegister = () => {
    setAuthMode('register')
    setShowAuth(true)
  }

  const handleAuthSuccess = (data: { name: string; email: string }) => {
    setUser(data)
    setShowAuth(false)
    setEntered(true)
  }

  const handleLogout = () => {
    setUser(null)
    setEntered(false)
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050510' }}>
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 40px rgba(124,58,237,0.5)',
            }}
          >
            <Orbit size={40} className="text-white" />
          </div>
          <div
            className="w-10 h-10 rounded-full"
            style={{
              border: '2px solid transparent',
              borderTopColor: '#00d4ff',
              borderRightColor: '#7c3aed',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onLogin={handleLogin} onRegister={handleRegister} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AstroVerseLayout
              userName={user?.name || 'Explorador'}
              userEmail={user?.email || 'explorador@astroverse.com'}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
