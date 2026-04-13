'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Orbit, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, MailCheck, KeyRound } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
  onSuccess: (data: { name: string; email: string }) => void
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [forgotForm, setForgotForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' })
  const [codeSent, setCodeSent] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')

  const resetState = () => { setError(''); setSuccess(''); setCodeSent(false) }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) { setError('Por favor, completa todos los campos'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      })
      const data = await res.json()
      if (res.ok) {
        onSuccess({ name: data.name || loginForm.email.split('@')[0], email: data.email })
        if (data.isPremium) localStorage.setItem('astroverse_pro', 'true')
        else localStorage.setItem('astroverse_pro', 'false')
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch {
      onSuccess({ name: loginForm.email.split('@')[0], email: loginForm.email })
    }
    setLoading(false)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) { setError('Por favor, completa todos los campos'); return }
    if (registerForm.password !== registerForm.confirmPassword) { setError('Las contraseñas no coinciden'); return }
    if (registerForm.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerForm.name, email: registerForm.email, password: registerForm.password }),
      })
      const data = await res.json()
      if (res.ok) {
        // Show verification screen
        setMode('verify-email')
        setSuccess('¡Cuenta creada! Verifica tu email para continuar.')
      } else if (res.status === 409) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: registerForm.email, password: registerForm.password }),
        })
        const loginData = await loginRes.json()
        if (loginRes.ok) { onSuccess({ name: loginData.name, email: loginData.email }) }
        else { setError(loginData.error || 'Error al crear cuenta') }
      } else {
        setError(data.error || 'Error al crear cuenta')
      }
    } catch {
      onSuccess({ name: registerForm.name, email: registerForm.email })
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!forgotForm.email) { setError('Ingresa tu email'); return }

    if (!codeSent) {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotForm.email }),
        })
        if (res.ok) {
          const data = await res.json()
          setCodeSent(true)
          if (data.code) {
            setGeneratedCode(data.code)
            setSuccess('¡Código generado! Cópialo abajo.')
          } else {
            setSuccess('Si el email existe, se generó un código')
          }
        }
      } catch { setError('Error al enviar código') }
      setLoading(false)
    } else {
      if (!forgotForm.code || !forgotForm.newPassword || !forgotForm.confirmPassword) {
        setError('Completa todos los campos')
        return
      }
      if (forgotForm.newPassword !== forgotForm.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
      if (forgotForm.newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      setLoading(true)
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotForm.email, code: forgotForm.code, newPassword: forgotForm.newPassword }),
        })
        const data = await res.json()
        if (res.ok) {
          setSuccess('¡Contraseña actualizada! Ya puedes iniciar sesión.')
          setTimeout(() => { setMode('login'); resetState() }, 2000)
        } else {
          setError(data.error || 'Error al cambiar contraseña')
        }
      } catch { setError('Error al cambiar contraseña') }
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerForm.email }),
      })
      if (res.ok) {
        onSuccess({ name: registerForm.name, email: registerForm.email })
      } else {
        setError('Error al verificar. Intenta de nuevo.')
      }
    } catch { setError('Error de conexión') }
    setLoading(false)
  }

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }

  const getHeaderInfo = () => {
    switch (mode) {
      case 'login': return { title: 'Bienvenido de vuelta', desc: 'Inicia sesión para continuar tu exploración' }
      case 'register': return { title: 'Crea tu cuenta', desc: 'Únete a AstroVerse y explora el universo' }
      case 'forgot-password': return { title: codeSent ? 'Restablecer Contraseña' : '¿Olvidaste tu contraseña?', desc: codeSent ? 'Ingresa el código y tu nueva contraseña' : 'Te enviaremos un código de recuperación' }
      case 'reset-password': return { title: 'Nueva Contraseña', desc: 'Ingresa tu nueva contraseña' }
      case 'verify-email': return { title: 'Verifica tu Email', desc: 'Confirma tu cuenta para empezar' }
    }
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
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: 'rgba(10,10,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)' }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed, #ec4899)' }} />

            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="pt-8 pb-2 px-8 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                {mode === 'verify-email' ? <MailCheck size={24} className="text-white" /> :
                 mode === 'forgot-password' ? <KeyRound size={24} className="text-white" /> :
                 <Orbit size={24} className="text-white" />}
              </div>
              <h2 className="text-xl font-bold text-white">{getHeaderInfo().title}</h2>
              <p className="text-white/40 text-sm mt-1">{getHeaderInfo().desc}</p>
              {success && (
                <motion.p className="text-sm text-emerald-400 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {success}
                </motion.p>
              )}
            </div>

            {/* Back button for non-main modes */}
            {(mode === 'forgot-password' || mode === 'verify-email') && (
              <div className="px-8 pt-2">
                <button onClick={() => { setMode('login'); resetState() }} className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-all">
                  <ArrowLeft size={14} /> Volver al inicio de sesión
                </button>
              </div>
            )}

            {/* Tab switcher - only on login/register */}
            {(mode === 'login' || mode === 'register') && (
              <div className="px-8 pt-4">
                <div className="rounded-xl p-1 flex" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => { setMode('login'); resetState() }} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: mode === 'login' ? 'rgba(0,212,255,0.1)' : 'transparent', color: mode === 'login' ? '#00d4ff' : 'rgba(255,255,255,0.4)', border: mode === 'login' ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent' }}>
                    Iniciar Sesión
                  </button>
                  <button onClick={() => { setMode('register'); resetState() }} className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ background: mode === 'register' ? 'rgba(124,58,237,0.1)' : 'transparent', color: mode === 'register' ? '#7c3aed' : 'rgba(255,255,255,0.4)', border: mode === 'register' ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent' }}>
                    Crear Cuenta
                  </button>
                </div>
              </div>
            )}

            {/* Forms */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* LOGIN */}
                {mode === 'login' && (
                  <motion.form key="login" onSubmit={handleLoginSubmit} className="space-y-4"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" placeholder="tu@email.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20" style={inputStyle} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <button type="button" onClick={() => { setMode('forgot-password'); resetState() }} className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-all">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}>
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Iniciando sesión...</> : 'Iniciar Sesión'}
                    </button>
                  </motion.form>
                )}

                {/* REGISTER */}
                {mode === 'register' && (
                  <motion.form key="register" onSubmit={handleRegisterSubmit} className="space-y-3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Nombre</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="text" placeholder="Tu nombre" value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" placeholder="tu@email.com" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20" style={inputStyle} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Confirmar Contraseña</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Repite tu contraseña" value={registerForm.confirmPassword} onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-white/20" style={inputStyle} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}>
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Creando cuenta...</> : 'Crear Cuenta'}
                    </button>
                  </motion.form>
                )}

                {/* FORGOT PASSWORD */}
                {mode === 'forgot-password' && (
                  <motion.form key="forgot" onSubmit={handleForgotPassword} className="space-y-4"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" placeholder="tu@email.com" value={forgotForm.email} onChange={e => setForgotForm({ ...forgotForm, email: e.target.value })} disabled={codeSent}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-white/20 disabled:opacity-50" style={inputStyle} />
                      </div>
                    </div>
                    {!codeSent ? (
                      <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(to right, #f59e0b, #ef4444)', boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}>
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><KeyRound size={16} /> Generar Código</>}
                      </button>
                    ) : (
                      <>
                        {/* Generated Code Display */}
                        {generatedCode && (
                          <motion.div
                            className="rounded-xl p-4 text-center"
                            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          >
                            <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Tu código de recuperación</p>
                            <p className="text-3xl font-mono font-bold tracking-[0.3em] text-cyan-400" style={{ textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
                              {generatedCode}
                            </p>
                            <button
                              type="button"
                              onClick={() => { navigator.clipboard.writeText(generatedCode) }}
                              className="mt-2 text-[10px] text-white/30 hover:text-cyan-400 transition-all"
                            >
                              📋 Copiar código
                            </button>
                            <p className="text-[9px] text-white/15 mt-1">Válido por 1 hora</p>
                          </motion.div>
                        )}
                        <div>
                          <label className="text-white/40 text-xs mb-1.5 block">Código de Verificación</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input type="text" placeholder="123456" value={forgotForm.code} onChange={e => setForgotForm({ ...forgotForm, code: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-white/20 tracking-widest text-center text-lg font-mono" style={inputStyle} maxLength={6} />
                          </div>
                          <p className="text-[10px] text-white/20 mt-1 text-center">Ingresa el código de 6 dígitos enviado a tu email</p>
                        </div>
                        <div>
                          <label className="text-white/40 text-xs mb-1.5 block">Nueva Contraseña</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={forgotForm.newPassword} onChange={e => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                              className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-white/20" style={inputStyle} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-white/40 text-xs mb-1.5 block">Confirmar Nueva Contraseña</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Repite tu nueva contraseña" value={forgotForm.confirmPassword} onChange={e => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-white/20" style={inputStyle} />
                          </div>
                        </div>
                        <button type="submit" disabled={loading}
                          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(to right, #10b981, #00d4ff)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
                          {loading ? <><Loader2 size={16} className="animate-spin" /> Actualizando...</> : 'Cambiar Contraseña'}
                        </button>
                        <button type="button" onClick={() => { setCodeSent(false); setError('') }} className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-all">
                          ¿No recibiste el código? Reenviar
                        </button>
                      </>
                    )}
                  </motion.form>
                )}

                {/* VERIFY EMAIL */}
                {mode === 'verify-email' && (
                  <motion.div key="verify" className="space-y-4 text-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
                      <MailCheck size={32} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Se ha enviado un enlace de verificación a:</p>
                      <p className="text-sm font-semibold text-cyan-400 mt-1">{registerForm.email}</p>
                    </div>
                    <p className="text-xs text-white/30">Verifica tu email para acceder a todas las funciones de AstroVerse</p>
                    <motion.button onClick={handleVerifyEmail} disabled={loading}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(to right, #10b981, #00d4ff)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Verificando...</> : <><MailCheck size={16} /> Verificar Email</>}
                    </motion.button>
                    <button onClick={() => { onSuccess({ name: registerForm.name, email: registerForm.email }) }}
                      className="text-xs text-white/30 hover:text-white/50 transition-all">
                      Omitir por ahora →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p className="mt-4 text-sm text-red-400 text-center" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Legal links */}
              {(mode === 'login' || mode === 'register') && (
                <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-[10px] text-white/20">
                    Al continuar, aceptas nuestros{' '}
                    <span className="text-cyan-400/40 hover:text-cyan-400 cursor-pointer">Términos</span> y{' '}
                    <span className="text-cyan-400/40 hover:text-cyan-400 cursor-pointer">Política de Privacidad</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
