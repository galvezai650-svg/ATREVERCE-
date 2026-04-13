'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Scale, FileText, Calendar, CreditCard, ShieldCheck, AlertTriangle, Gavel, RefreshCw } from 'lucide-react'
import { cardBase, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

const sections = [
  { id: 'aceptacion', title: '1. Aceptación de Términos', icon: Scale },
  { id: 'servicio', title: '2. Descripción del Servicio', icon: FileText },
  { id: 'cuentas', title: '3. Cuentas de Usuario', icon: Scale },
  { id: 'suscripcion', title: '4. Planes de Suscripción', icon: CreditCard },
  { id: 'pagos', title: '5. Pagos y Reembolsos', icon: RefreshCw },
  { id: 'propiedad', title: '6. Propiedad Intelectual', icon: ShieldCheck },
  { id: 'conducta', title: '7. Conducta del Usuario', icon: AlertTriangle },
  { id: 'responsabilidad', title: '8. Limitación de Responsabilidad', icon: AlertTriangle },
  { id: 'modificaciones', title: '9. Modificaciones', icon: RefreshCw },
  { id: 'ley', title: '10. Ley Aplicable', icon: Gavel },
]

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function TerminosPage() {
  return (
    <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-1 space-y-6 max-w-4xl mx-auto">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
        <motion.div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 0 40px rgba(0,212,255,0.15)',
          }}
        >
          <Gavel size={30} className="text-cyan-400" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Términos y Condiciones</h1>
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <Calendar size={14} />
          <span>Última actualización: 15 de enero de 2025</span>
        </div>
      </motion.div>

      {/* Table of Contents */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={cardBase}
        variants={staggerItem}
        initial="initial"
        animate="animate"
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
        <div className="p-5 md:p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Contenido</h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-white/50 hover:text-white hover:bg-white/[0.04] transition-all text-sm"
              >
                <s.icon size={14} className="text-cyan-400/60 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-5">
        <Section id="aceptacion" number="1" title="Aceptación de Términos">
          <p>Al acceder y utilizar la plataforma educativa <strong className="text-cyan-400">AstroVerse</strong>, usted acepta quedar vinculado legalmente por los presentes Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice la plataforma.</p>
          <p>Estos términos constituyen un acuerdo vinculante entre usted («el Usuario») y AstroVerse, una plataforma de tecnología educativa con domicilio en Colombia.</p>
        </Section>

        <Section id="servicio" number="2" title="Descripción del Servicio">
          <p>AstroVerse es una plataforma educativa enfocada en la divulgación científica y astronómica. Ofrece contenido interactivo, simuladores espaciales, enciclopedia del espacio, misiones diarias, juegos educativos y un asistente de inteligencia artificial para consultas sobre astronomía y ciencias.</p>
          <p>El servicio está diseñado con fines educativos e informativos. AstroVerse se reserva el derecho de modificar, suspender o descontinuar cualquier funcionalidad del servicio en cualquier momento sin previo aviso.</p>
        </Section>

        <Section id="cuentas" number="3" title="Cuentas de Usuario">
          <p>Para acceder a ciertas funcionalidades, el Usuario debe crear una cuenta proporcionando información veraz y completa. El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda actividad realizada bajo su cuenta.</p>
          <p>El Usuario se compromete a notificar de inmediato a AstroVerse sobre cualquier uso no autorizado de su cuenta. AstroVerse no se hace responsable por los daños derivados del incumplimiento de esta obligación.</p>
        </Section>

        <Section id="suscripcion" number="4" title="Planes de Suscripción">
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <p className="text-emerald-400 font-semibold text-sm mb-1">Plan Gratuito</p>
              <p className="text-white/40 text-sm">Acceso completo a contenido educativo básico, enciclopedia espacial, misiones diarias y la comunidad. Sin costo alguno.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <p className="text-violet-400 font-semibold text-sm mb-1">Plan PRO — USD $4.99/mes</p>
              <p className="text-white/40 text-sm">Incluye todo del plan gratuito más: simuladores avanzados, asistente IA ilimitado, certificados de logro, acceso anticipado a nuevo contenido, insignias exclusivas y sin publicidad.</p>
            </div>
          </div>
        </Section>

        <Section id="pagos" number="5" title="Pagos y Reembolsos">
          <p>Los pagos del plan PRO se procesan a través de plataformas de pago seguras autorizadas. El cobro se realiza de forma mensual de manera automática hasta que el Usuario cancele su suscripción.</p>
          <p>El Usuario puede cancelar su suscripción en cualquier momento desde su perfil. La cancelación surtirá efecto al finalizar el período de facturación vigente. No se otorgan reembolsos parciales por períodos ya facturados, salvo en casos excepcionales a criterio de AstroVerse.</p>
        </Section>

        <Section id="propiedad" number="6" title="Propiedad Intelectual">
          <p>Todo el contenido de AstroVerse, incluyendo pero no limitado a textos, imágenes, gráficos, logotipos, iconos, simuladores, código fuente, diseño y software, es propiedad de AstroVerse o de sus licenciantes y está protegido por las leyes de propiedad intelectual colombianas e internacionales.</p>
          <p>Queda prohibida la reproducción, distribución, modificación o uso comercial del contenido sin autorización expresa y por escrito de AstroVerse.</p>
        </Section>

        <Section id="conducta" number="7" title="Conducta del Usuario">
          <p>El Usuario se compromete a utilizar la plataforma de manera ética y respetuosa. Queda expresamente prohibido:</p>
          <ul className="list-none space-y-1.5 mt-2">
            {['Publicar contenido ofensivo, discriminatorio o ilegal', 'Intentar acceder a cuentas ajenas o vulnerar la seguridad del sistema', 'Distribuir spam, malware o enlaces maliciosos', 'Suplantar la identidad de otros usuarios o entidades', 'Utilizar la plataforma para fines comerciales no autorizados'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-white/40 text-sm">
                <span className="text-cyan-400/60 mt-1 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">El incumplimiento de estas normas puede resultar en la suspensión o cancelación permanente de la cuenta.</p>
        </Section>

        <Section id="responsabilidad" number="8" title="Limitación de Responsabilidad">
          <p>AstroVerse proporciona el servicio «tal cual» y «según disponibilidad». No garantiza que el servicio será ininterrumpido, libre de errores o completamente seguro.</p>
          <p>En ningún caso AstroVerse será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso de la plataforma, incluyendo pérdidas de datos, ganancias o oportunidades.</p>
        </Section>

        <Section id="modificaciones" number="9" title="Modificaciones">
          <p>AstroVerse se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en la plataforma.</p>
          <p>Se notificará a los Usuarios sobre cambios significativos a través de correo electrónico o aviso visible en la plataforma. El uso continuado del servicio después de la publicación de cambios constituye la aceptación de los nuevos términos.</p>
        </Section>

        <Section id="ley" number="10" title="Ley Aplicable">
          <p>Los presentes Términos y Condiciones se rigen por las leyes de la <strong className="text-white/70">República de Colombia</strong>. Cualquier controversia derivada del uso de la plataforma se someterá a la jurisdicción de los tribunales competentes en Colombia.</p>
          <p>Para consultas sobre estos términos, puede contactarnos en <span className="text-cyan-400">contacto@astroverse.com</span>.</p>
        </Section>
      </div>

      {/* Footer */}
      <motion.div
        className="rounded-xl p-4 text-center"
        style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-white/25 text-xs">© 2025 AstroVerse. Todos los derechos reservados. Plataforma educativa colombiana.</p>
      </motion.div>
    </div>
  )
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      className="rounded-2xl relative overflow-hidden scroll-mt-6"
      style={{ ...cardBase, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />
      <div className="p-5 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2.5">
          <span className="text-cyan-400 text-sm font-mono opacity-60">{number}.</span>
          {title}
        </h2>
        <div className="space-y-2.5 text-white/45 text-sm leading-relaxed">{children}</div>
      </div>
    </motion.section>
  )
}
