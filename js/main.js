/**
 * Edén Pilates - JavaScript Interactivity
 * Design System: Organic Minimalism (Stitch)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Elements on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        sectionObserver.observe(section);
    });

    // 2. Navbar Scroll Behavior
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('shadow-sm', 'bg-surface/95');
            navbar.classList.remove('bg-surface/80');
        } else {
            navbar.classList.remove('shadow-sm', 'bg-surface/95');
            navbar.classList.add('bg-surface/80');
        }
    });

    // 3. Mobile Navigation Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileDrawer.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    }

    function closeMobileMenu() {
        mobileDrawer.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 4. Schedule Filtering & Dynamic Slot Selection
    const dayButtons = document.querySelectorAll('.day-filter-btn');
    const classTypeButtons = document.querySelectorAll('.class-filter-btn');
    const scheduleSlots = document.querySelectorAll('.schedule-slot');

    let currentDay = 'hoy';
    let currentCategory = 'all';

    function filterSlots() {
        scheduleSlots.forEach(slot => {
            const slotDay = slot.getAttribute('data-day');
            const slotCat = slot.getAttribute('data-category');
            
            const matchDay = (currentDay === 'all' || slotDay === currentDay);
            const matchCat = (currentCategory === 'all' || slotCat === currentCategory);

            if (matchDay && matchCat) {
                slot.classList.remove('hidden');
                slot.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                slot.classList.add('hidden');
            }
        });
    }

    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                b.classList.add('bg-surface', 'text-on-surface-variant', 'border-outline-variant/40');
            });
            btn.classList.add('bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('bg-surface', 'text-on-surface-variant', 'border-outline-variant/40');
            currentDay = btn.getAttribute('data-day');
            filterSlots();
        });
    });

    classTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            classTypeButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-on-primary-container');
                b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
            });
            btn.classList.add('bg-primary-container', 'text-on-primary-container');
            btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
            currentCategory = btn.getAttribute('data-category');
            filterSlots();
        });
    });

    // 5. Booking Modal Logic
    const bookingModal = document.getElementById('booking-modal');
    const bookingModalClose = document.getElementById('close-booking-modal');
    const bookingForm = document.getElementById('booking-form');
    const selectedClassDisplay = document.getElementById('selected-class-name');
    const selectedTimeDisplay = document.getElementById('selected-class-time');
    const selectedInstructorDisplay = document.getElementById('selected-class-instructor');

    window.openBookingModal = function(className, time, instructor) {
        if (selectedClassDisplay) selectedClassDisplay.textContent = className;
        if (selectedTimeDisplay) selectedTimeDisplay.textContent = time;
        if (selectedInstructorDisplay) selectedInstructorDisplay.textContent = instructor;
        
        bookingModal.classList.remove('hidden');
        setTimeout(() => {
            bookingModal.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
        }, 10);
        document.body.classList.add('overflow-hidden');
    };

    function closeBookingModal() {
        const content = bookingModal.querySelector('.modal-content');
        content.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            bookingModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }, 200);
    }

    if (bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    // Attach click listeners to all "Seleccionar" buttons
    document.querySelectorAll('.select-slot-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentSlot = e.target.closest('.schedule-slot');
            if (parentSlot) {
                const title = parentSlot.getAttribute('data-title') || 'Pilates Reformer';
                const time = parentSlot.getAttribute('data-time') || '08:00 AM - 08:50 AM';
                const instructor = parentSlot.getAttribute('data-instructor') || 'Ana Soto';
                openBookingModal(title, time, instructor);
            }
        });
    });

    // Handle Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('book-name').value;
            const email = document.getElementById('book-email').value;
            
            closeBookingModal();
            bookingForm.reset();

            showToast(`¡Gracias ${name}! Tu reserva ha sido confirmada. Te enviamos los detalles a ${email}.`);
        });
    }

    // 6. Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('nombre').value;
            contactForm.reset();
            showToast(`¡Gracias por contactarnos, ${name}! Te responderemos a la brevedad.`);
        });
    }

    // 7. FAQ Accordions
    document.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('.faq-icon');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.classList.remove('hidden');
                icon.textContent = 'expand_less';
            } else {
                content.classList.add('hidden');
                icon.textContent = 'expand_more';
            }
        });
    });

    // 8. Toast notification utility
    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        const toastText = document.getElementById('toast-message');
        if (!toast || !toastText) return;

        toastText.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 400);
        }, 5000);
    }
});
