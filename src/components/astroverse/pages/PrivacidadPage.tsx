'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Cookie, Users, Lock, UserCheck, Clock, Baby, RefreshCw, Mail } from 'lucide-react'
import { cardBase, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

const sections = [
  { id: 'recopilacion', title: '1. Información que Recopilamos', icon: Eye },
  { id: 'uso', title: '2. Cómo Usamos tu Información', icon: Shield },
  { id: 'cookies', title: '3. Cookies', icon: Cookie },
  { id: 'compartir', title: '4. Compartir Información', icon: Users },
  { id: 'seguridad', title: '5. Seguridad de Datos', icon: Lock },
  { id: 'derechos', title: '6. Derechos del Usuario', icon: UserCheck },
  { id: 'retencion', title: '7. Retención de Datos', icon: Clock },
  { id: 'menores', title: '8. Menores de Edad', icon: Baby },
  { id: 'cambios', title: '9. Cambios a esta Política', icon: RefreshCw },
  { id: 'contacto', title: '10. Contacto', icon: Mail },
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function PrivacidadPage() {
  return (
    <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-1 space-y-6 max-w-4xl mx-auto">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
        <motion.div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(16,185,129,0.15))',
            border: '1px solid rgba(124,58,237,0.25)',
            boxShadow: '0 0 40px rgba(124,58,237,0.15)',
          }}
        >
          <Shield size={30} className="text-violet-400" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <Clock size={14} />
          <span>Última actualización: 15 de enero de 2025</span>
        </div>
        <p className="text-white/30 text-sm mt-2 max-w-lg mx-auto">
          En AstroVerse protegemos tus datos personales conforme a la <strong className="text-violet-400">Ley 1581 de 2012</strong> de Colombia.
        </p>
      </motion.div>

      {/* Table of Contents */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        variants={staggerItem}
        initial="initial"
        animate="animate"
      >
        <CardGradientTop color="linear-gradient(90deg, #7c3aed, #10b981, transparent)" />
        <div className="p-5 md:p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Contenido</h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-white/50 hover:text-white hover:bg-white/[0.04] transition-all text-sm"
              >
                <s.icon size={14} className="text-violet-400/60 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-5">
        <Section id="recopilacion" number="1" title="Información que Recopilamos">
          <p>Para proporcionarte una experiencia educativa segura y personalizada, AstroVerse recopila los siguientes tipos de información:</p>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Datos de registro', desc: 'Nombre, correo electrónico, fecha de nacimiento y país de residencia.' },
              { label: 'Datos de uso', desc: 'Páginas visitadas, contenido interactivo consumido, tiempo en plataforma, misiones completadas y puntuaciones.' },
              { label: 'Datos técnicos', desc: 'Dirección IP, tipo de dispositivo, navegador, sistema operativo y resolución de pantalla.' },
              { label: 'Datos de pago', desc: 'Información procesada directamente por nuestra pasarela de pago segura. AstroVerse no almacena datos de tarjetas.' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <span className="text-violet-400/60 mt-0.5 shrink-0">•</span>
                <div>
                  <span className="text-white/60 font-medium">{item.label}:</span>{' '}
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="uso" number="2" title="Cómo Usamos tu Información">
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-none space-y-1.5 mt-2">
            {['Proporcionar, operar y mantener la plataforma educativa', 'Personalizar contenido y recomendaciones de aprendizaje', 'Mejorar y desarrollar nuevas funcionalidades', 'Procesar pagos y gestionar suscripciones', 'Enviar notificaciones relevantes sobre tu progreso y novedades', 'Garantizar la seguridad e integridad de la plataforma', 'Cumplir con obligaciones legales vigentes en Colombia'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-white/40 text-sm">
                <span className="text-violet-400/60 mt-1 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cookies" number="3" title="Cookies">
          <p>AstroVerse utiliza cookies y tecnologías similares para mejorar tu experiencia. Las categorías incluyen:</p>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Esenciales', desc: 'Necesarias para el funcionamiento básico de la plataforma (autenticación, preferencias).' },
              { label: 'Analíticas', desc: 'Nos ayudan a comprender cómo los usuarios interactúan con la plataforma para mejorarla.' },
              { label: 'Preferencias', desc: 'Recuerdan tu idioma, tema visual y configuraciones personalizadas.' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <span className="text-amber-400/60 mt-0.5 shrink-0">•</span>
                <div>
                  <span className="text-white/60 font-medium">{item.label}:</span>{' '}
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2">Puedes gestionar tus preferencias de cookies en la configuración de tu navegador.</p>
        </Section>

        <Section id="compartir" number="4" title="Compartir Información">
          <p>AstroVerse <strong className="text-white/70">no vende, alquila ni comercializa</strong> tu información personal con terceros. Solo compartimos datos en los siguientes casos:</p>
          <ul className="list-none space-y-1.5 mt-2">
            {['Proveedores de servicios técnicos (alojamiento, pasarelas de pago, análisis)', 'Cuando sea requerido por autoridad judicial o administrativa competente', 'Para proteger los derechos, propiedad o seguridad de AstroVerse y sus usuarios'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-white/40 text-sm">
                <span className="text-violet-400/60 mt-1 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="seguridad" number="5" title="Seguridad de Datos">
          <p>Implementamos medidas técnicas y organizativas para proteger tu información personal, incluyendo cifrado de datos en tránsito (SSL/TLS), control de acceso restringido, monitoreo continuo y copias de seguridad periódicas.</p>
          <p>A pesar de nuestros esfuerzos, ningún sistema es completamente invulnerable. Notificaremos a los usuarios afectados de cualquier incidente de seguridad conforme a la legislación colombiana aplicable.</p>
        </Section>

        <Section id="derechos" number="6" title="Derechos del Usuario">
          <p>De acuerdo con la <strong className="text-emerald-400">Ley 1581 de 2012</strong> de la República de Colombia y el Decreto 1377 de 2013, tienes derecho a:</p>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Acceso', desc: 'Solicitar información sobre los datos personales que tenemos sobre ti.' },
              { label: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
              { label: 'Cancelación', desc: 'Solicitar la eliminación de tus datos personales.' },
              { label: 'Oposición', desc: 'Oponerte al tratamiento de tus datos para fines específicos.' },
              { label: 'Revocatoria', desc: 'Revocar el consentimiento otorgado para el tratamiento de tus datos.' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <span className="text-emerald-400/60 mt-0.5 shrink-0">•</span>
                <div>
                  <span className="text-white/60 font-medium">{item.label}:</span>{' '}
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2">Para ejercer estos derechos, envía una solicitud a <span className="text-cyan-400">contacto@astroverse.com</span>.</p>
        </Section>

        <Section id="retencion" number="7" title="Retención de Datos">
          <p>Conservaremos tu información personal durante el tiempo necesario para cumplir con las finalidades descritas en esta política y las obligaciones legales vigentes en Colombia.</p>
          <p>Si solicitas la eliminación de tu cuenta, procederemos a suprimir tus datos personales en un plazo máximo de 15 días hábiles, salvo que exista una obligación legal de conservar cierta información.</p>
        </Section>

        <Section id="menores" number="8" title="Menores de Edad">
          <p>AstroVerse es una plataforma educativa diseñada para estudiantes. Sin embargo, los menores de 13 años requieren el consentimiento expreso de sus padres o tutores legales para crear una cuenta y utilizar la plataforma.</p>
          <p>Los padres o tutores pueden contactarnos para solicitar el acceso, rectificación o eliminación de los datos personales de sus hijos en cualquier momento.</p>
        </Section>

        <Section id="cambios" number="9" title="Cambios a esta Política">
          <p>AstroVerse se reserva el derecho de actualizar esta Política de Privacidad periódicamente. Los cambios significativos serán comunicados a través de correo electrónico o aviso visible en la plataforma.</p>
          <p>Te recomendamos revisar esta política regularmente. El uso continuado de la plataforma después de la publicación de cambios implica la aceptación de la política actualizada.</p>
        </Section>

        <Section id="contacto" number="10" title="Contacto">
          <p>Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de tus datos personales, puedes contactarnos a través de:</p>
          <div className="rounded-xl p-4 mt-3" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <div className="flex items-center gap-2.5">
              <Mail size={18} className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm">contacto@astroverse.com</span>
            </div>
            <p className="text-white/30 text-xs mt-2">Tiempo de respuesta estimado: 3-5 días hábiles</p>
          </div>
          <p className="mt-2">Nuestro equipo de protección de datos está disponible para atenderte y garantizar el ejercicio de tus derechos como titular de datos.</p>
        </Section>
      </div>

      {/* Footer */}
      <motion.div
        className="rounded-xl p-4 text-center"
        style={{ background: 'rgba(124,58,237,0.03)', border: '1px solid rgba(124,58,237,0.08)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-white/25 text-xs">© 2025 AstroVerse · Protegido bajo la Ley 1581 de 2012 · República de Colombia</p>
      </motion.div>
    </div>
  )
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      className="rounded-2xl relative overflow-hidden scroll-mt-6"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <CardGradientTop color="linear-gradient(90deg, #7c3aed, #10b981, transparent)" />
      <div className="p-5 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2.5">
          <span className="text-violet-400 text-sm font-mono opacity-60">{number}.</span>
          {title}
        </h2>
        <div className="space-y-2.5 text-white/45 text-sm leading-relaxed">{children}</div>
      </div>
    </motion.section>
  )
}
