// Global Variables
let mouseX = 0, mouseY = 0;
let particles = [];

// DOM Ready State
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('#cursor');
    const follower = document.querySelector('#cursor-follower');
    const guitar = document.querySelector('.guitar-img');
    const rainContainer = document.querySelector('.code-rain-container');
    const canvas = document.getElementById('bg-canvas');
    
    // Initial Setup
    const savedLang = localStorage.getItem('preferred-lang') || 'tr';
    setLanguage(savedLang);
    
    if (canvas) {
        initCanvas(canvas);
        animateParticles(canvas);
    }
    
    if (rainContainer) {
        createCodeRain(rainContainer);
    }

    // Cursor Movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor && follower) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            follower.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
        }
    });

    // Guitar Interaction
    if (guitar) {
        guitar.addEventListener('mouseenter', () => {
            if (rainContainer) rainContainer.classList.add('active');
            guitar.style.filter = "drop-shadow(0 0 50px #00ffa3) brightness(1.2)";
        });

        guitar.addEventListener('mouseleave', () => {
            if (rainContainer) rainContainer.classList.remove('active');
            guitar.style.filter = "drop-shadow(0 0 20px rgba(255, 230, 0, 0.4))";
        });
    }

    // Language switcher flags
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const lang = btn.innerText.toLowerCase();
            const langFlags = { tr: 'https://flagcdn.com/w160/tr.png', en: 'https://flagcdn.com/w160/gb.png' };
            if (langFlags[lang] && follower) {
                follower.style.backgroundImage = `url(${langFlags[lang]})`;
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.borderColor = 'transparent';
            }
        });
        btn.addEventListener('mouseleave', () => {
            if (follower) {
                follower.style.backgroundImage = 'none';
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.borderColor = 'var(--accent-color)';
            }
        });
    });

    // Reveal Logic (Scroll Animation)
    function reveal() {
        const reveals = document.querySelectorAll(".project-card, .section-title, .tech-progress, .tech-item, .stat-num");
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add("active");
                if(el.classList.contains('tech-progress')) {
                    const targetWidth = el.getAttribute('data-width') || el.style.width;
                    if (!el.getAttribute('data-width')) el.setAttribute('data-width', targetWidth);
                    el.style.width = '0';
                    setTimeout(() => { el.style.width = targetWidth; }, 100);
                }
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Run once on load

    // Magnetic & Scale Effect
    const interactables = document.querySelectorAll('.nav-item, .cta-button, .project-card, .logo, .guitar-img');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (follower) {
                follower.style.width = '80px';
                follower.style.height = '80px';
                follower.style.background = 'rgba(0, 255, 163, 0.05)';
                follower.style.borderColor = 'rgba(0, 255, 163, 0.5)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (follower) {
                follower.style.width = '30px';
                follower.style.height = '30px';
                follower.style.background = 'transparent';
                follower.style.borderColor = 'var(--accent-color)';
            }
        });
    });

    // Project Card Parallax
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // Draggable Elements (Updated for entire sections)
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(el => {
        let isDragging = false;
        let startX, startY, initialX = 0, initialY = 0;

        el.addEventListener('mousedown', (e) => {
            if (['INPUT', 'TEXTAREA', 'A', 'BUTTON'].includes(e.target.tagName)) return;
            isDragging = true;
            el.style.zIndex = '2000';
            const style = window.getComputedStyle(el);
            const matrix = new WebKitCSSMatrix(style.transform);
            initialX = matrix.m41;
            initialY = matrix.m42;
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                el.style.zIndex = '';
            }
        });
    });
});

// Translation Function
const translations = {
    tr: {
        "nav-projects": "PROJELER", "nav-about": "HAKKINDA", "nav-contact": "İLETİŞİM",
        "projects-title": "SEÇİLİ İŞLER", "details": "DETAYLAR", "view": "GÖRÜNTÜLE",
        "project-1-desc": "Modern web için karanlık tema odaklı, esnek ve modüler bir tasarım sistemi.",
        "project-2-desc": "Yapay zeka algoritmaları kullanarak oluşturulan, üretken sanat tabanlı okült sembol jeneratörü.",
        "project-3-desc": "Karmaşık veri setlerini 3D uzayda görselleştiren ve geleceğe dönük tahminlemeler yapan yapay zeka arayüzü.",
        "tech-title": "Teknoloji Yığını", "about-title": "Vizyon",
        "about-text": "Dijital dünyanın karanlık köşelerinde, kod ve estetiği birleştirerek benzersiz web deneyimleri inşa ediyorum. Modern teknolojiyi okült bir disiplinle ele alıyor, her pikselin bir anlam taşıdığı projeler üretiyorum.",
        "stat-projects": "TAMAMLANAN PROJE", "stat-experience": "YILLIK DENEYİM",
        "contact-title": "Bağlantı Kur", "form-name": "ADINIZ", "form-email": "EMAIL", "form-msg": "MESAJINIZ", "form-submit": "GÖNDER()",
        "footer-text": "© 2024 xGoetia. Bütün hakları saklıdır."
    },
    en: {
        "nav-projects": "PROJECTS", "nav-about": "ABOUT", "nav-contact": "CONTACT",
        "projects-title": "SELECTED WORKS", "details": "DETAILS", "view": "VIEW",
        "project-1-desc": "A dark-themed, flexible, and modular design system focused on the modern web.",
        "project-2-desc": "An AI-powered generator for occult symbols based on generative art algorithms.",
        "project-3-desc": "An AI interface that visualizes complex datasets in 3D space and provides future predictions.",
        "tech-title": "Tech Stack", "about-title": "Vision",
        "about-text": "In the dark corners of the digital world, I build unique web experiences by combining code and aesthetics. I approach modern tech as an occult discipline, where every pixel carries meaning.",
        "stat-projects": "COMPLETED PROJECTS", "stat-experience": "YEARS EXPERIENCE",
        "contact-title": "Get in Touch", "form-name": "YOUR NAME", "form-email": "EMAIL", "form-msg": "YOUR MESSAGE", "form-submit": "SEND()",
        "footer-text": "© 2024 xGoetia. All rights reserved."
    }
};

function setLanguage(lang) {
    localStorage.setItem('preferred-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === lang);
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
            if (el.classList.contains('reconstruct')) el.setAttribute('data-text', translations[lang][key]);
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });
}

// Background Systems
function initCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<80; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2
        });
    }
}

function animateParticles(canvas) {
    const ctx = canvas.getContext('2d');
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 255, 163, 0.5)';
        ctx.strokeStyle = 'rgba(0, 255, 163, 0.05)';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            for(let j=i+1; j<particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
                if(dist < 150) {
                    ctx.lineWidth = 1 - dist/150;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function createCodeRain(container) {
    container.innerHTML = '';
    const columns = Math.floor(window.innerWidth / 25);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[];:+-*";
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'code-column';
        column.style.left = (i * 25) + 'px';
        column.style.animationDuration = (Math.random() * 2 + 2) + 's';
        column.style.animationDelay = (Math.random() * 5) + 's';
        let content = "";
        for (let j = 0; j < 40; j++) content += chars[Math.floor(Math.random() * chars.length)] + "<br>";
        column.innerHTML = content;
        container.appendChild(column);
    }
}

// Turkey Map Logic (If exists)
const cityNodes = document.querySelectorAll('.city-node');
const cityTooltip = document.getElementById('city-tooltip');
if (cityNodes.length > 0 && cityTooltip) {
    cityNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            cityTooltip.innerText = `CITY: ${node.getAttribute('data-city')}`;
            cityTooltip.style.opacity = '1';
        });
        node.addEventListener('mouseleave', () => { cityTooltip.style.opacity = '0'; });
    });
}
