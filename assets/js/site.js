(() => {
  const root = document.documentElement;
  const isEn = root.lang === "en";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionOk = () => !reduced.matches;
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} },
  };

  // App links on the home page are shown only on the platform they install on.
  if (/Android/i.test(navigator.userAgent)) document.querySelectorAll("[data-android-only]").forEach((el) => { el.hidden = false; });
  if (/Windows NT/i.test(navigator.userAgent)) document.querySelectorAll("[data-windows-only]").forEach((el) => { el.hidden = false; });

  // Theme: follows the system until the viewer picks one; the switch cross-fades where supported.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = store.get("raven-theme");
  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  const currentTheme = () => root.dataset.theme || (media.matches ? "dark" : "light");
  if (!root.dataset.theme) root.dataset.theme = currentTheme();
  media.addEventListener("change", () => {
    if (!store.get("raven-theme")) root.dataset.theme = media.matches ? "dark" : "light";
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    const apply = () => { root.dataset.theme = next; store.set("raven-theme", next); };
    if (document.startViewTransition && !reduced.matches) document.startViewTransition(apply); else apply();
  });

  // Live demo: steps advance when the progress bar finishes; hover, focus and offscreen hold it.
  const demo = document.getElementById("demo");
  if (demo) {
  const tabs = Array.from(demo.querySelectorAll(".step"));
  const panelEl = document.getElementById("demo-screens");
  const screens = Array.from(panelEl.querySelectorAll(".screen"));
  const toggle = document.getElementById("demo-toggle");
  const happTime = demo.querySelector("[data-happ-time]");
  const caption = document.getElementById("step-caption");
  let current = 0, happTimer = 0, happStart = 0;
  const runHapp = (on) => {
    clearInterval(happTimer); clearTimeout(happStart);
    happTime.textContent = "";
    if (!on) return;
    if (!motionOk()) { happTime.textContent = "00:00:01"; return; }
    const begin = () => {
      let s = 0;
      const tick = () => { s += 1; happTime.textContent = `00:00:${String(s).padStart(2, "0")}`; };
      tick(); happTimer = setInterval(tick, 1000);
    };
    if (motionOk()) happStart = setTimeout(begin, 2100); else begin();
  };
  const select = (index, focus) => {
    current = index;
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const bar = tab.querySelector(".step-progress");
      bar.replaceWith(bar.cloneNode(true)); // restart the progress animation
    });
    screens.forEach((screen, i) => {
      const active = i === index;
      screen.classList.toggle("is-active", active);
      screen.setAttribute("aria-hidden", String(!active));
      screen.classList.remove("run");
      if (active) {
        if (motionOk()) { void screen.offsetWidth; screen.classList.add("run"); screen.classList.remove("final"); }
        else screen.classList.add("final");
      }
    });
    panelEl.setAttribute("aria-labelledby", tabs[index].id);
    caption.querySelector("b").textContent = tabs[index].querySelector(".step-title").textContent;
    caption.querySelector("span").textContent = tabs[index].querySelector(".step-text").textContent;
    tabs[index].querySelector(".step-progress").addEventListener("animationend", () => {
      if (demo.classList.contains("is-auto")) select((current + 1) % tabs.length, false);
    }, { once: true });
    runHapp(index === 3);
    if (focus) tabs[index].focus();
  };
  const setAuto = (on) => {
    demo.classList.toggle("is-auto", on && motionOk());
    toggle.querySelector("span").textContent = demo.classList.contains("is-auto") ? (isEn ? "Pause" : "Пауза") : (isEn ? "Play demo" : "Смотреть демо");
    if (demo.classList.contains("is-auto")) select(current, false);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => { setAuto(false); select(i, false); });
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault(); setAuto(false);
      select((i + step + tabs.length) % tabs.length, true);
    });
  });
  toggle.addEventListener("click", () => setAuto(!demo.classList.contains("is-auto")));
  const hold = (on) => demo.classList.toggle("is-held", on);
  demo.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hold(true); });
  demo.addEventListener("pointerleave", () => hold(demo.contains(document.activeElement) && document.activeElement !== toggle));
  demo.addEventListener("focusin", (e) => { if (e.target !== toggle) hold(true); });
  demo.addEventListener("focusout", () => setTimeout(() => hold(demo.matches(":hover") || (demo.contains(document.activeElement) && document.activeElement !== toggle)), 0));
  new IntersectionObserver(([entry]) => {
    const wasOff = demo.classList.contains("is-offscreen");
    demo.classList.toggle("is-offscreen", !entry.isIntersecting);
    if (wasOff && entry.isIntersecting && demo.classList.contains("is-auto")) select(current, false);
  }, { threshold: 0.35 }).observe(demo);
  demo.classList.add("is-offscreen");
  select(0, false);
  setAuto(true);
  reduced.addEventListener("change", () => { setAuto(!reduced.matches); select(current, false); });

  }

  // Period prices: whole roubles per month, total = monthly price x months; numbers tween on change.
  const MONTHS = [1, 3, 6, 12];
  const MONTH_LABEL = isEn ? ["1 month", "3 months", "6 months", "12 months"] : ["1 месяц", "3 месяца", "6 месяцев", "12 месяцев"];
  const money = (n) => isEn ? `${n.toFixed(2)} USDT` : `${Math.round(n).toLocaleString("ru-RU")} ₽`;
  const plans = Array.from(document.querySelectorAll(".plan[data-prices]")).map((plan) => ({
    prices: plan.dataset.prices.split(",").map(Number),
    totals: plan.dataset.totals?.split(",").map(Number),
    price: plan.querySelector("[data-price]"),
    total: plan.querySelector("[data-total]"),
    shown: Number(plan.dataset.prices.split(",")[0]),
  }));
  let tween = 0;
  const render = (period) => {
    cancelAnimationFrame(tween);
    const targets = plans.map((p) => p.prices[period]);
    const starts = plans.map((p) => p.shown);
    plans.forEach((p, i) => {
      p.total.textContent = period === 0 ? (isEn ? "for 1 month" : "за 1 месяц") : `${money(p.totals?.[period] ?? targets[i] * MONTHS[period])} ${isEn ? "for" : "за"} ${MONTH_LABEL[period]}`;
    });
    if (!motionOk()) {
      plans.forEach((p, i) => { p.shown = targets[i]; p.price.textContent = money(targets[i]); });
      return;
    }
    const t0 = performance.now(), dur = 280;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      plans.forEach((p, i) => { p.shown = starts[i] + (targets[i] - starts[i]) * e; p.price.textContent = money(p.shown); });
      if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };
  document.querySelectorAll('input[name="period"]').forEach((input) => {
    input.addEventListener("change", () => render(Number(input.value)));
  });
  reduced.addEventListener("change", () => {
    const selected = document.querySelector('input[name="period"]:checked');
    if (selected) render(Number(selected.value));
  });

  // Hero: the raven blinks every 5-7 s and rests when the hero is offscreen.
  const visual = document.getElementById("hero-visual");
  if (visual) {
  let blinkTimer = 0, blinkStepTimer = 0, heroVisible = true;
  const blinkOnce = () => {
    const seq = [["is-half", 60], ["is-closed", 90], ["is-half", 60], ["", 0]];
    let i = 0;
    const next = () => {
      visual.classList.remove("is-half", "is-closed");
      const [cls, ms] = seq[i++];
      if (cls) visual.classList.add(cls);
      if (ms) blinkStepTimer = setTimeout(next, ms);
    };
    next();
  };
  const syncHero = () => {
    clearTimeout(blinkTimer);
    clearTimeout(blinkStepTimer);
    visual.classList.remove("is-half", "is-closed");
    if (!heroVisible || !motionOk() || document.hidden) return;
    const scheduleBlink = () => { blinkTimer = setTimeout(() => { blinkOnce(); scheduleBlink(); }, 5000 + Math.random() * 2000); };
    scheduleBlink();
  };
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncHero(); }).observe(visual);
  reduced.addEventListener("change", syncHero);
  document.addEventListener("visibilitychange", syncHero);

  }

  // Final block: procedural low-poly key (standalone WebGL module, loaded near the viewport). The raven
  // picture stays as the static fallback for reduced motion, weak devices and browsers without WebGL.
  const finalVisual = document.getElementById("final-visual");
  const keyStage = document.getElementById("key-stage");
  if (finalVisual && keyStage) {
  let keyLoaded = false, keyVisible = false, keyApi = null;
  const weakDevice = () => (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;
  const hasWebGL = (() => {
    try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
  })();
  const keyAllowed = () => hasWebGL && motionOk() && !weakDevice();
  const loadKey = async () => {
    if (keyLoaded) return; keyLoaded = true;
    const { mountKey } = await import("./key-3d.js");
    keyApi = mountKey(keyStage);
    syncKey();
  };
  // Without the key the raven picture is the final visual: drop the head-time key-pending guess.
  const showFallback = () => { finalVisual.classList.remove("is-key"); document.documentElement.classList.remove("key-pending"); };
  const syncKey = () => {
    if (!keyAllowed()) { showFallback(); if (keyApi) keyApi.stop(); return; }
    if (!keyVisible || document.hidden) { if (keyApi) keyApi.stop(); return; }
    if (!keyApi) { loadKey().catch(showFallback); return; }
    finalVisual.classList.add("is-key");
    keyApi.start();
  };
  new IntersectionObserver(([entry]) => { keyVisible = entry.isIntersecting; syncKey(); }, { rootMargin: "600px" }).observe(finalVisual);
  reduced.addEventListener("change", syncKey);
  document.addEventListener("visibilitychange", syncKey);
  }
})();

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
    window.matchMedia("(max-width: 900px)").addEventListener("change", closeNav);
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
    if (!/bot$/i.test(new URL(link.href).pathname)) return;
    link.addEventListener("click", () => {
      track("telegram_bot_outbound", {
        href: link.href,
        label: link.textContent.trim(),
      });
    });
  });
})();
