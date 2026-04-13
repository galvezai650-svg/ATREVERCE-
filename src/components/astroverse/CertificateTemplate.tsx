'use client'

import React from 'react'

// ─── Types ───────────────────────────────────────────────────
interface CertificateTemplateProps {
  studentName: string
  courseName: string
  courseDescription: string
  certificateId: string
  issueDate: string
  certDbId: string
}

// ─── NASA Meatball SVG ──────────────────────────────────────
const NASA_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 48 48">
  <path fill="#2a2f96" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
  <path fill="#e53935" d="M4.597,30H3c0,0,4.077-3.084,12.928-5.535c0,0,14.202-4.313,23.428-10.583C42.565,11.177,45.071,8.764,46 7c0,0-1.193,4.725-6.726,10.351C38.191,17.906,37.768,18.64,37,19c0.126-0.142-0.096-0.871,0-1c0,0-7.195,3.355-22.02,7.77C14.981,25.768,8.742,27.352,4.597,30z"/>
  <path fill="#fafafa" d="M19.282 25.221l1.503.025-.771-1.835L19.282 25.221zM18.969 26.366l-.274.96.802.441-2.661-.004.826-.463 1.714-5.602-.935-.467h3.167l2.639 6.068.528.467H21.08l.528-.467-.528-.934H18.969zM29.12 23.374c.576.135 2.526 1.143 1.848 3.129 0 0-.841 2.476-5.435.998L25.021 28v-1.995l.512.499c0 0 3.492 1.321 3.474-.316-.005-.319-.603-.845-2.205-1.048 0 0-1.802-.053-1.781-2.128.008-.843.626-2.964 5.121-1.497l.464-.518-.011 1.963-.453-.448c0 0-2.661-.834-2.926-.008C26.934 23.381 28.316 23.185 29.12 23.374z"/>
  <path fill="#e53935" d="M39.461,17.149c-1.06,1.224-3.203,2.847-4.899,4.11c0,0-13.626,8.805-19.033,12.769c0,0-4.167,2.72-6.529,6.972v-1.618c0,0,2.255-3.163,7.585-6.937C21.273,29.125,35.281,20.744,37,18L39.461,17.149z"/>
  <path fill="#fafafa" d="M8.667 21.257L11.834 21.257 14.473 25.459 14.473 21.724 13.945 21.257 16.056 21.257 15.528 21.724 15.528 27.326 16.056 27.793 12.889 27.793 10.251 23.592 10.251 27.326 10.778 27.793 8.667 27.793 9.195 27.326 9.195 21.724zM34.44 25.275l1.62-.007-.87-1.919L34.44 25.275zM34.275 26.366l-.33.934.858.467-2.661-.004.826-.463 1.714-5.602-.935-.467h3.167l2.639 6.068.528.467h-3.694l.528-.467-.528-.934H34.275z"/>
  <path fill="#fafafa" d="M33.596,30.256c-0.743-2.933-2.427-6.293-4.742-9.462c-4.81-6.582-10.901-10.274-13.578-8.232c-1.316,1.006-1.627,3.2-0.871,6.181c0.743,2.933,2.427,6.293,4.742,9.462c1.008,1.379,1.618,2.143,2.695,3.243l0.68,0.255c-1.064-1.09-2.119-2.324-3.119-3.693c-2.291-3.135-3.957-6.455-4.689-9.348c-0.72-2.844-0.453-4.918,0.753-5.839c0.459-0.351,1.029-0.518,1.681-0.518c2.95,0,7.598,3.412,11.451,8.684c2.291,3.135,3.957,6.455,4.689,9.348c0.72,2.844,0.453,4.918-0.753,5.839c-1.617,1.235-4.605,0.181-7.779-2.414l-0.22,0.225C26.889,35.903,29.162,37,30.9,37c0.708,0,1.326-0.181,1.825-0.564C34.041,35.433,34.35,33.237,33.596,30.256z"/>
  <path fill="#fafafa" d="M22.158 30.091A0.435 1.058 0 1 0 22.158 32.207A0.435 1.058 0 1 0 22.158 30.091Z" transform="rotate(-43.348 22.157 31.15)"/>
  <path fill="#fafafa" d="M27.5 7.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23L28.02 9.731c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L27.5 7.389zM18.5 14.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L18.5 14.389zM19.5 35.389l.231 1.591c.011.073.044.14.097.193.053.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14.044-.193.097-.052.052-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.053-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.052.087-.12.097-.193L19.5 35.389zM38.5 28.389l.231 1.591c.011.073.044.14.097.193.052.052.12.087.193.097l1.59.23-1.591.231c-.073.011-.14-.044-.193-.097-.052-.053-.087.12-.097.193l-.23 1.59-.231-1.591c-.011-.073-.044-.14-.097-.193-.052-.052-.12-.087-.193-.097l-1.59-.23 1.591-.231c.073-.011.14-.044.193-.097.052-.053-.087.12-.097.193L38.5 28.389zM36.5 33A.5.5 0 1 0 36.5 34 .5.5 0 1 0 36.5 33zM12.5 32A.5.5 0 1 0 12.5 33 .5.5 0 1 0 12.5 32zM9.5 30A.5.5 0 1 0 9.5 31 .5.5 0 1 0 9.5 30zM24.5 11A.5.5 0 1 0 24.5 12 .5.5 0 1 0 24.5 11zM20.5 18A.5.5 0 1 0 20.5 19 .5.5 0 1 0 20.5 18z"/>
</svg>`

// ─── Corner ornament SVG data URIs ──────────────────────────
// Top-left corner ornament
const CORNER_TL = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M0 0 L20 0 L20 3 L3 3 L3 20 L0 20 Z" fill="#d4a537"/>
  <path d="M5 5 L15 5 L15 7 L7 7 L7 15 L5 15 Z" fill="#f5c542"/>
  <circle cx="2" cy="2" r="2" fill="#f5c542"/>
</svg>`

const CORNER_TR = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M60 0 L40 0 L40 3 L57 3 L57 20 L60 20 Z" fill="#d4a537"/>
  <path d="M55 5 L45 5 L45 7 L53 7 L53 15 L55 15 Z" fill="#f5c542"/>
  <circle cx="58" cy="2" r="2" fill="#f5c542"/>
</svg>`

const CORNER_BL = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M0 60 L20 60 L20 57 L3 57 L3 40 L0 40 Z" fill="#d4a537"/>
  <path d="M5 55 L15 55 L15 53 L7 53 L7 45 L5 45 Z" fill="#f5c542"/>
  <circle cx="2" cy="58" r="2" fill="#f5c542"/>
</svg>`

const CORNER_BR = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M60 60 L40 60 L40 57 L57 57 L57 40 L60 40 Z" fill="#d4a537"/>
  <path d="M55 55 L45 55 L45 53 L53 53 L53 45 L55 45 Z" fill="#f5c542"/>
  <circle cx="58" cy="58" r="2" fill="#f5c542"/>
</svg>`

// ─── Star dots for background ──────────────────────────────
function generateStarDots() {
  const dots: { left: string; top: string; size: number; opacity: number }[] = []
  for (let i = 0; i < 50; i++) {
    dots.push({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    })
  }
  return dots
}

const starDots = generateStarDots()

// ─── Certificate Template Component ────────────────────────
export default function CertificateTemplate({
  studentName,
  courseName,
  courseDescription,
  certificateId,
  issueDate,
  certDbId,
}: CertificateTemplateProps) {
  return (
    <div
      id={`certificate-${certDbId}`}
      data-course-name={courseName}
      style={{
        position: 'relative',
        width: '1122px',
        minHeight: '794px',
        backgroundColor: '#0a0e27',
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── Background star dots ─── */}
      {starDots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: dot.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ─── Outer gold border ─── */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          bottom: '12px',
          border: '3px solid #d4a537',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />

      {/* ─── Inner gold border ─── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '1px solid #b8860b',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      />

      {/* ─── Decorative corner ornaments ─── */}
      <div style={{ position: 'absolute', top: '6px', left: '6px', width: '60px', height: '60px' }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(CORNER_TL)}`} width="60" height="60" alt="" />
      </div>
      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '60px', height: '60px' }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(CORNER_TR)}`} width="60" height="60" alt="" />
      </div>
      <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '60px', height: '60px' }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(CORNER_BL)}`} width="60" height="60" alt="" />
      </div>
      <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '60px', height: '60px' }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(CORNER_BR)}`} width="60" height="60" alt="" />
      </div>

      {/* ─── Gold horizontal decorative line under corners ─── */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '85px',
          right: '85px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #d4a537, #f5c542, #d4a537, transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '85px',
          right: '85px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #d4a537, #f5c542, #d4a537, transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '48px 72px 40px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '794px',
        }}
      >
        {/* ─── Top: NASA Logo + ASTROVERSE ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <img
            src={`data:image/svg+xml,${encodeURIComponent(NASA_LOGO_SVG)}`}
            width="60"
            height="60"
            alt="NASA Logo"
            style={{ flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '8px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ASTROVERSE
          </span>
        </div>

        {/* ─── Decorative gold divider ─── */}
        <div
          style={{
            width: '300px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #b8860b, #f5c542, #b8860b, transparent)',
            marginBottom: '24px',
          }}
        />

        {/* ─── Title: CERTIFICADO DE COMPLETACIÓN ─── */}
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#f5c542',
            letterSpacing: '4px',
            textAlign: 'center',
            margin: '0 0 12px 0',
            textShadow: '0 0 20px rgba(212, 165, 55, 0.3)',
          }}
        >
          CERTIFICADO DE COMPLETACIÓN
        </h1>

        {/* ─── Worldwide Endorsement ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🌐</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#00d4ff',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Avalado a Nivel Mundial
          </span>
          <span style={{ color: '#f5c542', fontSize: '12px' }}>★</span>
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#ffffff80',
            letterSpacing: '1px',
            marginBottom: '28px',
          }}
        >
          Reconocimiento Internacional
        </div>

        {/* ─── Second decorative divider ─── */}
        <div
          style={{
            width: '500px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #d4a53740, #d4a537, #d4a53740, transparent)',
            marginBottom: '32px',
          }}
        />

        {/* ─── "Este certificado es otorgado a:" ─── */}
        <p
          style={{
            fontSize: '14px',
            color: '#ffffff99',
            textAlign: 'center',
            margin: '0 0 8px 0',
            letterSpacing: '1px',
          }}
        >
          Este certificado es otorgado a:
        </p>

        {/* ─── Student Name ─── */}
        <h2
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '36px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            margin: '0 0 8px 0',
            padding: '0 20px',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
          }}
        >
          {studentName}
        </h2>

        {/* ─── Gold underline under name ─── */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4a537, transparent)',
            marginBottom: '24px',
          }}
        />

        {/* ─── "Por la exitosa finalización del curso:" ─── */}
        <p
          style={{
            fontSize: '14px',
            color: '#ffffff99',
            textAlign: 'center',
            margin: '0 0 8px 0',
            letterSpacing: '1px',
          }}
        >
          Por la exitosa finalización del curso:
        </p>

        {/* ─── Course Name ─── */}
        <h3
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '26px',
            fontWeight: 700,
            color: '#f5c542',
            textAlign: 'center',
            margin: '0 0 12px 0',
            textShadow: '0 0 15px rgba(245, 197, 66, 0.3)',
          }}
        >
          {courseName}
        </h3>

        {/* ─── Course Description ─── */}
        <p
          style={{
            fontSize: '12px',
            color: '#ffffff70',
            textAlign: 'center',
            margin: '0 0 24px 0',
            maxWidth: '600px',
            lineHeight: '1.6',
          }}
        >
          {courseDescription}
        </p>

        {/* ─── Certificate ID + Date ─── */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
            marginBottom: '36px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#ffffff50', letterSpacing: '1px', marginBottom: '2px' }}>CERTIFICADO ID</div>
            <div
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                color: '#d4a537',
                letterSpacing: '1px',
              }}
            >
              {certificateId}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#ffffff20' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#ffffff50', letterSpacing: '1px', marginBottom: '2px' }}>FECHA DE EMISIÓN</div>
            <div style={{ fontSize: '11px', color: '#ffffff99' }}>{issueDate}</div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BOTTOM SECTION
            ═══════════════════════════════════════════════════ */}
        <div
          style={{
            width: '100%',
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '16px',
          }}
        >
          {/* ─── Bottom Left: OKS LABS ─── */}
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}
            >
              OKS LABS
            </div>
            <div
              style={{
                width: '160px',
                borderTop: '1px solid #d4a537',
                margin: '0 auto 6px auto',
              }}
            />
            <div
              style={{
                fontSize: '10px',
                color: '#ffffff99',
                lineHeight: '1.4',
              }}
            >
              Oscar David Marulanda Galvez
            </div>
            <div
              style={{
                fontSize: '9px',
                color: '#ffffff60',
                letterSpacing: '1px',
              }}
            >
              Director
            </div>
          </div>

          {/* ─── Bottom Center: ASTROVERSE ─── */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '6px',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ASTROVERSE
            </span>
          </div>

          {/* ─── Bottom Right: NASA DATA ─── */}
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '6px',
              }}
            >
              <img
                src={`data:image/svg+xml,${encodeURIComponent(NASA_LOGO_SVG)}`}
                width="20"
                height="20"
                alt="NASA"
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#00d4ff',
                  letterSpacing: '2px',
                }}
              >
                NASA DATA
              </span>
            </div>
            <div
              style={{
                width: '160px',
                borderTop: '1px solid #00d4ff',
                margin: '0 auto 6px auto',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                fontSize: '9px',
                color: '#ffffff70',
                lineHeight: '1.4',
                maxWidth: '180px',
              }}
            >
              Contenido basado en datos oficiales de la NASA
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
