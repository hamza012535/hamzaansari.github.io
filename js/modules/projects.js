/**
 * Projects Section Module
 * Handles project grid animations, hover effects, and modal functionality
 */
export class Projects {
  constructor() {
    this.projects = document.getElementById('projects');
    this.projectItems = this.projects.querySelectorAll('.project-item');
    this.modal = null;
    
    this.init();
  }
  
  /**
   * Initialize projects section
   */
  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupModalFunctionality();
    this.createModal();
  }
  
  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Section title animation
    const title = this.projects.querySelector('h2');
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
    
    // Project items staggered animation
    gsap.fromTo(this.projectItems,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotation: 5
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: this.projects.querySelector('.project-grid'),
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
  
  /**
   * Setup hover effects for project items
   */
  setupHoverEffects() {
    this.projectItems.forEach((item, index) => {
      const image = item.querySelector('img');
      const overlay = item.querySelector('.project-overlay');
      const title = overlay.querySelector('h3');
      const description = overlay.querySelector('.project-description');
      const button = overlay.querySelector('.view-project');
      
      // Mouse enter effect
      item.addEventListener('mouseenter', () => {
        if (!this.prefersReducedMotion()) {
          // Item lift and scale
          gsap.to(item, {
            y: -12,
            scale: 1.03,
            duration: 0.4,
            ease: "power2.out"
          });
          
          // Image zoom
          gsap.to(image, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out"
          });
          
          // Overlay fade in
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Staggered content animation
          const tl = gsap.timeline();
          tl.to(title, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          })
          .to(description, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          }, "-=0.1")
          .to(button, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
          }, "-=0.1");
        }
      });
      
      // Mouse leave effect
      item.addEventListener('mouseleave', () => {
        if (!this.prefersReducedMotion()) {
          // Reset item position
          gsap.to(item, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
          
          // Reset image scale
          gsap.to(image, {
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          });
          
          // Hide overlay
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Reset content positions
          gsap.set([title, description, button], {
            y: 20,
            opacity: 0
          });
          gsap.set(button, { scale: 0.8 });
        }
      });
      
      // Click handler for modal
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(index);
      });
      
      // Keyboard support
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal(index);
        }
      });
    });
  }
  
  /**
   * Create modal structure
   */
  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'project-modal';
    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" aria-label="Close modal">&times;</button>
        <img class="modal-image" src="" alt="">
        <h3 class="modal-title"></h3>
        <p class="modal-description"></p>
        <div class="modal-links">
          <a href="#" class="btn" target="_blank">View Live</a>
          <a href="#" class="btn" target="_blank">View Code</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
  }
  
  /**
   * Setup modal functionality
   */
  setupModalFunctionality() {
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
    
    // Close button functionality will be added when modal is created
  }
  
  /**
   * Open modal with project data
   * @param {number} index - Project index
   */
  openModal(index) {
    const projectData = this.getProjectData(index);
    const modalContent = this.modal.querySelector('.modal-content');
    const closeButton = this.modal.querySelector('.close-modal');
    
    // Populate modal content
    this.modal.querySelector('.modal-image').src = projectData.image;
    this.modal.querySelector('.modal-image').alt = projectData.title;
    this.modal.querySelector('.modal-title').textContent = projectData.title;
    this.modal.querySelector('.modal-description').textContent = projectData.description;
    
    // Update links
    const links = this.modal.querySelectorAll('.modal-links a');
    links[0].href = projectData.liveUrl || '#';
    links[1].href = projectData.codeUrl || '#';
    
    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    if (!this.prefersReducedMotion()) {
      gsap.fromTo(this.modal, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      
      gsap.fromTo(modalContent,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.1 }
      );
    }
    
    // Add close button listener
    closeButton.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Focus management for accessibility
    closeButton.focus();
  }
  
  /**
   * Close modal
   */
  closeModal() {
    if (!this.prefersReducedMotion()) {
      const modalContent = this.modal.querySelector('.modal-content');
      
      gsap.to(modalContent, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      
      gsap.to(this.modal, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.1,
        onComplete: () => {
          this.modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    } else {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Get project data by index
   * @param {number} index - Project index
   * @returns {Object} - Project data
   */
  getProjectData(index) {
    // This would typically come from a data source
    const projectsData = [
      {
        title: "E-Commerce Platform",
        description: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and responsive design.",
        image: "assets/images/project1.jpg",
        liveUrl: "https://example.com/project1",
        codeUrl: "https://github.com/user/project1"
      },
      {
        title: "Portfolio Website",
        description: "A creative portfolio website showcasing modern web technologies including GSAP animations, WebGL effects, and responsive design principles.",
        image: "assets/images/project2.jpg",
        liveUrl: "https://example.com/project2",
        codeUrl: "https://github.com/user/project2"
      },
      {
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        image: "assets/images/project3.jpg",
        liveUrl: "https://example.com/project3",
        codeUrl: "https://github.com/user/project3"
      }
    ];
    
    return projectsData[index] || projectsData[0];
  }
  
  /**
   * Add new project dynamically
   * @param {Object} projectData - Project data object
   */
  addProject(projectData) {
    const projectGrid = this.projects.querySelector('.project-grid');
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    
    projectItem.innerHTML = `
      <img src="${projectData.image}" alt="${projectData.title}">
      <div class="project-overlay">
        <h3>${projectData.title}</h3>
        <p class="project-description">${projectData.description}</p>
        <button class="view-project">View Project</button>
      </div>
    `;
    
    projectGrid.appendChild(projectItem);
    
    // Animate in new project
    gsap.fromTo(projectItem,
      { opacity: 0, scale: 0, rotation: 180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    );
    
    // Update project items array and add event listeners
    this.projectItems = this.projects.querySelectorAll('.project-item');
    this.setupHoverEffects();
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
    // Remove modal
    if (this.modal && this.modal.parentNode) {
      this.modal.remove();
    }
    
    // Kill GSAP animations
    gsap.killTweensOf(this.projectItems);
    
    // Kill ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.projects) {
        trigger.kill();
      }
    });
  }
}

