/**
 * Contact Section Module
 * Handles contact form functionality, validation, and animations
 */
export class Contact {
  constructor() {
    this.contact = document.getElementById('contact');
    this.form = this.contact.querySelector('.contact-form');
    this.formGroups = this.form.querySelectorAll('.form-group');
    this.submitButton = this.form.querySelector('button[type="submit"]');
    
    this.init();
  }
  
  /**
   * Initialize contact section
   */
  init() {
    this.setupScrollAnimations();
    this.setupFormValidation();
    this.setupFloatingLabels();
    this.setupFormSubmission();
  }
  
  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Section title animation
    const title = this.contact.querySelector('h2');
    gsap.fromTo(title,
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
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    // Form groups staggered animation
    gsap.fromTo(this.formGroups,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: this.form,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    // Submit button animation
    gsap.fromTo(this.submitButton,
      {
        opacity: 0,
        y: 20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: this.submitButton,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
  
  /**
   * Setup floating label functionality
   */
  setupFloatingLabels() {
    this.formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      
      if (input && label) {
        // Handle input events
        input.addEventListener('input', () => {
          this.updateFloatingLabel(input, label);
        });
        
        input.addEventListener('focus', () => {
          this.animateLabelFocus(label, true);
        });
        
        input.addEventListener('blur', () => {
          if (!input.value.trim()) {
            this.animateLabelFocus(label, false);
          }
          this.validateField(input);
        });
        
        // Initial state check
        if (input.value.trim()) {
          this.updateFloatingLabel(input, label);
        }
      }
    });
  }
  
  /**
   * Update floating label position
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} label - Label element
   */
  updateFloatingLabel(input, label) {
    const hasValue = input.value.trim() !== '';
    
    if (hasValue) {
      label.classList.add('active');
      if (!this.prefersReducedMotion()) {
        gsap.to(label, {
          y: -25,
          scale: 0.85,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    } else {
      label.classList.remove('active');
      if (!this.prefersReducedMotion()) {
        gsap.to(label, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  }
  
  /**
   * Animate label on focus/blur
   * @param {HTMLElement} label - Label element
   * @param {boolean} focused - Whether input is focused
   */
  animateLabelFocus(label, focused) {
    if (!this.prefersReducedMotion()) {
      gsap.to(label, {
        color: focused ? 'var(--accent)' : 'var(--text-secondary)',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }
  
  /**
   * Setup form validation
   */
  setupFormValidation() {
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name (letters only, minimum 2 characters)'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      message: {
        required: true,
        minLength: 10,
        message: 'Please enter a message (minimum 10 characters)'
      }
    };
  }
  
  /**
   * Validate individual field
   * @param {HTMLElement} input - Input element to validate
   * @returns {boolean} - Whether field is valid
   */
  validateField(input) {
    const fieldName = input.id;
    const rules = this.validationRules[fieldName];
    const value = input.value.trim();
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !value) {
      isValid = false;
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Pattern validation
    if (isValid && rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.message;
    }
    
    // Minimum length validation
    if (isValid && rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = rules.message;
    }
    
    // Update field appearance
    this.updateFieldValidation(input, isValid, errorMessage);
    
    return isValid;
  }
  
  /**
   * Update field validation appearance
   * @param {HTMLElement} input - Input element
   * @param {boolean} isValid - Whether field is valid
   * @param {string} errorMessage - Error message to display
   */
  updateFieldValidation(input, isValid, errorMessage) {
    const formGroup = input.closest('.form-group');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    if (isValid) {
      input.classList.remove('error');
      input.classList.add('valid');
    } else {
      input.classList.remove('valid');
      input.classList.add('error');
      
      // Add error message
      const errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: block;
      `;
      
      formGroup.appendChild(errorElement);
      
      // Animate error message
      if (!this.prefersReducedMotion()) {
        gsap.fromTo(errorElement,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }
  
  /**
   * Setup form submission
   */
  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }
  
  /**
   * Handle form submission
   */
  async handleFormSubmission() {
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      this.showFormMessage('Please correct the errors above', 'error');
      return;
    }
    
    // Show loading state
    this.setSubmitButtonState('loading');
    
    try {
      // Simulate form submission (replace with actual API call)
      await this.submitForm();
      
      // Success state
      this.setSubmitButtonState('success');
      this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
      this.resetForm();
      
    } catch (error) {
      // Error state
      this.setSubmitButtonState('error');
      this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    }
    
    // Reset button state after 3 seconds
    setTimeout(() => {
      this.setSubmitButtonState('normal');
    }, 3000);
  }
  
  /**
   * Simulate form submission
   * @returns {Promise} - Promise that resolves after delay
   */
  submitForm() {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Simulate random success/failure for demo
        Math.random() > 0.1 ? resolve() : reject(new Error('Submission failed'));
      }, 2000);
    });
  }
  
  /**
   * Set submit button state
   * @param {string} state - Button state ('normal', 'loading', 'success', 'error')
   */
  setSubmitButtonState(state) {
    this.submitButton.className = `btn ${state}`;
    
    switch (state) {
      case 'loading':
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Sending...';
        break;
      case 'success':
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Message Sent!';
        break;
      case 'error':
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Try Again';
        break;
      default:
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Send Message';
    }
  }
  
  /**
   * Show form message
   * @param {string} message - Message to display
   * @param {string} type - Message type ('success' or 'error')
   */
  showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    this.form.appendChild(messageElement);
    
    // Animate message in
    if (!this.prefersReducedMotion()) {
      gsap.fromTo(messageElement,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    } else {
      messageElement.classList.add('show');
    }
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        if (messageElement.parentNode) {
          if (!this.prefersReducedMotion()) {
            gsap.to(messageElement, {
              opacity: 0,
              y: -20,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => messageElement.remove()
            });
          } else {
            messageElement.remove();
          }
        }
      }, 5000);
    }
  }
  
  /**
   * Reset form to initial state
   */
  resetForm() {
    this.form.reset();
    
    // Reset floating labels
    this.formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      
      if (input && label) {
        input.classList.remove('valid', 'error');
        label.classList.remove('active');
        
        if (!this.prefersReducedMotion()) {
          gsap.to(label, {
            y: 0,
            scale: 1,
            color: 'var(--text-secondary)',
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
      
      // Remove error messages
      const errorMessage = group.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} - True if reduced motion is preferred
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    // Kill GSAP animations
    gsap.killTweensOf(this.formGroups);
    gsap.killTweensOf(this.submitButton);
    
    // Kill ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.contact) {
        trigger.kill();
      }
    });
  }
}

