(() => {
  // A visit from the YouTube channel header (?utm_source=youtube) keeps its source for this tab:
  // site bot links get the yt_ prefix, so the bot counts the start as YouTube, not as the site.
  const PREFIXES = { youtube: "yt" };
  const KEY = "raven-source";
  const store = {
    get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
    set(value) {
      try { if (value) sessionStorage.setItem(KEY, value); else sessionStorage.removeItem(KEY); } catch (e) {}
    },
  };
  const utm = new URLSearchParams(location.search).get("utm_source");
  let prefix = store.get();
  if (utm !== null) {
    prefix = PREFIXES[utm.toLowerCase()] || null;
    store.set(prefix);
  }
  if (!prefix) return;

  document.querySelectorAll('a[href^="https://t.me/"]').forEach((link) => {
    const url = new URL(link.href);
    const start = url.searchParams.get("start");
    // Site labels only: ref_ and c_ carry their own attribution, site_ labels open support.
    if (!start || !/^(ru|en)_/.test(start)) return;
    const label = `${prefix}_${start}`;
    if (label.length > 64) return;
    url.searchParams.set("start", label);
    link.href = url.href;
  });
})();
