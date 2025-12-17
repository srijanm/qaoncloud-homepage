// QAonCloud Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately without animation
    showAllElementsInstantly();
    return;
  }

  // Initialize all animations
  initHeroAnimations();
  initScrollAnimations();
  initParallaxEffects();
  initTiltEffect();
});

// Show all elements without animation for reduced motion users
function showAllElementsInstantly() {
  const elementsToShow = [
    '.hero__label', '.hero__headline', '.hero__subtitle',
    '.hero__description', '.hero__ctas', '.hero__stats',
    '.hero__image-wrapper',
    '.services__card', '.partner__stat-card', '.guarantee__card',
    '.case-study-card', '.insight-card'
  ];

  elementsToShow.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });

  // Show counter values immediately
  document.querySelectorAll('.partner__stat-number[data-count]').forEach(el => {
    el.textContent = el.getAttribute('data-count');
  });
}

// ============================================
// Hero Section Animations (on load)
// ============================================
function initHeroAnimations() {
  const heroTextElements = [
    '.hero__label',
    '.hero__headline',
    '.hero__subtitle',
    '.hero__description',
    '.hero__ctas',
    '.hero__stats'
  ];

  const heroImage = '.hero__image-wrapper';

  // Set initial states
  gsap.set(heroTextElements, { opacity: 0, y: 40 });
  gsap.set(heroImage, { opacity: 0, x: 60, scale: 0.95 });

  // Create staggered timeline
  const tl = gsap.timeline({ delay: 0.2 });

  // Animate text elements
  heroTextElements.forEach((el, index) => {
    tl.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, index * 0.15);
  });

  // Animate hero image (starts slightly after headline)
  tl.to(heroImage, {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 1,
    ease: 'power2.out'
  }, 0.3);
}

// ============================================
// Scroll-Triggered Animations
// ============================================
function initScrollAnimations() {
  // Logos Section
  animateSection('.logos', {
    children: '.logos__heading',
    stagger: 0
  });

  // Pain Section
  animateSection('.pain__content', {
    children: ['.pain__headline', '.pain__body', '.pain__content .btn'],
    stagger: 0.1
  });

  animateSection('.pain__card', {
    fromX: 30
  });

  // Partner Section
  animateSection('.partner__content', {
    children: ['.partner__headline', '.partner__body'],
    stagger: 0.1
  });

  // Partner Stats with counter animation
  initPartnerStatsAnimation();

  // Services Section
  animateSection('.services__header', {
    children: ['.services__label', '.services__headline', '.services__subhead'],
    stagger: 0.1
  });

  animateStaggeredCards('.services__grid', '.services__card', 0.1);

  // Testimonial Section
  animateSection('.testimonial__headline');
  animateSection('.testimonial__card', {
    scale: 0.95
  });

  // Guarantee Section
  animateSection('.guarantee__header', {
    children: ['.guarantee__headline', '.guarantee__intro'],
    stagger: 0.1
  });

  animateStaggeredCards('.guarantee__grid', '.guarantee__card', 0.08);

  // Case Studies Section
  animateSection('.case-studies__header', {
    children: ['.case-studies__headline', '.case-studies__subhead'],
    stagger: 0.1
  });

  animateStaggeredCards('.case-studies__grid', '.case-study-card', 0.12);

  animateSection('.case-studies__link');

  // Insights Section
  animateSection('.insights__headline');
  animateStaggeredCards('.insights__grid', '.insight-card', 0.1);

  // Final CTA Section
  animateSection('.final-cta__container', {
    children: ['.final-cta__headline', '.final-cta__body', '.final-cta .btn'],
    stagger: 0.12
  });

  // Footer
  animateSection('.footer__container', {
    children: ['.footer__logo', '.footer__nav', '.footer__copyright'],
    stagger: 0.1,
    y: 20
  });
}

// ============================================
// Reusable Animation Functions
// ============================================

function animateSection(selector, options = {}) {
  const element = document.querySelector(selector);
  if (!element) return;

  const {
    children = null,
    stagger = 0,
    y = 40,
    fromX = 0,
    scale = 1,
    duration = 0.8
  } = options;

  if (children) {
    // Animate children with stagger
    const childElements = typeof children === 'string'
      ? element.querySelectorAll(children)
      : children.map(sel => element.querySelector(sel) || document.querySelector(sel)).filter(Boolean);

    gsap.set(childElements, { opacity: 0, y: y });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(childElements, {
          opacity: 1,
          y: 0,
          duration: duration,
          stagger: stagger,
          ease: 'power2.out'
        });
      }
    });
  } else {
    // Animate single element
    gsap.set(element, {
      opacity: 0,
      y: y,
      x: fromX,
      scale: scale
    });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: duration,
          ease: 'power2.out'
        });
      }
    });
  }
}

function animateStaggeredCards(containerSelector, cardSelector, staggerDelay = 0.1) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(cardSelector);
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 50 });

  ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: staggerDelay,
        ease: 'power2.out'
      });
    }
  });
}

// ============================================
// Partner Stats Counter Animation
// ============================================
function initPartnerStatsAnimation() {
  const statsSection = document.querySelector('.partner__stats');
  if (!statsSection) return;

  const cards = statsSection.querySelectorAll('.partner__stat-card');
  const statNumbers = statsSection.querySelectorAll('.partner__stat-number[data-count]');

  // Set initial state for cards
  gsap.set(cards, { opacity: 0, y: 40 });

  ScrollTrigger.create({
    trigger: statsSection,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      // Animate cards
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
      });

      // Animate counters after cards start appearing
      setTimeout(() => animateCounters(statNumbers), 200);
    }
  });
}

function animateCounters(elements) {
  elements.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * target);

      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ============================================
// Parallax Effects for Gradient Orbs
// ============================================
function initParallaxEffects() {
  // Hero glow parallax
  createParallax('.hero__glow', 0.3);

  // Partner glow parallax
  createParallax('.partner__glow', 0.2);

  // Final CTA glow parallax
  createParallax('.final-cta__glow', 0.25);
}

function createParallax(selector, speed = 0.3) {
  const element = document.querySelector(selector);
  if (!element) return;

  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
}

// ============================================
// 3D Tilt Effect for Hero Image
// ============================================
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(element => {
    const config = {
      maxRotation: 12,    // Max rotation in degrees
      scale: 1.02,        // Scale on hover
      perspective: 1000,  // Perspective value
      speed: 400          // Transition speed in ms
    };

    let rect;
    let isHovering = false;

    // Update element rect on resize
    const updateRect = () => {
      rect = element.getBoundingClientRect();
    };

    // Handle mouse enter
    const handleMouseEnter = () => {
      isHovering = true;
      element.classList.add('is-tilting');
      updateRect();
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      isHovering = false;
      element.classList.remove('is-tilting');

      // Reset transform smoothly
      element.style.transform = `
        perspective(${config.perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    };

    // Handle mouse move
    const handleMouseMove = (e) => {
      if (!isHovering) return;

      // Calculate mouse position relative to element center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation based on mouse position
      // Divide by half width/height to normalize to -1 to 1
      const rotateY = (mouseX / (rect.width / 2)) * config.maxRotation;
      const rotateX = -(mouseY / (rect.height / 2)) * config.maxRotation;

      // Apply transform
      element.style.transform = `
        perspective(${config.perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${config.scale}, ${config.scale}, ${config.scale})
      `;
    };

    // Add event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    // Update rect on window resize
    window.addEventListener('resize', updateRect);

    // Initial rect calculation
    updateRect();
  });
}
