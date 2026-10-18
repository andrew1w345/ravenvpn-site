/* GitHub Pages serves 404.html for every /c/<slug>, without per-creator deploys. */
(() => {
  const match = /^\/c\/([a-z0-9]{3,24})\/?$/.exec(window.location.pathname);
  if (!match) return;
  const target = 'https://t.me/GetRavenBot?start=c_' + match[1];
  const showFallback = () => {
    const main = document.getElementById('main');
    if (!main) return;
    main.replaceChildren();
    const section = document.createElement('section');
    section.className = 'page-hero';
    const wrap = document.createElement('div');
    wrap.className = 'wrap text-page';
    const title = document.createElement('h1');
    title.textContent = 'Открываем Raven VPN';
    const description = document.createElement('p');
    description.className = 'lead';
    description.textContent = 'Если Telegram не открылся автоматически, нажмите кнопку.';
    const link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.href = target;
    link.textContent = 'Открыть в Telegram';
    wrap.append(title, description, link);
    section.append(wrap);
    main.append(section);
    document.title = 'Raven VPN - открыть в Telegram';
    window.location.replace(target);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showFallback);
  else showFallback();
})();
