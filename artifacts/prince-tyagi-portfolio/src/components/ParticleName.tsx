import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  tx: number; ty: number; z: number; g: number; ph: number; ambient: boolean;
}

const COLORS = ['#1d4ed8', '#2563eb', '#4f46e5', '#0284c7', '#7c3aed'];
const FONT_STACK = '"Space Grotesk", "Manrope", Arial, sans-serif';

/**
 * Canvas particle field that assembles into a word (default "PRINCE").
 * - Pointer repels nearby particles and shifts layers for parallax depth.
 * - Pauses when off-screen / tab hidden; renders a single static frame for reduced motion.
 * - Fewer particles on small screens; capped device-pixel-ratio.
 */
export function ParticleName({ text = 'PRINCE' }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, onScreen = true, dead = false, resizeTimer = 0;
    let parts: Particle[] = [];
    let groups: Particle[][] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const look = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(260, Math.floor(rect.width));
      h = Math.max(120, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, w < 520 ? 1.25 : 1.75);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const o = off.getContext('2d', { willReadFrequently: true });
      if (!o) return;
      let fs = Math.min(h * 0.5, 200);
      o.font = `700 ${fs}px ${FONT_STACK}`;
      fs *= Math.min(1, (w * 0.94) / o.measureText(text).width);
      o.font = `700 ${fs}px ${FONT_STACK}`;
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(text, w / 2, h / 2);
      const data = o.getImageData(0, 0, w, h).data;
      const step = w < 400 ? 5 : w < 640 ? 4 : 3;
      const targets: [number, number][] = [];
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step)
          if (data[(y * w + x) * 4 + 3] > 128) targets.push([x, y]);

      const next: Particle[] = [];
      const mk = (tx: number, ty: number, ambient: boolean): Particle => {
        const z = 0.6 + Math.random() * 0.8;
        return {
          x: reduce ? tx : Math.random() * w, y: reduce ? ty : Math.random() * h,
          vx: 0, vy: 0, tx, ty, z, ph: Math.random() * Math.PI * 2, ambient,
          g: Math.floor(Math.random() * COLORS.length) * 2 + (z > 1 ? 1 : 0),
        };
      };
      targets.forEach(([tx, ty]) => next.push(mk(tx, ty, false)));
      const dust = w < 400 ? 18 : w < 640 ? 30 : 70;
      for (let i = 0; i < dust; i++) next.push(mk(Math.random() * w, Math.random() * h, true));
      parts = next;
      groups = Array.from({ length: COLORS.length * 2 }, () => []);
      parts.forEach((p) => groups[p.g].push(p));
      if (reduce) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 140);
        g.addColorStop(0, 'rgba(37,99,235,.14)'); g.addColorStop(1, 'rgba(37,99,235,0)');
        ctx.fillStyle = g; ctx.fillRect(pointer.x - 140, pointer.y - 140, 280, 280);
      }
      for (let gi = 0; gi < groups.length; gi++) {
        ctx.fillStyle = COLORS[gi >> 1];
        ctx.globalAlpha = gi & 1 ? 0.95 : 0.5;
        const list = groups[gi];
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          const s = (p.ambient ? 1.2 : 1.5) * p.z + 0.4;
          const ox = look.x * (p.z - 1) * 22, oy = look.y * (p.z - 1) * 22;
          ctx.fillRect(p.x + ox - s / 2, p.y + oy - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      void t;
    };

    const tick = (t: number) => {
      if (dead) return;
      const R = w < 520 ? 80 : 115;
      look.x += (look.tx - look.x) * 0.06; look.y += (look.ty - look.y) * 0.06;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const wob = p.ambient ? 14 : 0.7;
        let ax = (p.tx + Math.sin(t * 0.0009 + p.ph) * wob - p.x) * (p.ambient ? 0.006 : 0.055);
        let ay = (p.ty + Math.cos(t * 0.0011 + p.ph) * wob - p.y) * (p.ambient ? 0.006 : 0.055);
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / R) ** 2 * 2.6;
            ax += (dx / d) * f; ay += (dy / d) * f;
          }
        }
        p.vx = (p.vx + ax) * 0.84; p.vy = (p.vy + ay) * 0.84;
        p.x += p.vx; p.y += p.vy;
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!reduce && !raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onWindowMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      look.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? start() : stop();
    });
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    });

    const init = () => { if (dead) return; build(); start(); };
    (document.fonts?.load(`700 100px ${FONT_STACK}`) ?? Promise.resolve()).then(init, init);

    io.observe(wrap); ro.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('pointercancel', onLeave);
    if (!reduce) window.addEventListener('pointermove', onWindowMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      dead = true; stop(); io.disconnect(); ro.disconnect();
      window.clearTimeout(resizeTimer);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('pointermove', onWindowMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [text]);

  return (
    <div
      ref={wrapRef}
      className="particle-hero"
      role="img"
      aria-label={`Interactive particle animation spelling ${text}. Move the pointer over it to disturb the particles.`}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="particle-caption" aria-hidden="true">Interactive particles · move pointer to explore</span>
    </div>
  );
}
