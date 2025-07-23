/**
 * Smooth Scroll Utility
 * Provides smooth scrolling functionality with scroll-snapping
 */
export class SmoothScroll {
  constructor() {
    this.isScrolling = false;
    this.scrollSpeed = 1;
    this.sections = [];
    
    this.init();
  }
  
  /**
   * Initialize smooth scroll functionality
   */
  init() {
    // Only initialize if user doesn't prefer reduced motion
    if (!this.prefersReducedMotion()) {
      this.setupSmoothScroll();
    }
    
    this.setupScrollSnapping();
    this.setupNavigationLinks();
    this.setupKeyboardNavigation();
  }
  
  /**
   * Setup custom smooth scrolling (alternative to CSS scroll-behavior)
   */
  setupSmoothScroll() {
    // Disable default smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Custom wheel event handler for smooth scrolling
    let isScrolling = false;
    let scrollTimeout;
    
    window.addEventListener('wheel', (e) => {
      if (isScrolling) return;
      
      e.preventDefault();
      
      const delta = e.deltaY;
      const scrollAmount = delta * 0.5; // Adjust scroll speed
      
      // Smooth scroll animation
      gsap.to(window, {
        scrollTo: {
          y: window.scrollY + scrollAmount,
          autoKill: true
        },
        duration: 0.8,
        ease: "power2.out",
        onStart: () => {
          isScrolling = true;
        },
        onComplete: () => {
          isScrolling = false;
        }
      });
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set timeout to allow normal scrolling after animation
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
      
    }, { passive: false });
  }
  
  /**
   * Setup scroll snapping functionality
   */
  setupScrollSnapping() {
    this.sections = document.querySelectorAll('section');
    
    // Add CSS scroll-snap properties
    document.body.style.scrollSnapType = 'y mandatory';
    
    this.sections.forEach(section => {
      section.style.scrollSnapAlign = 'start';
      section.style.scrollSnapStop = 'always';
    });
  }
  
  /**
   * Setup navigation links for smooth scrolling
   */
  setupNavigationLinks() {
    // Find all anchor links that point to sections
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          this.scrollToSection(targetSection);
        }
      });
    });
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Only handle if no input is focused
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          this.scrollToNextSection();
          break;
          
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          this.scrollToPreviousSection();
          break;
          
        case 'Home':
          e.preventDefault();
          this.scrollToSection(this.sections[0]);
          break;
          
        case 'End':
          e.preventDefault();
          this.scrollToSection(this.sections[this.sections.length - 1]);
          break;
      }
    });
  }
  
  /**
   * Scroll to a specific section
   * @param {HTMLElement} section - Target section element
   */
  scrollToSection(section) {
    if (!section) return;
    
    const targetY = section.offsetTop;
    
    if (this.prefersReducedMotion()) {
      // Instant scroll for reduced motion
      window.scrollTo(0, targetY);
    } else {
      // Smooth animated scroll
      gsap.to(window, {
        scrollTo: {
          y: targetY,
          autoKill: true
        },
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  }
  
  /**
   * Scroll to next section
   */
  scrollToNextSection() {
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(this.sections).indexOf(currentSection);
    
    if (currentIndex < this.sections.length - 1) {
      this.scrollToSection(this.sections[currentIndex + 1]);
    }
  }
  
  /**
   * Scroll to previous section
   */
  scrollToPreviousSection() {
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(this.sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
      this.scrollToSection(this.sections[currentIndex - 1]);
    }
  }
  
  /**
   * Get currently visible section
   * @returns {HTMLElement} - Current section element
   */
  getCurrentSection() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Check if section is in viewport
      if (scrollY >= sectionTop - windowHeight / 2 && 
          scrollY < sectionTop + sectionHeight - windowHeight / 2) {
        return section;
      }
    }
    
    return this.sections[0]; // Default to first section
  }
  
  /**
   * Add scroll progress indicator
   */
  addScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--accent) 0%, var(--accent-hover) 100%);
      z-index: 1001;
      transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = scrollPercent + '%';
    });
    
    return progressBar;
  }
  
  /**
   * Enable/disable smooth scrolling
   * @param {boolean} enabled - Whether to enable smooth scrolling
   */
  toggleSmoothScroll(enabled) {
    if (enabled && !this.prefersReducedMotion()) {
      document.documentElement.style.scrollBehavior = 'auto';
      this.setupSmoothScroll();
    } else {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }
  
  /**
   * Scroll to top of page
   */
  scrollToTop() {
    this.scrollToSection(this.sections[0]);
  }
  
  /**
   * Scroll to bottom of page
   */
  scrollToBottom() {
    if (this.prefersReducedMotion()) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    } else {
      gsap.to(window, {
        scrollTo: {
          y: document.documentElement.scrollHeight,
          autoKill: true
        },
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} - True if reduced motion is preferred
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Get scroll position as percentage
   * @returns {number} - Scroll percentage (0-100)
   */
  getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    // Remove scroll-snap styles
    document.body.style.scrollSnapType = '';
    
    this.sections.forEach(section => {
      section.style.scrollSnapAlign = '';
      section.style.scrollSnapStop = '';
    });
    
    // Restore default scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Remove progress bar if it exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.remove();
    }
    
    // Kill GSAP scroll animations
    gsap.killTweensOf(window);
  }
}

