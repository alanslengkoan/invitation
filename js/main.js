/* =====================================================
   WEDDING INVITATION — main.js
   Particles · Cover · Scroll Animations · Music · Forms
===================================================== */

// ===== SCROLL RESTORATION =====
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ===== GUEST NAME FROM URL PARAMETER =====
(function() {
  var params  = new URLSearchParams(window.location.search);
  var guestTo = params.get('to');
  var name = (guestTo && guestTo.trim()) ? decodeURIComponent(guestTo.trim()) : 'Tamu Undangan';
  document.getElementById('guestName').textContent    = name;
  document.getElementById('envGuestName').textContent = name;
})();

// ===== COUNTDOWN TIMER =====
(function() {
  var target = new Date('2026-06-26T09:00:00');

  function updateCountdown() {
    var now  = new Date();
    var diff = target - now;

    if (diff <= 0) {
      ['cdDays','cdHours','cdMinutes','cdSeconds'].forEach(function(id) {
        document.getElementById(id).textContent = '00';
      });
      return;
    }

    document.getElementById('cdDays').textContent    = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent   = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
    document.getElementById('cdMinutes').textContent = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
    document.getElementById('cdSeconds').textContent = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.baseOpacity = Math.random() * 0.5 + 0.15;
    this.opacity = this.baseOpacity;
    this.life = 0;
    this.maxLife = Math.random() * 250 + 120;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    this.twinkle += this.twinkleSpeed;

    const fade = this.life < 40
      ? this.life / 40
      : this.life > this.maxLife - 40
        ? (this.maxLife - this.life) / 40
        : 1;

    this.opacity = this.baseOpacity * fade * (0.7 + 0.3 * Math.sin(this.twinkle));

    if (this.y < -10 || this.life >= this.maxLife) this.reset(false);
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
    ctx.fill();

    if (this.size > 1.2) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity * 0.15})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

const particles = [];
const PARTICLE_COUNT = 90;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

let animFrame;
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();


// ===== OPEN INVITATION =====
const openBtn = document.getElementById('openBtn');
const cover = document.getElementById('cover');
const mainContent = document.getElementById('mainContent');

openBtn.addEventListener('click', () => {
  document.body.classList.add('scroll-unlocked');
  cover.classList.add('fade-out');

  mainContent.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mainContent.classList.add('visible');
    });
  });

  setTimeout(() => {
    cancelAnimationFrame(animFrame);
    cover.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 1400);

  tryPlayMusic();
  initScrollObserver();
});


// ===== SCROLL ANIMATIONS =====
function initScrollObserver() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.closest('.timeline-item') ? index * 150 : index * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}


// ===== BACKGROUND MUSIC =====
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let isPlaying = false;

function tryPlayMusic() {
  var src = audio.querySelector('source');
  if (!src || !src.getAttribute('src')) return;
  audio.volume = 0;
  audio.play()
    .then(() => {
      isPlaying = true;
      musicBtn.textContent = '♫';
      musicBtn.classList.add('playing');
      fadeAudioIn();
    })
    .catch(() => {
      // Autoplay blocked — user will use the button
    });
}

function fadeAudioIn() {
  let vol = 0;
  const interval = setInterval(() => {
    vol = Math.min(vol + 0.02, 0.55);
    audio.volume = vol;
    if (vol >= 0.55) clearInterval(interval);
  }, 100);
}

function fadeAudioOut(callback) {
  let vol = audio.volume;
  const interval = setInterval(() => {
    vol = Math.max(vol - 0.03, 0);
    audio.volume = vol;
    if (vol <= 0) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 60);
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    fadeAudioOut(() => {
      audio.pause();
      isPlaying = false;
      musicBtn.textContent = '♪';
      musicBtn.classList.remove('playing');
    });
  } else {
    tryPlayMusic();
    if (!isPlaying) {
      audio.play()
        .then(() => {
          isPlaying = true;
          musicBtn.textContent = '♫';
          musicBtn.classList.add('playing');
          fadeAudioIn();
        })
        .catch(() => {});
    }
  }
});


// ===== RSVP FORM =====
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = document.getElementById('rsvpSubmit');
  btn.textContent = 'Dikonfirmasi ✓';
  btn.disabled = true;
  btn.style.cursor = 'default';

  rsvpForm.style.opacity = '0';
  rsvpForm.style.transform = 'translateY(-10px)';
  rsvpForm.style.transition = 'all 0.4s ease';

  setTimeout(() => {
    rsvpForm.classList.add('hidden');
    rsvpSuccess.classList.remove('hidden');
    rsvpSuccess.style.opacity = '0';
    rsvpSuccess.style.transform = 'translateY(10px)';
    rsvpSuccess.style.transition = 'all 0.5s ease';
    requestAnimationFrame(() => {
      rsvpSuccess.style.opacity = '1';
      rsvpSuccess.style.transform = 'translateY(0)';
    });
  }, 400);
});

// ===== GUESTBOOK / WISHES =====
const wishForm = document.getElementById('wishForm');
const wishesList = document.getElementById('wishesList');

const preloadedWishes = [
  { name: 'Keluarga Besar Santoso', text: 'Kiranya Tuhan memberkati pernikahan kalian dengan limpah. Semoga seumur hidup dipenuhi kasih, sukacita, dan iman yang teguh. Selamat menempuh hidup baru!' },
  { name: 'Pdt. Michael Wijaya', text: '"Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia." \u2014 Markus 10:9. Berkat Tuhan yang terlimpah atas ikatan suci kalian.' },
];

preloadedWishes.forEach(wish => addWishItem(wish.name, wish.text, true));

wishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = wishForm.querySelector('input');
  const textArea = wishForm.querySelector('textarea');
  const name = nameInput.value.trim();
  const text = textArea.value.trim();

  if (!name || !text) return;

  addWishItem(name, text, false);

  nameInput.value = '';
  textArea.value = '';

  const btn = wishForm.querySelector('.submit-btn');
  const original = btn.textContent;
  btn.textContent = 'Ucapan Terkirim ✓';
  setTimeout(() => { btn.textContent = original; }, 2000);
});

function addWishItem(name, text, append) {
  const now = new Date();
  const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const item = document.createElement('div');
  item.className = 'wish-item';
  item.innerHTML = `
    <p class="wish-name">✦ ${escapeHtml(name)}</p>
    <p class="wish-text">${escapeHtml(text)}</p>
    <p class="wish-time">${timeStr}</p>
  `;

  if (append) {
    wishesList.appendChild(item);
  } else {
    wishesList.prepend(item);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// ===== ENVELOPE ANIMATION (GIFT SECTION) =====
var envIsOpen = false;

document.getElementById('envWrap').addEventListener('click', function() {
  if (!envIsOpen) openEnvelope();
});

function openEnvelope() {
  if (envIsOpen) return;
  envIsOpen = true;
  var flap    = document.getElementById('envFlap');
  var front   = document.getElementById('envFront');
  var content = document.getElementById('envContent');
  var wrap    = document.getElementById('envWrap');
  flap.style.transform = 'rotateX(-165deg)';
  flap.style.opacity   = '0';
  setTimeout(function() {
    front.classList.add('env-hidden');
    content.classList.add('env-open');
    wrap.style.cursor = 'default';
  }, 420);
}

function closeEnvelope(e) {
  e.stopPropagation();
  envIsOpen = false;
  var flap    = document.getElementById('envFlap');
  var front   = document.getElementById('envFront');
  var content = document.getElementById('envContent');
  var wrap    = document.getElementById('envWrap');
  content.classList.remove('env-open');
  front.classList.remove('env-hidden');
  flap.style.transform = 'rotateX(0deg)';
  flap.style.opacity   = '1';
  wrap.style.cursor    = 'pointer';
}

function copyRek(nomor, toastId) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(nomor);
  } else {
    var el = document.createElement('textarea');
    el.value = nomor;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  var toast = document.getElementById(toastId);
  toast.style.display = 'block';
  setTimeout(function() { toast.style.display = 'none'; }, 2500);
}

// ===== FLORAL CORNER FRAME =====
(function() {
  var frame = '<div class="floral-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
  document.querySelectorAll('section:not(#cover)').forEach(function(s) {
    s.insertAdjacentHTML('afterbegin', frame);
  });
})();

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
