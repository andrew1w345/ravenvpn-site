/* Loaded before the module graph: catches an entry/chunk failure as well as runtime errors. */
(() => {
  const queue = [], seen = new Set();
  const clean = value => String(value).split(/\r?\n/).map(line =>
    /(?:initdata|query_id|auth_date|authorization|password|secret|seed|call_link|token)(?:[\s"']|%20)*(?::|=|%3d)/i.test(line)
      ? "[redacted]"
      : line.replace(/(?:https?|freeturn|vless|vmess|trojan|ss|tg):\/\/\S+|\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b|\b(?:\d{1,3}\.){3}\d{1,3}\b|(?:[0-9a-f]{0,4}:){2,}[0-9a-f:.]+|\+?\d[\d ()-]{8,}\d|bearer\s+\S+|[A-Za-z0-9_+/=-]{32,}/gi, "[redacted]")
  ).join("\n");
  let installation;
  try { installation = localStorage.getItem("raven-error-installation"); } catch { /* storage can be unavailable */ }
  if (!/^[0-9a-f-]{36}$/i.test(installation || "")) {
    installation = crypto.randomUUID();
    try { localStorage.setItem("raven-error-installation", installation); } catch { /* keep in memory */ }
  }
  let sender = async body => {
    let fallback = false;
    try { fallback = sessionStorage.getItem("raven-browser-fallback") === "1"
      || Number(localStorage.getItem("raven-browser-fallback-until")) > Date.now(); } catch { /* direct until the app selects a path */ }
    if (fallback && body.source === "cabinet" && !window.RavenApp && !/[?&]host=app(?:&|$)/.test(location.search)) {
      const module = await import("./static/cabinet-entry-fallback.js");
      return module.sendError(body);
    }
    const response = await fetch("https://api.ravenvpn.site/api/app/v1/errors", {
      method: "POST", headers: { "Content-Type": "application/json", "X-Raven-App": "1" },
      body: JSON.stringify(body), credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("error_ingress_unavailable");
  };
  let sending = false, timer, delay = 1000;
  async function flush() {
    if (sending || !queue.length || document.visibilityState === "hidden") return;
    sending = true;
    try { await sender(queue[0]); queue.shift(); delay = 1000; }
    catch { delay = Math.min(300000, delay * 2); }
    finally { sending = false; if (queue.length) timer = setTimeout(flush, delay); }
  }
  function capture(type, error) {
    const message = clean(error instanceof Error ? error.message : typeof error === "string" ? error : "unhandled_error").slice(0, 2000);
    const stack = clean(error instanceof Error ? error.stack || "" : "").slice(0, 12000);
    const key = type + message + stack;
    if (seen.has(key) || queue.length >= 20) return;
    if (seen.size >= 100) seen.clear();
    seen.add(key);
    const rawRoute = location.hash.replace(/^#\//, "").split(/[/?]/)[0];
    const screen = ["devices", "help", "invite", "profile", "renew", "buy", "orders", "login"].includes(rawRoute) ? rawRoute : "home";
    queue.push({ source: /tgWebAppData/.test(location.hash + location.search) || window.Telegram?.WebApp?.initData ? "telegram" : "cabinet",
      installation_id: installation, version: "cabinet-0.1.5", platform: "web", type, message, stack,
      context: { screen, state: document.visibilityState === "hidden" ? "background" : "foreground" } });
    clearTimeout(timer); timer = setTimeout(flush, 50);
  }
  window.addEventListener("error", event => {
    const target = event.target;
    if (target && target !== window) {
      if (target.tagName === "SCRIPT" || target.tagName === "LINK") capture("chunk_load", "module_resource_failed");
    } else capture("uncaught", event.error || event.message);
  }, true);
  window.addEventListener("unhandledrejection", event => capture("unhandledrejection", event.reason));
  let watchdog;
  function watch() {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      const root = document.getElementById("app"), page = root?.querySelector(".page"), main = root?.querySelector("main");
      if (!root?.firstElementChild || !page?.firstElementChild || (main && main.getBoundingClientRect().height < 24 && window.innerHeight >= 320)) {
        capture("blank_root", "cabinet_root_not_rendered");
      }
    }, 10000);
  }
  window.addEventListener("pageshow", watch);
  window.addEventListener("online", () => { clearTimeout(timer); void flush(); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") { watch(); clearTimeout(timer); void flush(); }
  });
  document.addEventListener("DOMContentLoaded", watch);
  window.ravenErrors = { setSender(next) { sender = next; clearTimeout(timer); void flush(); } };
})();
