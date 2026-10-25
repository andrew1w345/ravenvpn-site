(() => {
  const link = document.getElementById("cabinet-entry");
  if (!link) return;

  // The browser session is an HttpOnly cookie on the API domain.
  // A single credentialed probe also serves the invite page.
  // A cold VPN path (DNS + TLS) often needs several seconds; show it on arrival.
  const ctrl = new AbortController();
  const show = (signedIn) => {
    if (signedIn) link.textContent = link.dataset.sessionLabel;
    link.hidden = false;
    const signup = document.getElementById("invite-mail");
    if (signup) { signup.hidden = false; document.getElementById("invite-vpn").hidden = true; }
  };
  // Without VPN the blocked direct API hangs until the timeout, so the
  // encrypted fallback is also asked once the direct probe is slow.
  let asked = false;
  const fallback = () => {
    if (asked) return;
    asked = true;
    return import("/app/static/cabinet-entry-fallback.js").then(module => module.available()).then(ok => { if (ok) show(false); }, () => {});
  };
  let expired = false;
  const early = setTimeout(fallback, 3000);
  const timer = setTimeout(() => { expired = true; ctrl.abort(); }, 15000);
  let cookieBlocked = false;
  try { cookieBlocked = !!localStorage.getItem("raven-browser-no-cookie"); } catch { /* unavailable storage */ }
  fetch(`${link.dataset.api}/me`, { credentials: cookieBlocked ? "omit" : "include", cache: "no-store", signal: ctrl.signal })
    .then((response) => {
      if (expired || (response.status !== 200 && response.status !== 401)) return fallback();
      show(response.status === 200);
    }, fallback)
    .finally(() => { clearTimeout(early); clearTimeout(timer); });
})();
