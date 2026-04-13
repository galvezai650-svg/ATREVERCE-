'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Orbit, Home, Compass, Box, FlaskConical, GraduationCap, User, BookOpen, LogOut, X, Menu, School, Heart, Sparkles, Bell, Brain, Calendar, Newspaper, Telescope, Target, Trophy, Users, Gamepad2, Award, Shield, FileText, Lock, MailCheck, KeyRound, Bot, ClipboardCheck, Library } from 'lucide-react'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import Models3DPage from './pages/Models3DPage'
import SimulatorsPage from './pages/SimulatorsPage'
import PremiumPage from './pages/PremiumPage'
import ProfilePage from './pages/ProfilePage'
import SpaceEncyclopediaPage from './pages/SpaceEncyclopediaPage'
import AulaPage from './pages/AulaPage'
import DonacionesPage from './pages/DonacionesPage'
import QuizPage from './pages/QuizPage'
import EventsPage from './pages/EventsPage'
import NewsPage from './pages/NewsPage'
import NasaApodPage from './pages/NasaApodPage'
import DailyMissionsPage from './pages/DailyMissionsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CommunityPage from './pages/CommunityPage'
import MiniGamesPage from './pages/MiniGamesPage'
import CertificatesPage from './pages/CertificatesPage'
import AiChatPage from './pages/AiChatPage'
import CertificationExamsPage from './pages/CertificationExamsPage'
import BibliotecaPage from './pages/BibliotecaPage'
import TerminosPage from './pages/TerminosPage'
import PrivacidadPage from './pages/PrivacidadPage'
import SobreNosotrosPage from './pages/SobreNosotrosPage'

// ============================================================
// Sidebar Navigation
// ============================================================
const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'models3d', label: 'Modelos 3D', icon: Box },
  { id: 'simulators', label: 'Simuladores', icon: FlaskConical },
  { id: 'encyclopedia', label: 'Enciclopedia', icon: BookOpen },
  { id: 'apod', label: 'Galería NASA', icon: Telescope },
  { id: 'quiz', label: 'Quiz Espacial', icon: Brain },
  { id: 'leaderboard', label: 'Ranking', icon: Trophy, badge: 'TOP' },
  { id: 'missions', label: 'Misiones', icon: Target },
  { id: 'minigames', label: 'Mini Juegos', icon: Gamepad2 },
  { id: 'events', label: 'Eventos', icon: Calendar },
  { id: 'news', label: 'Noticias', icon: Newspaper },
  { id: 'community', label: 'Comunidad', icon: Users },
  { id: 'mentor-ai', label: 'Mentor IA PRO', icon: Bot, badge: 'PRO' },
  { id: 'biblioteca', label: 'Biblioteca', icon: Library, badge: '📚' },
  { id: 'cert-exams', label: 'Certificaciones', icon: ClipboardCheck, badge: '$4.99' },
  { id: 'certificates', label: 'Certificados', icon: Award, badge: 'FREE' },
  { id: 'aula', label: 'Aula Virtual', icon: School, badge: 'FREE' },
  { id: 'pro', label: 'AstroVerse PRO', icon: GraduationCap, badge: '$4.99' },
  { id: 'donaciones', label: 'Donaciones', icon: Heart, badge: 'USD' },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'nosotros', label: 'Sobre Nosotros', icon: Sparkles, badge: 'OKS' },
  { id: 'terminos', label: 'Términos', icon: FileText },
  { id: 'privacidad', label: 'Privacidad', icon: Shield },
]

const notifications = [
  { id: 1, title: '¡Nueva lluvia de meteoros!', desc: 'Las Perseidas serán visibles esta noche', time: 'Hace 1h', emoji: '☄️', read: false },
  { id: 2, title: 'Nuevo quiz disponible', desc: 'Astronomía: El Sistema Solar', time: 'Hace 3h', emoji: '🧠', read: false },
  { id: 3, title: 'Lanzamiento SpaceX', desc: 'Starship Flight Test programado', time: 'Ayer', emoji: '🚀', read: true },
  { id: 4, title: 'Bienvenido a AstroVerse', desc: 'Explora el universo desde tu pantalla', time: 'Hace 5 días', emoji: '🌍', read: true },
]

function Sidebar({
  activePage, onNavigate, userName, onLogout, collapsed, onToggleCollapse
}: {
  activePage: string
  onNavigate: (id: string) => void
  userName: string
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifs] = useState(notifications)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!collapsed && (
          <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onToggleCollapse} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        } transition-all duration-300`}
        style={{
          background: 'rgba(5,5,16,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)' }} />

        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <Orbit size={20} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div className="flex flex-col">
              <motion.span
                className="text-lg font-bold whitespace-nowrap"
                style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                AstroVerse
              </motion.span>
              <span className="text-[9px] font-medium text-white/25 tracking-wider">EXPLORADOR ESPACIAL</span>
            </motion.div>
          )}
        </div>

        <button onClick={onToggleCollapse} className="absolute top-5 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95">
          <X size={18} />
        </button>

        {/* Notification Bell */}
        {!collapsed && (
          <div className="px-5 pb-3 relative" ref={notifRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 hover:bg-white/[0.04]"
              style={{ background: showNotifications ? 'rgba(0,212,255,0.06)' : 'transparent', border: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell size={18} className="text-white/50" />
                  {unreadCount > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      <span className="text-[8px] font-bold text-white">{unreadCount}</span>
                    </motion.div>
                  )}
                </div>
                <span className="text-white/50 text-xs">Notificaciones</span>
              </div>
              <motion.span
                animate={{ rotate: showNotifications ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-white/20 text-xs"
              >
                ▾
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute left-5 right-5 top-full mt-2 rounded-xl overflow-hidden z-[60]"
                  style={{
                    background: 'rgba(10,10,30,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-xs">Notificaciones</p>
                      <span className="text-[10px] text-cyan-400 font-medium">{unreadCount} nuevas</span>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.map((n, i) => (
                      <motion.div
                        key={n.id}
                        className="flex items-start gap-3 p-3 transition-colors duration-150 hover:bg-white/[0.03]"
                        style={{ background: !n.read ? 'rgba(0,212,255,0.03)' : 'transparent' }}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <span className="text-lg mt-0.5">{n.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-xs font-medium ${!n.read ? 'text-white/80' : 'text-white/40'}`}>{n.title}</p>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00d4ff', boxShadow: '0 0 4px rgba(0,212,255,0.5)' }} />}
                          </div>
                          <p className="text-[10px] text-white/25 mt-0.5 truncate">{n.desc}</p>
                          <p className="text-[9px] text-white/15 mt-0.5">{n.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id
            const isAula = item.id === 'aula'
            const isPro = item.id === 'pro'
            const isDonacion = item.id === 'donaciones'
            const isSpecial = isAula || isPro || isDonacion
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); if (window.innerWidth < 1024) onToggleCollapse() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? '' : 'hover:bg-white/[0.04]'}`}
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                  color: isActive ? '#00d4ff' : isAula ? 'rgba(16,185,129,0.7)' : isPro ? 'rgba(0,212,255,0.7)' : isDonacion ? 'rgba(245,158,11,0.7)' : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
                }}
              >
                <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{
                        background: item.id === 'aula' || item.id === 'certificates' ? 'rgba(16,185,129,0.1)' : item.id === 'donaciones' ? 'rgba(245,158,11,0.1)' : item.id === 'leaderboard' ? 'rgba(245,158,11,0.1)' : 'rgba(0,212,255,0.1)',
                        color: item.id === 'aula' || item.id === 'certificates' ? '#10b981' : item.id === 'donaciones' ? '#f59e0b' : item.id === 'leaderboard' ? '#f59e0b' : '#00d4ff',
                        border: item.id === 'aula' || item.id === 'certificates' ? '1px solid rgba(16,185,129,0.2)' : item.id === 'donaciones' ? '1px solid rgba(245,158,11,0.2)' : item.id === 'leaderboard' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(0,212,255,0.2)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Luminous Donate USD Button */}
        <div className="px-3 py-2">
          <motion.button
            onClick={() => { onNavigate('donaciones'); if (window.innerWidth < 1024) onToggleCollapse() }}
            className={`w-full relative overflow-hidden rounded-xl transition-all duration-200 active:scale-[0.97] ${
              collapsed ? 'h-11 flex items-center justify-center' : 'py-3'
            }`}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899, #f59e0b)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 25px rgba(245,158,11,0.4), 0 0 50px rgba(236,72,153,0.2), 0 0 80px rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.4)',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(236,72,153,0.3), 0 0 120px rgba(245,158,11,0.15)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 55%, transparent 70%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            {/* Pulsing glow overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 70%)',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <div className={`relative z-10 flex items-center ${collapsed ? '' : 'gap-2.5 px-3'}`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <Heart size={18} className="text-white" fill="white" />
              </motion.div>
              {!collapsed && (
                <>
                  <span className="text-xs font-bold text-white tracking-wide">Donar</span>
                  <span className="ml-auto text-[10px] font-black text-white/90 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">USD</span>
                </>
              )}
            </div>
          </motion.button>

          {!collapsed && (
            <motion.div
              className="flex items-center justify-center gap-1 mt-1.5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles size={8} className="text-amber-400/40" />
              <span className="text-[9px] text-amber-400/40 font-medium">Apoya nuestro proyecto</span>
              <Sparkles size={8} className="text-amber-400/40" />
            </motion.div>
          )}
        </div>

        {/* User section */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 relative" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                {userName.charAt(0).toUpperCase()}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#050510' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-xs truncate text-white/30">Explorador Espacial</p>
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.href = '/admin'}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200 active:scale-[0.98] ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Panel de Administración"
          >
            <Shield size={18} className="shrink-0" />
            {!collapsed && <span>Admin</span>}
          </button>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-200 active:scale-[0.98] ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ============================================================
// MAIN AstroVerseLayout
// ============================================================
export default function AstroVerseLayout({
  userName, userEmail, onLogout
}: {
  userName: string
  userEmail: string
  onLogout: () => void
}) {
  const [activePage, setActivePage] = useState('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [userId, setUserId] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [emailVerified, setEmailVerified] = useState(true)
  const [showVerifyBanner, setShowVerifyBanner] = useState(false)

  // Fetch userId and premium status on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/check-premium?email=${encodeURIComponent(userEmail)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.user?.id) setUserId(data.user.id)
          if (data.isPremium) setIsPremium(true)
          if (data.emailVerified === false) {
            setEmailVerified(false)
            setShowVerifyBanner(true)
          }
        }
      } catch { /* silent */ }
    }
    fetchUser()
  }, [userEmail])

  const handleNavigate = useCallback((page: string) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage userName={userName} onNavigate={handleNavigate} />
      case 'explore': return <ExplorePage />
      case 'models3d': return <Models3DPage />
      case 'simulators': return <SimulatorsPage />
      case 'pro': return <PremiumPage />
      case 'aula': return <AulaPage />
      case 'donaciones': return <DonacionesPage />
      case 'profile': return <ProfilePage userName={userName} userEmail={userEmail} />
      case 'encyclopedia': return <SpaceEncyclopediaPage />
      case 'quiz': return <QuizPage />
      case 'events': return <EventsPage />
      case 'news': return <NewsPage />
      case 'apod': return <NasaApodPage />
      case 'missions': return <DailyMissionsPage userId={userId} />
      case 'leaderboard': return <LeaderboardPage currentUserId={userId} />
      case 'community': return <CommunityPage userId={userId} userName={userName} />
      case 'minigames': return <MiniGamesPage />
      case 'mentor-ai': return <AiChatPage userId={userId} isPremium={isPremium} userName={userName} />
      case 'biblioteca': return <BibliotecaPage userId={userId} isPremium={isPremium} userName={userName} />
      case 'cert-exams': return <CertificationExamsPage userId={userId} isPremium={isPremium} userName={userName} />
      case 'certificates': return <CertificatesPage userId={userId} isPremium={isPremium} userName={userName} />
      case 'nosotros': return <SobreNosotrosPage />
      case 'terminos': return <TerminosPage />
      case 'privacidad': return <PrivacidadPage />
      default: return <HomePage userName={userName} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} userName={userName} onLogout={onLogout} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 min-h-screen ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 p-4" style={{ background: 'rgba(5,5,16,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
            <Menu size={20} />
          </button>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
            <Orbit size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold flex-1" style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AstroVerse</span>
        </div>

        {/* Email Verification Banner */}
        <AnimatePresence>
          {showVerifyBanner && !emailVerified && (
            <motion.div
              className="mx-6 md:mx-8 mt-4 rounded-xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <MailCheck size={20} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-400">Verifica tu email</p>
                <p className="text-xs text-white/40 mt-0.5">Confirma tu cuenta para acceder a todas las funciones</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/auth/verify-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail }),
                      })
                      if (res.ok) {
                        setEmailVerified(true)
                        setShowVerifyBanner(false)
                      }
                    } catch { /* silent */ }
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  ✅ Verificar Ahora
                </motion.button>
                <button onClick={() => setShowVerifyBanner(false)} className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
