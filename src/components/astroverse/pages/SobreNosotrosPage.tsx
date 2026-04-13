'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Rocket, Globe2, Users, Star, ExternalLink, Heart, Zap, Award, Coffee, Cpu, Sparkles } from 'lucide-react'
import { cardBase, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

const GITHUB_URL = 'https://github.com/galvezai650-svg/ASTROVERSE'

const techStack = [
  { name: 'Next.js 16', desc: 'Framework React de última generación', icon: '⚛️' },
  { name: 'TypeScript', desc: 'Tipado estático y seguridad', icon: '📘' },
  { name: 'Tailwind CSS', desc: 'Diseño responsivo y moderno', icon: '🎨' },
  { name: 'Prisma ORM', desc: 'Base de datos optimizada', icon: '🗄️' },
  { name: 'Framer Motion', desc: 'Animaciones fluidas e interactivas', icon: '✨' },
  { name: 'PayPal API', desc: 'Suscripciones y pagos seguros', icon: '💳' },
]

const stats = [
  { value: '21+', label: 'Páginas interactivas', icon: Rocket },
  { value: '3,000+', label: 'Líneas de código', icon: Code2 },
  { value: '100%', label: 'Funcionalidad', icon: Zap },
  { value: '∞', label: 'Pasión por el espacio', icon: Star },
]

const timeline = [
  { year: '2024', title: 'La idea', desc: 'Oscar David (OSKITAR), de tan solo 16 años, concibe AstroVerse como un proyecto educativo para acercar la astronomía a todos.', emoji: '💡' },
  { year: '2025', title: 'Nace OKS LABS', desc: 'Se funda OKS LABS como la empresa detrás de AstroVerse, con enfoque en tecnología educativa y software innovador.', emoji: '🏢' },
  { year: '2025', title: 'Lanzamiento', desc: 'AstroVerse se lanza oficialmente con contenido educativo espacial, simuladores interactivos, comunidad y mucho más.', emoji: '🚀' },
  { year: 'Futuro', title: 'Expansión', desc: 'App móvil, traducción a 5 idiomas, contenido NASA en tiempo real y certificados educativos reconocidos.', emoji: '🌍' },
]

export default function SobreNosotrosPage() {
  return (
    <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-1 space-y-6 max-w-4xl mx-auto">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
        <motion.div
          className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(245,158,11,0.15))',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 0 40px rgba(0,212,255,0.15)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(245,158,11,0.1))',
                'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(124,58,237,0.1))',
                'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,212,255,0.1))',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <Cpu size={36} className="text-cyan-400 relative z-10" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Sobre AstroVerse</h1>
        <p className="text-white/30 text-sm max-w-lg mx-auto">
          Un proyecto de <span className="text-amber-400 font-semibold">OKS LABS</span> — tecnología educativa colombiana para explorar el universo
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl p-4 text-center relative overflow-hidden"
            style={cardBase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <s.icon size={16} className="text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-white/25 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Creator Card */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        variants={staggerItem}
        initial="initial"
        animate="animate"
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <motion.div
              className="relative shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2))',
                  border: '2px solid rgba(245,158,11,0.3)',
                }}
              >
                <span className="text-4xl">👨‍💻</span>
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                />
              </div>
              {/* Active indicator */}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: '2px solid #050510' }}
              >
                <Zap size={10} className="text-white" />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-bold text-white">Oscar David Marulanda Galvez</h2>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  OSKITAR
                </span>
              </div>
              <p className="text-amber-400/80 text-sm font-medium mb-3">CEO & Fundador · OKS LABS</p>
              <p className="text-white/40 text-sm leading-relaxed mb-4">
                Desarrollador Fullstack de <span className="text-white/60 font-semibold">16 años</span> con pasión por la tecnología, 
                la astronomía y la educación. Creador de AstroVerse, una plataforma educativa espacial que busca 
                democratizar el conocimiento del universo para estudiantes de toda Latinoamérica.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Fullstack Dev', color: '#00d4ff' },
                  { label: 'UI/UX Design', color: '#7c3aed' },
                  { label: '16 años', color: '#f59e0b' },
                  { label: 'Colombia 🇨🇴', color: '#10b981' },
                ].map(tag => (
                  <span
                    key={tag.label}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    style={{ background: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}25` }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OKS LABS Card */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                border: '1px solid rgba(0,212,255,0.25)',
              }}
            >
              <Sparkles size={24} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">OKS LABS</h2>
              <p className="text-white/30 text-xs">Empresa de tecnología educativa</p>
            </div>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-5">
            <span className="text-cyan-400 font-semibold">OKS LABS</span> es una empresa de tecnología educativa colombiana 
            fundada por Oscar David Marulanda Galvez. Nuestra misión es crear herramientas innovadoras que hagan 
            accesible el conocimiento científico y espacial para todas las personas, sin importar su edad o contexto.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Globe2, label: 'Origen', value: 'Colombia 🇨🇴' },
              { icon: Heart, label: 'Enfoque', value: 'Educativo' },
              { icon: Award, label: 'Fundador', value: 'OSKITAR' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <item.icon size={14} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/25 text-[10px]">{item.label}</p>
                  <p className="text-white/70 text-xs font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #7c3aed, #10b981, transparent)" />
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Code2 size={18} className="text-violet-400" />
            Stack Tecnológico
          </h2>
          <p className="text-white/30 text-xs mb-5">Las tecnologías que hacen posible AstroVerse</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-xl p-4 text-center transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                whileHover={{
                  borderColor: 'rgba(124,58,237,0.3)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.1)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <span className="text-2xl mb-2 block">{t.icon}</span>
                <p className="text-white/80 text-xs font-semibold">{t.name}</p>
                <p className="text-white/25 text-[10px] mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #f59e0b, #ec4899, transparent)" />
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Rocket size={18} className="text-amber-400" />
            Historia del Proyecto
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-2 bottom-2 w-px" style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.4), rgba(124,58,237,0.4), transparent)' }} />
            
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  className="flex gap-4 relative"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                >
                  {/* Dot */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: i === timeline.length - 1 ? 'rgba(245,158,11,0.15)' : 'rgba(0,212,255,0.1)',
                      border: i === timeline.length - 1 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(0,212,255,0.2)',
                    }}
                  >
                    <span className="text-lg">{t.emoji}</span>
                  </div>
                  {/* Content */}
                  <div className="pb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400/70 text-[10px] font-bold uppercase tracking-wider">{t.year}</span>
                    </div>
                    <h3 className="text-white/80 text-sm font-semibold mb-1">{t.title}</h3>
                    <p className="text-white/35 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* GitHub CTA */}
      <motion.div
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <span className="text-3xl mb-3 block">⭐</span>
        </motion.div>
        <p className="text-white/50 text-sm mb-4">
          ¿Te gusta AstroVerse? Dale una estrella en GitHub y apoya el proyecto de un desarrollador de 16 años.
        </p>
        <motion.a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
            border: '1px solid rgba(0,212,255,0.3)',
          }}
          whileHover={{
            borderColor: 'rgba(0,212,255,0.6)',
            boxShadow: '0 0 25px rgba(0,212,255,0.2)',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.97 }}
        >
          Ver en GitHub
          <ExternalLink size={14} />
        </motion.a>
        <p className="text-white/15 text-[10px] mt-3">
          github.com/galvezai650-svg/ASTROVERSE
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="rounded-xl p-4 text-center"
        style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.08)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-white/25 text-xs">
          © 2025 AstroVerse · Desarrollado con <Coffee size={10} className="inline text-amber-400" /> por <span className="text-amber-400/60">OSKITAR</span> para <span className="text-cyan-400/60">OKS LABS</span>
        </p>
        <p className="text-white/15 text-[10px] mt-1">Plataforma educativa colombiana · Hecho con ❤️ desde Colombia</p>
      </motion.div>
    </div>
  )
}
