/**
 * KALIANIA
 * Perfect & Minimal JavaScript
 */

(function() {
    'use strict';
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        initHearts();
        initAccessibility();
        logWelcome();
    }
    
    /**
     * Heart Interactions
     */
    function initHearts() {
        const heartLinks = document.querySelectorAll('.heart-link');
        
        heartLinks.forEach(link => {
            // Hover effect with haptic feedback
            link.addEventListener('mouseenter', function() {
                const heart = this.querySelector('.heart');
                if (heart && heart.textContent === '♡') {
                    heart.textContent = '♥';
                    
                    // Haptic feedback on supported devices
                    if (navigator.vibrate) {
                        navigator.vibrate(15);
                    }
                }
            });
            
            link.addEventListener('mouseleave', function() {
                const heart = this.querySelector('.heart');
                if (heart && heart.textContent === '♥') {
                    heart.textContent = '♡';
                }
            });
        });
    }
    
    /**
     * Accessibility Enhancements
     */
    function initAccessibility() {
        // Handle reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--duration-fast', '0.01ms');
            document.documentElement.style.setProperty('--duration-medium', '0.01ms');
            document.documentElement.style.setProperty('--duration-slow', '0.01ms');
            document.documentElement.style.setProperty('--duration-ultra', '0.01ms');
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--duration-fast', '0.01ms');
                document.documentElement.style.setProperty('--duration-medium', '0.01ms');
                document.documentElement.style.setProperty('--duration-slow', '0.01ms');
                document.documentElement.style.setProperty('--duration-ultra', '0.01ms');
            } else {
                document.documentElement.style.removeProperty('--duration-fast');
                document.documentElement.style.removeProperty('--duration-medium');
                document.documentElement.style.removeProperty('--duration-slow');
                document.documentElement.style.removeProperty('--duration-ultra');
            }
        });
    }
    
    /**
     * Console Message
     */
    function logWelcome() {
        const styles = [
            'color: #e91e63',
            'font-size: 16px',
            'font-weight: 600',
            'font-family: "Dancing Script", cursive',
            'text-shadow: 0 2px 8px rgba(233, 30, 99, 0.3)'
        ].join(';');
        
        console.log('%ckaliania ✧', styles);
    }
    
    /**
     * Error Handling
     */
    window.addEventListener('error', function(e) {
        console.error('Error:', e.message);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled rejection:', e.reason);
    });
    
})();
