/**
 * Custom Cursor Module
 * Handles custom cursor with hover morphing effects
 */
export class Cursor {
  constructor() {
    this.cursor = null;
    this.cursorInner = null;
    this.mouse = { x: 0, y: 0 };
    this.cursorPos = { x: 0, y: 0 };
    this.isVisible = false;
    
    // Check if device supports hover (not touch-only)
    if (this.supportsHover()) {
      this.init();
    }
  }
  
  /**
   * Initialize custom cursor
   */
  init() {
    this.createCursor();
    this.setupEventListeners();
    this.startAnimationLoop();
  }
  
  /**
   * Create cursor elements
   */
  createCursor() {
    // Outer cursor (larger circle)
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: ${getComputedStyle(document.documentElement).getPropertyValue('--z-cursor')};
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease, transform 0.3s ease;
      mix-blend-mode: difference;
    `;
    
    // Inner cursor (small dot)
    this.cursorInner = document.createElement('div');
    this.cursorInner.className = 'custom-cursor-inner';
    this.cursorInner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background-color: var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: ${getComputedStyle(document.documentElement).getPropertyValue('--z-cursor') + 1};
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorInner);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mouse move tracking
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      if (!this.isVisible) {
        this.showCursor();
      }
    });
    
    // Mouse enter/leave window
    document.addEventListener('mouseenter', () => {
      this.showCursor();
    });
    
    document.addEventListener('mouseleave', () => {
      this.hideCursor();
    });
    
    // Hover effects for interactive elements
    this.setupHoverEffects();
    
    // Theme change listener
    document.addEventListener('themechange', () => {
      this.updateCursorColors();
    });
  }
  
  /**
   * Setup hover effects for different elements
   */
  setupHoverEffects() {
    // Clickable elements
    const clickableElements = document.querySelectorAll('a, button, .project-item, .theme-toggle');
    
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.morphCursor('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        this.morphCursor('default');
      });
    });
    
    // Text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, span');
    
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.morphCursor('text');
      });
      
      element.addEventListener('mouseleave', () => {
        this.morphCursor('default');
      });
    });
    
    // Form inputs
    const inputElements = document.querySelectorAll('input, textarea');
    
    inputElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.morphCursor('input');
      });
      
      element.addEventListener('mouseleave', () => {
        this.morphCursor('default');
      });
    });
  }
  
  /**
   * Morph cursor based on hover state
   * @param {string} state - Cursor state ('default', 'hover', 'text', 'input')
   */
  morphCursor(state) {
    if (!this.cursor || !this.cursorInner || this.prefersReducedMotion()) {
      return;
    }
    
    switch (state) {
      case 'hover':
        gsap.to(this.cursor, {
          scale: 1.5,
          borderWidth: '1px',
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(this.cursorInner, {
          scale: 0.5,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
        
      case 'text':
        gsap.to(this.cursor, {
          scale: 0.8,
          borderWidth: '1px',
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(this.cursorInner, {
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
        
      case 'input':
        gsap.to(this.cursor, {
          scaleX: 0.3,
          scaleY: 1.2,
          borderWidth: '2px',
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(this.cursorInner, {
          scale: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
        
      default:
        gsap.to(this.cursor, {
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          borderWidth: '2px',
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(this.cursorInner, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
    }
  }
  
  /**
   * Start cursor animation loop
   */
  startAnimationLoop() {
    const animate = () => {
      // Smooth cursor following with easing
      this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.1;
      this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.1;
      
      // Update cursor positions
      if (this.cursor) {
        this.cursor.style.left = this.cursorPos.x + 'px';
        this.cursor.style.top = this.cursorPos.y + 'px';
      }
      
      // Inner cursor follows more closely
      if (this.cursorInner) {
        const innerX = this.cursorPos.x + (this.mouse.x - this.cursorPos.x) * 0.3;
        const innerY = this.cursorPos.y + (this.mouse.y - this.cursorPos.y) * 0.3;
        
        this.cursorInner.style.left = innerX + 'px';
        this.cursorInner.style.top = innerY + 'px';
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Show cursor
   */
  showCursor() {
    if (this.cursor && this.cursorInner) {
      this.isVisible = true;
      this.cursor.style.opacity = '1';
      this.cursorInner.style.opacity = '1';
    }
  }
  
  /**
   * Hide cursor
   */
  hideCursor() {
    if (this.cursor && this.cursorInner) {
      this.isVisible = false;
      this.cursor.style.opacity = '0';
      this.cursorInner.style.opacity = '0';
    }
  }
  
  /**
   * Update cursor colors based on theme
   */
  updateCursorColors() {
    if (this.cursor && this.cursorInner) {
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent');
      
      this.cursor.style.borderColor = accentColor;
      this.cursorInner.style.backgroundColor = accentColor;
    }
  }
  
  /**
   * Check if device supports hover
   * @returns {boolean} - True if hover is supported
   */
  supportsHover() {
    return window.matchMedia('(hover: hover)').matches;
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} - True if reduced motion is preferred
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Add cursor effect to new elements
   * @param {NodeList|HTMLElement} elements - Elements to add cursor effects to
   * @param {string} cursorType - Type of cursor effect
   */
  addHoverEffect(elements, cursorType = 'hover') {
    const elementList = elements.length ? elements : [elements];
    
    elementList.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.morphCursor(cursorType);
      });
      
      element.addEventListener('mouseleave', () => {
        this.morphCursor('default');
      });
    });
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.remove();
    }
    
    if (this.cursorInner && this.cursorInner.parentNode) {
      this.cursorInner.remove();
    }
    
    // Restore default cursor
    document.body.style.cursor = 'auto';
    
    // Kill GSAP animations
    gsap.killTweensOf(this.cursor);
    gsap.killTweensOf(this.cursorInner);
  }
}

