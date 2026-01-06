// ============================================
// HEALTHFLOW AI - JAVASCRIPT FUNCTIONALITY
// ============================================

// Carousel Functionality
let currentSlideIndex = 0;
const slideDuration = 5000; // Auto-advance every 5 seconds
let slideTimer;
let carouselPaused = false;

function moveSlide(n) {
    showSlide(currentSlideIndex += n);
    clearTimeout(slideTimer);
    if (!carouselPaused) {
        startAutoSlide();
    }
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
    clearTimeout(slideTimer);
    if (!carouselPaused) {
        startAutoSlide();
    }
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) {
        currentSlideIndex = 0;
    }
    if (n < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function startAutoSlide() {
    slideTimer = setTimeout(() => {
        moveSlide(1);
    }, slideDuration);
}

// Initialize carousel on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
    });
} else {
    initCarousel();
}

function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        startAutoSlide();
        
        // Pause carousel on hover
        carousel.addEventListener('mouseenter', () => {
            carouselPaused = true;
            clearTimeout(slideTimer);
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselPaused = false;
            startAutoSlide();
        });
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking overlay
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hamburger') && !e.target.closest('.nav-links')) {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const offsetTop = element.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation Trigger
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = getAnimationClass(entry.target);
        }
    });
}, observerOptions);

function getAnimationClass(element) {
    if (element.classList.contains('fade-in-down')) {
        return 'fadeInDown 0.8s ease forwards';
    } else if (element.classList.contains('fade-in-up')) {
        return 'fadeInUp 0.8s ease 0.2s forwards';
    } else if (element.classList.contains('slide-in-left')) {
        return 'slideInLeft 0.8s ease forwards';
    } else if (element.classList.contains('slide-in-right')) {
        return 'slideInRight 0.8s ease forwards';
    } else if (element.classList.contains('fade-in')) {
        return 'fadeIn 0.8s ease 0.3s forwards';
    }
    return '';
}

// Observe elements with animation classes
document.querySelectorAll('.fade-in-down, .fade-in-up, .slide-in-left, .slide-in-right, .fade-in, .problem-card, .trust-card, .benefit-card, .pricing-card, .contact-form, .contact-info').forEach(el => {
    observer.observe(el);
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!data.name || !data.email || !data.phone || !data.facility) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in all required fields',
                confirmButtonColor: '#0066FF',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validate email
        if (!isValidEmail(data.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
                confirmButtonColor: '#0066FF',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validate phone
        if (!isValidPhone(data.phone)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Please enter a valid phone number (at least 10 digits)',
                confirmButtonColor: '#0066FF',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Simulate form submission
        submitFormData(data);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

function submitFormData(data) {
    // Show loading alert
    Swal.fire({
        title: 'Sending Your Request',
        html: 'Please wait while we process your information...',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Simulate API call
    setTimeout(() => {
        // In production, send to your server
        console.log('Form submitted:', data);
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Request Received!',
            html: `<p>Thank you <strong>${data.name}</strong>!</p>
                   <p>We've received your information and will contact you within <strong>2 hours</strong> via email and WhatsApp.</p>
                   <p style="margin-top: 15px; font-size: 14px; color: #666;">Phone: ${data.phone}<br/>Email: ${data.email}</p>`,
            confirmButtonColor: '#0066FF',
            confirmButtonText: 'Great! Close this',
            timer: 8000,
            timerProgressBar: true
        }).then(() => {
            contactForm.reset();
        });

        // Optional: Send WhatsApp message
        // const message = `Hello,%0AI'm interested in HealthFlow AI...`;
        // window.location.href = `https://wa.me/256702XXXXXX?text=${message}`;
    }, 1500);
}

// Scroll to Contact Function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const offsetTop = contactSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
    }
});

// Counter Animation for Benefits
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Trigger counter animation when benefits section is visible
const benefitNumbers = document.querySelectorAll('.benefit-number');
let benefitsAnimated = false;

if (benefitNumbers.length > 0) {
    const benefitsSection = document.querySelector('.benefits');
    if (benefitsSection) {
        const benefitsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !benefitsAnimated) {
                    benefitsAnimated = true;
                    // Extract numbers and animate them
                    benefitNumbers.forEach(el => {
                        const text = el.textContent;
                        const numbers = text.match(/\d+/);
                        if (numbers) {
                            const target = parseInt(numbers[0]);
                            animateCounter(el, target);
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        benefitsObserver.observe(benefitsSection);
    }
}

// Parallax Effect (Optional)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// Testimonials Carousel (if needed later)
function createTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
        testimonials.forEach((t, index) => {
            t.style.display = index === currentIndex ? 'block' : 'none';
        });
        currentIndex = (currentIndex + 1) % testimonials.length;
    }, 5000);
}

// Initialize tooltips (if you add them)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.getAttribute('data-tooltip');
            el.appendChild(tooltip);
        });
        el.addEventListener('mouseleave', () => {
            const tooltip = el.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    createTestimonialCarousel();
    initTooltips();
    highlightActiveNavLink();
});

// Highlight Active Navigation Link
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        
        // Compare the paths
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    }
});

// Analytics (placeholder - add your actual analytics)
function trackEvent(eventName, eventData) {
    console.log('Event:', eventName, eventData);
    // Send to your analytics service
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('button_click', { button_text: this.textContent });
    });
});

// Lazy load images (future enhancement)
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.getAttribute('data-src');
            observer.unobserve(entry.target);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================

function toggleAccordion(header) {
    const accordionItem = header.closest('.accordion-item');
    const isActive = accordionItem.classList.contains('active');
    
    // Close all accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

// ============================================
// PHONE MOCKUP FUNCTIONALITY
// ============================================

function initPhoneMockup() {
    console.log('Initializing phone mockup...');
    
    const phoneHamburger = document.getElementById('phoneHamburger');
    const phoneSidebar = document.getElementById('phoneSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const phoneMainContent = document.getElementById('phoneMainContent');

    if (!phoneHamburger) {
        console.log('Phone hamburger element not found');
        return;
    }

    console.log('Phone elements found, attaching event listeners');

    // Toggle sidebar when hamburger is clicked
    phoneHamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked!');
        phoneHamburger.classList.toggle('active');
        phoneSidebar.classList.toggle('active');
        console.log('Hamburger active:', phoneHamburger.classList.contains('active'));
        console.log('Sidebar active:', phoneSidebar.classList.contains('active'));
    });

    // Close sidebar when close button is clicked
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            phoneHamburger.classList.remove('active');
            phoneSidebar.classList.remove('active');
        });
    }

    // Handle sidebar menu item clicks
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    console.log('Found', sidebarItems.length, 'sidebar items');
    
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu item clicked:', index);
            
            // Remove active class from all items
            sidebarItems.forEach(si => si.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Close sidebar
            phoneHamburger.classList.remove('active');
            phoneSidebar.classList.remove('active');
            
            // Show analytics view
            const analyticsViews = phoneMainContent.querySelectorAll('.analytics-view');
            analyticsViews.forEach(view => view.classList.remove('active'));
            if (analyticsViews.length > 0) {
                analyticsViews[0].classList.add('active');
            }
        });
    });

    // Close sidebar when clicking on main content area
    if (phoneMainContent) {
        phoneMainContent.addEventListener('click', function(e) {
            if (phoneSidebar.classList.contains('active')) {
                console.log('Clicked on main content, closing sidebar');
                phoneHamburger.classList.remove('active');
                phoneSidebar.classList.remove('active');
            }
        });
    }

    // Handle bottom navbar clicks
    const phoneFrame = phoneHamburger.closest('.phone-frame');
    if (phoneFrame) {
        const bottomNavbar = phoneFrame.querySelector('.phone-bottom-navbar');
        if (bottomNavbar) {
            const navItems = bottomNavbar.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const navName = item.getAttribute('data-nav');
                    console.log('Bottom nav clicked:', navName);
                    
                    // Remove active from all items
                    navItems.forEach(ni => ni.classList.remove('active'));
                    
                    // Add active to clicked item
                    item.classList.add('active');
                });
            });
        }
    }

    console.log('Phone mockup initialized successfully');
}

// Animate chart bars on page load
function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        const height = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.transition = 'height 0.5s ease';
            bar.style.height = height;
        }, 50 + index * 50);
    });
}

// Trigger chart animation when phone mockup section is visible
function setupPhoneObserver() {
    const phoneSection = document.querySelector('.phone-demo-section');
    if (phoneSection) {
        const phoneSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Phone demo section visible, animating chart bars');
                    animateChartBars();
                    phoneSectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        phoneSectionObserver.observe(phoneSection);
    }
}

// Initialize mobile app phone mockup (for mobile-app.html)
function initMobileAppPhoneMockup() {
    console.log('Initializing mobile app phone mockup...');
    
    const phoneHamburger = document.getElementById('phoneHamburgerMobileApp');
    const phoneSidebar = document.getElementById('phoneSidebarMobileApp');
    const closeSidebar = document.getElementById('closeSidebarMobileApp');
    const phoneMainContent = document.getElementById('phoneMainContentMobileApp');

    if (!phoneHamburger) {
        console.log('Mobile app phone hamburger element not found');
        return;
    }

    console.log('Mobile app phone elements found, attaching event listeners');

    // Toggle sidebar when hamburger is clicked
    phoneHamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile app hamburger clicked!');
        phoneHamburger.classList.toggle('active');
        phoneSidebar.classList.toggle('active');
    });

    // Close sidebar when close button is clicked
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            phoneHamburger.classList.remove('active');
            phoneSidebar.classList.remove('active');
        });
    }

    // Handle sidebar menu item clicks
    const sidebarItems = document.querySelectorAll('#phoneSidebarMobileApp .sidebar-item');
    console.log('Found', sidebarItems.length, 'mobile app sidebar items');
    
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active class from all items
            sidebarItems.forEach(si => si.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Close sidebar
            phoneHamburger.classList.remove('active');
            phoneSidebar.classList.remove('active');
        });
    });

    // Close sidebar when clicking on main content area
    if (phoneMainContent) {
        phoneMainContent.addEventListener('click', function(e) {
            if (phoneSidebar.classList.contains('active')) {
                phoneHamburger.classList.remove('active');
                phoneSidebar.classList.remove('active');
            }
        });
    }

    // Handle bottom navbar clicks
    const phoneFrame = phoneHamburger.closest('.phone-frame');
    if (phoneFrame) {
        const bottomNavbar = phoneFrame.querySelector('.phone-bottom-navbar');
        if (bottomNavbar) {
            const navItems = bottomNavbar.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const navName = item.getAttribute('data-nav');
                    console.log('Mobile app bottom nav clicked:', navName);
                    
                    // Remove active from all items
                    navItems.forEach(ni => ni.classList.remove('active'));
                    
                    // Add active to clicked item
                    item.classList.add('active');
                });
            });
        }
    }

    console.log('Mobile app phone mockup initialized successfully');
}

// Initialize phone mockup when DOM is ready
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired');
        initPhoneMockup();
        initMobileAppPhoneMockup();
        setupPhoneObserver();
    });
} else {
    console.log('DOM already loaded');
    initPhoneMockup();
    initMobileAppPhoneMockup();
    setupPhoneObserver();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    console.log('Window load event fired');
    initPhoneMockup();
    initMobileAppPhoneMockup();
    setupPhoneObserver();
});

// FAB Button Functionality
function initFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    if (!fabMain || !fabMenu) return;
    
    // Toggle menu on FAB click
    fabMain.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fabMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fab-container')) {
            fabMenu.classList.remove('active');
        }
    });
    
    // Close menu when clicking on a FAB item
    document.querySelectorAll('.fab-item').forEach(item => {
        item.addEventListener('click', () => {
            fabMenu.classList.remove('active');
        });
    });
}

// Initialize FAB
document.addEventListener('DOMContentLoaded', initFAB);

console.log('HealthFlow AI - Website Loaded Successfully');
