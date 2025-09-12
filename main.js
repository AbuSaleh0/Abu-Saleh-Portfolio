// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.contains('open');
  mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', !isOpen);
});

// Close mobile nav when link is clicked
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Project Modal
const modal = document.querySelector('.project-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
let focusableElements = [];
let firstFocusable, lastFocusable;

function openModal(projectCard) {
  const title = projectCard.querySelector('h3').textContent;
  const description = projectCard.querySelector('p').textContent;
  const techList = Array.from(projectCard.querySelectorAll('.tech-list li')).map(li => li.textContent);
  
  modal.querySelector('.modal-header h2').textContent = title;
  modal.querySelector('.modal-body').innerHTML = `
    <p>${description}</p>
    <h3>Technologies Used</h3>
    <ul>${techList.map(tech => `<li>${tech}</li>`).join('')}</ul>
  `;
  
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  firstFocusable = focusableElements[0];
  lastFocusable = focusableElements[focusableElements.length - 1];
  firstFocusable?.focus();
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.btn-case-study').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectCard = btn.closest('.project-card');
    openModal(projectCard);
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

modal?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  }
});

// Back to Top
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Contact Form
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
}

function validateForm(formData) {
  const errors = [];
  if (!formData.get('name')?.trim()) errors.push('Name is required');
  if (!formData.get('email')?.trim()) errors.push('Email is required');
  if (!/\S+@\S+\.\S+/.test(formData.get('email'))) errors.push('Email is invalid');
  if (!formData.get('subject')?.trim()) errors.push('Subject is required');
  if (!formData.get('message')?.trim()) errors.push('Message is required');
  return errors;
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  
  // Ignore honeypot field
  if (formData.get('website')) return;
  
  const errors = validateForm(formData);
  if (errors.length > 0) {
    showStatus(errors.join(', '), 'error');
    return;
  }
  
  try {
    const response = await fetch("/", {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });
    
    if (response.ok) {
      showStatus('Message sent successfully!', 'success');
      contactForm.reset();
    } else {
      showStatus('Failed to send message. Please try again.', 'error');
    }
  } catch (error) {
    showStatus('Network error. Please try again.', 'error');
  }
});

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-on-scroll');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section, .project-card, .skill, .timeline-item').forEach(el => {
  observer.observe(el);
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list a[href^="#"], .nav-list a[href$=".html"]');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${id}` || 
            (id === 'home' && link.getAttribute('href').includes('index.html'))) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Initialize
initTheme();
updateActiveNav();