import { useState, useEffect, useRef, useCallback } from 'react'

const EMOJIS = ['🌸', '🌺', '💕', '🌷', '✨', '💫', '🌹', '💗', '🍀', '🌼']

interface Petal {
  id: number
  emoji: string
  left: string
  fontSize: string
  duration: number
}

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false)
  const [petals, setPetals] = useState<Petal[]>([])
  const petalIdRef = useRef(0)

  const spawnPetal = useCallback(() => {
    const id = petalIdRef.current++
    const petal: Petal = {
      id,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100 + 'vw',
      fontSize: (14 + Math.random() * 20) + 'px',
      duration: 6 + Math.random() * 8,
    }
    setPetals((prev) => [...prev, petal])
    setTimeout(() => {
      setPetals((prev) => prev.filter((p) => p.id !== id))
    }, petal.duration * 1000)
  }, [])

  useEffect(() => {
    // Initial burst
    const burstTimers: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i < 18; i++) {
      burstTimers.push(setTimeout(spawnPetal, i * 200))
    }
    // Continuous rain
    const interval = setInterval(spawnPetal, 700)

    // Auto-dismiss
    const fadeTimer = setTimeout(() => setFadeOut(true), 3500)
    const doneTimer = setTimeout(onDone, 4000)

    return () => {
      burstTimers.forEach(clearTimeout)
      clearInterval(interval)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone, spawnPetal])

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        @keyframes splash-bgShift {
          0% { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(15deg) brightness(1.05); }
        }
        @keyframes splash-fall {
          0%   { transform: translateY(-80px) rotate(0deg) scale(0.8); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg) scale(1.1); opacity: 0; }
        }
        @keyframes splash-cardReveal {
          0%  { opacity: 0; transform: translateY(40px) scale(0.9); }
          100%{ opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splash-ringPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.9; transform: translate(-50%,-50%) scale(1.04); }
        }
        @keyframes splash-heartbeat {
          0%, 100% { transform: scale(1); }
          15%       { transform: scale(1.18); }
          30%       { transform: scale(1); }
          45%       { transform: scale(1.12); }
          60%       { transform: scale(1); }
        }
        @keyframes splash-fadeUp {
          0%  { opacity: 0; transform: translateY(20px); }
          100%{ opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-floatSlow {
          0%, 100% { transform: translateY(0) rotate(-5deg); opacity: 0.06; }
          50%       { transform: translateY(-12px) rotate(5deg); opacity: 0.12; }
        }
      `}</style>

      {/* Animated gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, #ffd6e0 0%, transparent 60%),
            radial-gradient(ellipse 70% 70% at 80% 80%, #ffe0b2 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 50% 50%, #fff0f5 0%, transparent 70%),
            #fff8f0
          `,
          animation: 'splash-bgShift 8s ease-in-out infinite alternate',
        }}
      />

      {/* Corner flourishes */}
      {[
        { top: '4%', left: '4%', delay: '0s', transform: undefined },
        { top: '4%', right: '4%', delay: '1s', transform: 'scaleX(-1)' },
        { bottom: '4%', left: '4%', delay: '2s', transform: 'scaleY(-1)' },
        { bottom: '4%', right: '4%', delay: '3s', transform: 'scale(-1)' },
      ].map((pos, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-[2]"
          style={{
            ...pos,
            fontSize: '60px',
            opacity: 0.06,
            animation: `splash-floatSlow 6s ease-in-out infinite`,
            animationDelay: pos.delay,
          }}
        >
          ❧
        </div>
      ))}

      {/* Floating petals */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute"
            style={{
              top: '-60px',
              left: petal.left,
              fontSize: petal.fontSize,
              opacity: 0,
              animation: `splash-fall ${petal.duration}s linear forwards`,
              filter: 'drop-shadow(0 2px 4px rgba(232,71,106,0.2))',
            }}
          >
            {petal.emoji}
          </div>
        ))}
      </div>

      {/* Center card */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center"
      >
        <div
          className="relative text-center"
          style={{
            padding: '3rem 4rem',
            maxWidth: '600px',
            animation: 'splash-cardReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          {/* Decorative rings */}
          {[320, 440, 560].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: size + 'px',
                height: size + 'px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                border: `1.5px solid ${i === 2 ? 'rgba(245,200,66,0.1)' : 'rgba(232,71,106,0.15)'}`,
                animation: `splash-ringPulse 4s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {/* Heart icon */}
          <span
            className="block mx-auto"
            style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              marginBottom: '1.2rem',
              animation: 'splash-heartbeat 1.4s ease-in-out infinite',
              filter: 'drop-shadow(0 4px 20px rgba(232,71,106,0.5))',
            }}
          >
            💖
          </span>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#2a1220',
              marginBottom: '0.4rem',
              animation: 'splash-fadeUp 1.4s 0.5s both',
            }}
          >
            Hello
            <br />
            <em style={{ fontStyle: 'italic', color: '#e8476a', display: 'block' }}>
              my Love
            </em>
          </h1>
        </div>
      </div>
    </div>
  )
}
