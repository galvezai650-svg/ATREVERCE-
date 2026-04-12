'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Orbit, Rocket, Globe2, Video, Sparkles, Star, Crown,
  ArrowRight, ChevronDown, Heart, Zap, Play, Check,
  Users, BookOpen, Cpu, Shield, FlaskConical, ArrowUp,
  Quote, Twitter, Github, MessageCircle, X
} from 'lucide-react'
import { toast } from 'sonner'

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

      stars.forEach(star => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
        const opacity = 0.3 + twinkle * 0.5

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = Math.max(0.1, opacity)
        ctx.fill()

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
// ShimmerButton - Reusable shimmer overlay for buttons
// ============================================================
function ShimmerOverlay() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[inherit]"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

// ============================================================
// GlowingPlanet - CSS planet with atmosphere + tilt on hover
// ============================================================
function GlowingPlanet() {
  const planetRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 10, y: -x * 10 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={planetRef}
      className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
      style={{
        perspective: '800px',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <OrbitRing size={320} duration={15} color="#00d4ff" />
      <OrbitRing size={380} duration={22} color="#7c3aed" />
      <OrbitRing size={260} duration={12} color="#ec4899" />

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
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1a4a6e, #0d2847 40%, #061529 70%, #030b14)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 40% 50%, #10b981 0%, transparent 50%), radial-gradient(ellipse at 65% 35%, #10b981 0%, transparent 30%)',
            }}
          />
          <div
            className="absolute inset-2 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 35%)',
              animation: 'cloud-drift 30s ease-in-out infinite alternate',
            }}
          />
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
// FeatureCard - Enhanced glassmorphism feature card
// ============================================================
function FeatureCard({ icon: Icon, title, description, color, sectionId }: {
  icon: React.ElementType; title: string; description: string; color: string; sectionId?: string
}) {
  const colorMap: Record<string, { border: string; shadow: string; text: string; bg: string; glow: string }> = {
    cyan: { border: 'rgba(0,212,255,0.2)', shadow: '0 0 40px rgba(0,212,255,0.2)', text: '#00d4ff', bg: 'rgba(0,212,255,0.08)', glow: 'rgba(0,212,255,0.4)' },
    violet: { border: 'rgba(124,58,237,0.2)', shadow: '0 0 40px rgba(124,58,237,0.2)', text: '#7c3aed', bg: 'rgba(124,58,237,0.08)', glow: 'rgba(124,58,237,0.4)' },
    pink: { border: 'rgba(236,72,153,0.2)', shadow: '0 0 40px rgba(236,72,153,0.2)', text: '#ec4899', bg: 'rgba(236,72,153,0.08)', glow: 'rgba(236,72,153,0.4)' },
    amber: { border: 'rgba(245,158,11,0.2)', shadow: '0 0 40px rgba(245,158,11,0.2)', text: '#f59e0b', bg: 'rgba(245,158,11,0.08)', glow: 'rgba(245,158,11,0.4)' },
    emerald: { border: 'rgba(16,185,129,0.2)', shadow: '0 0 40px rgba(16,185,129,0.2)', text: '#10b981', bg: 'rgba(16,185,129,0.08)', glow: 'rgba(16,185,129,0.4)' },
    blue: { border: 'rgba(59,130,246,0.2)', shadow: '0 0 40px rgba(59,130,246,0.2)', text: '#3b82f6', bg: 'rgba(59,130,246,0.08)', glow: 'rgba(59,130,246,0.4)' },
  }
  const c = colorMap[color] || colorMap.cyan

  const handleClick = () => {
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      toast.info(`${title}: Explora esta funcionalidad al registrarte`, {
        description: description.slice(0, 80) + '...',
      })
    }
  }

  return (
    <motion.div
      className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-500"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(20px)',
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3 },
      }}
      onClick={handleClick}
    >
      {/* Animated gradient border overlay on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-[-200%] animate-[spin_4s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, ${c.text}40, transparent, ${c.text}20, transparent, ${c.text}40)`,
          }}
        />
        <div
          className="absolute inset-[1px] rounded-2xl"
          style={{ background: 'rgba(5,5,16,0.95)' }}
        />
      </div>

      {/* Shimmer sweep on hover */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)',
            animation: 'shimmer 2.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with pulse glow */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: c.bg,
            boxShadow: `0 0 0px ${c.glow}`,
          }}
        >
          <motion.div
            animate={undefined}
            whileHover={{
              boxShadow: [`0 0 0px ${c.glow}`, `0 0 20px ${c.glow}`, `0 0 0px ${c.glow}`],
              transition: { duration: 1.5, repeat: Infinity },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Icon size={26} style={{ color: c.text }} />
          </motion.div>
        </div>

        <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{description}</p>

        {/* Learn more link */}
        <div className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-2.5" style={{ color: c.text }}>
          Saber más
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Hover shadow glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-500"
        style={{ boxShadow: 'none' }}
        onMouseEnter={e => {
          if (e.currentTarget) {
            (e.currentTarget as HTMLDivElement).style.boxShadow = c.shadow
          }
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  )
}

// ============================================================
// StatsCounter - Animated counter with glow
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
      <motion.div
        className="text-4xl md:text-5xl font-bold mb-2"
        animate={isInView ? {
          textShadow: [
            '0 0 10px rgba(0,212,255,0.0)',
            '0 0 30px rgba(0,212,255,0.5)',
            '0 0 10px rgba(0,212,255,0.0)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {count}{suffix}
      </motion.div>
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
// AnimatedNavLink - Nav link with underline animation
// ============================================================
function AnimatedNavLink({ label, id, onClick }: { label: string; id: string; onClick: (id: string) => void }) {
  return (
    <button
      onClick={() => onClick(id)}
      className="nav-link relative text-white/50 hover:text-white/90 text-sm transition-colors duration-200 py-1"
    >
      {label}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 hover:w-full rounded-full" />
    </button>
  )
}

// ============================================================
// LandingNavbar - Fixed top navigation bar (enhanced)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(5,5,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
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
            <AnimatedNavLink key={item.id} label={item.label} id={item.id} onClick={scrollTo} />
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* Iniciar Sesión - Ghost button with animated border */}
          <motion.button
            onClick={onLogin}
            className="relative px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white font-medium transition-colors duration-300 overflow-hidden"
            whileTap={{ scale: 0.98 }}
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => {
              if (e.currentTarget) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.4)'
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px rgba(0,212,255,0.15)'
              }
            }}
            onMouseLeave={e => {
              if (e.currentTarget) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
              }
            }}
          >
            Iniciar Sesión
          </motion.button>

          {/* Crear Cuenta - Gradient button with shimmer */}
          <motion.button
            onClick={onRegister}
            className="relative px-4 py-2 rounded-lg text-sm text-white font-medium overflow-hidden active:scale-[0.98] transition-transform"
            style={{
              background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            }}
            whileHover={{
              boxShadow: '0 0 30px rgba(0,212,255,0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <ShimmerOverlay />
            <span className="relative z-10">Crear Cuenta</span>
          </motion.button>
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
// FloatingBackToTop - Appears after scrolling past hero
// ============================================================
function FloatingBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.button
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
        boxShadow: '0 0 20px rgba(0,212,255,0.4)',
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ boxShadow: '0 0 35px rgba(0,212,255,0.6)', scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Volver arriba"
    >
      <ArrowUp size={20} className="text-white" />
    </motion.button>
  )
}

// ============================================================
// TestimonialCard - Enhanced testimonial with avatar ring, quote icon, glow
// ============================================================
function TestimonialCard({ name, role, text, rating, avatar }: {
  name: string; role: string; text: string; rating: number; avatar: string
}) {
  return (
    <motion.div
      className="group relative rounded-2xl p-6 cursor-default transition-all duration-500"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3 },
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
      />
      {/* Hover border brighten */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 group-hover:border-pink-500/30"
        style={{ border: '1px solid transparent' }}
      />

      {/* Quote icon decoration */}
      <Quote size={28} className="absolute top-4 right-4 text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500" />

      {/* Avatar with gradient ring */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
          style={{
            background: 'conic-gradient(from 0deg, #ec4899, #f59e0b, #7c3aed, #ec4899)',
            padding: '2px',
          }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: '#050510' }}>
            {avatar}
          </div>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-white/30 text-xs">{role}</p>
        </div>
      </div>

      {/* Star rating with glow on filled stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, si) => (
          <motion.div
            key={si}
            className="relative"
          >
            {si < rating && (
              <div className="absolute inset-0 blur-sm opacity-50">
                <Star size={14} className="text-amber-400 fill-amber-400" />
              </div>
            )}
            <Star
              size={14}
              className={si < rating ? 'text-amber-400 fill-amber-400 relative' : 'text-white/10 relative'}
            />
          </motion.div>
        ))}
      </div>

      <p className="text-white/50 text-sm leading-relaxed">"{text}"</p>
    </motion.div>
  )
}

// ============================================================
// GradientBorderContainer - Animated rotating gradient border
// ============================================================
function GradientBorderContainer({ children, className = '', colors = ['#00d4ff', '#7c3aed', '#ec4899'] }: {
  children: React.ReactNode; className?: string; colors?: string[]
}) {
  const gradient = `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`
  return (
    <div className={`relative rounded-3xl overflow-hidden ${className}`}>
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ background: gradient, padding: '1.5px' }}
      >
        <div
          className="absolute inset-[-200%] rounded-full animate-[spin_6s_linear_infinite]"
          style={{ background: gradient }}
        />
        <div className="absolute inset-[1.5px] rounded-3xl" style={{ background: 'rgba(5,5,16,0.97)' }} />
      </div>
      {/* Inner content */}
      <div className="relative z-10">{children}</div>
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
      color: 'cyan', sectionId: 'features',
    },
    {
      icon: Globe2, title: 'Exploración Interactiva',
      description: 'Navega por planetas, estrellas y nebulosas con información detallada y datos en tiempo real.',
      color: 'violet', sectionId: 'explore',
    },
    {
      icon: Cpu, title: 'Modelos 3D',
      description: 'Visualiza el universo en 3D con modelos detallados de cada cuerpo celeste del sistema solar.',
      color: 'pink', sectionId: 'showcase',
    },
    {
      icon: Sparkles, title: 'Simuladores',
      description: 'Experimenta la gravedad, el peso en otros planetas y calcula tu edad espacial.',
      color: 'amber', sectionId: 'simulators',
    },
    {
      icon: Crown, title: 'Contenido Premium',
      description: 'Accede a contenido exclusivo, simuladores avanzados y datos de la NASA en tiempo real.',
      color: 'emerald', sectionId: 'premium',
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

  const premiumComparison = [
    { feature: 'Videos Educativos', free: '10 videos', premium: '50+ videos' },
    { feature: 'Simuladores', free: '1 simulador', premium: 'Todos los simuladores' },
    { feature: 'Modelos 3D', free: 'Vista previa', premium: 'Acceso completo' },
    { feature: 'Datos NASA', free: 'Básicos', premium: 'Tiempo real' },
    { feature: 'Sin anuncios', free: false, premium: true },
    { feature: 'Soporte prioritario', free: false, premium: true },
  ]

  // Parallax scroll for hero
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarfieldCanvas />
      <AuroraMesh />
      <HUDGrid />

      <LandingNavbar onLogin={onLogin} onRegister={onRegister} />
      <FloatingBackToTop />

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div className="max-w-5xl mx-auto text-center" style={{ y: heroY, opacity: heroOpacity }}>
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
            {/* Comenzar Aventura - Large gradient with shimmer + pulse glow */}
            <motion.button
              onClick={() => {
                toast.info('¡Creando tu cuenta...', { description: 'Serás redirigido al registro' })
                onRegister()
              }}
              className="group relative flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                boxShadow: '0 0 30px rgba(0,212,255,0.3)',
              }}
              whileHover={{
                boxShadow: [
                  '0 0 30px rgba(0,212,255,0.3)',
                  '0 0 50px rgba(0,212,255,0.5)',
                  '0 0 30px rgba(0,212,255,0.3)',
                ],
                transition: { duration: 1.5, repeat: Infinity },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ShimmerOverlay />
              <span className="relative z-10 flex items-center gap-2">
                Comenzar Aventura
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {/* Ver Demo - Ghost button with play icon */}
            <motion.button
              onClick={() => {
                toast.success('Explorando las características...', { description: 'Desplázate para ver todo lo que ofrece AstroVerse' })
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group relative flex items-center gap-2 px-8 py-4 rounded-xl text-white/70 font-medium overflow-hidden transition-all duration-300 active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(0,212,255,0.3)',
                boxShadow: '0 0 20px rgba(0,212,255,0.1)',
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={18} />
              Ver Demo
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={24} className="mx-auto text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            {/* CTA Button */}
            <motion.button
              onClick={() => {
                toast.info('¡Explora el sistema solar!', { description: 'Regístrate para acceder a los modelos 3D interactivos' })
                onRegister()
              }}
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold mt-8 overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                boxShadow: '0 0 25px rgba(124,58,237,0.3)',
              }}
              whileHover={{
                boxShadow: [
                  '0 0 25px rgba(124,58,237,0.3)',
                  '0 0 40px rgba(124,58,237,0.5)',
                  '0 0 25px rgba(124,58,237,0.3)',
                ],
                transition: { duration: 1.5, repeat: Infinity },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ShimmerOverlay />
              <span className="relative z-10 flex items-center gap-2">
                Explorar el sistema solar
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlowingPlanet />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="explore" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GradientBorderContainer colors={['#00d4ff30', '#7c3aed30', '#ec489930', '#00d4ff30']} className="p-8 md:p-12">
              {/* Star decorations */}
              <div className="absolute top-4 left-6 text-white/[0.06]">
                <Star size={16} />
              </div>
              <div className="absolute top-8 right-10 text-white/[0.04]">
                <Star size={12} />
              </div>
              <div className="absolute bottom-6 left-20 text-white/[0.05]">
                <Star size={14} />
              </div>
              <div className="absolute bottom-4 right-6 text-white/[0.06]">
                <Star size={10} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatsCounter value={50} suffix="+" label="Videos Educativos" />
                <StatsCounter value={6} suffix="" label="Planetas Explorables" />
                <StatsCounter value={3} suffix="" label="Simuladores" />
                <StatsCounter value={10000} suffix="+" label="Usuarios Activos" />
              </div>
            </GradientBorderContainer>
          </motion.div>
        </div>
      </section>

      {/* ===== SIMULATORS SECTION ===== */}
      <section id="simulators" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <WeightSimulator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            {/* CTA Button */}
            <motion.button
              onClick={() => {
                toast.info('¡Descubre más simuladores!', { description: 'Regístrate para desbloquear todos los simuladores' })
                onRegister()
              }}
              className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold mt-8 overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                boxShadow: '0 0 25px rgba(245,158,11,0.3)',
              }}
              whileHover={{
                boxShadow: [
                  '0 0 25px rgba(245,158,11,0.3)',
                  '0 0 40px rgba(245,158,11,0.5)',
                  '0 0 25px rgba(245,158,11,0.3)',
                ],
                transition: { duration: 1.5, repeat: Infinity },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ShimmerOverlay />
              <span className="relative z-10 flex items-center gap-2">
                Explorar simuladores
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PREMIUM CTA SECTION ===== */}
      <section id="premium" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GradientBorderContainer colors={['#f59e0b', '#ec4899', '#7c3aed', '#f59e0b']} className="p-8 md:p-12">
              {/* Floating particles */}
              <div className="absolute top-6 left-8">
                <motion.div
                  className="w-2 h-2 rounded-full bg-amber-400/20"
                  animate={{ y: [-5, 5, -5], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="absolute top-12 right-12">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-pink-400/20"
                  animate={{ y: [5, -5, 5], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </div>
              <div className="absolute bottom-10 left-16">
                <motion.div
                  className="w-1 h-1 rounded-full bg-violet-400/20"
                  animate={{ y: [-3, 6, -3], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                />
              </div>
              <div className="absolute bottom-8 right-20">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-amber-400/15"
                  animate={{ y: [4, -4, 4], opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                />
              </div>

              <div className="relative z-10 text-center">
                {/* Glowing crown icon */}
                <motion.div
                  className="inline-block mb-6"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 8px rgba(245,158,11,0.3))',
                      'drop-shadow(0 0 20px rgba(245,158,11,0.6))',
                      'drop-shadow(0 0 8px rgba(245,158,11,0.3))',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown size={40} className="text-amber-400" />
                </motion.div>

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

                {/* CTA button with shimmer + glow */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                  <motion.button
                    onClick={() => {
                      toast.success('¡Bienvenido a Premium!', { description: 'Disfruta de 7 días de prueba gratuita' })
                      onRegister()
                    }}
                    className="group relative flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold overflow-hidden active:scale-[0.98] transition-transform text-lg"
                    style={{
                      background: 'linear-gradient(to right, #f59e0b, #ec4899)',
                      boxShadow: '0 0 30px rgba(245,158,11,0.3)',
                    }}
                    whileHover={{
                      boxShadow: [
                        '0 0 30px rgba(245,158,11,0.3)',
                        '0 0 50px rgba(245,158,11,0.5)',
                        '0 0 30px rgba(245,158,11,0.3)',
                      ],
                      transition: { duration: 1.5, repeat: Infinity },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShimmerOverlay />
                    <span className="relative z-10 flex items-center gap-2">
                      <Crown size={18} />
                      Probar Premium Gratis
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                  <span className="text-white/30 text-sm">Solo $4.99/mes</span>
                </div>

                {/* Comparison Table */}
                <div className="text-left max-w-2xl mx-auto">
                  <div className="rounded-xl overflow-hidden" style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {/* Table header */}
                    <div className="grid grid-cols-3 gap-4 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-white/40 text-xs font-medium">Característica</div>
                      <div className="text-white/40 text-xs font-medium text-center">Gratis</div>
                      <div className="text-xs font-medium text-center" style={{ color: '#f59e0b' }}>Premium</div>
                    </div>
                    {/* Table rows */}
                    {premiumComparison.map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 px-4 py-3 items-center" style={{
                        borderBottom: i < premiumComparison.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      }}>
                        <div className="text-white/50 text-sm">{row.feature}</div>
                        <div className="text-white/30 text-sm text-center">
                          {typeof row.free === 'boolean' ? (
                            row.free ? (
                              <Check size={16} className="inline text-emerald-400" />
                            ) : (
                              <X size={16} className="inline text-white/20" />
                            )
                          ) : (
                            row.free
                          )}
                        </div>
                        <div className="text-sm text-center" style={{ color: '#f59e0b' }}>
                          {typeof row.premium === 'boolean' ? (
                            row.premium ? (
                              <Check size={16} className="inline text-amber-400" />
                            ) : (
                              <X size={16} className="inline text-white/20" />
                            )
                          ) : (
                            row.premium
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GradientBorderContainer>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.button
                onClick={() => {
                  toast.success('¡Prepárate para despegar!', { description: 'Tu aventura espacial está a punto de comenzar' })
                  onRegister()
                }}
                className="group relative flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-lg overflow-hidden active:scale-[0.98] transition-transform"
                style={{
                  background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 40px rgba(0,212,255,0.4)',
                }}
                whileHover={{
                  boxShadow: [
                    '0 0 40px rgba(0,212,255,0.4)',
                    '0 0 60px rgba(0,212,255,0.6)',
                    '0 0 40px rgba(0,212,255,0.4)',
                  ],
                  transition: { duration: 1.5, repeat: Infinity },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <ShimmerOverlay />
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket size={20} />
                  Comenzar Ahora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={onLogin}
                className="px-10 py-4 rounded-xl text-white/70 font-semibold text-lg transition-all duration-300 hover:text-white hover:border-cyan-500/30 active:scale-[0.98]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                whileHover={{ boxShadow: '0 0 20px rgba(0,212,255,0.15)' }}
                whileTap={{ scale: 0.98 }}
              >
                Ya tengo cuenta
              </motion.button>
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
              {/* Social media icons */}
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  onClick={() => toast.info('¡Próximamente!', { description: 'Síguenos en Twitter/X para novedades' })}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                  whileHover={{
                    borderColor: 'rgba(0,212,255,0.3)',
                    boxShadow: '0 0 15px rgba(0,212,255,0.15)',
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </motion.button>
                <motion.button
                  onClick={() => toast.info('¡Próximamente!', { description: 'Visita nuestro repositorio en GitHub' })}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                  whileHover={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 15px rgba(255,255,255,0.1)',
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </motion.button>
                <motion.button
                  onClick={() => toast.info('¡Próximamente!', { description: 'Únete a nuestra comunidad en Discord' })}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                  whileHover={{
                    borderColor: 'rgba(124,58,237,0.3)',
                    boxShadow: '0 0 15px rgba(124,58,237,0.15)',
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Discord"
                >
                  <MessageCircle size={16} />
                </motion.button>
              </div>
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
                <p onClick={() => toast.info('FAQ próximamente disponible')} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">FAQ</p>
                <p onClick={() => toast.info('Formulario de contacto próximamente')} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">Contacto</p>
                <p onClick={() => toast.info('Términos y condiciones próximamente')} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">Términos</p>
                <p onClick={() => toast.info('Política de privacidad próximamente')} className="text-white/30 text-sm hover:text-white/50 cursor-pointer transition-colors">Privacidad</p>
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
            <p className="text-white/20 text-xs flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#2a2f96" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
                <path fill="#e53935" d="M4.597,30H3c0,0,4.077-3.084,12.928-5.535c0,0,14.202-4.313,23.428-10.583C42.565,11.177,45.071,8.764,46 7c0,0-1.193,4.725-6.726,10.351C38.191,17.906,37.768,18.64,37,19c0.126-0.142-0.096-0.871,0-1c0,0-7.195,3.355-22.02,7.77C14.981,25.768,8.742,27.352,4.597,30z"></path>
                <path fill="#fafafa" d="M19.282 25.221l1.503.025-.771-1.835L19.282 25.221zM18.969 26.366l-.274.96.802.441-2.661-.004.826-.463 1.714-5.602-.935-.467h3.167l2.639 6.068.528.467H21.08l.528-.467-.528-.934H18.969zM29.12 23.374c.576.135 2.526 1.143 1.848 3.129 0 0-.841 2.476-5.435.998L25.021 28v-1.995l.512.499c0 0 3.492 1.321 3.474-.316-.005-.319-.603-.845-2.205-1.048 0 0-1.802-.053-1.781-2.128.008-.843.626-2.964 5.121-1.497l.464-.518-.011 1.963-.453-.448c0 0-2.661-.834-2.926-.008C26.934 23.381 28.316 23.185 29.12 23.374z"></path>
                <path fill="#e53935" d="M39.461,17.149c-1.06,1.224-3.203,2.847-4.899,4.11c0,0-13.626,8.805-19.033,12.769c0,0-4.167,2.72-6.529,6.972v-1.618c0,0,2.255-3.163,7.585-6.937C21.273,29.125,35.281,20.744,37,18L39.461,17.149z"></path>
                <path fill="#fafafa" d="M8.667 21.257L11.834 21.257 14.473 25.459 14.473 21.724 13.945 21.257 16.056 21.257 15.528 21.724 15.528 27.326 16.056 27.793 12.889 27.793 10.251 23.592 10.251 27.326 10.778 27.793 8.667 27.793 9.195 27.326 9.195 21.724zM34.44 25.275l1.62-.007-.87-1.919L34.44 25.275zM34.275 26.366l-.33.934.858.467-2.661-.004.826-.463 1.714-5.602-.935-.467h3.167l2.639 6.068.528.467h-3.694l.528-.467-.528-.934H34.275z"></path>
                <path fill="#fafafa" d="M33.596,30.256c-0.743-2.933-2.427-6.293-4.742-9.462c-4.81-6.582-10.901-10.274-13.578-8.232c-1.316,1.006-1.627,3.2-0.871,6.181c0.743,2.933,2.427,6.293,4.742,9.462c1.008,1.379,1.618,2.143,2.695,3.243l0.68,0.255c-1.064-1.09-2.119-2.324-3.119-3.693c-2.291-3.135-3.957-6.455-4.689-9.348c-0.72-2.844-0.453-4.918,0.753-5.839c0.459-0.351,1.029-0.518,1.681-0.518c2.95,0,7.598,3.412,11.451,8.684c2.291,3.135,3.957,6.455,4.689,9.348c0.72,2.844,0.453,4.918-0.753,5.839c-1.617,1.235-4.605,0.181-7.779-2.414l-0.22,0.225C26.889,35.903,29.162,37,30.9,37c0.708,0,1.326-0.181,1.825-0.564C34.041,35.433,34.35,33.237,33.596,30.256z"></path>
                <path fill="#fafafa" d="M22.158 30.091A0.435 1.058 0 1 0 22.158 32.207A0.435 1.058 0 1 0 22.158 30.091Z" transform="rotate(-43.348 22.157 31.15)"></path>
                <path fill="#fafafa" d="M27.5 7.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23L28.02 9.731c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L27.5 7.389zM18.5 14.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L18.5 14.389zM19.5 35.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L19.5 35.389zM38.5 28.389l.231 1.591c.011.073.044.14.097.193.052.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14.044-.193.097-.052.053-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.052-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.053-.087.12-.097.193L38.5 28.389zM36.5 33A.5.5 0 1 0 36.5 34 .5.5 0 1 0 36.5 33zM12.5 32A.5.5 0 1 0 12.5 33 .5.5 0 1 0 12.5 32zM9.5 30A.5.5 0 1 0 9.5 31 .5.5 0 1 0 9.5 30zM24.5 11A.5.5 0 1 0 24.5 12 .5.5 0 1 0 24.5 11zM20.5 18A.5.5 0 1 0 20.5 19 .5.5 0 1 0 20.5 18z"></path>
              </svg>
              Powered by NASA data
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
