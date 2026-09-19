/**
 * ==========================================================================
 * RHEUMORA — RHEUMATOLOGY & AUTOIMMUNE CARE CENTER
 * Core Application Logic (Theme, RTL, Navigation, Drawer, Validation, Hero)
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME MANAGEMENT (LIGHT / DARK)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'rheumora_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleIcons(theme);
  }

  function updateThemeToggleIcons(theme) {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'ph ph-sun';
          btn.setAttribute('aria-label', 'Switch to light theme');
        } else {
          icon.className = 'ph ph-moon';
          btn.setAttribute('aria-label', 'Switch to dark theme');
        }
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // --------------------------------------------------------------------------
  // 2. RTL MANAGEMENT
  // --------------------------------------------------------------------------
  const RTL_STORAGE_KEY = 'rheumora_direction';

  function initDirection() {
    const savedDir = localStorage.getItem(RTL_STORAGE_KEY) || 'ltr';
    applyDirection(savedDir);
  }

  function applyDirection(dir) {
    document.body.classList.add('disable-transitions');

    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }
    
    // Force reflow to apply the CSS changes immediately without transition
    void document.body.offsetHeight;

    setTimeout(() => {
      document.body.classList.remove('disable-transitions');
    }, 50);

    localStorage.setItem(RTL_STORAGE_KEY, dir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(nextDir);
  }

  // --------------------------------------------------------------------------
  // 3. NAVIGATION & MOBILE DRAWER (<= 1024px)
  // --------------------------------------------------------------------------
  function setupNavigation() {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const closeBtn = document.getElementById('drawerCloseBtn');

    // Sticky Header styling on scroll
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Open Drawer
    function openDrawer() {
      if (drawer && backdrop) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    // Close Drawer
    function closeDrawer() {
      if (drawer && backdrop) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close drawer when clicking nav links
    if (drawer) {
      const links = drawer.querySelectorAll('.drawer-link');
      links.forEach(link => {
        link.addEventListener('click', closeDrawer);
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Theme toggle buttons click event
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // RTL toggle buttons click event
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });
  }

  // --------------------------------------------------------------------------
  // 4. HERO TYPEWRITER / ROTATING WORDS
  // --------------------------------------------------------------------------
  function setupHeroTypewriter() {
    const typewriterEl = document.querySelector('.typewriter-word');
    if (!typewriterEl) return;

    const words = [
      'Remission',
      'Mobility',
      'Relief',
      'Vitality',
      'Empowerment'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 60;
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 1800; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
  }

  // --------------------------------------------------------------------------
  // 5. CLIENT-SIDE FORM VALIDATION (STEP 12)
  // --------------------------------------------------------------------------
  function setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate="true"]');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      const submitBtn = form.querySelector('button[type="submit"]');
      const alertBox = form.querySelector('.alert-box');

      // Realtime validation on blur & input
      inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group && group.classList.contains('has-error')) {
            validateField(input);
          }
          // If password changes, re-validate confirm_password if present
          if (input.type === 'password' && input.name === 'password') {
            const confirmInput = form.querySelector('input[name="confirm_password"]');
            if (confirmInput && confirmInput.value) {
              validateField(confirmInput);
            }
          }
        });
      });

      // Submit listener
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;
        inputs.forEach(input => {
          if (!validateField(input)) {
            isFormValid = false;
          }
        });

        // Check terms checkbox if present
        const termsCheckbox = form.querySelector('input[name="terms"]');
        if (termsCheckbox && !termsCheckbox.checked) {
          isFormValid = false;
          const group = termsCheckbox.closest('.form-checkbox-row') || termsCheckbox.parentElement;
          group.style.color = 'var(--color-error)';
        } else if (termsCheckbox) {
          const group = termsCheckbox.closest('.form-checkbox-row') || termsCheckbox.parentElement;
          group.style.color = '';
        }

        if (isFormValid) {
          // Success State
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
          }

          setTimeout(() => {
            if (alertBox) {
              alertBox.className = 'alert-box success show';
              alertBox.textContent = form.getAttribute('data-success-msg') || 'Thank you! Your submission was received successfully. Our clinical team will reach out promptly.';
            }
            form.reset();
            inputs.forEach(input => {
              const group = input.closest('.form-group');
              if (group) {
                group.classList.remove('has-success', 'has-error');
              }
            });

            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submitted';
            }
          }, 600);
        } else {
          if (alertBox) {
            alertBox.className = 'alert-box error show';
            alertBox.textContent = 'Please correct the highlighted fields before submitting.';
          }
        }
      });
    });
  }

  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;

    const errorMsg = group.querySelector('.form-error-msg');
    let isValid = true;
    let message = '';

    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');

    if (isRequired && !value) {
      isValid = false;
      message = 'This field is required.';
    } else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (input.type === 'password' && input.name === 'password' && value) {
      if (value.length < 8) {
        isValid = false;
        message = 'Password must be at least 8 characters.';
      }
    } else if (input.name === 'confirm_password' && value) {
      const pwdInput = input.form ? input.form.querySelector('input[name="password"]') : null;
      if (pwdInput && value !== pwdInput.value) {
        isValid = false;
        message = 'Passwords do not match.';
      }
    }

    if (!isValid) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      if (errorMsg) errorMsg.textContent = message;
    } else {
      group.classList.remove('has-error');
      if (value) group.classList.add('has-success');
      if (errorMsg) errorMsg.textContent = '';
    }

    return isValid;
  }

  // --------------------------------------------------------------------------
  // 6. HOME 2 INTERACTIVE JOINT & SYMPTOM NAVIGATOR
  // --------------------------------------------------------------------------
  function setupJointNavigator() {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    const panel = document.getElementById('navigatorPanel');
    if (!tabBtns.length || !panel) return;

    const jointData = {
      hands: {
        title: 'Small Joints: Hands, Wrists & Fingers',
        desc: 'Symmetric swelling, early morning stiffness persisting over 45 minutes, and MCP/PIP joint tenderness are hallmarks of early Rheumatoid Arthritis or Psoriatic Arthritis. Early ultrasound diagnostics prevent irreversible joint erosions.',
        tags: ['Morning Stiffness > 45m', 'Symmetric Swelling', 'Grip Weakness', 'Tenosynovitis'],
        img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
        recommendation: 'Targeted High-Resolution Musculoskeletal Ultrasound & Anti-CCP Serology'
      },
      spine: {
        title: 'Axial Spine, Neck & Sacroiliac Joints',
        desc: 'Inflammatory back pain that awakens you during the second half of the night, improves with active exercise rather than rest, and presents before age 45 points toward Axial Spondyloarthritis (Ankylosing Spondylitis).',
        tags: ['Night-Time Awakening', 'Improves With Movement', 'HLA-B27 Marker', 'Sacroiliitis'],
        img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        recommendation: 'Pelvic & Whole-Spine MRI Protocol with Targeted Anti-TNF / IL-17 Planning'
      },
      knees: {
        title: 'Large Weight-Bearing Joints: Knees & Hips',
        desc: 'Persistent knee effusion, warmth, and redness without clear trauma may signify reactive arthritis, crystal arthropathy (Gout/CPPD), or systemic autoimmune flare. Direct joint aspiration and crystal analysis offer rapid clarity.',
        tags: ['Recurrent Effusions', 'Joint Heat / Erythema', 'Limited Flexion', 'Baker’s Cyst'],
        img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        recommendation: 'Synovial Fluid Cytology + Image-Guided Corticosteroid or Viscosupplementation'
      },
      systemic: {
        title: 'Systemic Autoimmune & Connective Tissue (Lupus / Sjögren’s)',
        desc: 'Unexplained debilitating fatigue, malar facial rash, dry eyes and mouth (sicca syndrome), photosensitivity, and Raynaud’s phenomenon in fingers indicate systemic connective tissue involvement requiring multidisciplinary care.',
        tags: ['Severe Fatigue', 'Malar Butterfly Rash', 'Raynaud Phenomenon', 'Sicca Syndrome'],
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        recommendation: 'Comprehensive ANA Multiplex, ENA Panel, Complement C3/C4 & Renal Monitoring'
      }
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-joint') || 'hands';
        const data = jointData[key];
        if (!data) return;

        const visualEl = panel.querySelector('.navigator-panel-visual img');
        const titleEl = panel.querySelector('.nav-detail-title');
        const descEl = panel.querySelector('.nav-detail-desc');
        const tagsContainer = panel.querySelector('.symptom-tag-list');
        const recEl = panel.querySelector('.nav-detail-rec');

        if (visualEl) visualEl.src = data.img;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (recEl) recEl.textContent = data.recommendation;

        if (tagsContainer) {
          tagsContainer.innerHTML = data.tags
            .map(t => `<span class="symptom-tag">${t}</span>`)
            .join('');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. COUNTDOWN TIMER (COMING SOON PAGE)
  // --------------------------------------------------------------------------
  function setupCountdown() {
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMinutes');
    const secsEl = document.getElementById('timerSeconds');

    if (!daysEl) return;

    // Target date: 45 days from today
    const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000);

    function update() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) return;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // --------------------------------------------------------------------------
  // 8. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // DOM READY INITIALIZATION
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDirection();
    setupNavigation();
    setupHeroTypewriter();
    setupFormValidation();
    setupJointNavigator();
    setupCountdown();
    setupBackToTop();
  });
})();
