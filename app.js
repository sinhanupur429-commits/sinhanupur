/**
 * ApexConsult | Chartered Accountant & Certified Advisory Platform
 * Interactive Client-side Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initServiceFilters();
    initConsultationEstimator();
    initContactForm();
    initCopyEmail();
    initScrollEffects();
});

/* -------------------------------------------------------------------------- */
/* Theme Switcher (Dark & Light Mode)                                         */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Read saved theme or OS preference
    const savedTheme = localStorage.getItem('apex_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('apex_theme', theme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        if (theme === 'dark') {
            themeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>`;
            themeBtn.setAttribute('title', 'Switch to Light Mode');
        } else {
            themeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>`;
            themeBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Mobile Drawer Navigation                                                   */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Service Category Tabs Filter                                               */
/* -------------------------------------------------------------------------- */
function initServiceFilters() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Interactive Consultation Estimator & WhatsApp Pre-fill                     */
/* -------------------------------------------------------------------------- */
function initConsultationEstimator() {
    const checkboxes = document.querySelectorAll('.estimator-checkbox');
    const selectedList = document.getElementById('selected-services-list');
    const waBtn = document.getElementById('estimator-whatsapp-btn');
    const totalCountElem = document.getElementById('selected-count');

    if (!checkboxes.length) return;

    function updateEstimator() {
        const selected = [];
        checkboxes.forEach(cb => {
            const card = cb.closest('.checkbox-card');
            if (cb.checked) {
                card.classList.add('selected');
                selected.push({
                    name: cb.getAttribute('data-name'),
                    type: cb.getAttribute('data-type')
                });
            } else {
                card.classList.remove('selected');
            }
        });

        if (totalCountElem) {
            totalCountElem.textContent = selected.length;
        }

        if (selectedList) {
            if (selected.length === 0) {
                selectedList.innerHTML = `<li style="color: var(--text-subtle); justify-content: center;">No services selected yet. Click options to build inquiry.</li>`;
            } else {
                selectedList.innerHTML = selected.map(item => `
          <li>
            <span><strong>${item.name}</strong></span>
            <span class="service-type-badge ${item.type === 'Individual' ? 'type-individual' : 'type-business'}">${item.type}</span>
          </li>
        `).join('');
            }
        }

        // Update WhatsApp pre-filled URL
        if (waBtn) {
            const waNumber = '919876543210'; // Phone number placeholder
            let msg = 'Hello CA Consultant, I am interested in advisory for: ';
            if (selected.length > 0) {
                msg += selected.map(s => `${s.name} (${s.type})`).join(', ');
            } else {
                msg += 'General Financial & Taxation Consultancy';
            }
            waBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateEstimator);
    });

    updateEstimator();
}

/* -------------------------------------------------------------------------- */
/* Contact Form Handling & Toast                                              */
/* -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const service = document.getElementById('form-service').value;

        if (!name || !email) {
            showToast('Please provide your name and email address.', 'error');
            return;
        }

        // Simulate clean submission
        showToast(`Thank you, ${name}! Your consultation request has been received. We will respond within 2 hours.`, 'success');
        form.reset();
    });
}

/* -------------------------------------------------------------------------- */
/* Email Copy to Clipboard                                                    */
/* -------------------------------------------------------------------------- */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const emailText = 'consultant@apexca.com';
        navigator.clipboard.writeText(emailText).then(() => {
            showToast('Email address copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Copied email: consultant@apexca.com', 'info');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Toast Notification Utility                                                 */
/* -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  `;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.35s ease';
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

/* -------------------------------------------------------------------------- */
/* Smooth Scroll & Active Nav Highlighting                                    */
/* -------------------------------------------------------------------------- */
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}
