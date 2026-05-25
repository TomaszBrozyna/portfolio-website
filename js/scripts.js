/* ═══════════════════════════════════════════════
   script.js — Tomasz Brożyna Portfolio
═══════════════════════════════════════════════ */

/* ── Matrix Rain ─────────────────────────────── */
(function () {
    const c = document.getElementById('mtx-canvas');

    /* Respect prefers-reduced-motion: hide canvas and bail out */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        c.style.display = 'none';
        return;
    }

    const ctx = c.getContext('2d');

    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    const fs = 13;
    let drops = [];

    function initDrops() {
        drops = Array.from({ length: Math.floor(c.width / fs) }, () => Math.random() * -50 | 0);
    }
    initDrops();
    window.addEventListener('resize', initDrops);

    setInterval(() => {
        ctx.fillStyle = 'rgba(5,5,5,0.06)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#ff0033';
        ctx.font = `${fs}px 'JetBrains Mono', monospace`;
        drops.forEach((y, i) => {
            ctx.fillText(chars[Math.random() * chars.length | 0], i * fs, y * fs);
            if (y * fs > c.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 55);
})();

/* ── Typewriter (Hero) ───────────────────────── */
(function () {
    const phrases = [
        'Hello, World!',
        'Student Informatyki',
        'Linux user btw',
        'Cisco CCNA in progress...',
        'Network & Cloud Enthusiast',
        'Python & Bash Automator',
        'Cybersecurity learner',
        'git commit -m "keep going"',
        'sudo apt install knowledge',
    ];
    let pi = 0, ci = 0, del = false;
    const el = document.getElementById('typing-text');

    function tick() {
        const p = phrases[pi];
        el.textContent = del ? p.slice(0, ci - 1) : p.slice(0, ci + 1);
        del ? ci-- : ci++;
        let t = del ? 45 : 105;
        if (!del && ci === p.length) { t = 2200; del = true; }
        else if (del && ci === 0)   { del = false; pi = (pi + 1) % phrases.length; t = 280; }
        setTimeout(tick, t);
    }
    tick();
})();

/* ── Mobile Menu ─────────────────────────────── */
let menuOpen = false;

function toggleMenu() {
    menuOpen = !menuOpen;
    const m   = document.getElementById('mobile-menu');
    const ov  = document.getElementById('menu-overlay');
    const b1  = document.getElementById('hb1');
    const b2  = document.getElementById('hb2');
    const b3  = document.getElementById('hb3');
    const btn = document.getElementById('ham-btn');

    m.classList.toggle('open', menuOpen);
    ov.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    btn.setAttribute('aria-expanded', menuOpen);

    if (menuOpen) {
        b1.style.transform = 'rotate(45deg) translate(4.5px,4.5px)';
        b2.style.opacity   = '0';
        b3.style.transform = 'rotate(-45deg) translate(4px,-4px)';
        b3.style.width     = '22px';
    } else {
        b1.style.transform = ''; b2.style.opacity = '1';
        b3.style.transform = ''; b3.style.width   = '14px';
    }
}

function closeMenu() { if (menuOpen) toggleMenu(); }

/* Close on Escape key */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── Smooth scroll ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
    });
});

/* ── Active nav highlight ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link, .nav-cta, .mobile-link');
const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            const id = en.target.id;
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

/* ── Fade-in on scroll ───────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); fadeObs.unobserve(en.target); }
    });
}, { threshold: 0.12 });
fadeEls.forEach(el => fadeObs.observe(el));

/* ── Contact form (Formspree) ────────────────── */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formOk    = document.getElementById('form-ok');
const formErr   = document.getElementById('form-err');

form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.textContent = '>> SENDING...';
    submitBtn.disabled = true;
    formOk.style.display = 'none';
    formErr.style.display = 'none';
    try {
        const r = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (r.ok) { form.reset(); formOk.style.display = 'block'; }
        else formErr.style.display = 'block';
    } catch {
        formErr.style.display = 'block';
    }
    submitBtn.textContent = '>> SEND_MESSAGE';
    submitBtn.disabled = false;
});

/* ── Dynamic copyright year ──────────────────── */
document.getElementById('footer-year').textContent = new Date().getFullYear();