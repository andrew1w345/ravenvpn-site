(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const navLinks = document.querySelector("[data-nav-links]");
  const closeNav = () => {
    navLinks?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("click", (event) => {
      if (!menuButton.contains(event.target) && !navLinks.contains(event.target)) closeNav();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeNav();
        menuButton.focus();
      }
    });
    window.matchMedia("(max-width: 980px)").addEventListener("change", closeNav);
  }

  const languagePickers = Array.from(document.querySelectorAll(".language-picker"));

  if (languagePickers.length) {
    const closeLanguagePicker = (picker) => {
      const toggle = picker.querySelector("[data-language-toggle]");
      const menu = picker.querySelector("[data-language-menu]");
      toggle?.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    };

    languagePickers.forEach((picker) => {
      const toggle = picker.querySelector("[data-language-toggle]");
      const menu = picker.querySelector("[data-language-menu]");
      if (!toggle || !menu) return;

      toggle.addEventListener("click", () => {
        closeNav();
        const willOpen = menu.hidden;
        languagePickers.forEach(closeLanguagePicker);
        menu.hidden = !willOpen;
        toggle.setAttribute("aria-expanded", String(willOpen));
      });
    });

    document.addEventListener("click", (event) => {
      languagePickers.forEach((picker) => {
        if (!picker.contains(event.target)) closeLanguagePicker(picker);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openPicker = languagePickers.find((picker) => picker.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded") === "true");
      languagePickers.forEach(closeLanguagePicker);
      openPicker?.querySelector("[data-language-toggle]")?.focus();
    });
  }

  const stickyCta = document.querySelector(".sticky-cta");
  if (stickyCta && "IntersectionObserver" in window) {
    const intro = document.querySelector(".hero-actions, .page-hero");
    const finalCta = document.querySelector(".cta-band");
    const visible = new Map();
    let introPassed = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target, entry.isIntersecting);
        if (entry.target === intro) introPassed = entry.boundingClientRect.bottom <= 72;
      });
      stickyCta.hidden = !introPassed || visible.get(finalCta) === true;
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    [intro, finalCta].filter(Boolean).forEach((element) => observer.observe(element));
  }

  const track = (name, data) => {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, data);
    }
  };

  document.querySelectorAll("details[data-umami-event]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      const question = item.querySelector("summary")?.textContent?.trim();
      track(item.dataset.umamiEvent, { question });
    });
  });

  document.querySelectorAll('a[href^="https://t.me/"]').forEach((link) => {
    link.addEventListener("click", () => {
      track("telegram_bot_outbound", {
        href: link.href,
        label: link.textContent.trim(),
      });
    });
  });
})();
