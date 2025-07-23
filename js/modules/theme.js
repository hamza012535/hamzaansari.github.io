/**
 * Theme Toggle Module
 * Handles dark/light theme switching with smooth GSAP transitions
 */
export class ThemeToggle {
  constructor() {
    this.toggle = document.getElementById('theme-toggle');
    this.html = document.documentElement;
    this.currentTheme = this.getStoredTheme() || 'light';
    
    this.init();
  }
  
  /**
   * Initialize theme toggle functionality
   */
  init() {
    // Set initial theme
    this.setTheme(this.currentTheme, false);
    
    // Add click event listener
    this.toggle.addEventListener('click', () => {
      this.switchTheme();
    });
    
    // Add keyboard support
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.switchTheme();
      }
    });
    
    // Listen for system theme changes
    this.watchSystemTheme();
  }
  
  /**
   * Switch between light and dark themes
   */
  switchTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }
  
  /**
   * Set theme with optional animation
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} animate - Whether to animate the transition
   */
  setTheme(theme, animate = true) {
    const oldTheme = this.currentTheme;
    this.currentTheme = theme;
    
    if (animate && !this.prefersReducedMotion()) {
      this.animateThemeTransition(oldTheme, theme);
    } else {
      this.applyTheme(theme);
    }
    
    // Store theme preference
    this.storeTheme(theme);
    
    // Dispatch custom event for other modules
    this.dispatchThemeChangeEvent(theme);
  }
  
  /**
   * Apply theme to document
   * @param {string} theme - Theme to apply
   */
  applyTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    
    // Update toggle button aria-label
    this.toggle.setAttribute('aria-label', 
      `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`
    );
  }
  
  /**
   * Animate theme transition using GSAP
   * @param {string} oldTheme - Previous theme
   * @param {string} newTheme - New theme
   */
  animateThemeTransition(oldTheme, newTheme) {
    const tl = gsap.timeline();
    
    // Create overlay for smooth transition
    const overlay = this.createTransitionOverlay();
    
    tl.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut"
    })
    .call(() => {
      // Apply new theme during overlay
      this.applyTheme(newTheme);
    })
    .to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        overlay.remove();
      }
    });
    
    // Animate toggle button icons
    this.animateToggleIcons();
  }
  
  /**
   * Create transition overlay element
   * @returns {HTMLElement} - Overlay element
   */
  createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${this.currentTheme === 'light' ? '#0e0e0e' : '#fffbe6'};
      opacity: 0;
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);
    return overlay;
  }
  
  /**
   * Animate toggle button icons
   */
  animateToggleIcons() {
    const lightIcon = this.toggle.querySelector('.icon-light');
    const darkIcon = this.toggle.querySelector('.icon-dark');
    
    // Rotate and scale animation
    gsap.to(this.toggle, {
      rotation: 360,
      duration: 0.6,
      ease: "back.out(1.7)"
    });
    
    // Icon transition
    if (this.currentTheme === 'dark') {
      gsap.to(lightIcon, { opacity: 0, scale: 0.5, rotation: -180, duration: 0.3 });
      gsap.to(darkIcon, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, delay: 0.1 });
    } else {
      gsap.to(darkIcon, { opacity: 0, scale: 0.5, rotation: 180, duration: 0.3 });
      gsap.to(lightIcon, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, delay: 0.1 });
    }
  }
  
  /**
   * Get stored theme preference
   * @returns {string|null} - Stored theme or null
   */
  getStoredTheme() {
    return localStorage.getItem('portfolio-theme');
  }
  
  /**
   * Store theme preference
   * @param {string} theme - Theme to store
   */
  storeTheme(theme) {
    localStorage.setItem('portfolio-theme', theme);
  }
  
  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if no stored preference
      if (!this.getStoredTheme()) {
        const systemTheme = e.matches ? 'dark' : 'light';
        this.setTheme(systemTheme, true);
      }
    });
  }
  
  /**
   * Dispatch theme change event
   * @param {string} theme - New theme
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} - True if reduced motion is preferred
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Get current theme
   * @returns {string} - Current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}

