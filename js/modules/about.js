/**
 * About Section Module
 * Handles scroll-triggered animations for the about section
 */
export class About {
  constructor() {
    this.about = document.getElementById('about');
    this.avatar = this.about.querySelector('.avatar');
    this.textElements = this.about.querySelectorAll('.about-text, .skills-list, .cta-button');
    
    this.init();
  }
  
  /**
   * Initialize about section animations
   */
  init() {
    this.setupScrollTriggerAnimations();
    this.setupInteractiveElements();
  }
  
  /**
   * Setup ScrollTrigger animations
   */
  setupScrollTriggerAnimations() {
    // Avatar animation
    gsap.fromTo(this.avatar, 
      {
        opacity: 0,
        scale: 0.8,
        x: -100,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: this.about,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    // Text elements staggered animation
    gsap.fromTo(this.textElements,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: this.about,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    // Parallax effect for avatar
    gsap.to(this.avatar, {
      y: -50,
      scrollTrigger: {
        trigger: this.about,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
    
    // Skills animation with individual delays
    const skillTags = this.about.querySelectorAll('.skill-tag');
    if (skillTags.length > 0) {
      gsap.fromTo(skillTags,
        {
          opacity: 0,
          scale: 0,
          rotation: 180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: skillTags[0].parentElement,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }
  
  /**
   * Setup interactive elements
   */
  setupInteractiveElements() {
    // Avatar hover effect
    this.setupAvatarHover();
    
    // Skill tags hover effects
    this.setupSkillTagsHover();
    
    // CTA button effects
    this.setupCTAButton();
  }
  
  /**
   * Setup avatar hover interactions
   */
  setupAvatarHover() {
    const avatarContainer = this.avatar.parentElement;
    
    avatarContainer.addEventListener('mouseenter', () => {
      if (!this.prefersReducedMotion()) {
        gsap.to(this.avatar, {
          scale: 1.05,
          rotation: 2,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Animate decorative border
        const border = avatarContainer.querySelector('::before');
        gsap.to(avatarContainer, {
          '--border-opacity': 0.6,
          duration: 0.3
        });
      }
    });
    
    avatarContainer.addEventListener('mouseleave', () => {
      if (!this.prefersReducedMotion()) {
        gsap.to(this.avatar, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(avatarContainer, {
          '--border-opacity': 0.3,
          duration: 0.3
        });
      }
    });
  }
  
  /**
   * Setup skill tags hover effects
   */
  setupSkillTagsHover() {
    const skillTags = this.about.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        if (!this.prefersReducedMotion()) {
          gsap.to(tag, {
            scale: 1.1,
            y: -5,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
      
      tag.addEventListener('mouseleave', () => {
        if (!this.prefersReducedMotion()) {
          gsap.to(tag, {
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
    });
  }
  
  /**
   * Setup CTA button effects
   */
  setupCTAButton() {
    const ctaButton = this.about.querySelector('.cta-button .btn');
    
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        const icon = ctaButton.querySelector('.icon');
        if (icon && !this.prefersReducedMotion()) {
          gsap.to(icon, {
            x: 8,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      ctaButton.addEventListener('mouseleave', () => {
        const icon = ctaButton.querySelector('.icon');
        if (icon && !this.prefersReducedMotion()) {
          gsap.to(icon, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      // Click ripple effect
      ctaButton.addEventListener('click', (e) => {
        if (!this.prefersReducedMotion()) {
          this.createRippleEffect(e, ctaButton);
        }
      });
    }
  }
  
  /**
   * Create ripple effect on button click
   * @param {Event} e - Click event
   * @param {HTMLElement} button - Button element
   */
  createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        ripple.remove();
      }
    });
  }
  
  /**
   * Add new skill tag dynamically
   * @param {string} skillName - Name of the skill
   */
  addSkill(skillName) {
    const skillsList = this.about.querySelector('.skills-list');
    if (skillsList) {
      const skillTag = document.createElement('span');
      skillTag.className = 'skill-tag';
      skillTag.textContent = skillName;
      
      // Initial state for animation
      gsap.set(skillTag, {
        opacity: 0,
        scale: 0,
        rotation: 180
      });
      
      skillsList.appendChild(skillTag);
      
      // Animate in
      gsap.to(skillTag, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      });
      
      // Add hover effects
      this.setupSkillTagsHover();
    }
  }
  
  /**
   * Update about text with typewriter effect
   * @param {string} newText - New text content
   */
  updateAboutText(newText) {
    const textElement = this.about.querySelector('.about-text');
    if (textElement) {
      // Fade out current text
      gsap.to(textElement, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          textElement.textContent = newText;
          // Fade in new text
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.3
          });
        }
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
   * Refresh ScrollTrigger instances
   */
  refresh() {
    ScrollTrigger.refresh();
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    // Kill all GSAP animations
    gsap.killTweensOf(this.avatar);
    gsap.killTweensOf(this.textElements);
    
    // Kill ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.about) {
        trigger.kill();
      }
    });
  }
}

