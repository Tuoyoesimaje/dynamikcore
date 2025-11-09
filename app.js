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
});

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
    
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    const successMessage = document.getElementById('successMessage');
    const formElements = form.querySelectorAll('.form-input');
    
    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        form.style.display = 'none';
        successMessage.classList.add('show');
        
        // Hide success message after 3 seconds and reset form
        setTimeout(() => {
            successMessage.classList.remove('show');
            form.style.display = 'flex';
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
        
    }, 1500); // Simulate network delay
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

/* ===== Keyboard / Visual Viewport helpers for mobile (Android) ===== */
// Keep inputs visible when the on-screen keyboard appears
(function keyboardModalHelpers() {
    // Only run in browsers that have document.querySelector
    if (!document.querySelector) return;

    // Utility to apply keyboard-open state and adjust modal-content maxHeight
    function handleKeyboardOpen(modalEl, focusedEl) {
        modalEl.classList.add('keyboard-open');

        const content = modalEl.querySelector('.modal-content');
        if (!content) return;

        // If visualViewport is available, use it to compute available height
        if (window.visualViewport) {
            const vv = window.visualViewport;
            const available = vv.height - 40; // leave some padding
            content.style.maxHeight = available + 'px';
        } else {
            // fallback: use window.innerHeight
            const available = window.innerHeight - 200;
            content.style.maxHeight = Math.max(200, available) + 'px';
        }

        // Scroll focused element into view inside modal-content
        setTimeout(() => {
            try {
                focusedEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            } catch (err) {
                // ignore
            }
        }, 250);
    }

    function handleKeyboardClose(modalEl) {
        modalEl.classList.remove('keyboard-open');
        const content = modalEl.querySelector('.modal-content');
        if (content) {
            content.style.maxHeight = ''; // let CSS handle sizes again
        }
    }

    // Attach to any modal that contains form inputs (run on DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            // focusin/focusout bubble and work well across inputs
            modal.addEventListener('focusin', (e) => {
                const tag = (e.target && e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
                    handleKeyboardOpen(modal, e.target);
                }
            });

            modal.addEventListener('focusout', (e) => {
                // Slight delay to handle switching between inputs
                setTimeout(() => {
                    if (!modal.contains(document.activeElement)) {
                        handleKeyboardClose(modal);
                    }
                }, 100);
            });

            // If the browser supports visualViewport, update sizes when it resizes
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', () => {
                    // If modal is open and keyboard likely visible (reduced visual viewport), adjust
                    if (modal.classList.contains('active') && modal.classList.contains('keyboard-open')) {
                        const vv = window.visualViewport;
                        const content = modal.querySelector('.modal-content');
                        if (content) content.style.maxHeight = (vv.height - 40) + 'px';
                    }
                });
            }
        });
    });
})();