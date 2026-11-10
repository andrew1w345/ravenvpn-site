(() => {
  const link = document.getElementById("cabinet-entry");
  if (!link) return;

  // The browser session is an HttpOnly cookie on the API domain.
  // Sign-in and email signup are visible in the HTML while the network is pending.
  // The probe changes the header label and remembers a working fallback path.
  const ctrl = new AbortController();
  const show = (signedIn) => {
    if (signedIn) link.textContent = link.dataset.sessionLabel;
    link.hidden = false;
  };
  // Without VPN the blocked direct API hangs until the timeout, so the
  // encrypted fallback is also asked once the direct probe is slow.
  let asked = false;
  let directAvailable = false;
  const fallback = () => {
    if (asked) return;
    asked = true;
    return import("/app/static/cabinet-entry-fallback.js").then(module => module.available()).then(ok => {
      if (!ok) return;
      if (!directAvailable) {
        try { localStorage.setItem("raven-browser-fallback-until", String(Date.now() + 10 * 60 * 1000)); } catch { /* unavailable storage */ }
      }
      show(false);
    }, () => {});
  };
  let expired = false;
  const early = setTimeout(fallback, 3000);
  const timer = setTimeout(() => { expired = true; ctrl.abort(); }, 15000);
  let cookieBlocked = false;
  try { cookieBlocked = !!localStorage.getItem("raven-browser-no-cookie"); } catch { /* unavailable storage */ }
  fetch(`${link.dataset.api}/me`, { credentials: cookieBlocked ? "omit" : "include", cache: "no-store", signal: ctrl.signal })
    .then((response) => {
      if (expired || (response.status !== 200 && response.status !== 401)) return fallback();
      directAvailable = true;
      try { localStorage.removeItem("raven-browser-fallback-until"); } catch { /* unavailable storage */ }
      show(response.status === 200);
    }, fallback)
    .finally(() => { clearTimeout(early); clearTimeout(timer); });
})();
