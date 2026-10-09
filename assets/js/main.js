// Keep a modal's background out of the keyboard and accessibility navigation.
function ntamIsolateDialog(dialog) {
  const previousOverflow = document.body.style.overflow;
  const background = Array.from(document.body.children)
    .filter(element => element !== dialog)
    .map(element => ({ element, inert: element.inert }));
  background.forEach(({ element }) => { element.inert = true; });
  document.body.style.overflow = 'hidden';
  return () => {
    background.forEach(({ element, inert }) => { element.inert = inert; });
    document.body.style.overflow = previousOverflow;
  };
}

function ntamTrapDialogFocus(event, dialog) {
  if (event.key !== 'Tab') return;
  const elements = Array.from(dialog.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]'
  )).filter(element => !element.disabled && element.tabIndex >= 0 &&
    !element.closest('[inert]') && element.getClientRects().length > 0);
  if (!elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    const mobileMenu = window.matchMedia('(max-width: 1500px)');
    const header = document.querySelector('.site-header');
    navMenu.id = navMenu.id || 'site-navigation-menu';
    hamburger.setAttribute('aria-controls', navMenu.id);

    const updateMenuPosition = () => {
      if (header) {
        const bottom = Math.max(0, header.getBoundingClientRect().bottom);
        navMenu.style.setProperty('--nav-top', `${bottom}px`);
      }
    };
    const setMenuOpen = (open, restoreFocus = false) => {
      const expanded = mobileMenu.matches && open;
      hamburger.classList.toggle('active', expanded);
      navMenu.classList.toggle('active', expanded);
      hamburger.setAttribute('aria-expanded', String(expanded));
      if (restoreFocus) hamburger.focus();
      navMenu.inert = mobileMenu.matches && !expanded;
      if (navMenu.inert) navMenu.setAttribute('aria-hidden', 'true');
      else navMenu.removeAttribute('aria-hidden');
      updateMenuPosition();
    };

    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') !== 'true';
      setMenuOpen(open);
      if (open) navMenu.querySelector('.nav-link')?.focus({ preventScroll: true });
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        setMenuOpen(false, mobileMenu.matches);
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, true);
      }
    });
    header?.addEventListener('focusout', event => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenuOpen(false);
    });
    mobileMenu.addEventListener('change', () => {
      const focusInMenu = navMenu.contains(document.activeElement);
      setMenuOpen(false, mobileMenu.matches && focusInMenu);
    });
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, { passive: true });
    if (header && 'ResizeObserver' in window) new ResizeObserver(updateMenuPosition).observe(header);
    setMenuOpen(false);
  }

  // 2. Team Bio Modals (Team Page)
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalName = document.querySelector('.modal-name');
  const modalTitle = document.querySelector('.modal-title');
  const modalBioText = document.querySelector('.modal-bio-text');
  const viewBioBtns = document.querySelectorAll('.btn-view-bio');

  let activeElementBeforeModal = null;
  let restoreModalBackground = null;

  if (modalOverlay && modalCloseBtn && viewBioBtns.length > 0) {
    modalOverlay.inert = true;
    modalName.id = modalName.id || 'team-modal-name';
    modalOverlay.setAttribute('aria-labelledby', modalName.id);
    const openModal = (name, title, bioContent) => {
      activeElementBeforeModal = document.activeElement;
      
      modalName.textContent = name;
      modalTitle.textContent = title;
      modalBioText.innerHTML = bioContent;
      
      modalOverlay.classList.add('active');
      modalOverlay.inert = false;
      modalOverlay.setAttribute('aria-hidden', 'false');
      restoreModalBackground = ntamIsolateDialog(modalOverlay);
      
      // Accessibility: Focus close button
      modalCloseBtn.focus();
    };

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      if (restoreModalBackground) restoreModalBackground();
      restoreModalBackground = null;
      
      if (activeElementBeforeModal) {
        activeElementBeforeModal.focus();
      }
      modalOverlay.setAttribute('aria-hidden', 'true');
      modalOverlay.inert = true;
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
      ntamTrapDialogFocus(e, modalOverlay);
    });
  }

  // 3. Contact Form handling (Contact Section/Page)
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    const messages = {
      en: {
        required: 'Please fill in all required fields (Name, Email, Message).',
        email: 'Please provide a valid email address.',
        submitting: 'Submitting...',
        success: 'Thank you! Your message has been sent. We will get back to you shortly.',
        failure: 'Sorry, your message could not be sent. Please email us directly at info@ntam.com.hk.',
        network: 'Network error. Please email us directly at info@ntam.com.hk.'
      },
      'zh-Hant': {
        required: '請填寫所有必填欄位（姓名、電子郵件及訊息）。',
        email: '請輸入有效的電子郵件地址。',
        submitting: '正在發送…',
        success: '謝謝！您的訊息已送出，我們會盡快回覆。',
        failure: '抱歉，訊息未能送出。請直接電郵至 info@ntam.com.hk。',
        network: '網絡連線出現問題。請直接電郵至 info@ntam.com.hk。'
      },
      'zh-Hans': {
        required: '请填写所有必填字段（姓名、电子邮件及信息）。',
        email: '请输入有效的电子邮件地址。',
        submitting: '正在发送…',
        success: '谢谢！您的信息已送出，我们会尽快回复。',
        failure: '抱歉，信息未能送出。请直接电邮至 info@ntam.com.hk。',
        network: '网络连接出现问题。请直接电邮至 info@ntam.com.hk。'
      }
    };
    const copy = messages[document.documentElement.lang] || messages.en;
    let submitting = false;
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitting) return;

      // Retrieve form fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Reset message state
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';

      // Validation
      if (!name || !email || !message) {
        formMessage.textContent = copy.required;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      // Simple email format regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.textContent = copy.email;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        return;
      }

      // Enter submitting state
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
      submitting = true;
      contactForm.setAttribute('aria-busy', 'true');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = copy.submitting;
      }
      formMessage.textContent = copy.submitting;
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

        if (response.ok && result.success) {
          formMessage.textContent = copy.success;
          formMessage.className = 'form-message success';
          contactForm.reset();
        } else {
          formMessage.textContent = copy.failure;
          formMessage.className = 'form-message error';
        }
      } catch (err) {
        formMessage.textContent = copy.network;
        formMessage.className = 'form-message error';
      } finally {
        submitting = false;
        contactForm.setAttribute('aria-busy', 'false');
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
        '<div class="disclaimer-scroll" tabindex="0">' +
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
    var previousFocus = document.activeElement;
    var restoreBackground = ntamIsolateDialog(overlay);
    overlay.addEventListener('keydown', function (event) {
      ntamTrapDialogFocus(event, overlay);
    });
    var btn = overlay.querySelector('.disclaimer-agree');
    btn.addEventListener('click', function () {
      try { sessionStorage.setItem(KEY, 'yes'); } catch (e) {}
      restoreBackground();
      overlay.parentNode.removeChild(overlay);
      var focusTarget = previousFocus !== document.body && previousFocus && previousFocus.isConnected
        ? previousFocus : document.querySelector('.header-logo-link');
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    });
    overlay.querySelector('.disclaimer-scroll').focus();
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
