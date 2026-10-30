/* ==========================================================================
   CUMPLE ALE 35 - APP.JS
   Lógica interactiva: Cuenta regresiva, Mapa Leaflet Yerba Buena,
   Confetti Engine, Sonidos Web Audio, Lightbox y Botones WhatsApp
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMap();
  initConfetti();
  initSound();
  initLightbox();
  initWhatsAppButtons();
});

/* ==========================================================================
   1. CUENTA REGRESIVA (COUNTDOWN TIMER)
   Target: Sábado 14 de Noviembre de 2026 a las 22:00 hs (UTC-3 Argentina)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-11-14T22:00:00-03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const statusEl = document.getElementById('countdown-status-text');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (statusEl) {
        statusEl.innerHTML = '🔥 ¡HOY ES EL CUMPLE! ¡NOS VEMOS EN YERBA BUENA A LAS 22 HS PARA EL DESCONTROL! 🔥';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (statusEl) {
      if (days > 15) {
        statusEl.textContent = `Faltan ${days} días... ¡Andá preparando la bebida y las ganas de bailar! 🧊`;
      } else if (days > 7) {
        statusEl.textContent = `¡Solo ${days} días! Elegí el outfit y prepará la bebida para el sábado 14 🍾`;
      } else if (days > 2) {
        statusEl.textContent = `¡Entramos en la recta final! Cuenta regresiva activada. Cero responsabilidad ♡`;
      } else if (days === 1) {
        statusEl.textContent = `¡MAÑANA! Cargá el mapa y prepará la bebida que a las 22 hs arranca la noche 🚗🍷`;
      } else {
        statusEl.textContent = `¡Faltan horas! ${hours}h ${minutes}m para que arranque el cumpleañito en Yerba Buena 🔥`;
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. MAPA INTERACTIVO (LEAFLET - YERBA BUENA, TUCUMÁN)
   Coordenadas exactas: -26.809209, -65.314655 (Av. Aconquija 2960)
   ========================================================================== */
let mapInstance = null;
const YERBA_BUENA_COORDS = [-26.809209, -65.314655];

function initMap() {
  const mapContainer = document.getElementById('interactive-map');
  if (!mapContainer || typeof L === 'undefined') return;

  try {
    mapInstance = L.map('interactive-map', {
      center: YERBA_BUENA_COORDS,
      zoom: 16,
      scrollWheelZoom: false
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Yerba Buena, Tucumán',
      maxZoom: 19
    }).addTo(mapInstance);

    // Custom Pink Marker Pin
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background: #FF2B85;
          width: 44px;
          height: 44px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 15px rgba(255,43,133,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 20px;">👑</span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -40]
    });

    const marker = L.marker(YERBA_BUENA_COORDS, { icon: customIcon }).addTo(mapInstance);

    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; padding: 6px 4px;">
        <h4 style="margin: 0; color: #111; font-weight: 800; font-size: 14px;">👑 CUMPLE ALE 35</h4>
        <p style="margin: 4px 0 0; color: #FF2B85; font-weight: 700; font-size: 13px;">📍 AV. ACONQUIJA 2960</p>
        <p style="margin: 2px 0 0; font-size: 11px; color: #555;">El Corte, Yerba Buena • 22:00 Hs</p>
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    // Recenter Button
    const btnRecenter = document.getElementById('btn-recenter-map');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        mapInstance.setView(YERBA_BUENA_COORDS, 16);
        marker.openPopup();
        playSound('pop');
      });
    }

    // Copy coords / address button
    const btnCopy = document.getElementById('btn-copy-coords');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const coords = btnCopy.getAttribute('data-coords') || 'Av. Aconquija 2960, Yerba Buena, Tucumán';
        navigator.clipboard.writeText(coords).then(() => {
          const originalText = btnCopy.innerHTML;
          btnCopy.innerHTML = '✅ ¡Copiado!';
          btnCopy.style.background = '#10B981';
          playSound('pop');
          setTimeout(() => {
            btnCopy.innerHTML = originalText;
            btnCopy.style.background = '';
          }, 2500);
        });
      });
    }

  } catch (err) {
    console.error('Error loading Leaflet map:', err);
  }
}

/* ==========================================================================
   3. BOTONES WHATSAPP (CONFETI & SONIDO AL CONFIRMAR)
   ========================================================================== */
const WA_PHONE = '5493816434253';
const WA_MESSAGE = '¡Hola Ale! 🎉 Confirmo que voy a tu cumple de 35 en Yerba Buena el sábado 14 a las 22 hs 🍷🍾 ¡Llevo bebida para tomar mucho! Cero responsabilidad ♡';

function initWhatsAppButtons() {
  const fullUrl = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(WA_MESSAGE)}`;
  
  const waBtns = document.querySelectorAll('a[href*="whatsapp.com"], a[href*="wa.me"]');
  waBtns.forEach(btn => {
    btn.href = fullUrl;
    btn.addEventListener('click', () => {
      playSound('horn');
      triggerConfetti(90);
    });
  });
}

/* ==========================================================================
   4. LIGHTBOX TARJETA
   ========================================================================== */
function initLightbox() {
  const trigger = document.getElementById('open-lightbox-trigger');
  const btnView = document.getElementById('btn-view-card');
  const modal = document.getElementById('lightbox-modal');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const btnShare = document.getElementById('btn-share-card');

  function open() {
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      playSound('pop');
    }
  }

  function close() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (trigger) trigger.addEventListener('click', open);
  if (btnView) btnView.addEventListener('click', open);
  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      close();
    }
  });

  if (btnShare && navigator.share) {
    btnShare.addEventListener('click', () => {
      navigator.share({
        title: 'Cumple de Ale 35 en Yerba Buena',
        text: '¡Es mi cumpleañito perras! Te invito a festejar el Sábado 14 a las 22 hs en Yerba Buena.',
        url: window.location.href
      }).catch(() => {});
    });
  } else if (btnShare) {
    btnShare.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('¡Enlace de la web copiado al portapapeles!');
      });
    });
  }
}

/* ==========================================================================
   5. CONFETTI ENGINE
   ========================================================================== */
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
  const btn = document.getElementById('btn-festejo');
  if (btn) {
    btn.addEventListener('click', () => {
      triggerConfetti(120);
      playSound('horn');
    });
  }

  // Small welcome burst
  setTimeout(() => {
    triggerConfetti(50);
  }, 1000);
}

function triggerConfetti(count = 100) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF2B85', '#FF1493', '#FFE600', '#111114', '#FFFFFF', '#25D366'];

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * window.innerWidth * 0.8,
      y: window.innerHeight * 0.3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      opacity: 1
    });
  }

  if (!confettiAnimationId) {
    animateConfetti(canvas, ctx);
  }
}

function animateConfetti(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // gravity
    p.vx *= 0.98; // air resistance
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.007;

    if (p.opacity <= 0 || p.y > canvas.height + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(() => animateConfetti(canvas, ctx));
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiAnimationId = null;
  }
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

/* ==========================================================================
   6. WEB AUDIO API SOUND EFFECTS
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSound() {
  const btnSound = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (btnSound && soundIcon) {
    btnSound.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) {
        playSound('pop');
      }
    });
  }
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'horn') {
      const freqs = [392, 523.25, 659.25];
      freqs.forEach((f, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + index * 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * 0.04);
        osc.stop(now + 0.55);
      });
    }
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}
