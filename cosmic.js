(() => {
  const canvas = document.getElementById('cosmic-hero');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, nodes = [], meteors = [], frame = 0, last = 0, dpr = 1;
  const random = (min, max) => min + Math.random() * (max - min);
  const makeNode = (initial = false) => ({
    x: initial ? random(0, width) : random(-90, 0),
    y: random(0, height),
    vx: random(130, 290), vy: random(-75, 70),
    radius: random(.7, 2.3), phase: random(0, Math.PI * 2),
    blue: Math.random() > .2
  });
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = Array.from({ length: width < 700 ? 74 : 138 }, () => makeNode(true));
    meteors = [];
    draw(0, false);
  }
  function draw(time, advance) {
    ctx.clearRect(0, 0, width, height);
    const dt = Math.min((time - last) / 1000 || 0, .05);
    last = time;
    if (advance) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]; n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x > width + 60 || n.y < -40 || n.y > height + 40) nodes[i] = makeNode();
      }
      if (++frame % (width < 700 ? 36 : 20) === 0) {
        meteors.push({ x: random(-width * .2, width * .7), y: random(-50, height * .75), vx: random(850, 1450), vy: random(270, 650), life: 1 });
      }
    }
    const reach = width < 700 ? 120 : 170;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > reach * reach) continue;
        const strength = (1 - Math.sqrt(dist2) / reach) * .48;
        ctx.strokeStyle = `rgba(250,213,149,${strength})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (i % 5 === 0 && j % 4 === 0) {
          const travel = (time * .0011 + i * .17 + j * .09) % 1;
          ctx.fillStyle = `rgba(255,236,188,${strength * 2.2})`;
          ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * travel, a.y + (b.y - a.y) * travel, 1.7, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    for (const n of nodes) {
      const pulse = .7 + .3 * Math.sin(time * .003 + n.phase);
      ctx.shadowBlur = 13; ctx.shadowColor = n.blue ? '#f6d9a4' : '#ff7770';
      ctx.fillStyle = n.blue ? `rgba(255,245,220,${pulse})` : `rgba(255,153,126,${pulse})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (advance) { m.x += m.vx * dt; m.y += m.vy * dt; m.life -= dt * 1.12; }
      if (m.life <= 0 || m.x > width + 260) { meteors.splice(i, 1); continue; }
      const tail = Math.min(230, m.vx * .25);
      const gradient = ctx.createLinearGradient(m.x, m.y, m.x - tail, m.y - tail * m.vy / m.vx);
      gradient.addColorStop(0, `rgba(255,255,255,${m.life})`);
      gradient.addColorStop(.24, `rgba(255,202,139,${m.life * .8})`);
      gradient.addColorStop(1, 'rgba(255,202,139,0)');
      ctx.strokeStyle = gradient; ctx.lineWidth = 3.1; ctx.beginPath();
      ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - tail, m.y - tail * m.vy / m.vx); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${m.life})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  function animate(time) { draw(time, true); if (!reduceMotion.matches) requestAnimationFrame(animate); }
  window.addEventListener('resize', resize, { passive: true });
  reduceMotion.addEventListener('change', () => { resize(); if (!reduceMotion.matches) requestAnimationFrame(animate); });
  resize();
  if (!reduceMotion.matches) requestAnimationFrame(animate);
})();
