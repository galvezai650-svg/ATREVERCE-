'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Orbit, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
  onSuccess: (data: { name: string; email: string }) => void
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!loginForm.email || !loginForm.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    setLoading(true)
    try {
      // Register/login user in DB
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      })
      const data = await res.json()

      if (res.ok) {
        // Check if user is premium from server
        onSuccess({ name: data.name || loginForm.email.split('@')[0], email: data.email })
        // Sync premium status from server
        if (data.isPremium) {
          localStorage.setItem('astroverse_pro', 'true')
        } else {
          localStorage.setItem('astroverse_pro', 'false')
        }
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch {
      // Fallback to localStorage-only login
      onSuccess({ name: loginForm.email.split('@')[0], email: loginForm.email })
    }
    setLoading(false)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setError('Por favor, completa todos los campos')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (registerForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      // Register user in DB
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        onSuccess({ name: data.name, email: data.email })
      } else {
        // If user already exists, login instead
        if (res.status === 409) {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: registerForm.email, password: registerForm.password }),
          })
          const loginData = await loginRes.json()
          if (loginRes.ok) {
            onSuccess({ name: loginData.name, email: loginData.email })
          } else {
            setError(loginData.error || 'Error al crear cuenta')
          }
        } else {
          setError(data.error || 'Error al crear cuenta')
        }
      }
    } catch {
      // Fallback to localStorage-only register
      onSuccess({ name: registerForm.name, email: registerForm.email })
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,10,30,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(40px)',
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Gradient border top */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed, #ec4899)',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            {/* Logo */}
            <div className="pt-8 pb-2 px-8 text-center">
              <div
                className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                }}
              >
                <Orbit size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
              </h2>
              <p className="text-white/40 text-sm mt-1">
                {mode === 'login'
                  ? 'Inicia sesión para continuar tu exploración'
                  : 'Únete a AstroVerse y explora el universo'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="px-8 pt-4">
              <div
                className="rounded-xl p-1 flex"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: mode === 'login' ? 'rgba(0,212,255,0.1)' : 'transparent',
                    color: mode === 'login' ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                    border: mode === 'login' ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => { setMode('register'); setError('') }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: mode === 'register' ? 'rgba(124,58,237,0.1)' : 'transparent',
                    color: mode === 'register' ? '#7c3aed' : 'rgba(255,255,255,0.4)',
                    border: mode === 'register' ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                  }}
                >
                  Crear Cuenta
                </button>
              </div>
            </div>

            {/* Forms */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.form
                    key="login"
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={loginForm.email}
                          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                        boxShadow: '0 0 20px rgba(0,212,255,0.2)',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Nombre</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={registerForm.name}
                          onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={registerForm.email}
                          onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          value={registerForm.password}
                          onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Confirmar Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repite tu contraseña"
                          value={registerForm.confirmPassword}
                          onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                        boxShadow: '0 0 20px rgba(124,58,237,0.2)',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        'Crear Cuenta'
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="mt-4 text-sm text-red-400 text-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
