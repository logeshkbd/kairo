/**
 * Kairo Restaurant - Interactive JavaScript Module
 * Contains all client-side logic for navigation, modals, reviews slider, menu filters, and lightboxes.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & SCROLL SPY NAVIGATION
       ========================================================================== */
    const header = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        // Toggle sticky background
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active navigation link detection (Scroll Spy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' && currentSectionId === 'home') {
                link.classList.add('active');
            } else if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially

    /* ==========================================================================
       2. MOBILE MENU NAVIGATION TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu-wrapper');
    const navMenuLinks = document.querySelectorAll('.nav-menu .nav-link');

    const toggleMobileMenu = () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    };

    const closeMobileMenu = () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
    };

    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking links on mobile
    navMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       3. SIGNATURE MENU TAB FILTER
       ========================================================================== */
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active states
            menuTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            menuPanels.forEach(panel => panel.classList.remove('active'));

            // Set active clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Find matching panel and show it
            const targetPanelId = tab.getAttribute('aria-controls');
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. TESTIMONIALS SLIDER / CAROUSEL
       ========================================================================== */
    const reviewsWrapper = document.getElementById('reviews-wrapper');
    const reviewCards = document.querySelectorAll('.review-card');
    const btnPrev = document.getElementById('rev-prev');
    const btnNext = document.getElementById('rev-next');
    const dotsContainer = document.getElementById('rev-dots');
    
    let currentSlide = 0;
    const totalSlides = reviewCards.length;

    // Generate slide indicator dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    const updateSliderUI = () => {
        reviewsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const goToSlide = (slideIndex) => {
        currentSlide = (slideIndex + totalSlides) % totalSlides;
        updateSliderUI();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // Auto-scroll reviews slider every 6 seconds
    let slideInterval = setInterval(nextSlide, 6000);

    // Pause auto-scroll on manual interaction
    const resetSlideInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 8000);
    };

    btnNext.addEventListener('click', resetSlideInterval);
    btnPrev.addEventListener('click', resetSlideInterval);
    dots.forEach(dot => dot.addEventListener('click', resetSlideInterval));

    /* ==========================================================================
       5. GALLERY LIGHTBOX
       ========================================================================== */
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const btnCloseLightbox = document.getElementById('btn-close-lightbox');
    const lightboxOverlay = document.getElementById('lightbox-overlay-trigger');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const openLightbox = (item) => {
        const imgSrc = item.getAttribute('data-src');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        const imgCaption = item.querySelector('.gallery-item-title').textContent;

        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightboxCaption.textContent = imgCaption;

        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent page scrolling
    };

    const closeLightbox = () => {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    btnCloseLightbox.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    /* ==========================================================================
       6. INTERACTIVE CHANNELS ORDER MODAL
       ========================================================================== */
    const orderModal = document.getElementById('order-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalOverlay = document.getElementById('modal-overlay-trigger');
    
    // Select all order trigger buttons on the page
    const orderTriggers = [
        document.getElementById('nav-cta-order'),
        document.getElementById('final-cta-order')
    ];

    const openOrderModal = (itemName = '') => {
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        
        if (modalTitle) {
            if (itemName && typeof itemName === 'string') {
                modalTitle.textContent = `Order Your ${itemName}`;
            } else {
                modalTitle.textContent = `Order Kairo's Royal Feast`;
            }
        }
        
        if (modalSubtitle) {
            if (itemName && typeof itemName === 'string') {
                modalSubtitle.textContent = `Get this delicious specialty delivered straight to your table or doorstep.`;
            } else {
                modalSubtitle.textContent = `Choose your preferred ordering channel below.`;
            }
        }

        if (orderModal) {
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeOrderModal = () => {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Attach regular online triggers
    orderTriggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', () => openOrderModal());
        }
    });

    // Attach quick order triggers from menu items
    const quickOrderBtns = document.querySelectorAll('.btn-order-quick');
    quickOrderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = btn.getAttribute('data-item');
            openOrderModal(item);
        });
    });

    btnCloseModal.addEventListener('click', closeOrderModal);
    modalOverlay.addEventListener('click', closeOrderModal);

    /* ==========================================================================
       7. GLOBAL ESCAPE KEY CLOSE HANDLER
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeOrderModal();
            closeMobileMenu();
        }
    });
});
