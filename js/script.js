// ── GLITCH TYPEWRITER ──────────────────────────────────────
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&?/\\|[]{}Δ∑Ω∂∇λ';
const LINES = [
  { id: 'titleLine0', text: 'Mateo',     cls: ''       },
  { id: 'titleLine1', text: 'Gajić', cls: 'accent' },
  { id: 'titleLine2', text: 'Sales',   cls: 'stroke' },
];

// scanline flash al cargar
const scan = document.createElement('div');
scan.className = 'scan-line';
document.body.appendChild(scan);
setTimeout(() => scan.remove(), 1400);

function glitchRevealLine(lineEl, text, cls, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      // construir spans vacíos
      lineEl.innerHTML = text.split('').map(() =>
        `<span class="glitch-char ${cls}"> </span>`
      ).join('');
      const spans = lineEl.querySelectorAll('.glitch-char');

      let i = 0;
      function revealNext() {
        if (i >= spans.length) {
          // pequeño glitch slice en el h1 al terminar la última línea
          if (cls === 'stroke') {
            const title = document.getElementById('heroTitle');
            title.classList.add('glitching');
            setTimeout(() => title.classList.remove('glitching'), 450);
          }
          resolve();
          return;
        }
        const span = spans[i];
        const target = text[i];
        let scrambles = 0;
        const maxScrambles = 5 + Math.floor(Math.random() * 7);
        span.classList.add('scrambling');

        const tick = setInterval(() => {
          if (scrambles < maxScrambles) {
            span.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            scrambles++;
          } else {
            clearInterval(tick);
            span.textContent = target;
            span.classList.remove('scrambling');
            i++;
            setTimeout(revealNext, 28 + Math.random() * 30);
          }
        }, 38);
      }
      revealNext();
    }, delay);
  });
}

async function runGlitchIntro() {
  // esperar un frame para que el DOM esté pintado
  await new Promise(r => requestAnimationFrame(r));
  await glitchRevealLine(
    document.getElementById('titleLine0'), LINES[0].text, LINES[0].cls, 300
  );
  await glitchRevealLine(
    document.getElementById('titleLine1'), LINES[1].text, LINES[1].cls, 80
  );
  await glitchRevealLine(
    document.getElementById('titleLine2'), LINES[2].text, LINES[2].cls, 60
  );
}
runGlitchIntro();

// hover re-glitch en el título
document.getElementById('heroTitle').addEventListener('mouseenter', () => {
  LINES.forEach((l, idx) => {
    glitchRevealLine(document.getElementById(l.id), l.text, l.cls, idx * 90);
  });
});
// ──────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '60px';
    ring.style.height = '60px';
    ring.style.marginLeft = '-12px';
    ring.style.marginTop  = '-12px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.marginLeft = '0';
    ring.style.marginTop  = '0';
  });
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => obs.observe(el));
