(() => {
  const link = document.getElementById("cabinet-entry");
  if (!link) return;

  // The browser session is an HttpOnly cookie on the API domain.
  // A single credentialed probe also serves the invite page.
  const ctrl = new AbortController();
  let expired = false;
  const timer = setTimeout(() => { expired = true; ctrl.abort(); }, 2000);
  fetch(`${link.dataset.api}/me`, { credentials: "include", cache: "no-store", signal: ctrl.signal })
    .then((response) => {
      if (expired || (response.status !== 200 && response.status !== 401)) return;
      if (response.status === 200) link.textContent = link.dataset.sessionLabel;
      link.hidden = false;
      const signup = document.getElementById("invite-mail");
      if (signup) {
        signup.hidden = false;
        document.getElementById("invite-vpn").hidden = true;
      }
    }, () => {})
    .finally(() => clearTimeout(timer));
})();
