'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

// ============================================================
// AiChatPage
// ============================================================
export default function AiChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: '¡Hola! Soy AstroAsistente 🤖. Estoy aquí para ayudarte a explorar el universo. Pregúntame sobre planetas, galaxias, estrellas o cualquier tema espacial. ¿En qué puedo ayudarte hoy?',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = [
    'Cuéntame sobre Júpiter',
    '¿Qué es un agujero negro?',
    'Edad en Marte',
    '¿Cuántas estrellas hay?',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return
    setMessages(prev => [...prev, { role: 'user', text: textToSend }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        default: '¡Interesante pregunta! Los datos que tengo indican que el universo es vasto y lleno de misterios. Te recomiendo explorar nuestra sección de simuladores para experimentar esto de forma interactiva. ¿Te gustaría saber algo más específico?',
        jupiter: 'Júpiter es el planeta más grande del sistema solar, con un diámetro de 142,984 km. Su Gran Mancha Roja es una tormenta que ha durado más de 300 años. ¡Podrías meter a la Tierra dentro de Júpiter más de 1,300 veces! Júpiter tiene 95 lunas conocidas, incluyendo las cuatro lunas galileanas: Io, Europa, Ganímedes y Calisto.',
        marte: 'Marte, el planeta rojo, tiene una temperatura promedio de -60°C. Es el objetivo principal de la exploración humana futura. Su montaña más alta, el Monte Olimpo, es casi 3 veces más alta que el Monte Everest con 21.9 km de altura. Un día en Marte dura 24 horas y 37 minutos, muy similar al nuestro.',
        agujero: 'Los agujeros negros son regiones del espacio-tiempo donde la gravedad es tan fuerte que nada, ni siquiera la luz, puede escapar. El más cercano a la Tierra es Gaia BH1, a aproximadamente 1,560 años luz. El agujero negro supermasivo en el centro de nuestra galaxia, Sagitario A*, tiene una masa de 4 millones de soles.',
        estrella: 'Las estrellas se forman en nebulosas a partir de colapsos gravitacionales de gas y polvo. Nuestro Sol es una estrella enana amarilla con aproximadamente 4.6 mil millones de años. ¡Está a la mitad de su vida! Se estima que hay aproximadamente 70 sextillones (7 × 10²²) de estrellas en el universo observable.',
        edad: 'Si tienes 25 años en la Tierra, en Marte tendrías aproximadamente 13.3 años, ya que un año marciano dura 1.88 años terrestres. En Júpiter solo tendrías 2.1 años, y en Mercurio tendrías más de 104 años. ¡Puedes calcular tu edad espacial en nuestro simulador!',
      }

      let response = responses.default
      const lower = textToSend.toLowerCase()
      if (lower.includes('júpiter') || lower.includes('jupiter')) response = responses.jupiter
      else if (lower.includes('marte') || lower.includes('mars')) response = responses.marte
      else if (lower.includes('agujero') || lower.includes('black hole')) response = responses.agujero
      else if (lower.includes('estrella') || lower.includes('star') || lower.includes('cuántas estrellas') || lower.includes('cuantas estrellas')) response = responses.estrella
      else if (lower.includes('edad') || lower.includes('age')) response = responses.edad

      setMessages(prev => [...prev, { role: 'ai', text: response }])
      setIsTyping(false)
    }, 1500)
  }

  const showSuggestions = messages.length <= 1

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <MessageSquare size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AstroAsistente</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-xs">En línea</span>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              style={{
                background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(124,58,237,0.1)',
                border: msg.role === 'user'
                  ? '1px solid rgba(0,212,255,0.15)'
                  : '1px solid rgba(124,58,237,0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={12} className="text-violet-400" />
                  <span className="text-violet-400 text-[10px] font-medium">AstroAsistente</span>
                </div>
              )}
              <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white/80' : 'text-white/60'}`}>
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Quick suggestions */}
        {showSuggestions && !isTyping && (
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {quickSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#a78bfa',
                }}
                onMouseEnter={e => {
                  if (e.currentTarget) {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.15)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(124,58,237,0.1)'
                  }
                }}
                onMouseLeave={e => {
                  if (e.currentTarget) {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <Sparkles size={12} className="inline mr-1.5 opacity-60" />
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-violet-400 text-[10px] font-medium">AstroAsistente</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400/50"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregúntame sobre el universo..."
          className="flex-1 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder:text-white/20 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
        />
        <button
          onClick={() => handleSend()}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-[1.05] active:scale-90 shimmer"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            boxShadow: '0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}
