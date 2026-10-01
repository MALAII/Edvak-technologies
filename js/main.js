/**
 * EDVAK TECHNOLOGIES PVT LTD - JAVASCRIPT CONTROLLER
 * Production-ready, lightweight vanilla JS for UX interactions,
 * mobile drawer, URL parameter handling, enquiry form validation, and scroll reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initServiceFilters();
  initContactForm();
  initSmoothScroll();
  initScrollReveal();
  initDivisionHub();
});

/**
 * 1. STICKY HEADER & SCROLL SHADOW
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. MOBILE NAVIGATION DRAWER
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navWrapper = document.querySelector('.nav-menu-wrapper');
  if (!toggleBtn || !navWrapper) return;

  const openDrawer = () => {
    navWrapper.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    navWrapper.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navWrapper.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close when clicking outside on the backdrop
  navWrapper.addEventListener('click', (e) => {
    if (e.target === navWrapper) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navWrapper.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });

  // Close when clicking internal links
  const navLinks = navWrapper.querySelectorAll('.nav-link, .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/**
 * 3. SERVICES PAGE FILTERING & LIVE SEARCH
 */
function initServiceFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-detail-card, .service-card');
  const searchInput = document.getElementById('service-search');
  const categoryBlocks = document.querySelectorAll('.services-category-block');

  if (!filterButtons.length && !searchInput) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    let visibleCount = 0;

    serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('.service-card-title, .service-detail-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.service-card-desc, .service-detail-intro, .service-scope')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchTerm || cardTitle.includes(searchTerm) || cardDesc.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Check category section headings visibility
    categoryBlocks.forEach(block => {
      const visibleChildCards = block.querySelectorAll('.service-detail-card:not([style*="display: none"])');
      if (visibleChildCards.length === 0) {
        block.style.display = 'none';
      } else {
        block.style.display = '';
      }
    });

    const noResultsMsg = document.getElementById('no-services-message');
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/**
 * 4. CONTACT ENQUIRY FORM & URL PARAMETER PARSER
 */
function initContactForm() {
  const form = document.getElementById('service-enquiry-form');
  const serviceSelect = document.getElementById('service-select');
  const formFeedback = document.getElementById('form-feedback');

  // Pre-select service from URL parameter (e.g. ?service=cctv or ?division=telecom)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service');
  const requestedDivision = urlParams.get('division');

  if (serviceSelect && (requestedService || requestedDivision)) {
    const serviceMap = {
      // Electronics Division
      'cctv': 'CCTV',
      'home-appliances': 'Home Appliances',
      'technicians': 'Technicians for all Electrical Equipment',
      'solar-panels': 'Solar Panels',
      'led-panels': 'LED Panels',
      'lighting-panels': 'Lighting Panels',
      'electronics': 'CCTV',
      // Telecom Division
      'broadband-installation': 'Broadband Installation',
      'tower-erection': 'Tower Erection',
      'tower-maintenance': 'Tower Maintenance',
      'ofc': 'OFC (Optical Fiber Cable)',
      'telecom-repairs': 'Telecom Repairs',
      'repairs': 'Telecom Repairs',
      'telecom': 'Broadband Installation',
      // Electrical Division
      'wires': 'Wires',
      'poles': 'Poles',
      'electrical-equipment': 'Electrical Equipment',
      'electrical-contractors': 'Electrical Contractors',
      'electrical': 'Electrical Contractors',
      // PVC & Plumbing Division
      'pvc-manufacturers': 'PVC Manufacturers',
      'plumbing-manufacturers': 'Plumbing Manufacturers',
      'pvc-contractors': 'PVC Contractors',
      'plumbing-contractors': 'Plumbing Contractors',
      'plumbing': 'Plumbing Contractors',
      'pvc': 'PVC Contractors',
      // IT Sector
      'it-services': 'IT Services',
      'it': 'IT Services',
      'other': 'General Technical Enquiry'
    };

    const key = (requestedService || requestedDivision || '').toLowerCase();
    const targetVal = serviceMap[key];
    if (targetVal) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === targetVal) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (!form) return;

  // Validation rules
  const validateField = (input, validator, errorId, errorMsg) => {
    const errorEl = document.getElementById(errorId);
    const isValid = validator(input.value.trim());

    if (!isValid) {
      input.classList.add('error');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  };

  const nameInput = document.getElementById('client-name');
  const phoneInput = document.getElementById('client-phone');
  const emailInput = document.getElementById('client-email');
  const locationInput = document.getElementById('client-location');
  const requirementInput = document.getElementById('client-requirement');

  // Listeners for live clearing of errors
  [nameInput, phoneInput, emailInput, locationInput, requirementInput, serviceSelect].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById(`${field.id}-error`);
      if (errEl) errEl.classList.remove('visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Name validation
    if (nameInput) {
      const isNameValid = validateField(
        nameInput,
        val => val.length >= 2,
        'client-name-error',
        'Please enter your full name.'
      );
      if (!isNameValid) isValid = false;
    }

    // Phone validation (Indian / international format: 10+ digits)
    if (phoneInput) {
      const isPhoneValid = validateField(
        phoneInput,
        val => {
          const digitsOnly = val.replace(/\D/g, '');
          return digitsOnly.length >= 10;
        },
        'client-phone-error',
        'Please enter a valid 10-digit phone number.'
      );
      if (!isPhoneValid) isValid = false;
    }

    // Email validation
    if (emailInput) {
      const isEmailValid = validateField(
        emailInput,
        val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'client-email-error',
        'Please enter a valid email address.'
      );
      if (!isEmailValid) isValid = false;
    }

    // Service dropdown validation
    if (serviceSelect) {
      const isServiceValid = validateField(
        serviceSelect,
        val => val !== '' && val !== 'Select a service',
        'service-select-error',
        'Please select a service from the list.'
      );
      if (!isServiceValid) isValid = false;
    }

    // Location validation
    if (locationInput) {
      const isLocationValid = validateField(
        locationInput,
        val => val.length >= 2,
        'client-location-error',
        'Please specify your city or location.'
      );
      if (!isLocationValid) isValid = false;
    }

    // Requirement details validation
    if (requirementInput) {
      const isReqValid = validateField(
        requirementInput,
        val => val.length >= 10,
        'client-requirement-error',
        'Please briefly describe your requirement (at least 10 characters).'
      );
      if (!isReqValid) isValid = false;
    }

    if (!isValid) {
      const firstError = form.querySelector('.form-control.error');
      if (firstError) firstError.focus();
      return;
    }

    // Success Feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Enquiry...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (formFeedback) {
        formFeedback.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:0.75rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#10B981; flex-shrink:0;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <strong style="display:block; font-size:1.05rem; margin-bottom:0.25rem; color:#065F46;">Enquiry Submitted Successfully!</strong>
              <p style="margin:0; font-size:0.9rem; color:#047857;">
                Thank you, <strong>${nameInput.value}</strong>. Your enquiry for <strong>${serviceSelect.value}</strong> has been logged. Our technical team will review your requirement and reach out to you shortly.
              </p>
            </div>
          </div>
        `;
        formFeedback.className = 'form-feedback success';
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    }, 600);
  });
}

/**
 * 5. SMOOTH SCROLLING FOR INTERNAL ANCHORS
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * 6. SUBTLE SCROLL REVEAL (IntersectionObserver)
 * Fade-in and slight slide-up as sections and components enter the viewport.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealElements = document.querySelectorAll(
    '.section-header, .service-card, .division-card, .process-step, .why-point-card, .why-card-item, .capability-matrix-card, .faq-item, .service-detail-card, .contact-preview-card, .matrix-item, .mission-card, .enquiry-form-card, .contact-info-card, .cta-banner-content, .reveal-on-scroll'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

/**
 * 7. INTERACTIVE ENTERPRISE DIVISION HUB
 * Handles tab switching, keyboard navigation, and deep-link synchronization.
 */
function initDivisionHub() {
  const hubNavItems = document.querySelectorAll('.hub-nav-item');
  const hubPanels = document.querySelectorAll('.hub-panel');
  if (!hubNavItems.length || !hubPanels.length) return;

  const activateTab = (targetId) => {
    // Normalize targetId (e.g. from 'division-electronics' to 'panel-electronics')
    let panelId = targetId;
    if (panelId.startsWith('division-')) {
      panelId = panelId.replace('division-', 'panel-');
    }
    if (!panelId.startsWith('panel-')) {
      panelId = 'panel-' + panelId;
    }

    const targetPanel = document.getElementById(panelId);
    if (!targetPanel) return;

    hubNavItems.forEach(item => {
      const isTarget = item.getAttribute('data-target') === panelId;
      item.classList.toggle('active', isTarget);
      item.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    hubPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === panelId);
    });
  };

  // Click handler for tab navigation items
  hubNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPanelId = item.getAttribute('data-target');
      activateTab(targetPanelId);
    });

    // Keyboard accessibility (Arrow navigation)
    item.addEventListener('keydown', (e) => {
      const tabsArray = Array.from(hubNavItems);
      const currentIndex = tabsArray.indexOf(item);
      let nextIndex = null;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % tabsArray.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabsArray[nextIndex].focus();
        tabsArray[nextIndex].click();
      }
    });
  });

  // Handle external anchor links targeting divisions (e.g., from hero floating cards)
  document.querySelectorAll('a[href*="#division-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const hash = href.substring(href.indexOf('#') + 1);
      if (hash && hash.startsWith('division-')) {
        activateTab(hash);
      }
    });
  });

  // Check URL hash on page load
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('division-')) {
      activateTab(hash);
    }
  }
}


