/**
 * Lazy Loading Utility
 * Handles lazy loading of images and other media for performance optimization
 */
export class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.mediaObserver = null;
    this.loadedImages = new Set();
    
    this.init();
  }
  
  /**
   * Initialize lazy loading
   */
  init() {
    // Check for Intersection Observer support
    if ('IntersectionObserver' in window) {
      this.setupImageLazyLoading();
      this.setupMediaLazyLoading();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }
  
  /**
   * Setup lazy loading for images
   */
  setupImageLazyLoading() {
    const imageObserverOptions = {
      root: null,
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, imageObserverOptions);
    
    // Observe all images with loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }
  
  /**
   * Setup lazy loading for other media (videos, iframes)
   */
  setupMediaLazyLoading() {
    const mediaObserverOptions = {
      root: null,
      rootMargin: '100px 0px',
      threshold: 0.01
    };
    
    this.mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMedia(entry.target);
          this.mediaObserver.unobserve(entry.target);
        }
      });
    }, mediaObserverOptions);
    
    // Observe videos and iframes with data-src
    const lazyMedia = document.querySelectorAll('video[data-src], iframe[data-src]');
    lazyMedia.forEach(media => {
      this.mediaObserver.observe(media);
    });
  }
  
  /**
   * Load individual image
   * @param {HTMLImageElement} img - Image element to load
   */
  loadImage(img) {
    // Skip if already loaded
    if (this.loadedImages.has(img)) return;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Add fade-in animation
      if (!this.prefersReducedMotion()) {
        gsap.set(img, { opacity: 0 });
        gsap.to(img, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      }
      
      // Mark as loaded
      this.loadedImages.add(img);
      img.classList.add('loaded');
      
      // Dispatch custom event
      img.dispatchEvent(new CustomEvent('imageloaded', {
        detail: { src: img.src }
      }));
    };
    
    imageLoader.onerror = () => {
      // Handle loading error
      img.classList.add('error');
      console.warn('Failed to load image:', img.src);
    };
    
    // Set loading class
    img.classList.add('loading');
    
    // Start loading
    imageLoader.src = img.src;
  }
  
  /**
   * Load media element (video, iframe)
   * @param {HTMLElement} media - Media element to load
   */
  loadMedia(media) {
    const dataSrc = media.getAttribute('data-src');
    if (dataSrc) {
      media.src = dataSrc;
      media.removeAttribute('data-src');
      
      // Add loading class
      media.classList.add('loading');
      
      // Handle load event
      media.addEventListener('load', () => {
        media.classList.remove('loading');
        media.classList.add('loaded');
      });
      
      // Handle error event
      media.addEventListener('error', () => {
        media.classList.add('error');
        console.warn('Failed to load media:', dataSrc);
      });
    }
  }
  
  /**
   * Preload critical images
   * @param {Array} imageSrcs - Array of image URLs to preload
   */
  preloadCriticalImages(imageSrcs) {
    imageSrcs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    const allImages = document.querySelectorAll('img[loading="lazy"]');
    allImages.forEach(img => {
      this.loadImage(img);
    });
    
    const allMedia = document.querySelectorAll('video[data-src], iframe[data-src]');
    allMedia.forEach(media => {
      this.loadMedia(media);
    });
  }
  
  /**
   * Add new images to lazy loading
   * @param {NodeList|HTMLElement} images - Images to add
   */
  observeNewImages(images) {
    if (!this.imageObserver) return;
    
    const imageList = images.length ? images : [images];
    imageList.forEach(img => {
      if (img.tagName === 'IMG' && img.getAttribute('loading') === 'lazy') {
        this.imageObserver.observe(img);
      }
    });
  }
  
  /**
   * Create placeholder for loading images
   * @param {HTMLImageElement} img - Image element
   */
  createPlaceholder(img) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      position: absolute;
      top: 0;
      left: 0;
    `;
    
    // Add shimmer animation
    if (!document.querySelector('#shimmer-keyframes')) {
      const style = document.createElement('style');
      style.id = 'shimmer-keyframes';
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    img.parentNode.style.position = 'relative';
    img.parentNode.appendChild(placeholder);
    
    // Remove placeholder when image loads
    img.addEventListener('imageloaded', () => {
      placeholder.remove();
    });
    
    return placeholder;
  }
  
  /**
   * Progressive image loading with different quality levels
   * @param {HTMLImageElement} img - Image element
   * @param {Object} sources - Object with different quality sources
   */
  progressiveLoad(img, sources) {
    // Load low quality first
    if (sources.lowQuality) {
      const lowQualityImg = new Image();
      lowQualityImg.onload = () => {
        img.src = sources.lowQuality;
        img.style.filter = 'blur(2px)';
        
        // Then load high quality
        if (sources.highQuality) {
          const highQualityImg = new Image();
          highQualityImg.onload = () => {
            img.src = sources.highQuality;
            
            if (!this.prefersReducedMotion()) {
              gsap.to(img, {
                filter: 'blur(0px)',
                duration: 0.5,
                ease: "power2.out"
              });
            } else {
              img.style.filter = 'blur(0px)';
            }
          };
          highQualityImg.src = sources.highQuality;
        }
      };
      lowQualityImg.src = sources.lowQuality;
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
   * Get loading statistics
   * @returns {Object} - Loading statistics
   */
  getStats() {
    const totalImages = document.querySelectorAll('img[loading="lazy"]').length;
    const loadedImages = this.loadedImages.size;
    const loadingProgress = totalImages > 0 ? (loadedImages / totalImages) * 100 : 100;
    
    return {
      total: totalImages,
      loaded: loadedImages,
      progress: Math.round(loadingProgress)
    };
  }
  
  /**
   * Cleanup method
   */
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    
    if (this.mediaObserver) {
      this.mediaObserver.disconnect();
    }
    
    this.loadedImages.clear();
  }
}

