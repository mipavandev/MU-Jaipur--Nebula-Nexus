// Global State Management
const AppState = {
    currentTheme: 'light',
    isLoading: false,
    currentUser: {
        name: 'Aditya Sharma',
        department: 'Computer Science',
        year: '3rd Year',
        joinedClubs: ['Coding Club', 'Photography Club'],
        registeredEvents: ['Hackathon 2024', 'Open Mic Night']
    }
};

// DOM Elements
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    countdown: {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    }
};

// Theme Management
class ThemeManager {
    constructor() {
        this.initTheme();
        this.bindEvents();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        AppState.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = elements.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const newTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add celebration effect
        this.createThemeParticles();
    }

    createThemeParticles() {
        const colors = AppState.currentTheme === 'dark' 
            ? ['#fbbf24', '#f59e0b', '#d97706'] 
            : ['#3b82f6', '#1d4ed8', '#1e40af'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${elements.themeToggle.getBoundingClientRect().left + 20}px;
                top: ${elements.themeToggle.getBoundingClientRect().top + 20}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    bindEvents() {
        elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.bindEvents();
        this.handleActiveLink();
    }

    bindEvents() {
        elements.hamburger?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navMenu?.contains(e.target) && !elements.hamburger?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    this.smoothScroll(link.getAttribute('href'));
                }
            });
        });
    }

    toggleMobileMenu() {
        elements.navMenu?.classList.toggle('active');
        elements.hamburger?.classList.toggle('active');
    }

    closeMobileMenu() {
        elements.navMenu?.classList.remove('active');
        elements.hamburger?.classList.remove('active');
    }

    handleActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Countdown Timer
class CountdownTimer {
    constructor() {
        this.targetDate = new Date('2024-04-15T00:00:00').getTime();
        this.start();
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.stop();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.updateDisplay(days, hours, minutes, seconds);
    }

    updateDisplay(days, hours, minutes, seconds) {
        if (elements.countdown.days) elements.countdown.days.textContent = days.toString().padStart(2, '0');
        if (elements.countdown.hours) elements.countdown.hours.textContent = hours.toString().padStart(2, '0');
        if (elements.countdown.minutes) elements.countdown.minutes.textContent = minutes.toString().padStart(2, '0');
        if (elements.countdown.seconds) elements.countdown.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    stop() {
        clearInterval(this.interval);
        document.querySelector('.countdown-timer')?.innerHTML = '<div class="time-unit"><span class="time-value">🎉</span><span class="time-label">Event Started!</span></div>';
    }
}

// Page Transition Manager
class PageTransitionManager {
    constructor() {
        this.transitionDuration = 500;
    }

    showLoading() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.add('active');
            AppState.isLoading = true;
        }
    }

    hideLoading() {
        setTimeout(() => {
            if (elements.loadingOverlay) {
                elements.loadingOverlay.classList.remove('active');
                AppState.isLoading = false;
            }
        }, 800);
    }

    transitionTo(url) {
        this.showLoading();
        
        setTimeout(() => {
            window.location.href = url;
        }, this.transitionDuration);
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
            `;
            
            this.container?.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2
            });
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.init();
    }

    init() {
        const animatedElements = document.querySelectorAll('.club-card, .coordinator-card, .highlight-card, .section-title');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Interactive Elements
class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.handleClubCards();
        this.handleHighlightCarousel();
        this.handleContactButtons();
        this.addHoverEffects();
    }

    handleClubCards() {
        document.querySelectorAll('.club-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createHoverParticles(card);
            });

            card.addEventListener('click', () => {
                this.createClickRipple(card);
            });
        });
    }

    handleHighlightCarousel() {
        const carousel = document.querySelector('.highlights-carousel');
        if (!carousel) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    handleContactButtons() {
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showContactModal(btn);
            });
        });
    }

    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#667eea', '#764ba2', '#06b6d4'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { opacity: 1, transform: 'translate(0, 0) scale(1)' },
                { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 100}px, ${-50 - Math.random() * 50}px) scale(0)` }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    createClickRipple(element) {
        const ripple = document.createElement('div');
        const size = Math.max(element.offsetWidth, element.offsetHeight);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            pointer-events: none;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }

    showContactModal(button) {
        const coordinatorCard = button.closest('.coordinator-card');
        const name = coordinatorCard.querySelector('h3').textContent;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 2rem; border-radius: 1rem; max-width: 400px; width: 90%; text-align: center;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Contact ${name}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Send a message to our coordinator</p>
                <textarea placeholder="Your message..." style="width: 100%; height: 100px; padding: 1rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; background: var(--bg-tertiary); color: var(--text-primary); margin-bottom: 1rem; resize: none;"></textarea>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Send Message</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Add close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    addHoverEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Global Functions for Navigation
window.pageTransition = function(url) {
    new PageTransitionManager().transitionTo(url);
};

window.openClubPage = function(clubPage) {
    pageTransition(clubPage);
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Nebula Nexus initialized!');
    
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new CountdownTimer();
    new ParticleSystem();
    new ScrollAnimations();
    new InteractiveElements();
    
    // Hide loading overlay
    setTimeout(() => {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.style.display = 'none';
        }
    }, 1000);
    
    // Add smooth page entrance animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    // Recalculate particle positions
    const particles = document.querySelectorAll('#particles div');
    particles.forEach(particle => {
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Service Worker for caching (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

export { AppState, ThemeManager, NavigationManager, CountdownTimer };