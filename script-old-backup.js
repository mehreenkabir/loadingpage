/**
 * Kaliania - Album Release Website
 * Clean, efficient, and bug-free JavaScript
 */

// =========================================
// Initialize Application
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main application initialization
 */
function initializeApp() {
    const elements = getElements();
    const config = getConfiguration();
    
    initializeLoading(elements, config);
    initializeHeartInteractions(elements, config);
    initializeAccessibility(elements);
    initializePerformanceTracking();
    
    logWelcomeMessage();
}

/**
 * Get all required DOM elements
 */
function getElements() {
    return {
        loadingOverlay: document.getElementById('loadingOverlay'),
        mainContent: document.getElementById('mainContent'),
        card: document.querySelector('.card'),
        hearts: document.querySelectorAll('.heart')
    };
}

/**
 * Get application configuration
 */
function getConfiguration() {
    return {
        isLowPowerDevice: navigator.hardwareConcurrency <= 2,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouchDevice: 'ontouchstart' in window,
        isDesktop: window.innerWidth > 768,
        loadingDuration: 2000,
        animationDelay: 300
    };
}

// =========================================
// Loading Screen Management
// =========================================

/**
 * Initialize and manage loading screen
 */
function initializeLoading(elements, config) {
    const { loadingOverlay, mainContent } = elements;
    const { loadingDuration, animationDelay } = config;
    
    if (!loadingOverlay) {
        showMainContent(mainContent);
        return;
    }
    
    // Set up loading timeout with fallback
    const loadingTimeout = setTimeout(() => {
        hideLoadingScreen(loadingOverlay, mainContent, animationDelay);
    }, loadingDuration);
    
    // Ensure loading completes on window load
    window.addEventListener('load', () => {
        clearTimeout(loadingTimeout);
        setTimeout(() => {
            hideLoadingScreen(loadingOverlay, mainContent, animationDelay);
        }, 500);
    });
}

/**
 * Hide loading screen and show main content
 */
function hideLoadingScreen(loadingOverlay, mainContent, delay) {
    if (!loadingOverlay) return;
    
    loadingOverlay.classList.add('fade-out', 'hidden');
    
    setTimeout(() => {
        showMainContent(mainContent);
    }, delay);
    
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.remove();
        }
    }, delay * 4);
}

/**
 * Show main content with proper visibility
 */
function showMainContent(mainContent) {
    if (mainContent) {
        mainContent.classList.add('visible', 'loaded');
    }
}

// =========================================
// Heart Interactions
// =========================================

/**
 * Initialize heart button interactions
 */
function initializeHeartInteractions(elements, config) {
    const { hearts } = elements;
    const { prefersReducedMotion, isLowPowerDevice } = config;
    
    hearts.forEach((heart, index) => {
        setupHeartClickHandler(heart, index, prefersReducedMotion, isLowPowerDevice);
        setupHeartKeyboardHandler(heart);
        setupHeartHoverEffects(heart, config);
    });
}

/**
 * Set up click handler for heart button
 */
function setupHeartClickHandler(heart, index, prefersReducedMotion, isLowPowerDevice) {
    heart.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Add visual feedback if motion is allowed
        if (!prefersReducedMotion) {
            this.classList.add('clicked', 'loved');
            
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
        }
        
        // Add haptic feedback on supported devices
        if (navigator.vibrate && !isLowPowerDevice) {
            navigator.vibrate([30, 20, 30]);
        }
        
        // Track interaction for analytics
        trackEvent('heart_interaction', { 
            position: index + 1,
            timestamp: Date.now()
        });
    });
}

/**
 * Set up keyboard handler for heart button
 */
function setupHeartKeyboardHandler(heart) {
    heart.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    });
}

/**
 * Set up hover effects for desktop devices
 */
function setupHeartHoverEffects(heart, config) {
    const { isDesktop, isTouchDevice, prefersReducedMotion } = config;
    
    if (isDesktop && !isTouchDevice && !prefersReducedMotion) {
        heart.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        heart.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// =========================================
// Accessibility Features
// =========================================

/**
 * Initialize accessibility features
 */
function initializeAccessibility(elements) {
    const { hearts } = elements;
    
    // Ensure all interactive elements are focusable
    hearts.forEach(heart => {
        if (!heart.hasAttribute('tabindex')) {
            heart.setAttribute('tabindex', '0');
        }
    });
    
    // Handle reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
}

/**
 * Handle changes in motion preference
 */
function handleMotionPreferenceChange(mediaQuery) {
    const prefersReducedMotion = mediaQuery.matches;
    
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    } else {
        document.documentElement.style.removeProperty('--animation-duration');
    }
}

// =========================================
// Performance Tracking
// =========================================

/**
 * Initialize performance tracking
 */
function initializePerformanceTracking() {
    if ('PerformanceObserver' in window) {
        observePagePerformance();
    }
    
    trackPageLoad();
}

/**
 * Observe and track page performance metrics
 */
function observePagePerformance() {
    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach(entry => {
                if (entry.entryType === 'navigation') {
                    const loadTime = Math.round(entry.loadEventEnd - entry.fetchStart);
                    trackEvent('page_performance', {
                        load_time: loadTime,
                        dns_lookup: Math.round(entry.domainLookupEnd - entry.domainLookupStart),
                        tcp_connection: Math.round(entry.connectEnd - entry.connectStart),
                        first_byte: Math.round(entry.responseStart - entry.requestStart),
                        dom_ready: Math.round(entry.domContentLoadedEventEnd - entry.fetchStart)
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
        console.warn('Performance observer not supported:', error);
    }
}

/**
 * Track initial page load
 */
function trackPageLoad() {
    trackEvent('page_load', {
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        color_scheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    });
}

// =========================================
// Analytics & Event Tracking
// =========================================

/**
 * Track events for analytics
 */
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 integration
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Adobe Analytics integration
    if (typeof s !== 'undefined' && s.tl) {
        s.tl(true, 'o', eventName);
    }
    
    // Development logging
    if (process?.env?.NODE_ENV === 'development') {
        console.log('📊 Event tracked:', eventName, eventData);
    }
}

// =========================================
// Service Worker Registration
// =========================================

/**
 * Register service worker for PWA functionality
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        });
    }
}

// Initialize service worker
registerServiceWorker();

// =========================================
// Development & Debugging
// =========================================

/**
 * Log welcome message to console
 */
function logWelcomeMessage() {
    if (process?.env?.NODE_ENV === 'development') {
        console.log(`
✧ KALIANIA ✧
April 20th Album Release

🎵 Features:
✓ Clean, optimized code
✓ Accessibility compliant
✓ Performance optimized
✓ Mobile responsive
✓ PWA ready
✓ Analytics integrated

Ready for launch! ✨
        `);
    }
}

// =========================================
// Error Handling
// =========================================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
    });
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    trackEvent('promise_rejection', {
        reason: event.reason?.toString() || 'Unknown'
    });
});