document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // Play animation only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Map Enlargement Logic
    const mapTriggers = document.querySelectorAll('.map-container');
    if (mapTriggers.length > 0) {
        // Create modal element if it doesn't exist
        let modal = document.querySelector('.map-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'map-modal';
            modal.innerHTML = `
                <span class="close-modal">&times;</span>
                <img src="" alt="Enlarged Map">
            `;
            document.body.appendChild(modal);
        }

        const modalImg = modal.querySelector('img');
        const closeModal = modal.querySelector('.close-modal');

        mapTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const img = trigger.querySelector('img');
                if (img) {
                    modalImg.src = img.src;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scroll
                }
            });
        });

        const hideModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modal.addEventListener('click', hideModal);
        closeModal.addEventListener('click', (e) => {
            e.stopPropagation();
            hideModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hideModal();
            }
        });
    }

    // Anniversary Calculation
    const startYear = 1953;
    const currentYear = new Date().getFullYear();
    const anniversary = currentYear - startYear;

    const currentYearEl = document.getElementById('current-year');
    const anniversaryYearEl = document.getElementById('anniversary-year');

    if (currentYearEl) currentYearEl.textContent = currentYear;
    if (anniversaryYearEl) anniversaryYearEl.textContent = anniversary;

    // Mobile Hamburger Menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when a link is clicked
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Seasonal Banner Logic (Show only in March, April, May)
    const currentMonth = new Date().getMonth(); // 0 is January, 1 is February, 2 is March, 4 is May
    if (currentMonth >= 1 && currentMonth <= 4) {
        const banners = document.querySelectorAll('.seasonal-banner');
        if (banners.length > 0) {
            banners.forEach(banner => {
                banner.style.display = 'block';
            });
            document.body.classList.add('has-seasonal-banner'); // Add class to body for page spacing
        }
    }
});
