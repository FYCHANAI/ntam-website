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


/* ===== Disclaimer gate (shows once per browser session) ===== */
(function () {
  var KEY = 'ntamDisclaimerAccepted';
  var accepted = false;
  try { accepted = sessionStorage.getItem(KEY) === 'yes'; } catch (e) {}
  if (accepted) return;

  function init() {
    var overlay = document.createElement('div');
    overlay.className = 'disclaimer-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'ntam-disclaimer-title');
    overlay.innerHTML =
      '<div class="disclaimer-panel">' +
        '<div class="disclaimer-scroll">' +
          '<h2 id="ntam-disclaimer-title">Nice Talent Asset Management Limited</h2>' +
          '<h3>Disclaimer</h3>' +
          '<p>By accessing this website and any of its pages, you accept the terms set out below. Nice Talent Asset Management Limited (\u201cCompany\u201d) may make any change(s) to these terms at any time by posting the updated terms on this website. By continuing to use this website following the posting of any change(s) to these terms, you signify your consent to the change(s) made. The Company also reserves the right to restrict, interrupt or terminate this website. No other form of notification will be delivered to you.</p>' +
          '<h4>1. Use of Information</h4>' +
          '<p>The information contained, and the investments (including but not limited to securities), products and services described, in this website is not intended to be made available to, and/or for use by, any person or any entity in any jurisdiction where such distribution or use would be contrary to the laws or regulations of such jurisdiction or would otherwise cause the Company to be subject to and/or violate any legal or regulatory requirement within such jurisdiction.</p>' +
          '<h4>2. No offer / advice</h4>' +
          '<p>Nothing contained in this web site constitutes or should be construed to constitute an offer, invitation, advice, recommendation or solicitation by the Company to buy, sell or otherwise deal with any investment, product or service. If you wish to invest in any of the investments/products or use any of the services mentioned in this web site, you should seek your own professional or other appropriate advice as and when necessary.</p>' +
          '<h4>3. Intellectual Property</h4>' +
          '<p>All contents and materials of this web site are protected by copyright and/or other intellectual property rights of the Company, the relevant information providers, the relevant licensors and other relevant third parties (including The Stock Exchange of Hong Kong Limited). No part of any such contents or materials may be copied, modified, reproduced, transmitted, disseminated, sold, distributed, published, displayed in public, broadcasted, circulated, stored for subsequent use or commercially exploited in any manner whatsoever and for any purpose without the prior written consent of the Company, the relevant information providers, the relevant licensors and other relevant third parties.</p>' +
          '<h4>4. Exclusion/Limitation of Liability</h4>' +
          '<p>While the information and materials contained in this web site have been obtained from sources believed to be reliable, such information and materials are provided on an \u201cas is\u201d basis without any representation, warranty or guarantee of any kind, whether express or implied, on the part of the Company and/or any relevant party, and is subject to change without prior notice. In particular, no representation, warranty or guarantee regarding non-infringement, security, accuracy, completeness, timeliness, reliability, fitness for any particular purpose or freedom from computer viruses is given in connection with such information and materials. Access to and/or use of this web site and/or its contents shall be at your own risks. In no event will the Company or any of its affiliates have any tortious, contractual or any other liability to you and/or any third party arising out of or in connection with any access to, use of or inability to access to this web site, or any reliance on any information or services provided in this web site (including but not limited to any direct, indirect, special, consequential, incidental or punitive damages whatsoever).</p>' +
          '<h4>5. Indemnification</h4>' +
          '<p>You will on demand indemnify the Company against all actions, claims, other liabilities and all costs suffered or incurred as a result of your use of this web site, including but not limited to the breach of any or all of these terms.</p>' +
          '<h4>6. Linked/Associated Sites</h4>' +
          '<p>Web sites linked to this web site are included for your convenience and information purpose only and have not been reviewed by the Company. The Company shall not be responsible for the contents of such linked web sites. Access to and use of such linked web sites are at your own risks and are subject to any terms and conditions applicable to such access or use. By providing links to these linked web sites, the Company shall not be deemed to endorse, recommend, approve, guarantee or introduce any third parties or the services/products they provide on their web site, or have any form of co-operation or association with such third parties and web sites. The Company is not a party to any contractual arrangements entered into between you and the provider of such linked web sites unless otherwise expressly specified or agreed to by the Company in writing.</p>' +
          '<h4>7. Risks Disclosure</h4>' +
          '<p>Transactions or communications over the internet may be subject to interruption, transmission blackout, delayed transmission and/or incorrect data transmission due to various reasons such as the public nature of the internet. The Company does not warrant or represent that any communication available or generated from this web site is free from virus or harmful components. The Company does not make any representations or warranties regarding the accuracy, functionality or performance of any third party software that may be used in connection with this web site. The Company assumes no liability whatsoever in this regard. You have sole responsibility for adequate protection and back up of data and for undertaking reasonable and appropriate precautions to scan for computer viruses or other destructive properties.</p>' +
          '<h4>8. Others</h4>' +
          '<p>(a) If there is any inconsistency between the English version and Chinese version of these terms, the English version shall prevail.</p>' +
          '<p>(b) These terms shall be governed by, and construed in accordance with, the laws of the Hong Kong Special Administrative Region, and you agree to submit to the jurisdiction of the courts of Hong Kong Special Administrative Region in respect of any matters or disputes arising under this web site.</p>' +
        '</div>' +
        '<div class="disclaimer-actions">' +
          '<button type="button" class="disclaimer-agree">I agree to accept all the above terms and conditions.</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    var btn = overlay.querySelector('.disclaimer-agree');
    btn.addEventListener('click', function () {
      try { sessionStorage.setItem(KEY, 'yes'); } catch (e) {}
      document.body.style.overflow = prevOverflow;
      overlay.parentNode.removeChild(overlay);
    });
    btn.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Auto-update footer copyright year (edit once, correct every year)
(function () {
  function updateCopyrightYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll('.footer-bottom div').forEach(function (el) {
      if (/©\s*Copyright\s*\d{4}/.test(el.textContent)) {
        el.textContent = el.textContent
          .replace(/(©\s*Copyright\s*)\d{4}/, '$1' + year)
          .replace(/Limited \./, 'Limited.');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCopyrightYear);
  } else {
    updateCopyrightYear();
  }
})();
