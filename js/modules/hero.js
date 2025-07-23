/**
 * Hero Section Module
 * Handles hero animations, parallax effects, and cursor particles
 */
export class Hero {
  constructor() {
    this.hero = document.getElementById('hero');
    this.headline = this.hero.querySelector('.hero-headline');
    this.particlesContainer = this.hero.querySelector('.cursor-particles');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }
  
  /**
   * Initialize hero section
   */
  init() {
    this.setupHeadlineAnimation();
    this.setupParallaxEffect();
    this.setupCursorParticles();
    this.setupScrollIndicator();
    
    // Add resize listener
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  /**
   * Setup headline staggered animation
   */
  setupHeadlineAnimation() {
    // Split text into words for stagger animation
    const words = this.headline.textContent.split(' ');
    this.headline.innerHTML = words.map(word => 
      `<span class="word">${word}</span>`
    ).join(' ');
    
    const wordElements = this.headline.querySelectorAll('.word');
    
    // Initial state
    gsap.set(wordElements, {
      opacity: 0,
      y: 100,
      rotationX: -90
    });
    
    // Animate in with stagger
    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.5
    });
    
    // Add continuous floating animation
    gsap.to(this.headline, {
      y: -10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }
  
  /**
   * Setup 3D parallax effect
   */
  setupParallaxEffect() {
    // Create parallax layers if they don't exist
    if (!this.hero.querySelector('.hero-parallax')) {
      this.createParallaxLayers();
    }
    
    const parallaxLayers = this.hero.querySelectorAll('.parallax-layer');
    
    // Mouse move parallax
    this.hero.addEventListener('mousemove', (e) => {
      const rect = this.hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.5;
        gsap.to(layer, {
          x: x * speed * 50,
          y: y * speed * 30,
          duration: 1,
          ease: "power2.out"
        });
      });
    });
    
    // Reset on mouse leave
    this.hero.addEventListener('mouseleave', () => {
      parallaxLayers.forEach(layer => {
        gsap.to(layer, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
      });
    });
  }
  
  /**
   * Create parallax background layers
   */
  createParallaxLayers() {
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'hero-parallax';
    
    for (let i = 0; i < 3; i++) {
      const layer = document.createElement('div');
      layer.className = 'parallax-layer';
      parallaxContainer.appendChild(layer);
    }
    
    this.hero.appendChild(parallaxContainer);
  }
  
  /**
   * Setup cursor-following particles
   */
  setupCursorParticles() {
    // Track mouse movement
    this.hero.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // Create particle at cursor position
      this.createParticle(e.clientX, e.clientY);
    });
    
    // Start particle animation loop
    this.animateParticles();
  }
  
  /**
   * Create a new particle at given coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  createParticle(x, y) {
    // Limit particle count for performance
    if (this.particles.length > 20) {
      const oldParticle = this.particles.shift();
      if (oldParticle.element.parentNode) {
        oldParticle.element.remove();
      }
    }
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size and opacity
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Position relative to hero section
    const heroRect = this.hero.getBoundingClientRect();
    particle.style.left = (x - heroRect.left) + 'px';
    particle.style.top = (y - heroRect.top) + 'px';
    
    this.particlesContainer.appendChild(particle);
    
    const particleData = {
      element: particle,
      x: x - heroRect.left,
      y: y - heroRect.top,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1
    };
    
    this.particles.push(particleData);
    
    // Animate particle
    gsap.to(particle, {
      opacity: 0,
      scale: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        if (particle.parentNode) {
          particle.remove();
        }
      }
    });
  }
  
  /**
   * Animate all particles
   */
  animateParticles() {
    const animate = () => {
      this.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;
        
        particle.element.style.transform = 
          `translate(${particle.x}px, ${particle.y}px)`;
        
        // Remove dead particles
        if (particle.life <= 0) {
          if (particle.element.parentNode) {
            particle.element.remove();
          }
          this.particles.splice(index, 1);
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Setup scroll indicator
   */
  setupScrollIndicator() {
    const scrollIndicator = this.hero.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
      
      // Hide indicator on scroll
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 200);
        scrollIndicator.style.opacity = opacity;
      });
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Clear particles on resize
    this.particles.forEach(particle => {
      if (particle.element.parentNode) {
        particle.element.remove();
      }
    });
    this.particles = [];
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    // Remove particles
    this.particles.forEach(particle => {
      if (particle.element.parentNode) {
        particle.element.remove();
      }
    });
    this.particles = [];
    
    // Kill GSAP animations
    gsap.killTweensOf(this.headline);
    gsap.killTweensOf(this.hero.querySelectorAll('.word'));
  }
}

