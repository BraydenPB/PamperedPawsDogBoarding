/* =============================================
   PAMPERED PAWS — MAIN SCRIPT
   ============================================= */

(function () {
  'use strict';

  // ── NAV: scroll behaviour & mobile menu ──────────────────────
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── SMOOTH SCROLL for all anchor links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── REVEAL ANIMATION (IntersectionObserver) ──────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));

  // Also trigger reveals for hero on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 200);
    });
  });

  // ── SERVICE CARDS: staggered reveal ─────────────────────────
  const serviceCards = document.querySelectorAll('.service-card');
  const cardObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease, border-color 0.3s ease';
    cardObserver.observe(card);
  });

  // ── TESTIMONIALS CAROUSEL ────────────────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimonialDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let visibleCards = 3;

    function getVisibleCards() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.ceil(cards.length / getVisibleCards());
    }

    // Create dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      visibleCards = getVisibleCards();
      const max = totalSlides() - 1;
      currentIndex = Math.max(0, Math.min(index, max));
      const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
      track.style.transform = `translateX(-${currentIndex * visibleCards * cardWidth}px)`;
      updateDots();
    }

    function next() { goTo(currentIndex + 1 >= totalSlides() ? 0 : currentIndex + 1); }
    function prev() { goTo(currentIndex - 1 < 0 ? totalSlides() - 1 : currentIndex - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Drag/swipe
    track.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      track.style.transition = 'none';
    });
    window.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 60) diff < 0 ? next() : prev();
      else goTo(currentIndex);
    });
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      track.style.transition = 'none';
    }, { passive: true });
    track.addEventListener('touchend', e => {
      track.style.transition = '';
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 60) diff < 0 ? next() : prev();
      else goTo(currentIndex);
    }, { passive: true });

    // Auto-advance
    let autoplay = setInterval(next, 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => { autoplay = setInterval(next, 5000); });

    buildDots();
    window.addEventListener('resize', () => { buildDots(); goTo(currentIndex); });
  }

  // ── PRICING TOGGLE ───────────────────────────────────────────
  const pricingToggle = document.getElementById('pricingToggle');
  const overnightLabel = document.getElementById('overnightLabel');
  const daycareLabel = document.getElementById('daycareLabel');

  if (pricingToggle) {
    let isDaycare = false;

    pricingToggle.addEventListener('click', () => {
      isDaycare = !isDaycare;
      pricingToggle.setAttribute('aria-checked', isDaycare.toString());

      overnightLabel.classList.toggle('active', !isDaycare);
      daycareLabel.classList.toggle('active', isDaycare);

      // Update period labels
      document.querySelectorAll('.price-card__period').forEach(el => {
        el.textContent = isDaycare ? '/day' : '/night';
      });

      // Animate price change
      document.querySelectorAll('.price-card__amount').forEach(el => {
        el.style.transform = 'translateY(-8px)';
        el.style.opacity = '0';
        setTimeout(() => {
          const price = isDaycare ? el.dataset.daycare : el.dataset.overnight;
          el.textContent = '$' + price;
          el.style.transform = 'translateY(8px)';
          setTimeout(() => {
            el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
          }, 50);
        }, 150);
      });
    });
  }

  // ── FAQ ACCORDION ────────────────────────────────────────────
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  // Open first FAQ by default
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');

  // ── CONTACT FORM ─────────────────────────────────────────────
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    function validateField(id, errorId, test, message) {
      const field = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!field || !error) return true;
      const valid = test(field.value.trim());
      field.classList.toggle('error', !valid);
      error.textContent = valid ? '' : message;
      return valid;
    }

    function validateAll() {
      const results = [
        validateField('ownerName', 'ownerNameError',
          v => v.length >= 2, 'Please enter your name.'),
        validateField('email', 'emailError',
          v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.'),
        validateField('dogName', 'dogNameError',
          v => v.length >= 1, "Please enter your dog's name."),
        validateField('service', 'serviceError',
          v => v !== '', 'Please select a service.'),
      ];
      // Terms
      const terms = document.getElementById('terms');
      const termsError = document.getElementById('termsError');
      if (terms && !terms.checked) {
        termsError.textContent = 'Please confirm your dog\'s vaccination status.';
        results.push(false);
      } else if (termsError) {
        termsError.textContent = '';
      }
      return results.every(Boolean);
    }

    // Live validation on blur
    ['ownerName', 'email', 'dogName', 'service'].forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('blur', validateAll);
        field.addEventListener('input', () => {
          field.classList.remove('error');
          const errorEl = document.getElementById(id + 'Error');
          if (errorEl) errorEl.textContent = '';
        });
      }
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateAll()) return;

      // Simulate submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 1800));

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');
      form.reset();

      // Scroll to success
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Hide success after 8 seconds
      setTimeout(() => formSuccess.classList.remove('visible'), 8000);
    });
  }

  // ── ACTIVE NAV LINK on scroll ────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const activeLinkObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            link.style.background = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = 'var(--amber)';
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' }
  );
  sections.forEach(s => activeLinkObserver.observe(s));

  // ── GALLERY items: scroll reveal ─────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, idx * 80);
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );
  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.92)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    galleryObserver.observe(item);
  });

  // ── DATE FIELDS: set min to today ────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  if (checkin) checkin.min = today;
  if (checkout) checkout.min = today;
  if (checkin && checkout) {
    checkin.addEventListener('change', () => {
      checkout.min = checkin.value || today;
      if (checkout.value && checkout.value < checkin.value) {
        checkout.value = checkin.value;
      }
    });
  }

})();
