// Tiny dependency-free confetti burst on a temporary full-screen canvas.
const COLORS = ["#f84901", "#ffd6a8", "#0a0a0a", "#ffffff", "#c2410c"]

export function confetti(origin?: { x: number; y: number }) {
  if (typeof window === "undefined") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const canvas = document.createElement("canvas")
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "100",
  })
  document.body.appendChild(canvas)
  const ctx = canvas.getContext("2d")!
  ctx.scale(dpr, dpr)

  const ox = origin?.x ?? window.innerWidth / 2
  const oy = origin?.y ?? window.innerHeight / 2
  const parts = Array.from({ length: 90 }, () => {
    const a = Math.random() * Math.PI * 2
    const v = 6 + Math.random() * 10
    return {
      x: ox,
      y: oy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 7,
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.3,
    }
  })

  const start = performance.now()
  function frame(now: number) {
    const t = now - start
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (const p of parts) {
      p.vy += 0.32
      p.vx *= 0.985
      p.x += p.vx
      p.y += p.vy
      p.r += p.vr
      ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - t / 2600)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.c
      if (p.round) {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    if (t < 2600) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}
