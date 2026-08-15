(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
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
      languagePickers.forEach(closeLanguagePicker);
    });
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
