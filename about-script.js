document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme on load
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // --- Mobile Navigation ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileNav = document.getElementById('mobile-nav');

    menuBtn.addEventListener('click', () => {
        mobileNav.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('open');
    });

    // --- Typing Animation ---
    const heading = document.querySelector('.main-heading');
    if (heading) {
        const text = heading.textContent;
        heading.textContent = '';
        let i = 0;
        
        // Audio setup (Ensure you have 'audio/typing.mp3' in your project)
        const typeSound = new Audio('audio/typing.mp3');
        typeSound.volume = 0.3; // Set volume to 30%

        function typeWriter() {
            if (i < text.length) {
                heading.textContent += text.charAt(i);
                
                // Play sound (cloneNode allows overlapping sounds for fast typing)
                typeSound.cloneNode().play().catch(() => {}); 
                
                i++;
                setTimeout(typeWriter, 150); // Adjust typing speed here
            }
        }
        setTimeout(typeWriter, 500); // Initial delay
    }

    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animation for Bento Box ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.skill-card');
                cards.forEach((card, index) => {
                    // Add a delay for each card to stagger the animation
                    card.style.transitionDelay = `${index * 100}ms`;
                    card.classList.add('reveal');
                });
                // Stop observing once the animation has been triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        observer.observe(bentoGrid);
    }

    // --- Hide Desktop Nav on Scroll ---
    const desktopNav = document.querySelector('.desktop-nav');
    if (desktopNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                desktopNav.classList.add('hidden');
            } else {
                desktopNav.classList.remove('hidden');
            }
        });
    }
});