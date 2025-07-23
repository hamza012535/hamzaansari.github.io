// Import modules
import { Preloader } from './modules/preloader.js';
import { ThemeToggle } from './modules/theme.js';
import { Hero } from './modules/hero.js';
import { About } from './modules/about.js';
import { Projects } from './modules/projects.js';
import { Contact } from './modules/contact.js';
import { Cursor } from './modules/cursor.js';
import { SmoothScroll } from './utils/smooth-scroll.js';
import { LazyLoader } from './utils/lazy-loading.js';

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    'assets/images/avatar.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical resources
  preloadCriticalResources();
  
  // Initialize lazy loading first
  const lazyLoader = new LazyLoader();
  
  // Initialize preloader first
  const preloader = new Preloader();
  
  // Initialize other modules after preloader
  preloader.onComplete(() => {
    const themeToggle = new ThemeToggle();
    const hero = new Hero();
    const about = new About();
    const projects = new Projects();
    const contact = new Contact();
    const cursor = new Cursor();
    const smoothScroll = new SmoothScroll();
    
    // Add scroll progress indicator
    smoothScroll.addScrollProgress();
    
    // Refresh ScrollTrigger on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
    
    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Portfolio loaded in ${Math.round(loadTime)}ms`);
        
        // Log Core Web Vitals if available
        if ('web-vitals' in window) {
          // This would require importing web-vitals library
          // getCLS(console.log);
          // getFID(console.log);
          // getLCP(console.log);
        }
      });
    }
    
    // Service Worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //   .then(registration => {
        //     console.log('SW registered: ', registration);
        //   })
        //   .catch(registrationError => {
        //     console.log('SW registration failed: ', registrationError);
        //   });
      });
    }
    
    // Error handling for GSAP animations
    window.addEventListener('error', (e) => {
      if (e.message.includes('gsap') || e.message.includes('ScrollTrigger')) {
        console.warn('GSAP animation error:', e.message);
        // Fallback to CSS animations or disable animations
        document.body.classList.add('no-js-animations');
      }
    });
    
    // Accessibility: Focus management
    document.addEventListener('keydown', (e) => {
      // Show focus indicators when using keyboard navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      // Hide focus indicators when using mouse
      document.body.classList.remove('keyboard-navigation');
    });
    
    // Accessibility: Skip links functionality
    const skipLink = document.querySelector('a[href="#main"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // Print styles optimization
    window.addEventListener('beforeprint', () => {
      // Disable animations for printing
      document.body.classList.add('print-mode');
    });
    
    window.addEventListener('afterprint', () => {
      // Re-enable animations after printing
      document.body.classList.remove('print-mode');
    });
  });
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    gsap.globalTimeline.pause();
  } else {
    // Resume animations when page is visible
    gsap.globalTimeline.resume();
  }
});

// Export for potential external use
window.PortfolioApp = {
  version: '1.0.0',
  modules: {
    Preloader,
    ThemeToggle,
    Hero,
    About,
    Projects,
    Contact,
    Cursor,
    SmoothScroll,
    LazyLoader
  }
};

