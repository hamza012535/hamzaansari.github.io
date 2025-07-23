/**
 * Preloader Module
 * Handles the loading screen with typewriter animation
 */
export class Preloader {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.text = this.preloader.querySelector('.preloader-text');
    this.originalText = this.text.textContent;
    this.completionCallbacks = [];
    
    this.init();
  }
  
  /**
   * Initialize preloader with typewriter effect
   */
  init() {
    // Clear text initially
    this.text.textContent = '';
    
    // Start typewriter animation
    this.typeWriter();
    
    // Simulate loading time (2-3 seconds)
    setTimeout(() => {
      this.complete();
    }, 2500);
  }
  
  /**
   * Typewriter animation effect
   */
  typeWriter() {
    let i = 0;
    const speed = 100; // Typing speed in milliseconds
    
    const type = () => {
      if (i < this.originalText.length) {
        this.text.textContent += this.originalText.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }
  
  /**
   * Complete preloader and trigger fade out
   */
  complete() {
    // Add loaded class for CSS transition
    this.preloader.classList.add('loaded');
    
    // Remove from DOM after transition
    setTimeout(() => {
      this.preloader.style.display = 'none';
      
      // Execute completion callbacks
      this.completionCallbacks.forEach(callback => callback());
    }, 500);
  }
  
  /**
   * Register callback to execute when preloader completes
   * @param {Function} callback - Function to execute on completion
   */
  onComplete(callback) {
    if (typeof callback === 'function') {
      this.completionCallbacks.push(callback);
    }
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} - True if reduced motion is preferred
   */
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Alternative minimal loading animation for reduced motion
   */
  minimalLoader() {
    // Create simple fade-in effect instead of typewriter
    gsap.to(this.text, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  }
}

