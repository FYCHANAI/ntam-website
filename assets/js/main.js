document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Team Bio Modals (Team Page)
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalName = document.querySelector('.modal-name');
  const modalTitle = document.querySelector('.modal-title');
  const modalBioText = document.querySelector('.modal-bio-text');
  const viewBioBtns = document.querySelectorAll('.btn-view-bio');

  let activeElementBeforeModal = null;

  if (modalOverlay && modalCloseBtn && viewBioBtns.length > 0) {
    const openModal = (name, title, bioContent) => {
      activeElementBeforeModal = document.activeElement;
      
      modalName.textContent = name;
      modalTitle.textContent = title;
      modalBioText.innerHTML = bioContent;
      
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      
      // Accessibility: Focus close button
      modalCloseBtn.focus();
    };

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      if (activeElementBeforeModal) {
        activeElementBeforeModal.focus();
      }
    };

    viewBioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.team-member-card');
        const name = card.querySelector('h4').textContent;
        const title = card.querySelector('.title').textContent;
        // Grab detailed bio stored inside hidden element
        const bioHtml = card.querySelector('.full-bio-content').innerHTML;
        openModal(name, title, bioHtml);
      });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Trap focus inside modal for accessibility
    modalOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalOverlay.querySelectorAll('button, [tabindex="0"]');
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    });
  }

  // 3. Contact Form handling (Contact Section/Page)
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Reset message state
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';

      // Validation
      if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all required fields (Name, Email, Message).';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      // Simple email format regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please provide a valid email address.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      // Enter submitting state
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }
      formMessage.textContent = 'Submitting...';
      formMessage.className = 'form-message success';
      formMessage.style.display = 'block';

      // Send via Web3Forms — automatically gathers all fields, including the hidden access_key
      try {
        const payload = Object.fromEntries(new FormData(contactForm).entries());
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.success) {
          formMessage.textContent = 'Thank you! Your message has been sent. We will get back to you shortly.';
          formMessage.className = 'form-message success';
          contactForm.reset();
        } else {
          formMessage.textContent = 'Sorry, your message could not be sent. Please email us directly at info@ntam.com.hk.';
          formMessage.className = 'form-message error';
        }
      } catch (err) {
        formMessage.textContent = 'Network error. Please email us directly at info@ntam.com.hk.';
        formMessage.className = 'form-message error';
      } finally {
        formMessage.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }
});
