// Modal functionality for Dynamicore website

// Global variables
let currentModal = null;

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.closest('.modal').id);
        }
    });

    // Close modals with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeModal(currentModal);
        }
    });

    // Add touch support for mobile
    addTouchSupport();

    // Mobile menu toggle (attach listeners)
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('open');
            mobileMenu.setAttribute('aria-hidden', mobileMenu.classList.contains('open') ? 'false' : 'true');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileToggle')) {
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }
});

// Utility functions for mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
}

// Open modal function
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        currentModal = modalId;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add slide-up animation for about modal
        if (modalId === 'aboutModal') {
            setTimeout(() => {
                modal.querySelector('.modal-content').style.animation = 'slideUp 0.3s ease-out';
            }, 50);
        }
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModal = null;
    }
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();

    // Formspree implementation (replace FORM_ENDPOINT with your Formspree URL)
    const FORM_ENDPOINT = 'https://formspree.io/f/xblqrzbg'; // <-- replace this with your Formspree endpoint
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    const successMessage = document.getElementById('successMessage');

    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const fd = new FormData(form);

    fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
    }).then(async (res) => {
        if (res.ok) {
            form.reset();
            form.style.display = 'none';
            successMessage.classList.add('show');

            setTimeout(() => {
                successMessage.classList.remove('show');
                form.style.display = 'flex';
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 3000);
        } else {
            const data = await res.json();
            console.error('Form submission error', data);
            alert('Failed to send message. Please try again later.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }).catch((err) => {
        console.error('Network error', err);
        alert('Network error. Please try again.');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
}

// Add touch support for mobile devices
function addTouchSupport() {
    // Prevent body scroll when modal is open
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('touchmove', function(e) {
            if (!e.target.closest('.modal-content')) {
                e.preventDefault();
            }
        });
    });
}

// Smooth scroll for project cards (if needed for future enhancements)
function scrollToProject(projectId) {
    const project = document.getElementById(projectId);
    if (project) {
        project.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Auto-close modals after 5 minutes (optional feature)
function setAutoClose(modalId, minutes = 5) {
    setTimeout(() => {
        if (currentModal === modalId) {
            closeModal(modalId);
        }
    }, minutes * 60 * 1000);
}

// Project card hover effects (enhanced interactions)
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhanceProjectCards();
});

// Handle window resize for responsive modals
window.addEventListener('resize', function() {
    if (currentModal) {
        const modal = document.getElementById(currentModal);
        const content = modal.querySelector('.modal-content');
        // Recalculate modal positioning if needed
        content.style.margin = '20px';
    }
});

// Form validation enhancements
function validateForm() {
    const inputs = document.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#EF4444';
            isValid = false;
        } else {
            input.style.borderColor = '#E5E7EB';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = '#EF4444';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Apply form validation to contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateForm);
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    validateForm();
                }
            });
        });
    }
});

// Analytics tracking (placeholder for future implementation)
function trackModalEvent(modalId, action) {
    // Placeholder for analytics tracking
    console.log(`Modal Event: ${action} on ${modalId}`);
}

// Track modal openings
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        currentModal = modalId;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track modal open
        trackModalEvent(modalId, 'opened');
        
        // Add slide-up animation for about modal
        if (modalId === 'aboutModal') {
            setTimeout(() => {
                modal.querySelector('.modal-content').style.animation = 'slideUp 0.3s ease-out';
            }, 50);
        }
    }
}

// Track modal closes
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModal = null;
        
        // Track modal close
        trackModalEvent(modalId, 'closed');
    }
}

// ===== Projects data and renderer =====
// Edit this array to add/remove projects. Each object should contain:
// { title, category, description, videoSrc, link }
const projects = [
    {
        title: 'E-Commerce Platform',
        category: 'Web App',
        description: 'A complete online store solution with payment integration, inventory management, and customer analytics dashboard.',
        videoSrc: '',
        link: '#'
    },
    {
        title: 'Workflow Automation Tool',
        category: 'Automation Tool',
        description: 'Streamline business processes with automated task management, document processing, and report generation.',
        videoSrc: '',
        link: '#'
    },
    {
        title: 'Mobile Banking App',
        category: 'Mobile App',
        description: 'Secure mobile banking solution with biometric authentication, real-time transactions, and financial planning tools.',
        videoSrc: '',
        link: '#'
    },
    {
        title: 'Restaurant Management System',
        category: 'Web App',
        description: 'Comprehensive POS system with order management, inventory tracking, and customer loyalty program.',
        videoSrc: '',
        link: '#'
    }
];

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Video placeholder (you can swap for <video> or <img> when videoSrc is set)
        const vp = document.createElement('div');
        vp.className = 'video-placeholder';
        const play = document.createElement('div');
        play.className = 'play-icon';
        play.textContent = '▶';
        vp.appendChild(play);
        card.appendChild(vp);

        const h3 = document.createElement('h3');
        h3.className = 'project-title';
        h3.textContent = p.title;
        card.appendChild(h3);

        const tag = document.createElement('span');
        tag.className = 'category-tag';
        tag.textContent = p.category;
        card.appendChild(tag);

        const desc = document.createElement('p');
        desc.className = 'project-description';
        desc.textContent = p.description;
        card.appendChild(desc);

        const a = document.createElement('a');
        a.className = 'view-project-link';
        a.href = p.link || '#';
        a.textContent = 'View Project →';
        a.target = '_blank';
        card.appendChild(a);

        grid.appendChild(card);
    });
}

// Render projects on load
document.addEventListener('DOMContentLoaded', renderProjects);

// (keyboard helpers removed)

// Minimal contact-modal focus handler: scroll focused input into view
document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contactModal');
    if (!contactModal) return;

    contactModal.addEventListener('focusin', (e) => {
        const tag = (e.target && e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
            // allow the keyboard to open first, then scroll the field into view
            setTimeout(() => {
                try {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                } catch (err) {
                    // fallback: do nothing
                }
            }, 300);
        }
    });
});