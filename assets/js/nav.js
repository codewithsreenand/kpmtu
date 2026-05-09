function renderNav() {
  const header = document.getElementById("main-header");
  if (!header) return;

  const currentPage = document.body.dataset.page || "home";

  const navLinks = [
    { key: "nav_home", href: "index.html", id: "nav-home" },
    { key: "nav_about", href: "about.html", id: "nav-about" },
    { key: "nav_leadership", href: "leadership.html", id: "nav-leadership" },
    { key: "nav_districts", href: "districts.html", id: "nav-districts" },
    { key: "nav_membership", href: "membership.html", id: "nav-membership" },
    { key: "nav_contact", href: "contact.html", id: "nav-contact" },
    { key: "nav_admin", href: "admin.html", id: "nav-admin" },
  ];

  const nav = document.createElement("nav");
  nav.className = "navbar container";
  nav.innerHTML = `
    <div class="nav-brand">
      <a href="index.html" aria-label="KPMTU home">
        <img src="assets/images/logo.jpeg" alt="KPMTU logo" />
      </a>
      <h1 class="nav-brand-text">KPMTU</h1>
    </div>
    
    <button class="mobile-toggle" id="mobile-toggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>

    <div class="nav-menu" id="nav-menu">
      <div class="nav-links" id="nav-links"></div>
      <button class="lang-switch" id="lang-toggle" type="button" aria-label="Toggle language"></button>
    </div>
  `;

  header.appendChild(nav);

  const linksContainer = nav.querySelector("#nav-links");
  navLinks.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.setAttribute("data-i18n", item.key);
    link.id = item.id;
    if (item.href.includes(`${currentPage}.html`) || (currentPage === "home" && item.href === "index.html")) {
      link.classList.add("active");
    }
    linksContainer.appendChild(link);
  });

  // Mobile Toggle Logic
  const mobileToggle = nav.querySelector("#mobile-toggle");
  const navMenu = nav.querySelector("#nav-menu");
  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("is-active");
    navMenu.classList.toggle("is-active");
  });

  // Close menu when link is clicked
  const menuLinks = nav.querySelectorAll(".nav-links a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("is-active");
      navMenu.classList.remove("is-active");
    });
  });
}

function renderFooter() {
  const legacyFooters = document.querySelectorAll('.footer');
  legacyFooters.forEach(f => f.remove());

  const footer = document.createElement("footer");
  footer.className = "mega-footer";
  footer.innerHTML = `
    <div class="container footer-grid" style="gap: 4rem;">
      <div class="footer-brand">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <img src="assets/images/logo.jpeg" alt="KPMTU Logo" style="width: 60px; height: 60px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          <h2 data-i18n="hero_title_sub" style="margin: 0; font-size: 1.4rem; letter-spacing: 0.02em;"></h2>
        </div>
        <p data-i18n="footer_text" style="color: rgba(255,255,255,0.65); line-height: 1.7;"></p>
      </div>
      <div class="footer-col">
        <h3 data-i18n="footer_quick_links"></h3>
        <ul>
          <li><a href="index.html" data-i18n="nav_home"></a></li>
          <li><a href="about.html" data-i18n="nav_about"></a></li>
          <li><a href="leadership.html" data-i18n="nav_leadership"></a></li>
          <li><a href="districts.html" data-i18n="nav_districts"></a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3 data-i18n="nav_membership"></h3>
        <ul>
          <li><a href="membership.html" data-i18n="nav_membership"></a></li>
          <li><a href="contact.html" data-i18n="nav_contact"></a></li>
          <li><a href="admin.html" data-i18n="nav_admin"></a></li>
        </ul>
      </div>
      <div class="footer-col footer-contact-info">
        <h3 data-i18n="nav_contact"></h3>
        <p data-i18n="footer_contact_address" style="color: rgba(255,255,255,0.7); line-height: 1.6;"></p>
      </div>
    </div>
    <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.05); padding: 2rem 0; margin-top: 2rem;">
      <div class="container" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <p data-i18n="footer_note" style="margin: 0; color: rgba(255,255,255,0.5); font-size: 0.95rem;"></p>
        <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 0.85rem;">developed by <a href="https://www.codecave.co.in" target="_blank" style="color: inherit; text-decoration: none; font-weight: 500;">codecave</a></p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

window.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderFooter();
  if (typeof applyTranslations === "function") {
    applyTranslations();
  }
  if (typeof setupLanguageToggle === "function") {
    setupLanguageToggle();
  }
});
