// script.js (cleaned & consolidated)
// Scroll to top when page loads or refreshes
window.onload = window.onbeforeunload = function() {
  window.scrollTo(0, 0);
};

// Certificate Modal Functionality
const modal = document.getElementById('certificate-modal');
const modalImg = document.getElementById('certificate-image');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-modal');

// Open modal when clicking on view certificate link
document.querySelectorAll('.view-certificate').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const imgSrc = this.getAttribute('href');
        if (imgSrc) {
            modalImg.src = imgSrc;
            modalImg.alt = this.previousElementSibling?.textContent || 'Certificate';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    });
});

// Close modal when clicking the close button
closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close modal when clicking outside the image
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

document.addEventListener('DOMContentLoaded', () => {
  /* ============================
     Cache DOM elements
     ============================ */
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('toggle-icon');
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYear = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const searchBtn = document.getElementById('search-btn');

  // Project slider elements
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  const indicators = Array.from(document.querySelectorAll('.indicator'));

  // Skills marquee elements
  const skillsTrack = document.querySelector('.skills-track');
  const skillCards = skillsTrack ? Array.from(skillsTrack.querySelectorAll('.skill-card')) : [];

  /* ============================
     Utilities
     ============================ */
  const safeQuery = (sel, parent = document) => parent.querySelector(sel);

  // Small helper to create notifications
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = message;

    // Basic inline styles (keeps it self-contained)
    Object.assign(n.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '14px 20px',
      borderRadius: '6px',
      color: '#fff',
      zIndex: '1200',
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      transform: 'translateY(20px)',
      opacity: '0',
      transition: 'all 0.28s ease',
      fontFamily: 'Poppins, sans-serif',
    });

    n.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    document.body.appendChild(n);

    // animate in
    requestAnimationFrame(() => {
      n.style.transform = 'translateY(0)';
      n.style.opacity = '1';
    });

    setTimeout(() => {
      n.style.transform = 'translateY(20px)';
      n.style.opacity = '0';
      setTimeout(() => n.remove(), 300);
    }, 4500);
  }

  /* ============================
     Year in footer
     ============================ */
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ============================
     Theme toggle (persisted)
     ============================ */
  (function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      body.setAttribute('data-theme', 'dark');
      if (toggleIcon) toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
      if (themeToggle) themeToggle.checked = true;
    } else {
      body.removeAttribute('data-theme');
      if (toggleIcon) toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
      if (themeToggle) themeToggle.checked = false;
    }

    if (themeToggle) {
      themeToggle.addEventListener('change', () => {
        const isDark = themeToggle.checked;
        if (isDark) {
          body.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          if (toggleIcon) toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          body.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          if (toggleIcon) toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }
      });

      // Also allow clicking the icon to toggle
      if (toggleIcon) {
        toggleIcon.addEventListener('click', () => {
          themeToggle.checked = !themeToggle.checked;
          themeToggle.dispatchEvent(new Event('change'));
        });
      }
    }
  })();

  /* ============================
     Mobile nav / hamburger
     ============================ */
  (function initMobileNav() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      const active = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = active ? 'hidden' : '';
    });

    // Close when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  })();

  /* ============================
     Smooth scrolling for anchors
     ============================ */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const offset = 80; // navbar offset
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();

  /* ============================
     Back to top button (throttled)
     ============================ */
  (function initBackToTop() {
    if (!backToTopBtn) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
          } else {
            backToTopBtn.classList.remove('active');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ============================
     Active nav link on scroll
     ============================ */
  (function initActiveNav() {
    if (!sections.length || !navItems.length) return;

    const sectionMap = Array.from(sections).map(s => ({
      id: s.id,
      top: () => s.getBoundingClientRect().top + window.pageYOffset
    }));

    let lastActive = null;
    function updateActive() {
      const scrollPos = window.pageYOffset + 100; // threshold
      let current = sectionMap[0].id;
      for (let i = 0; i < sectionMap.length; i++) {
        if (scrollPos >= sectionMap[i].top()) current = sectionMap[i].id;
      }

      if (lastActive === current) return;
      lastActive = current;

      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
      });
    }

    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActive);
    }, { passive: true });

    // run once on load
    updateActive();
  })();

  /* ============================
     Contact form (validation + UI)
     ============================ */
  (function initContactForm() {
    if (!contactForm) return;

    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameEl = contactForm.querySelector('#name');
      const emailEl = contactForm.querySelector('#email');
      const subjectEl = contactForm.querySelector('#subject');
      const messageEl = contactForm.querySelector('#message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const subject = subjectEl ? subjectEl.value.trim() : '';
      const message = messageEl ? messageEl.value.trim() : '';

      if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // disable submit
      const originalText = submitBtn ? submitBtn.innerHTML : 'Sending...';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        // Simulate network request (replace with actual fetch to server)
        await new Promise(resolve => setTimeout(resolve, 900));
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
      } catch (err) {
        console.error('Contact submit error', err);
        showNotification('Something went wrong. Please try again later.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  })();

  /* ============================
     Enhanced Search functionality
     ============================ */
  (function initSearch() {
    if (!searchBtn) return;

    // Create search modal
    function createSearchModal() {
      const modal = document.createElement('div');
      modal.id = 'search-modal';
      modal.innerHTML = `
        <div class="search-modal-content">
          <div class="search-header">
            <h3>Search Portfolio</h3>
            <button class="search-close">&times;</button>
          </div>
          <div class="search-input-wrapper">
            <input type="text" id="search-input" placeholder="Type to search (e.g., skills, projects, contact)..." autocomplete="off">
            <div class="search-results-count"></div>
          </div>
          <div class="search-results" id="search-results"></div>
        </div>
      `;
      document.body.appendChild(modal);
      return modal;
    }

    const modal = createSearchModal();
    const searchInput = modal.querySelector('#search-input');
    const searchResults = modal.querySelector('#search-results');
    const resultsCount = modal.querySelector('.search-results-count');
    const closeBtn = modal.querySelector('.search-close');

    // Searchable content mapping
    const searchableContent = [
      { id: 'about', title: 'About', keywords: ['about', 'profile', 'introduction', 'who', 'me'], content: 'Learn about my background and skills' },
      { id: 'skills', title: 'Skills', keywords: ['skills', 'technologies', 'programming', 'coding', 'html', 'css', 'javascript', 'python', 'c', 'c++', 'git', 'mysql'], content: 'Technical skills and programming languages' },
      { id: 'projects', title: 'Projects', keywords: ['projects', 'work', 'portfolio', 'showcase', 'development'], content: 'Featured projects and work samples' },
      { id: 'experience', title: 'Work Experience', keywords: ['experience', 'work', 'job', 'career', 'internship', 'employment'], content: 'Professional work experience and internships' },
      { id: 'education', title: 'Education', keywords: ['education', 'academic', 'school', 'university', 'college', 'degree'], content: 'Educational background and qualifications' },
      { id: 'contact', title: 'Contact', keywords: ['contact', 'email', 'phone', 'reach', 'message', 'get in touch'], content: 'Contact information and form' }
    ];

    function performSearch(query) {
      const searchTerm = query.toLowerCase().trim();
      
      if (!searchTerm) {
        searchResults.innerHTML = '';
        resultsCount.textContent = '';
        return [];
      }

      const results = searchableContent.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const keywordMatch = item.keywords.some(keyword => keyword.includes(searchTerm));
        const contentMatch = item.content.toLowerCase().includes(searchTerm);
        return titleMatch || keywordMatch || contentMatch;
      });

      return results;
    }

    function displayResults(results, query) {
      searchResults.innerHTML = '';
      
      if (results.length === 0) {
        searchResults.innerHTML = `
          <div class="search-no-results">
            <p>No results found for "<strong>${query}</strong>"</p>
            <p>Try searching for: skills, projects, contact, about, education, experience</p>
          </div>
        `;
        resultsCount.textContent = 'No results';
        return;
      }

      resultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
      
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
          <h4>${result.title}</h4>
          <p>${result.content}</p>
          <div class="search-keywords">
            ${result.keywords.slice(0, 3).map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
          </div>
        `;
        
        resultItem.addEventListener('click', () => {
          const section = document.getElementById(result.id);
          if (section) {
            closeModal();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight the section briefly
            section.style.transition = 'background-color 0.3s ease';
            section.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
            setTimeout(() => {
              section.style.backgroundColor = '';
            }, 2000);
          }
        });
        
        searchResults.appendChild(resultItem);
      });
    }

    function openModal() {
      modal.style.display = 'flex';
      searchInput.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.style.display = 'none';
      searchInput.value = '';
      searchResults.innerHTML = '';
      resultsCount.textContent = '';
      document.body.style.overflow = '';
    }

    // Event listeners
    searchBtn.addEventListener('click', openModal);
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Search input handler with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value;
        const results = performSearch(query);
        displayResults(results, query);
      }, 300);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Enter' && searchResults.firstChild) {
        searchResults.firstChild.click();
      }
    });

    // Close modal when clicking outside
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  })();

  /* ============================
     Enhanced Intersection Observer animations
     ============================ */
  (function initObservers() {
    // Animation class mapping for different element types
    const animationClasses = {
      '.skill-card': 'bounce-in',
      '.project-card': 'scale-in',
      '.timeline-item': 'fade-in-left',
      '.education-card': 'fade-in-right',
      '.contact-item': 'fade-in-up',
      '.section-title': 'slide-in-left',
      '.about-content': 'fade-in-up',
      '.profile-image': 'rotate-in',
      '.nav-link': 'fade-in-up',
      '.btn-primary': 'bounce-in',
      '.btn-secondary': 'bounce-in'
    };

    // Add animation classes to elements
    Object.keys(animationClasses).forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('animate-on-scroll', animationClasses[selector]);
      });
    });

    // Add stagger animation to containers with multiple children
    const staggerContainers = document.querySelectorAll('.skills-track, .education-container, .timeline');
    staggerContainers.forEach(container => {
      container.classList.add('stagger-animation');
    });

    // Add floating animation to specific elements
    const floatingElements = document.querySelectorAll('.profile-image');
    floatingElements.forEach(el => {
      el.classList.add('floating');
    });

    // Add glow animation to theme toggle and search button
    const glowElements = document.querySelectorAll('#theme-toggle, #search-btn');
    glowElements.forEach(el => {
      el.classList.add('glow');
    });

    // Enhanced Intersection Observer
    if ('IntersectionObserver' in window) {
      const obsOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            // Add animation classes
            if (target.classList.contains('animate-on-scroll')) {
              target.style.animationDelay = `${index * 0.1}s`;
            }

            if (target.classList.contains('btn-secondary')) {
              target.style.animationDelay = '0.2s';
            }

            if (target.classList.contains('profile-image')) {
              target.style.animationDelay = '0.3s';
            }
            
            target.classList.add('animated');
            observer.unobserve(target);
          }
        });
      }, obsOptions);

      // Observe elements
      const animatedElements = document.querySelectorAll('.animate-on-scroll, .btn-secondary, .profile-image');
      animatedElements.forEach(el => observer.observe(el));

      // Check for elements already in viewport on page load
      setTimeout(() => {
        animatedElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInViewport && !el.classList.contains('animated')) {
            el.classList.add('animated');
          }
        });
      }, 100);

      // Observe stagger containers
      document.querySelectorAll('.stagger-animation').forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
          child.dataset.delay = `${index * 100}`;
          observer.observe(child);
        });
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
      });
    }

    // Add entrance animations on page load
    window.addEventListener('load', () => {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        document.body.style.opacity = '1';
        
        // Animate hero section immediately
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, index * 200);
        });
      }, 100);
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-content');
        if (parallax) {
          parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
      });
    }

    // Add mouse move effect for cards
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.skill-card, .project-card, .education-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        
        if (distance < maxDistance) {
          const intensity = 1 - (distance / maxDistance);
          card.style.transform = `perspective(1000px) rotateY(${x * intensity * 0.1}deg) rotateX(${-y * intensity * 0.1}deg) scale(${1 + intensity * 0.02})`;
        }
      });
    });

    // Reset card transform on mouse leave
    document.addEventListener('mouseleave', () => {
      const cards = document.querySelectorAll('.skill-card, .project-card, .education-card');
      cards.forEach(card => {
        card.style.transform = '';
      });
    });
  })();

  /* ============================
     Skills marquee + center zoom
     ============================ */
  (function initSkillsMarquee() {
    if (!skillsTrack || !skillCards.length) return;

    // If the author has already duplicated items for seamless scrolling (they have),
    // we just read them. Otherwise we could clone children to make loop.
    let rafId = null;
    let paused = false;

    // Calculate center scaling each frame
    function updateScale() {
      const parentRect = skillsTrack.getBoundingClientRect();
      const centerX = parentRect.left + parentRect.width / 2;

      skillCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - cardCenter);
        const maxDistance = parentRect.width / 2;
        const norm = Math.min(1, distance / maxDistance); // 0 (center) -> 1 (edge)
        const scale = 1 + (0.28 * (1 - norm)); // 1.28 -> 1
        const opacity = 0.7 + (0.3 * (1 - norm));
        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
        // special style for center
        if (distance < Math.min(100, rect.width)) {
          card.style.zIndex = 20;
          card.style.boxShadow = '0 15px 40px rgba(108, 99, 255, 0.35)';
          const icon = card.querySelector('i');
          const title = card.querySelector('h3');
          if (icon) icon.style.fontSize = '3.8rem';
          if (title) title.style.fontSize = '1.35rem';
        } else {
          card.style.zIndex = '';
          card.style.boxShadow = '';
          const icon = card.querySelector('i');
          const title = card.querySelector('h3');
          if (icon) icon.style.fontSize = '3rem';
          if (title) title.style.fontSize = '1.1rem';
        }
      });

      rafId = requestAnimationFrame(() => {
        if (!paused) updateScale();
      });
    }

    // start
    rafId = requestAnimationFrame(updateScale);

    // Pause scaling while user hovers to avoid jitter
    const parent = skillsTrack.parentElement;
    parent.addEventListener('mouseenter', () => {
      paused = true;
      if (rafId) cancelAnimationFrame(rafId);
    });
    parent.addEventListener('mouseleave', () => {
      paused = false;
      rafId = requestAnimationFrame(updateScale);
    });

    // Recompute on resize
    window.addEventListener('resize', () => {
      if (!paused) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateScale);
      }
    }, { passive: true });
  })();

  /* ============================
     Project slider (clean)
     ============================ */
  (function initProjectSlider() {
    if (!projectCards.length) return;

    // ensure CSS transitions are in place (project-card already has CSS)
    projectCards.forEach(card => {
      // ensure initial transform & transition values (sensible defaults if CSS missing)
      card.style.transition = card.style.transition || 'transform 0.36s ease, opacity 0.36s ease';
      card.style.transformStyle = 'preserve-3d';
    });

    // Hide all but current
    let currentIndex = 0;

    function showProject(index) {
      const total = projectCards.length;
      if (total === 0) return;

      let next = index;
      if (index < 0) next = total - 1;
      if (index >= total) next = 0;

      if (next === currentIndex) return;

      const outCard = projectCards[currentIndex];
      const inCard = projectCards[next];

      // Animate out
      outCard.style.transform = 'rotateY(-80deg)';
      outCard.style.opacity = '0';

      // After out animation, hide it and show incoming card
      setTimeout(() => {
        outCard.style.display = 'none';
        outCard.classList.remove('active');

        inCard.style.display = 'block';
        inCard.style.transform = 'rotateY(80deg)';
        inCard.style.opacity = '0';
        // small timeout to allow style to apply
        requestAnimationFrame(() => {
          inCard.style.transform = 'rotateY(0deg)';
          inCard.style.opacity = '1';
          inCard.classList.add('active');
        });
      }, 260); // matches transition timing

      currentIndex = next;
      updateIndicators();
    }

    function updateIndicators() {
      indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // init: hide all then show 0
    projectCards.forEach((card, i) => {
      card.style.display = 'none';
      card.style.opacity = '0';
      card.classList.remove('active');
      // Add role for accessibility
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'project slide');
      card.setAttribute('aria-hidden', 'true');
    });

    projectCards[0].style.display = 'block';
    projectCards[0].style.opacity = '1';
    projectCards[0].classList.add('active');
    projectCards[0].setAttribute('aria-hidden', 'false');
    updateIndicators();

    // attach events
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showProject(currentIndex + 1));
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showProject(currentIndex - 1));
    }

    // indicators click
    indicators.forEach((dot, idx) => {
      dot.addEventListener('click', () => showProject(idx));
    });
  })();

  /* ============================
     Safety: small console hints if critical elements missing
     ============================ */
  (function sanityChecks() {
    if (!projectCards.length) console.warn('No .project-card elements found.');
    if (!skillsTrack) console.warn('No .skills-track found.');
    if (!document.querySelector('.profile-image')) {
      // not critical: your HTML uses .profile-image, but if missing, don't break
    }
  })();

  /* ============================
     Clean exit
     ============================ */
  // End of DOMContentLoaded
});
