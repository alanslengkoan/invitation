/* =====================================================
   WEDDING INVITATION — main.js
   Particles · Cover · Scroll Animations · Music · Forms
===================================================== */

// ===== SCROLL RESTORATION =====
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ===== PRELOADER =====
(function() {
  var pre = document.getElementById('preloader');
  var minTime = 2000;
  var start   = Date.now();
  function hidePreloader() {
    var elapsed = Date.now() - start;
    var delay   = Math.max(0, minTime - elapsed);
    setTimeout(function() {
      pre.classList.add('hide');
      setTimeout(function() { pre.style.display = 'none'; }, 900);
    }, delay);
  }
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
})();

// ===== PETAL PARTICLES =====
(function() {
  var cover = document.getElementById('cover');
  var petalCount = 14;
  for (var i = 0; i < petalCount; i++) {
    var p = document.createElement('div');
    p.className = 'petal';
    var w = 6 + Math.random() * 8;
    p.style.cssText =
      'left:'                + (3 + Math.random() * 94) + '%;' +
      'width:'               + w + 'px;' +
      'height:'              + (w * 1.4) + 'px;' +
      'background:rgba('     + (Math.random() > 0.5 ? '201,168,76' : '255,248,220') + ',' + (0.18 + Math.random() * 0.22) + ');' +
      'animation-delay:'     + (Math.random() * 10) + 's;' +
      'animation-duration:'  + (7 + Math.random() * 7) + 's;';
    cover.appendChild(p);
  }
})();

// ===== HERO SLIDER =====
(function() {
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  var current = 0;
  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); });
  });
  setInterval(function() { goTo(current + 1); }, 5000);
})();

// ===== HERO PARALLAX =====
(function() {
  var heroSection = document.getElementById('hero');
  if (!heroSection) return;
  function onScroll() {
    var rect   = heroSection.getBoundingClientRect();
    var inView = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!inView) return;
    var offset = rect.top * 0.25 + 'px';
    heroSection.querySelectorAll('.hero-slide img').forEach(function(img) {
      img.style.transform = 'translateY(' + offset + ')';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

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
      musicBtn.classList.remove('playing');
    });
  } else {
    tryPlayMusic();
    if (!isPlaying) {
      audio.play()
        .then(() => {
          isPlaying = true;
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

// ===== LIGHTBOX =====
(function() {
  var lb       = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lbImg');
  var lbClose  = document.getElementById('lbClose');
  var lbPrev   = document.getElementById('lbPrev');
  var lbNext   = document.getElementById('lbNext');
  var lbCount  = document.getElementById('lbCounter');
  var backdrop = lb.querySelector('.lb-backdrop');

  var images = [];
  var current = 0;

  document.querySelectorAll('.gallery-item[data-index] img').forEach(function(img) {
    images.push({ src: img.src, alt: img.alt });
  });

  function openLightbox(idx) {
    current = idx;
    showImage(current);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showImage(idx) {
    lbImg.classList.add('lb-fade');
    setTimeout(function() {
      lbImg.src = images[idx].src;
      lbImg.alt = images[idx].alt;
      lbCount.textContent = (idx + 1) + ' / ' + images.length;
      lbImg.classList.remove('lb-fade');
    }, 200);
  }

  function prevImage() {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  }

  function nextImage() {
    current = (current + 1) % images.length;
    showImage(current);
  }

  document.querySelectorAll('.gallery-item[data-index]').forEach(function(item) {
    item.addEventListener('click', function() {
      openLightbox(parseInt(item.getAttribute('data-index')));
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
  lbNext.addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
})();

// ===== FLORAL CORNER FRAME =====
(function() {
  var frame = '<div class="floral-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
  document.querySelectorAll('section:not(#cover)').forEach(function(s) {
    s.insertAdjacentHTML('afterbegin', frame);
  });
})();

// ===== FLOATING NAV — ACTIVE SECTION =====
(function() {
  var navIds = ['hero', 'profil', 'love-story', 'events', 'gallery', 'gift'];
  var navMap  = {};
  navIds.forEach(function(id) {
    var el = document.querySelector('.fn-item[href="#' + id + '"]');
    if (el) navMap[id] = el;
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var id = entry.target.id;
      if (!navMap[id]) return;
      if (entry.isIntersecting) {
        Object.values(navMap).forEach(function(i) { i.classList.remove('active'); });
        navMap[id].classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  navIds.forEach(function(id) {
    var sec = document.getElementById(id);
    if (sec) observer.observe(sec);
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

// ===== MULTILANGUAGE =====
(function() {
  var t = {
    id: {
      'open-btn':           'Buka Undangan',
      'guest-name-default': 'Tamu Undangan',
      'grace-text':         'Dengan anugerah Tuhan, kami dipersatukan dalam ikatan suci pernikahan',
      'profil-title':       'Mempelai',
      'profil-sub':         'Yang berbahagia dipersatukan dalam anugerah-Nya',
      'role-groom':         'Mempelai Pria',
      'role-bride':         'Mempelai Wanita',
      'parents-groom':      'Putra dari',
      'parents-bride':      'Putri dari',
      'verse-main':         '"Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih,<br>dan yang paling besar di antaranya ialah kasih."',
      'verse-cite':         '— 1 Korintus 13:13',
      'ls-title':           'Kisah Cinta Kami',
      'ls-sub':             'Sembilan tahun semesta merajut cerita ini',
      'tl-2017a-h':         'Berawal dari Percakapan Sederhana',
      'tl-2017a-p':         'Di tahun ketiga perkuliahan, semesta mulai merajut cerita kami — dari percakapan sederhana di layar, dengan alasan yang terdengar biasa, namun perlahan membawa kami saling mengenal.',
      'tl-2017b-h':         'Pertemuan Pertama di Bazar',
      'tl-2017b-p':         'Pertemuan pertama di sebuah bazar kecil menjadi awal, di mana tawa terasa ringan dan percakapan mengalir tanpa jeda. Sejak saat itu, kami berjalan sebagai sahabat — saling menguatkan, saling menjaga, dalam langkah yang tenang dan sederhana.',
      'tl-2021-h':          'Dipertemukan Kembali',
      'tl-2021-p':          'Meski sempat terpisah oleh jarak dan kesibukan, cerita ini tidak benar-benar usai. Kami dipertemukan kembali dalam versi yang lebih dewasa, lebih siap — dan kali ini, kami memilih untuk berjalan ke arah yang sama.',
      'tl-2026-h':          'Bersama, Selamanya',
      'tl-2026-p':          'Lebih dari lima tahun kami berjalan berdampingan, menjaga apa yang sudah lama ada. Kini, kami memutuskan untuk tidak lagi berjalan sendiri — melainkan bersama, selamanya.',
      'events-title':       'Rangkaian Acara',
      'events-sub':         'Dengan sukacita kami mengundang Anda untuk merayakan bersama kami',
      'cd-days':            'Hari',
      'cd-hours':           'Jam',
      'cd-minutes':         'Menit',
      'cd-seconds':         'Detik',
      'ev1-title':          'Pemberkatan Nikah',
      'ev1-date':           'Jumat, 26 · 06 · 2026',
      'ev2-title':          'Resepsi Pernikahan',
      'ev2-date':           'Jumat, 26 · 06 · 2026',
      'map-btn':            'Lihat di Peta ↗',
      'save-date-text':     'Tandai harinya agar tidak terlewat',
      'save-date-btn':      'Simpan Tanggal',
      'gallery-title':      'Momen Kami',
      'gallery-sub':        'Sekilas perjalanan cinta kami bersama',
      'rsvp-title':         'Konfirmasi Kehadiran',
      'rsvp-sub':           'Mohon konfirmasi kehadiran Anda sebelum 1 · 06 · 2026',
      'rsvp-ph-name':       'Nama Lengkap Anda',
      'rsvp-ph-phone':      'Nomor Telepon',
      'rsvp-opt-default':   'Apakah Anda akan hadir?',
      'rsvp-opt-yes':       'Ya, saya akan hadir',
      'rsvp-opt-no':        'Mohon maaf, saya tidak dapat hadir',
      'rsvp-ph-guests':     'Jumlah Tamu',
      'rsvp-submit':        'Konfirmasi Kehadiran',
      'rsvp-success':       '✦ Terima kasih! Kehadiran Anda telah kami catat. ✦',
      'gb-title':           'Doa & Ucapan',
      'gb-sub':             'Bagikan doa dan ucapan selamat untuk kedua mempelai',
      'gb-ph-name':         'Nama Anda',
      'gb-ph-msg':          'Tuliskan doa dan ucapan selamat untuk Alan & Kris...',
      'gb-submit':          'Kirim Ucapan',
      'amplop-sub':         'Doa dan kehadiran Anda adalah hadiah terbesar bagi kami.<br>Bagi yang ingin memberikan berkat, kami dengan rendah hati<br>menerima melalui rekening berikut.',
      'env-label-to':       'Kepada Yth.',
      'env-label-from':     'dari',
      'env-hint':           '— ketuk untuk membuka —',
      'env-content-label':  'Nomor Rekening',
      'env-content-sub':    'Pilih bank untuk menyalin nomor rekening',
      'bank-type':          'Tabungan Individu',
      'rek-lbl-num':        'Nomor Rekening',
      'rek-lbl-name':       'Atas Nama',
      'copy-btn':           'Salin Nomor Rekening',
      'toast-bca':          'Nomor rekening BCA tersalin ✓',
      'toast-mandiri':      'Nomor rekening Mandiri tersalin ✓',
      'qris-title':         'Atau via QRIS',
      'qris-note':          'Scan QRIS · Berlaku untuk semua aplikasi pembayaran',
      'close-env':          '— tutup amplop —',
      'gift-note':          'Kehadiran dan doa Bapak/Ibu/Saudara/i<br>adalah hadiah terbesar dan terindah bagi kami.',
      'closing-text':       'Dengan hati yang penuh syukur, kami mengucapkan terima kasih telah merayakan momen suci ini bersama kami. Kehadiran Anda adalah berkat terbesar bagi kami.',
      'closing-verse':      '"Kiranya kasih dan berkat Tuhan menyertai kita semua"',
      'closing-sub':        '— Bersatu dalam Anugerah Tuhan —'
    },
    en: {
      'open-btn':           'Open Invitation',
      'guest-name-default': 'Guest',
      'grace-text':         'By the grace of God, we are united in holy matrimony',
      'profil-title':       'The Couple',
      'profil-sub':         'Joyfully united in His grace',
      'role-groom':         'Groom',
      'role-bride':         'Bride',
      'parents-groom':      'Son of',
      'parents-bride':      'Daughter of',
      'verse-main':         '"And now these three remain: faith, hope and love.<br>But the greatest of these is love."',
      'verse-cite':         '— 1 Corinthians 13:13',
      'ls-title':           'Our Love Story',
      'ls-sub':             'Nine years in the making',
      'tl-2017a-h':         'It Began with a Simple Conversation',
      'tl-2017a-p':         'In our third year of college, the universe began weaving our story — from a simple exchange of messages, with an ordinary reason, yet quietly drawing us closer to each other.',
      'tl-2017b-h':         'First Meeting at a Bazaar',
      'tl-2017b-p':         'Our first meeting at a small bazaar was only the beginning, where laughter came easy and conversation flowed without pause. From that moment, we walked as friends — strengthening and keeping each other, in quiet and steady steps.',
      'tl-2021-h':          'Reunited',
      'tl-2021-p':          'Though briefly separated by distance and the busyness of life, this story never truly ended. We were brought back together — more mature, more ready — and this time, we chose to walk in the same direction.',
      'tl-2026-h':          'Together, Forever',
      'tl-2026-p':          'For more than five years we have walked side by side, cherishing what had long been there. Now, we decide to no longer walk alone — but together, forever.',
      'events-title':       'Events',
      'events-sub':         'With joy, we invite you to celebrate this moment with us',
      'cd-days':            'Days',
      'cd-hours':           'Hours',
      'cd-minutes':         'Minutes',
      'cd-seconds':         'Seconds',
      'ev1-title':          'Holy Matrimony',
      'ev1-date':           'Friday, 26 · 06 · 2026',
      'ev2-title':          'Wedding Reception',
      'ev2-date':           'Friday, 26 · 06 · 2026',
      'map-btn':            'View on Map ↗',
      'save-date-text':     'Mark the date so you don\'t miss it',
      'save-date-btn':      'Save the Date',
      'gallery-title':      'Our Moments',
      'gallery-sub':        'A glimpse of our journey together',
      'rsvp-title':         'RSVP',
      'rsvp-sub':           'Please confirm your attendance before 1 · 06 · 2026',
      'rsvp-ph-name':       'Your Full Name',
      'rsvp-ph-phone':      'Phone Number',
      'rsvp-opt-default':   'Will you be attending?',
      'rsvp-opt-yes':       'Yes, I will attend',
      'rsvp-opt-no':        'I\'m sorry, I cannot attend',
      'rsvp-ph-guests':     'Number of Guests',
      'rsvp-submit':        'Confirm Attendance',
      'rsvp-success':       '✦ Thank you! Your attendance has been noted. ✦',
      'gb-title':           'Prayers & Wishes',
      'gb-sub':             'Share your prayers and congratulations for the couple',
      'gb-ph-name':         'Your Name',
      'gb-ph-msg':          'Write your prayers and wishes for Alan & Kris...',
      'gb-submit':          'Send Wishes',
      'amplop-sub':         'Your presence and prayers are the greatest gift to us.<br>For those who wish to give a blessing, we humbly<br>receive it through the following accounts.',
      'env-label-to':       'To',
      'env-label-from':     'from',
      'env-hint':           '— tap to open —',
      'env-content-label':  'Account Details',
      'env-content-sub':    'Select bank to copy account number',
      'bank-type':          'Individual Savings',
      'rek-lbl-num':        'Account Number',
      'rek-lbl-name':       'Account Name',
      'copy-btn':           'Copy Account Number',
      'toast-bca':          'BCA account number copied ✓',
      'toast-mandiri':      'Mandiri account number copied ✓',
      'qris-title':         'Or via QRIS',
      'qris-note':          'Scan QRIS · Valid for all payment apps',
      'close-env':          '— close envelope —',
      'gift-note':          'Your presence and prayers<br>are the greatest and most beautiful gift to us.',
      'closing-text':       'With hearts full of gratitude, we thank you for celebrating this sacred moment with us. Your presence is the greatest blessing to us.',
      'closing-verse':      '"May the love and blessing of God be with us all"',
      'closing-sub':        '— United in God\'s Grace —'
    }
  };

  var currentLang = localStorage.getItem('lang') || 'id';

  function applyLang(lang) {
    var d = t[lang];
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (d[key] !== undefined) el.textContent = d[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (d[key] !== undefined) el.innerHTML = d[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-ph');
      if (d[key] !== undefined) el.placeholder = d[key];
    });
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'id' ? 'EN' : 'ID';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    currentLang = lang;
  }

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', function() {
        applyLang(currentLang === 'id' ? 'en' : 'id');
      });
    }
    applyLang(currentLang);
  });
})();
