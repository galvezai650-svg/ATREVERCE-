'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Orbit, Rocket, Globe2, Video, Sparkles, Star, Crown,
  ArrowRight, ChevronDown, Heart, Zap, Play, Check,
  Telescope, Users, BookOpen, Cpu, Shield, FlaskConical
} from 'lucide-react'

// ============================================================
// StarfieldCanvas - Full-screen animated star background
// ============================================================
function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const starColors = ['#ffffff', '#00d4ff', '#7c3aed', '#ec4899']
    const stars: Array<{
      x: number; y: number; size: number; color: string;
      twinkleSpeed: number; twinkleOffset: number;
    }> = []

    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    const shootingStars: Array<{
      x: number; y: number; length: number; speed: number; opacity: number; angle: number;
    }> = []

    let animId: number
    let frame = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Draw stars
      stars.forEach(star => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
        const opacity = 0.3 + twinkle * 0.5

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = Math.max(0.1, opacity)
        ctx.fill()

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          )
          grad.addColorStop(0, star.color)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.globalAlpha = Math.max(0.05, opacity * 0.3)
          ctx.fill()
        }
      })

      // Shooting stars
      if (Math.random() < 0.002) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          opacity: 1,
          angle: Math.PI / 4 + Math.random() * 0.3,
        })
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity -= 0.015

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        )
        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        )
        grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`)
        grad.addColorStop(1, 'transparent')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.globalAlpha = 1
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  )
}

// ============================================================
// AuroraMesh - Animated aurora gradient overlay
// ============================================================
function AuroraMesh() {
  return (
    <div className="fixed inset-0 z-[1] overflow-hidden opacity-30 pointer-events-none">
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)',
          top: '-10%',
          left: '20%',
          animation: 'aurora 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          top: '30%',
          right: '-5%',
          animation: 'aurora 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          bottom: '10%',
          left: '10%',
          animation: 'aurora 18s ease-in-out infinite 5s',
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
          bottom: '30%',
          right: '20%',
          animation: 'aurora 22s ease-in-out infinite 3s',
        }}
      />
    </div>
  )
}

// ============================================================
// HUDGrid - SVG grid overlay
// ============================================================
function HUDGrid() {
  return (
    <svg className="fixed inset-0 z-[2] w-full h-full opacity-[0.03] pointer-events-none">
      <defs>
        <pattern id="hudGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hudGrid)" />
    </svg>
  )
}

// ============================================================
// OrbitRing - Animated orbit ring with dot
// ============================================================
function OrbitRing({ size = 300, duration = 20, color = '#00d4ff' }: {
  size?: number; duration?: number; color?: string
}) {
  return (
    <div
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor: `${color}30`,
        top: '50%',
        left: '50%',
        marginTop: -size / 2,
        marginLeft: -size / 2,
      }}
    >
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2"
        style={{
          animation: `spin ${duration}s linear infinite`,
          width: size,
          height: size,
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ============================================================
// GlowingPlanet - CSS planet with atmosphere
// ============================================================
function GlowingPlanet() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Orbit rings */}
      <OrbitRing size={320} duration={15} color="#00d4ff" />
      <OrbitRing size={380} duration={22} color="#7c3aed" />
      <OrbitRing size={260} duration={12} color="#ec4899" />

      {/* Planet body */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full"
          style={{ animation: 'float 6s ease-in-out infinite' }}
          animate={{
            boxShadow: [
              '0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(124,58,237,0.2), inset -20px -10px 40px rgba(0,0,0,0.5)',
              '0 0 80px rgba(0,212,255,0.4), 0 0 160px rgba(124,58,237,0.3), inset -20px -10px 40px rgba(0,0,0,0.5)',
              '0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(124,58,237,0.2), inset -20px -10px 40px rgba(0,0,0,0.5)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Surface */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1a4a6e, #0d2847 40%, #061529 70%, #030b14)',
            }}
          />
          {/* Land masses */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 40% 50%, #10b981 0%, transparent 50%), radial-gradient(ellipse at 65% 35%, #10b981 0%, transparent 30%)',
            }}
          />
          {/* Cloud layer */}
          <div
            className="absolute inset-2 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 35%)',
              animation: 'cloud-drift 30s ease-in-out infinite alternate',
            }}
          />
          {/* Atmosphere glow */}
          <div
            className="absolute -inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 55%, rgba(0,212,255,0.1) 70%, rgba(124,58,237,0.05) 85%, transparent 100%)',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================
// FeatureCard - Glassmorphism feature card
// ============================================================
function FeatureCard({ icon: Icon, title, description, color }: {
  icon: React.ElementType; title: string; description: string; color: string
}) {
  const colorMap: Record<string, { border: string; shadow: string; text: string; bg: string }> = {
    cyan: { border: 'rgba(0,212,255,0.2)', shadow: '0 0 30px rgba(0,212,255,0.15)', text: '#00d4ff', bg: 'rgba(0,212,255,0.05)' },
    violet: { border: 'rgba(124,58,237,0.2)', shadow: '0 0 30px rgba(124,58,237,0.15)', text: '#7c3aed', bg: 'rgba(124,58,237,0.05)' },
    pink: { border: 'rgba(236,72,153,0.2)', shadow: '0 0 30px rgba(236,72,153,0.15)', text: '#ec4899', bg: 'rgba(236,72,153,0.05)' },
    amber: { border: 'rgba(245,158,11,0.2)', shadow: '0 0 30px rgba(245,158,11,0.15)', text: '#f59e0b', bg: 'rgba(245,158,11,0.05)' },
    emerald: { border: 'rgba(16,185,129,0.2)', shadow: '0 0 30px rgba(16,185,129,0.15)', text: '#10b981', bg: 'rgba(16,185,129,0.05)' },
    blue: { border: 'rgba(59,130,246,0.2)', shadow: '0 0 30px rgba(59,130,246,0.15)', text: '#3b82f6', bg: 'rgba(59,130,246,0.05)' },
  }
  const c = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(20px)',
      }}
      whileHover={{
        borderColor: c.text,
        boxShadow: c.shadow,
        y: -4,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
        style={{ backgroundColor: c.bg }}
      >
        <Icon size={24} style={{ color: c.text }} />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ============================================================
// StatsCounter - Animated counter with intersection observer
// ============================================================
function StatsCounter({ value, suffix, label }: {
  value: number; suffix: string; label: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * value)
      setCount(start)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl md:text-5xl font-bold mb-2"
        style={{
          background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {count}{suffix}
      </div>
      <p className="text-white/40 text-sm">{label}</p>
    </div>
  )
}

// ============================================================
// TypingText - Typewriter effect component
// ============================================================
function TypingText({ strings }: { strings: string[] }) {
  const [displayText, setDisplayText] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = strings[stringIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setStringIndex((stringIndex + 1) % strings.length)
        }
      }
    }, isDeleting ? 30 : 80)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, stringIndex, strings])

  return (
    <span className="text-cyan-400">
      {displayText}
      <span className="inline-block w-[2px] h-5 bg-cyan-400 ml-1 animate-pulse" />
    </span>
  )
}

// ============================================================
// WeightSimulator - Interactive weight calculator
// ============================================================
function WeightSimulator() {
  const planets = [
    { name: 'Mercurio', emoji: '☿', factor: 0.38, gravity: '3.7 m/s²' },
    { name: 'Venus', emoji: '♀', factor: 0.91, gravity: '8.87 m/s²' },
    { name: 'Marte', emoji: '♂', factor: 0.38, gravity: '3.72 m/s²' },
    { name: 'Júpiter', emoji: '♃', factor: 2.34, gravity: '24.79 m/s²' },
    { name: 'Saturno', emoji: '♄', factor: 1.06, gravity: '10.44 m/s²' },
    { name: 'Luna', emoji: '🌙', factor: 0.16, gravity: '1.62 m/s²' },
    { name: 'Neptuno', emoji: '♆', factor: 1.19, gravity: '11.15 m/s²' },
    { name: 'Urano', emoji: '⛢', factor: 0.92, gravity: '8.69 m/s²' },
  ]

  const [selectedPlanet, setSelectedPlanet] = useState(planets[4])
  const [weight, setWeight] = useState(70)
  const result = (weight * selectedPlanet.factor).toFixed(1)

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Cpu size={20} className="text-amber-400" />
        Simulador de Peso
      </h3>

      <div>
        <label className="text-white/40 text-xs mb-2 block">Tu peso en la Tierra (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={e => setWeight(Number(e.target.value) || 0)}
          className="w-full rounded-lg px-4 py-2.5 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      </div>

      <div>
        <label className="text-white/40 text-xs mb-2 block">Selecciona un planeta</label>
        <div className="grid grid-cols-4 gap-2">
          {planets.map(p => (
            <button
              key={p.name}
              onClick={() => setSelectedPlanet(p)}
              className="rounded-lg px-2 py-2 text-xs transition-all duration-200 text-center"
              style={{
                background: selectedPlanet.name === p.name ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedPlanet.name === p.name ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: selectedPlanet.name === p.name ? '#f59e0b' : 'rgba(255,255,255,0.5)',
              }}
            >
              <div className="text-lg mb-0.5">{p.emoji}</div>
              <div className="truncate">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
        }}
      >
        <p className="text-white/40 text-xs mb-1">Tu peso en {selectedPlanet.name}</p>
        <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
          {selectedPlanet.emoji} {result} kg
        </p>
        <p className="text-white/30 text-xs mt-2">Gravedad: {selectedPlanet.gravity}</p>
      </div>
    </div>
  )
}

// ============================================================
// LandingNavbar - Fixed top navigation bar
// ============================================================
function LandingNavbar({
  onLogin, onRegister
}: { onLogin: () => void; onRegister: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(5,5,16,0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}
          >
            <Orbit size={20} className="text-white" />
          </div>
          <span
            className="text-xl font-bold"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AstroVerse
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Características', id: 'features' },
            { label: 'Explorar', id: 'explore' },
            { label: '3D', id: 'showcase' },
            { label: 'Simuladores', id: 'simulators' },
            { label: 'Premium', id: 'premium' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-white/50 hover:text-white/90 text-sm transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onRegister}
            className="px-4 py-2 rounded-lg text-sm text-white font-medium transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            }}
          >
            Crear Cuenta
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

// ============================================================
// Logo Component (reusable)
// ============================================================
function AstroLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          boxShadow: '0 0 20px rgba(124,58,237,0.4)',
        }}
      >
        <Orbit size={20} className="text-white" />
      </div>
      <span
        className="text-xl font-bold"
        style={{
          background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        AstroVerse
      </span>
    </div>
  )
}

// ============================================================
// MAIN LandingPage Component
// ============================================================
export default function LandingPage({
  onLogin, onRegister
}: {
  onLogin: () => void
  onRegister: () => void
}) {
  const features = [
    {
      icon: Video, title: 'Contenido Educativo',
      description: 'Más de 50 videos explicativos sobre astronomía, desde el sistema solar hasta galaxias lejanas.',
      color: 'cyan',
    },
    {
      icon: Globe2, title: 'Exploración Interactiva',
      description: 'Navega por planetas, estrellas y nebulosas con información detallada y datos en tiempo real.',
      color: 'violet',
    },
    {
      icon: Cpu, title: 'Modelos 3D',
      description: 'Visualiza el universo en 3D con modelos detallados de cada cuerpo celeste del sistema solar.',
      color: 'pink',
    },
    {
      icon: Sparkles, title: 'Simuladores',
      description: 'Experimenta la gravedad, el peso en otros planetas y calcula tu edad espacial.',
      color: 'amber',
    },
    {
      icon: Crown, title: 'Contenido Premium',
      description: 'Accede a contenido exclusivo, simuladores avanzados y datos de la NASA en tiempo real.',
      color: 'emerald',
    },
  ]

  const testimonials = [
    {
      name: 'María García',
      role: 'Estudiante de Astrofísica',
      text: 'AstroVerse ha revolucionado mi forma de aprender sobre el universo. Los simuladores son increíblemente precisos.',
      rating: 5,
      avatar: '👩‍🎓',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Profesor de Ciencias',
      text: 'Uso AstroVerse en mis clases. Mis alumnos están más motivados que nunca para aprender astronomía.',
      rating: 5,
      avatar: '👨‍🏫',
    },
    {
      name: 'Ana Martínez',
      role: 'Aficionada al espacio',
      text: 'Nunca pensé que aprender sobre el espacio podía ser tan interactivo y divertido. ¡Simplemente genial!',
      rating: 4,
      avatar: '👩‍🚀',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarfieldCanvas />
      <AuroraMesh />
      <HUDGrid />

      <LandingNavbar onLogin={onLogin} onRegister={onRegister} />

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#00d4ff',
              }}
            >
              <Sparkles size={14} />
              Plataforma Educativa Espacial #1
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AstroVerse
            </span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-white/60 mb-6 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TypingText strings={[
              'Explora el universo desde tu pantalla',
              'Descubre planetas, galaxias y nebulosas',
              'Aprende astronomía de forma interactiva',
              'Viaja a través del cosmos',
            ]} />
          </motion.div>

          <motion.p
            className="text-white/40 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sumérgete en una experiencia educativa única. Explora el sistema solar en 3D,
            utiliza simuladores interactivos y descubre los misterios del universo con datos
            basados en investigaciones de la NASA.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={onRegister}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                boxShadow: '0 0 30px rgba(0,212,255,0.3)',
              }}
            >
              Comenzar Aventura
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white/70 font-medium transition-all hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Play size={18} />
              Ver Demo
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={24} className="mx-auto text-white/20" />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Características{' '}
              <span style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Increíbles
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Herramientas diseñadas para hacerte sentir como un verdadero astronauta explorando el cosmos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3D SHOWCASE SECTION ===== */}
      <section id="showcase" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                color: '#7c3aed',
              }}
            >
              <Cpu size={14} />
              Visualización 3D
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Explora el sistema solar en{' '}
              <span style={{
                background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                tres dimensiones
              </span>
            </h2>
            <p className="text-white/40 mb-8 leading-relaxed">
              Nuestros modelos 3D de alta resolución te permiten explorar cada rincón
              de los planetas del sistema solar. Rota, acerca y descubre detalles que nunca
              imaginaste.
            </p>
            <div className="space-y-4">
              {[
                'Modelos 3D interactivos de todos los planetas',
                'Texturas de alta resolución basadas en datos de la NASA',
                'Información detallada de cada cuerpo celeste',
                'Animaciones de rotación y traslación realistas',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-white/50 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowingPlanet />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="explore" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatsCounter value={50} suffix="+" label="Videos Educativos" />
              <StatsCounter value={6} suffix="" label="Planetas Explorables" />
              <StatsCounter value={3} suffix="" label="Simuladores" />
              <StatsCounter value={10000} suffix="+" label="Usuarios Activos" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIMULATORS SECTION ===== */}
      <section id="simulators" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <WeightSimulator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: '#f59e0b',
              }}
            >
              <FlaskConical size={14} />
              Simuladores Interactivos
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Experimenta la{' '}
              <span style={{
                background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                física espacial
              </span>
            </h2>
            <p className="text-white/40 mb-8 leading-relaxed">
              Nuestros simuladores te permiten experimentar fenómenos espaciales de primera mano.
              Calcula tu peso en otros planetas, simula la gravedad y mucho más.
            </p>
            <div className="space-y-4">
              {[
                'Calculadora de peso planetario precisa',
                'Simulador de gravedad en tiempo real',
                'Calculadora de edad espacial',
                'Basado en datos científicos reales',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Zap size={18} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-white/50 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Lo que dicen nuestros{' '}
              <span style={{
                background: 'linear-gradient(to right, #ec4899, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                exploradores
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      className={si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}
                    />
                  ))}
                </div>
                <p className="text-white/50 text-sm leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PREMIUM CTA SECTION ===== */}
      <section id="premium" className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3), rgba(236,72,153,0.3))',
                padding: '1px',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: 'rgba(5,5,16,0.95)' }}
            />

            <div className="relative z-10 text-center">
              <Crown size={40} className="mx-auto mb-6 text-amber-400" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Desbloquea{' '}
                <span style={{
                  background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Premium
                </span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto mb-8">
                Accede a contenido exclusivo, simuladores avanzados y datos en tiempo real
                de la NASA. Lleva tu exploración al siguiente nivel.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onRegister}
                  className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                    boxShadow: '0 0 30px rgba(245,158,11,0.3)',
                  }}
                >
                  <Crown size={18} />
                  Probar Premium Gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-white/30 text-sm">Solo $4.99/mes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para explorar el{' '}
              <span style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                universo?
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto mb-10">
              Únete a más de 10,000 exploradores espaciales y comienza tu viaje
              a través del cosmos hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onRegister}
                className="group flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 40px rgba(0,212,255,0.4)',
                }}
              >
                <Rocket size={20} />
                Comenzar Ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="px-10 py-4 rounded-xl text-white/70 font-semibold text-lg transition-all hover:text-white"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Ya tengo cuenta
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <AstroLogo />
              <p className="text-white/30 text-sm mt-4">
                Plataforma educativa espacial que te permite explorar el universo de forma interactiva.
              </p>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">Explorar</h4>
              <div className="space-y-2">
                {['Planetas', 'Galaxias', 'Nebulosas', 'Estrellas'].map(item => (
                  <p key={item} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">Plataforma</h4>
              <div className="space-y-2">
                {['Simuladores', 'Modelos 3D', 'Videos', 'Premium'].map(item => (
                  <p key={item} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white/60 font-semibold text-sm mb-4">Soporte</h4>
              <div className="space-y-2">
                {['FAQ', 'Contacto', 'Términos', 'Privacidad'].map(item => (
                  <p key={item} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-white/20 text-sm">
              © 2025 AstroVerse. Todos los derechos reservados.
            </p>
            <p className="text-white/20 text-xs flex items-center gap-1.5">
              <Telescope size={14} />
              Powered by NASA data
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
