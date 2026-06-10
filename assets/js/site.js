(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
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
