import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Check,
  ChevronDown,
  Gauge,
  Headphones,
  Menu,
  QrCode,
  Send,
  Smartphone,
  TabletSmartphone,
  Wallet,
} from "lucide";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const siteUrl = "https://ravenvpn.site";
const lastmod = "2026-06-10";
const ruBot = "https://t.me/GetRavenBot";
const enBot = "https://t.me/TheRavenVPNBot";
const ruSupportBot = "https://t.me/RavenVPN_support_bot";
const enSupportBot = "https://t.me/TheRavenVPNSupportBot";

const icons = {
  Check,
  ChevronDown,
  Gauge,
  Headphones,
  Menu,
  QrCode,
  Send,
  Smartphone,
  TabletSmartphone,
  Wallet,
};

const ruPlans = [
  {
    name: "Пробный",
    slug: "trial",
    price: "15₽",
    suffix: "1 день",
    text: "Для проверки подключения на вашем устройстве.",
    features: ["10 ГБ трафика", "до 25 Мбит/с", "2 устройства", "1 раз на Telegram ID"],
    event: "trial_click",
  },
  {
    name: "Старт",
    slug: "start",
    price: "149₽",
    suffix: "мес",
    text: "Базовый тариф для телефона и ноутбука.",
    features: ["250 ГБ в месяц", "до 50 Мбит/с", "2 устройства", "продление в боте"],
    event: "pricing_plan_click",
  },
  {
    name: "Стандарт",
    slug: "standard",
    price: "249₽",
    suffix: "мес",
    text: "Оптимальный вариант для повседневного использования.",
    features: ["500 ГБ в месяц", "до 100 Мбит/с", "4 устройства", "скидки за период"],
    event: "pricing_plan_click",
    featured: true,
  },
  {
    name: "Про",
    slug: "pro",
    price: "349₽",
    suffix: "мес",
    text: "Для нескольких устройств и более активного трафика.",
    features: ["1000 ГБ в месяц", "до 200 Мбит/с", "6 устройств", "максимальный лимит"],
    event: "pricing_plan_click",
  },
];

const enPlans = [
  {
    name: "Trial",
    slug: "trial",
    price: "1.49 USDT",
    suffix: "1 day",
    text: "A short test before you commit.",
    features: ["10 GB traffic", "up to 25 Mbps", "2 devices", "one time per Telegram ID"],
    event: "trial_click",
  },
  {
    name: "Start",
    slug: "start",
    price: "4.99 USDT",
    suffix: "mo",
    text: "For one phone and one laptop.",
    features: ["250 GB per month", "up to 50 Mbps", "2 devices", "Telegram setup"],
    event: "pricing_plan_click",
  },
  {
    name: "Standard",
    slug: "standard",
    price: "7.99 USDT",
    suffix: "mo",
    text: "A balanced plan for everyday use.",
    features: ["500 GB per month", "up to 100 Mbps", "4 devices", "period discounts"],
    event: "pricing_plan_click",
    featured: true,
  },
  {
    name: "Pro",
    slug: "pro",
    price: "11.99 USDT",
    suffix: "mo",
    text: "For more devices and heavier traffic.",
    features: ["1000 GB per month", "up to 200 Mbps", "6 devices", "highest limit"],
    event: "pricing_plan_click",
  },
];

const ruFaq = [
  [
    "Как получить ключ Raven VPN?",
    "Откройте @GetRavenBot, выберите тариф и оплатите. После успешной оплаты бот отправит ссылку подключения и QR-код.",
  ],
  [
    "Какие приложения поддерживаются?",
    "Основные клиенты: Hiddify, Happ, v2rayNG на Android, Hiddify, Happ, V2Box и Shadowrocket на iOS, Hiddify, Happ и v2rayN на Windows и macOS.",
  ],
  [
    "Можно ли попробовать перед оплатой полного тарифа?",
    "Да. Пробный доступ стоит 15₽: 1 день, 10 ГБ, до 25 Мбит/с и 2 устройства. Он доступен один раз на Telegram ID.",
  ],
  [
    "Что делать, если VPN не подключается?",
    "Проверьте, что ссылка импортирована в поддерживаемое приложение, обновите клиент и попробуйте переключить сеть. Если не помогло, напишите в поддержку и приложите скриншот ошибки.",
  ],
  [
    "Raven VPN хранит историю моих действий?",
    "Мы не храним данные о ваших действиях в сети.",
  ],
  [
    "Какие способы оплаты доступны?",
    "В RU-версии доступны Telegram Stars, CryptoBot, YooKassa и СБП. Конкретный список способов оплаты показывается в боте.",
  ],
];

const ruFaqExtra = [
  [
    "Как продлить подписку?",
    "Откройте активную подписку в боте и выберите продление. Если подписка ещё активна, срок добавится к текущей дате окончания.",
  ],
  [
    "Что происходит после окончания подписки?",
    "Подписку можно возобновить в течение 14 дней после окончания. После этого она скрывается из списка, и нужно оформить новую.",
  ],
  [
    "Можно ли передать ключ другому человеку?",
    "Нет. Сервис предназначен для личного использования, передача ключей третьим лицам запрещена правилами.",
  ],
  [
    "Можно ли выбрать страну сервера вручную?",
    "Сейчас бот выдаёт подключение с автоматическим выбором сервера.",
  ],
  [
    "Работают ли торренты?",
    "Торренты работают через Raven VPN. Скачивание и раздача расходуют трафик тарифа.",
  ],
  [
    "Как работает реферальная программа?",
    "После покупки платной подписки приглашённым другом вы получите 30 дней. Если у вас нет активной платной подписки, бонус будет ждать её оформления. Пробный доступ не учитывается; лимит — 10 друзей.",
  ],
  [
    "Поддерживаются ли белые списки для мобильного интернета?",
    "Нет. Белые списки для мобильного интернета сейчас не поддерживаются.",
  ],
];

const enFaq = [
  [
    "How do I get Raven VPN access?",
    "Open @TheRavenVPNBot, choose a plan and pay inside Telegram. The bot sends a connection link and a QR code after payment.",
  ],
  [
    "Which apps can I use?",
    "Raven VPN works with common VLESS clients such as Hiddify, Happ, v2rayNG, V2Box, Shadowrocket and v2rayN depending on your device.",
  ],
  [
    "Can I test it first?",
    "Yes. The trial plan gives 1 day, 10 GB, up to 25 Mbps and 2 devices. It is available once per Telegram ID.",
  ],
  [
    "Which payments are shown on the global page?",
    "The global test uses USDT as the public price anchor and supports Telegram Stars and CryptoBot. Card payments are not advertised for the global flow.",
  ],
  [
    "Do you promise full anonymity?",
    "No. Raven VPN is a practical private VPN service, not a promise of full anonymity or legal protection.",
  ],
];

const enFaqExtra = [
  [
    "How do I renew my subscription?",
    "Open the active subscription in the bot and choose renewal. If the subscription is still active, the new period is added to the current end date.",
  ],
  [
    "What happens after the subscription expires?",
    "You can renew the subscription within 14 days after expiration. After that it is hidden from the list and you need to buy a new one.",
  ],
  [
    "Can I share my key with another person?",
    "No. The service is for personal use, and sharing access keys with third parties is prohibited by the rules.",
  ],
  [
    "Can I choose a server country manually?",
    "The bot currently issues access with automatic server selection.",
  ],
  [
    "Do torrents work?",
    "Torrents work through Raven VPN. Downloading and seeding use the traffic included in your plan.",
  ],
  [
    "How does the referral program work?",
    "After an invited friend buys a paid subscription, you receive 30 days. If you do not have an active paid subscription, the bonus waits until you buy one. Trial access does not count; the limit is 10 friends.",
  ],
  [
    "Are mobile carrier allowlists supported?",
    "No. Mobile carrier allowlists are not supported at the moment.",
  ],
];

function pageDepth(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  if (!normalized.includes("/")) return 0;
  return normalized.split("/").length - 1;
}

function prefix(filePath) {
  return "../".repeat(pageDepth(filePath));
}

function local(page, target = "") {
  const p = prefix(page.file);
  if (target.startsWith("#") || target.startsWith("http")) return target;
  if (target === "") return p || "./";
  return `${p}${target}`;
}

function homeHref(page) {
  return page.lang === "en" ? local(page, "en/") : local(page);
}

function route(page, target = "") {
  if (target.startsWith("#") || target.startsWith("http")) return target;
  return local(page, page.lang === "en" ? `en/${target}` : target);
}

function languageHref(page) {
  if (page.lang === "en") {
    const ruUrl = page.url.replace(/^\/en\/?/, "/");
    return local(page, ruUrl === "/" ? "" : ruUrl.slice(1));
  }

  return local(page, page.url === "/" ? "en/" : `en${page.url}`);
}

function mirroredAlternates(ruUrl) {
  const enUrl = ruUrl === "/" ? "/en/" : `/en${ruUrl}`;
  return [
    { lang: "ru", url: ruUrl },
    { lang: "en", url: enUrl },
    { lang: "x-default", url: ruUrl },
  ];
}

function botLink(lang, source) {
  const base = lang === "en" ? enBot : ruBot;
  return `${base}?start=${source}`;
}

function supportLink(lang, source) {
  const base = lang === "en" ? enSupportBot : ruSupportBot;
  return `${base}?start=${source}`;
}

function imagePath(page, file) {
  return `${prefix(page.file)}assets/img/${file}`;
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function attrName(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .map(([name, value]) => `${attrName(name)}="${escapeAttr(value)}"`)
    .join(" ");
}

function icon(name, { className = "icon", size = 18, strokeWidth = 2 } = {}) {
  const nodes = icons[name];
  if (!nodes) {
    throw new Error(`Unknown Lucide icon: ${name}`);
  }

  const body = nodes
    .map(([tag, attrs]) => `<${tag} ${attrsToString(attrs)}></${tag}>`)
    .join("");

  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

function picture(page, { lang = "ru", name, alt, hero = false, mobile = false, webpOnly = false }) {
  const imgLang = lang === "en" ? "en" : "ru";
  const loading = hero ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const darkMobileSources = mobile
    ? [
        `<source media="(prefers-color-scheme: dark) and (max-width: 760px)" type="image/avif" srcset="${imagePath(page, `${imgLang}/hero-mobile-dark-640.avif`)} 640w, ${imagePath(page, `${imgLang}/hero-mobile-dark-900.avif`)} 900w" sizes="100vw">`,
        `<source media="(prefers-color-scheme: dark) and (max-width: 760px)" type="image/webp" srcset="${imagePath(page, `${imgLang}/hero-mobile-dark-640.webp`)} 640w, ${imagePath(page, `${imgLang}/hero-mobile-dark-900.webp`)} 900w" sizes="100vw">`,
      ]
    : [];
  const mobileSources = mobile
    ? [
        `<source media="(max-width: 760px)" type="image/avif" srcset="${imagePath(page, `${imgLang}/hero-mobile-640.avif`)} 640w, ${imagePath(page, `${imgLang}/hero-mobile-900.avif`)} 900w" sizes="100vw">`,
        `<source media="(max-width: 760px)" type="image/webp" srcset="${imagePath(page, `${imgLang}/hero-mobile-640.webp`)} 640w, ${imagePath(page, `${imgLang}/hero-mobile-900.webp`)} 900w" sizes="100vw">`,
      ]
    : [];

  const wideSet =
    name === "hero-wide"
      ? `${imagePath(page, `${imgLang}/${name}-900.avif`)} 900w, ${imagePath(page, `${imgLang}/${name}-1200.avif`)} 1200w, ${imagePath(page, `${imgLang}/${name}-1600.avif`)} 1600w`
      : `${imagePath(page, `${imgLang}/${name}-1200.avif`)} 1200w, ${imagePath(page, `${imgLang}/${name}-1600.avif`)} 1600w`;
  const wideWebp =
    name === "hero-wide"
      ? `${imagePath(page, `${imgLang}/${name}-900.webp`)} 900w, ${imagePath(page, `${imgLang}/${name}-1200.webp`)} 1200w, ${imagePath(page, `${imgLang}/${name}-1600.webp`)} 1600w`
      : `${imagePath(page, `${imgLang}/${name}-1200.webp`)} 1200w, ${imagePath(page, `${imgLang}/${name}-1600.webp`)} 1600w`;
  const sizes = hero ? "100vw" : "(max-width: 980px) 100vw, 56vw";
  const dimensions = name === "hero-wide" ? 'width="1200" height="550"' : 'width="1200" height="670"';
  const sources = webpOnly
    ? [`<source type="image/webp" srcset="${wideWebp}" sizes="${sizes}">`].join("\n          ")
    : [
    ...darkMobileSources,
    ...(hero
      ? [
          `<source media="(prefers-color-scheme: dark)" type="image/avif" srcset="${imagePath(page, `${imgLang}/${name}-dark-900.avif`)} 900w, ${imagePath(page, `${imgLang}/${name}-dark-1200.avif`)} 1200w, ${imagePath(page, `${imgLang}/${name}-dark-1600.avif`)} 1600w" sizes="${sizes}">`,
          `<source media="(prefers-color-scheme: dark)" type="image/webp" srcset="${imagePath(page, `${imgLang}/${name}-dark-900.webp`)} 900w, ${imagePath(page, `${imgLang}/${name}-dark-1200.webp`)} 1200w, ${imagePath(page, `${imgLang}/${name}-dark-1600.webp`)} 1600w" sizes="${sizes}">`,
        ]
      : []),
    ...mobileSources,
    `<source type="image/avif" srcset="${wideSet}" sizes="${sizes}">`,
    `<source type="image/webp" srcset="${wideWebp}" sizes="${sizes}">`,
  ].join("\n          ");

  return `<picture class="product-picture">
          ${sources}
          <img src="${imagePath(page, `${imgLang}/${name}-1200.webp`)}" ${dimensions} alt="${alt}" ${loading}>
        </picture>`;
}

function spotPicture(page, { name, alt }) {
  return `<picture class="spot-picture">
          <source type="image/avif" srcset="${imagePath(page, `spot/${name}-420.avif`)} 420w, ${imagePath(page, `spot/${name}-842.avif`)} 842w" sizes="(max-width: 680px) 62vw, 210px">
          <source type="image/webp" srcset="${imagePath(page, `spot/${name}-420.webp`)} 420w, ${imagePath(page, `spot/${name}-842.webp`)} 842w" sizes="(max-width: 680px) 62vw, 210px">
          <img src="${imagePath(page, `spot/${name}-420.webp`)}" width="420" height="423" alt="${alt}" loading="lazy">
        </picture>`;
}

function pricingCards(page, plans, lang) {
  const isEn = lang === "en";
  const trial = plans.find((plan) => plan.slug === "trial");
  const paidPlans = plans.filter((plan) => plan.slug !== "trial");

  return `
      <div class="pricing-layout">
        ${
          trial
            ? `
        <article class="trial-card">
          <div class="trial-copy">
            <p class="eyebrow">${isEn ? "Trial" : "Проверка"}</p>
            <h3>${trial.name}</h3>
            <p>${trial.text}</p>
          </div>
          <div class="trial-card-price">
            <span>${trial.price}</span>
            <small>${trial.suffix}</small>
          </div>
          <ul class="check-list trial-list">
            ${trial.features.map((feature) => `<li>${icon("Check", { className: "list-icon" })}<span>${feature}</span></li>`).join("")}
          </ul>
          <a class="button button-light" href="${botLink(lang, `${lang}_plan_${trial.slug}`)}" data-umami-event="${trial.event}">${isEn ? "Start trial" : "Попробовать"}</a>
        </article>`
            : ""
        }
        <div class="price-grid paid-plans">
          ${paidPlans
          .map(
            (plan) => `
          <article class="price-card${plan.featured ? " featured" : ""}">
            <div class="plan-badge-slot">${plan.featured ? `<div class="plan-badge">${isEn ? "Popular" : "Популярный выбор"}</div>` : ""}</div>
            <div class="plan-copy">
              <h3>${plan.name}</h3>
              <p>${plan.text}</p>
            </div>
            <div class="price">${plan.price} <small>${plan.suffix}</small></div>
            <ul class="check-list">
              ${plan.features.map((feature) => `<li>${icon("Check", { className: "list-icon" })}<span>${feature}</span></li>`).join("")}
            </ul>
            <a class="button ${plan.featured ? "button-accent" : "button-light"}" href="${botLink(lang, `${lang}_plan_${plan.slug}`)}" data-umami-event="${plan.event}">${isEn ? "Choose plan" : "Выбрать тариф"}</a>
          </article>`
          )
          .join("")}
        </div>
      </div>`;
}

function useCaseGrid(page, lang) {
  const isEn = lang === "en";
  const items = isEn
    ? [
        ["telegram-setup", "Link and QR in the bot", "The bot sends the connection link, QR code and setup guide after payment."],
        ["devices", "Phone and computer", "Import the link or QR code into a supported client on the device you need."],
        ["stable-connection", "Traffic and speed by plan", "Traffic, speed and device limits are shown before payment."],
        ["support", "Setup help", "If payment or connection does not work, message support."],
      ]
    : [
        ["telegram-setup", "Ключ и QR в боте", "После оплаты бот отправляет ссылку подключения, QR-код и инструкцию."],
        ["devices", "Телефон и компьютер", "Импортируйте ссылку или QR-код в поддерживаемый клиент на нужном устройстве."],
        ["stable-connection", "Трафик и скорость в тарифе", "В тарифе сразу видно: трафик, скорость и лимит устройств."],
        ["support", "Помощь с подключением", "Если что-то не получилось с оплатой или подключением, напишите в поддержку."],
      ];

  return `
    <section class="section use-cases">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">Raven VPN</p>
            <h2>${isEn ? "What you get with Raven VPN" : "Что вы получаете в Raven VPN"}</h2>
          </div>
          <p>${isEn ? "Connection link, QR code, plan limits and setup help in one clear flow." : "Ключ, QR-код, лимиты тарифа и помощь с подключением — в одном понятном сценарии."}</p>
        </div>
        <div class="use-case-grid">
          ${items
            .map(
              ([image, title, text]) => `
          <article class="use-case">
            ${spotPicture(page, { name: image, alt: title })}
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function faqList(items) {
  return `
      <div class="faq-list">
        ${items
          .map(
            ([q, a]) => `
        <details class="faq-item" data-umami-event="faq_open">
          <summary><span>${q}</span>${icon("ChevronDown", { className: "summary-icon", size: 20 })}</summary>
          <p>${a}</p>
        </details>`
          )
          .join("")}
      </div>`;
}

function headJson(page) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Raven VPN",
      url: siteUrl,
      logo: `${siteUrl}/assets/img/logo.webp`,
      sameAs: ["https://t.me/TheRavenVPN"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Raven VPN",
      url: siteUrl,
      inLanguage: page.lang === "en" ? "en" : "ru",
    },
  ];

  if (page.faqJson) {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqJson.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: {
          "@type": "Answer",
          text: a,
        },
      })),
    });
  }

  return JSON.stringify(data, null, 2).replaceAll("</script", "<\\/script");
}

function nav(page) {
  const isEn = page.lang === "en";
  const links = [
    [route(page, "pricing/"), isEn ? "Pricing" : "Тарифы"],
    [route(page, "setup/"), isEn ? "Setup" : "Настройка"],
    [route(page, "faq/"), "FAQ"],
  ];

  return `
    <header class="site-header">
      <nav class="nav" aria-label="${isEn ? "Main navigation" : "Основная навигация"}">
        <a class="brand" href="${homeHref(page)}" aria-label="Raven VPN">
          <img src="${imagePath(page, "logo.webp")}" width="38" height="38" alt="">
          <span>Raven VPN</span>
        </a>
        <button class="menu-button" type="button" aria-label="${isEn ? "Open menu" : "Открыть меню"}" aria-expanded="false" data-menu-button>${icon("Menu", { size: 24 })}</button>
        <div class="nav-links" data-nav-links>
          ${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
        <div class="nav-actions">
          <a class="language" href="${languageHref(page)}">${isEn ? "RU" : "EN"}</a>
          <a class="button button-accent button-with-icon" href="${botLink(isEn ? "en" : "ru", isEn ? "site_en_header" : "site_ru_header")}" data-umami-event="hero_cta_click">${icon("Send", { className: "button-icon" })}<span>${isEn ? "Open bot" : "Открыть бота"}</span></a>
        </div>
      </nav>
    </header>`;
}

function footer(page) {
  const isEn = page.lang === "en";
  return `
    <footer class="footer">
      <div class="footer-shell">
        <div class="footer-grid">
          <div class="footer-column footer-help-column">
            <h3>${isEn ? "Support" : "Помощь"}</h3>
            <a href="${isEn ? supportLink("en", "site_en_footer") : supportLink("ru", "site_ru_footer")}" data-umami-event="support_click">${isEn ? "Support bot" : "Бот поддержки"}</a>
            <a href="${route(page, "support/")}">${isEn ? "Support" : "Поддержка"}</a>
            <a href="${route(page, "refund/")}">${isEn ? "Refunds" : "Возвраты"}</a>
          </div>
          <div class="footer-column">
            <div class="footer-group">
              <h3>${isEn ? "Product" : "Продукт"}</h3>
              <a href="${route(page, "pricing/")}">${isEn ? "Pricing" : "Тарифы"}</a>
              <a href="${route(page, "faq/")}">FAQ</a>
            </div>
            <div class="footer-group">
              <h3>${isEn ? "Legal" : "Документы"}</h3>
              <a href="${route(page, "privacy/")}" data-umami-event="legal_click">${isEn ? "Privacy" : "Конфиденциальность"}</a>
              <a href="${route(page, "terms/")}" data-umami-event="legal_click">${isEn ? "Terms" : "Условия и правила"}</a>
            </div>
          </div>
          <div class="footer-column footer-setup-column">
            <div class="footer-group">
              <h3>${isEn ? "Setup" : "Настройка"}</h3>
              <a href="${route(page, "setup/")}">${isEn ? "Setup" : "Настройка"}</a>
            </div>
            <div class="footer-group">
              <h3>Telegram</h3>
              <a href="${botLink(isEn ? "en" : "ru", isEn ? "site_en_footer_bot" : "site_ru_footer_bot")}" data-umami-event="telegram_bot_outbound">${isEn ? "Open bot" : "Открыть бота"}</a>
              <a href="${isEn ? supportLink("en", "site_en_footer_support") : supportLink("ru", "site_ru_footer_support")}" data-umami-event="support_click">${isEn ? "Support bot" : "Бот поддержки"}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© 2026 Raven VPN. ${isEn ? "VPN access through Telegram." : "VPN через Telegram."}</div>
    </footer>`;
}

function layout(page, content) {
  const canonical = `${siteUrl}${page.url}`;
  const ruUrl = page.url.startsWith("/en/") ? page.url.replace(/^\/en/, "") || "/" : page.url;
  const alternateItems = page.alternates ?? (page.file !== "404.html" ? mirroredAlternates(ruUrl) : null);
  const alternates = alternateItems
    ? alternateItems
        .map((item) => `<link rel="alternate" hreflang="${item.lang}" href="${siteUrl}${item.url}">`)
        .join("\n    ")
    : "";

  return `<!doctype html>
<html lang="${page.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Raven VPN">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/img/${page.lang === "en" ? "en" : "ru"}/hero-wide-1200.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${imagePath(page, "logo.webp")}" type="image/webp">
  <link rel="stylesheet" href="${local(page, "assets/css/site.css")}">
  <script defer src="https://stats.ravenvpn.site/script.js" data-website-id="434ba3fe-0aca-4f2c-a579-ebc335aedfc3"></script>
  <script type="application/ld+json">${headJson(page)}</script>
  <script defer src="${local(page, "assets/js/site.js")}"></script>
</head>
<body>
  <a class="skip-link" href="#main">${page.lang === "en" ? "Skip to content" : "К содержанию"}</a>
  ${nav(page)}
  <main id="main">
${content}
  </main>
  ${page.noCta ? "" : finalCta(page)}
  ${footer(page)}
  <a class="button button-accent button-with-icon sticky-cta" href="${botLink(page.lang === "en" ? "en" : "ru", page.lang === "en" ? "site_en_sticky" : "site_ru_sticky")}" data-umami-event="sticky_cta_click">${icon("Send", { className: "button-icon" })}<span>${page.lang === "en" ? "Open Telegram bot" : "Открыть бота"}</span></a>
</body>
</html>
`;
}

function finalCta(page) {
  const isEn = page.lang === "en";
  return `
    <section class="cta-band">
      <div class="wrap">
        <h2>${isEn ? "Start in Telegram" : "Начните в Telegram"}</h2>
        <p>${isEn ? "Choose a plan, pay and receive the connection link with a QR code in the bot." : "Выберите тариф, оплатите и получите ссылку подключения с QR-кодом в боте."}</p>
        <div class="cta-row">
          <a class="button button-accent button-with-icon" href="${botLink(isEn ? "en" : "ru", isEn ? "site_en_final" : "site_ru_final")}" data-umami-event="hero_cta_click">${icon("Send", { className: "button-icon" })}<span>${isEn ? "Open Telegram bot" : "Открыть Telegram-бота"}</span></a>
          <a class="button button-ghost" href="${route(page, "pricing/")}" data-umami-event="hero_pricing_click">${isEn ? "View pricing" : "Смотреть тарифы"}</a>
        </div>
      </div>
    </section>`;
}

function heroTrustBar(page, lang) {
  const isEn = lang === "en";
  const items = isEn
    ? [
        ["QrCode", "Link and QR in Telegram"],
        ["TabletSmartphone", "iPhone / Android / desktop"],
        ["Wallet", "USDT / Stars / CryptoBot"],
        ["Headphones", "Telegram support"],
      ]
    : [
        ["Gauge", "до 200 Мбит/с"],
        ["QrCode", "ключ и QR в боте"],
        ["TabletSmartphone", "iPhone / Android / PC"],
        ["Headphones", "поддержка в Telegram"],
      ];

  return `
    <section class="trust-bar" aria-label="${isEn ? "Raven VPN highlights" : "Ключевые свойства Raven VPN"}">
      <div class="wrap trust-bar-grid">
        ${items
          .map(
            ([iconName, text]) => `
        <div class="trust-bar-item">${icon(iconName, { className: "meta-icon" })}<span>${text}</span></div>`
          )
          .join("")}
      </div>
    </section>`;
}

function compactSetupSteps(lang) {
  const isEn = lang === "en";
  const steps = isEn
    ? [
        ["1", "Open the bot", "Start the purchase flow in Telegram."],
        ["2", "Choose a plan", "Check traffic, speed and device limits before payment."],
        ["3", "Get link and QR", "Import the access into a supported VPN client."],
      ]
    : [
        ["1", "Откройте бота", "Запустите покупку VPN в Telegram."],
        ["2", "Выберите тариф", "Проверьте трафик, скорость и устройства до оплаты."],
        ["3", "Получите ссылку и QR", "Импортируйте доступ в поддерживаемый VPN-клиент."],
      ];

  return `
        <div class="compact-steps">
          ${steps
            .map(
              ([number, title, text]) => `
          <article class="compact-step">
            <span>${number}</span>
            <div><strong>${title}</strong><p>${text}</p></div>
          </article>`
            )
            .join("")}
        </div>`;
}

function pageHero(page, title, lead, crumb) {
  return `
    <section class="page-hero">
      <div class="wrap">
        <nav class="breadcrumbs" aria-label="breadcrumbs">
          <a href="${homeHref(page)}">Raven VPN</a><span>/</span><span>${crumb}</span>
        </nav>
        <p class="eyebrow">Raven VPN</p>
        <h1>${title}</h1>
        <p class="lead">${lead}</p>
      </div>
    </section>`;
}

function homeRu(page) {
  return `
    <section class="hero hero-bg">
      <div class="hero-bg-media" aria-hidden="true">
        ${picture(page, { lang: "ru", name: "hero-wide", alt: "", hero: true, mobile: true })}
      </div>
      <div class="hero-content">
        <div class="hero-copy">
          <p class="eyebrow">Raven VPN</p>
          <h1>VPN, который работает</h1>
          <p class="lead">Открывает YouTube, Instagram и другие привычные сервисы. Подключение через Telegram за 2 минуты, пробный день — 15₽.</p>
          <div class="hero-actions">
            <a class="button button-accent button-with-icon" href="${botLink("ru", "site_ru_hero")}" data-umami-event="hero_cta_click">${icon("Send", { className: "button-icon" })}<span>Попробовать за 15₽</span></a>
            <a class="button button-ghost" href="${route(page, "pricing/")}" data-umami-event="hero_pricing_click">Смотреть тарифы</a>
          </div>
        </div>
      </div>
    </section>

    ${heroTrustBar(page, "ru")}

    <section class="section section-band">
      <div class="wrap">
        <div class="split setup-intro">
          <div class="setup-intro-copy">
            <div class="section-head">
              <p class="eyebrow">Как это устроено</p>
              <h2>Ключ, QR и инструкция сразу в боте</h2>
              <p>Выберите тариф, оплатите, бот отправит ссылку подключения и QR-код.</p>
            </div>
            <div class="cta-row">
              <a class="button" href="${route(page, "setup/")}" data-umami-event="setup_section_click">Настройка по шагам</a>
            </div>
          </div>
          <div class="visual-section-media transparent-visual">
            ${picture(page, { lang: "ru", name: "setup-transparent", alt: "Три шага подключения Raven VPN: бот, тариф и ключ", webpOnly: true })}
          </div>
        </div>
        ${compactSetupSteps("ru")}
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">Тарифы</p>
            <h2>Пробный доступ и месячные тарифы</h2>
          </div>
          <p>В тарифе сразу видно: трафик, скорость и лимит устройств. Скидки за период: 3 месяца —10%, 6 месяцев —20%, 12 месяцев —30%.</p>
        </div>
        ${pricingCards(page, ruPlans, "ru")}
      </div>
    </section>

    ${useCaseGrid(page, "ru")}

    <section class="section">
      <div class="wrap split split-reverse">
        <div class="product-frame transparent-visual">
          ${picture(page, { lang: "ru", name: "devices-transparent", alt: "Raven VPN на телефоне, ноутбуке и планшете", webpOnly: true })}
        </div>
        <div>
          <p class="eyebrow">Устройства</p>
          <h2>Один доступ для телефона, компьютера и планшета</h2>
          <p class="lead">Raven VPN подключается через распространённые VPN-клиенты на iOS, Android, Windows и macOS.</p>
          <ul class="plain-list">
            <li>Android: Hiddify, Happ, v2rayNG.</li>
            <li>iOS: Hiddify, Happ, V2Box, Shadowrocket.</li>
            <li>Windows и macOS: Hiddify, Happ, v2rayN.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">FAQ</p>
            <h2>Ответы на частые вопросы</h2>
          </div>
          <p>Больше ответов — на странице FAQ.</p>
        </div>
        ${faqList(ruFaq.slice(0, 4))}
      </div>
    </section>`;
}

function homeEn(page) {
  return `
    <section class="hero hero-bg">
      <div class="hero-bg-media" aria-hidden="true">
        ${picture(page, { lang: "en", name: "hero-wide", alt: "", hero: true, mobile: true })}
      </div>
      <div class="hero-content">
        <div class="hero-copy">
          <p class="eyebrow">Raven VPN Global</p>
          <h1>Private VPN through Telegram</h1>
          <p class="lead">Open the bot, choose a plan and receive the connection link, QR code and setup guide in Telegram.</p>
          <div class="hero-actions">
            <a class="button button-accent button-with-icon" href="${botLink("en", "site_en_hero")}" data-umami-event="hero_cta_click">${icon("Send", { className: "button-icon" })}<span>Open Telegram bot</span></a>
            <a class="button button-ghost" href="${route(page, "pricing/")}" data-umami-event="hero_pricing_click">View pricing</a>
          </div>
        </div>
      </div>
    </section>

    ${heroTrustBar(page, "en")}

    <section class="section section-band">
      <div class="wrap">
        <div class="split setup-intro">
          <div class="setup-intro-copy">
            <div class="section-head">
              <p class="eyebrow">Setup flow</p>
              <h2>Link, QR code and setup guide in the bot</h2>
              <p>Choose a plan, pay and import the subscription link into a supported VPN app.</p>
            </div>
          </div>
          <div class="visual-section-media transparent-visual">
            ${picture(page, { lang: "en", name: "setup-transparent", alt: "Raven VPN global setup flow in Telegram", webpOnly: true })}
          </div>
        </div>
        ${compactSetupSteps("en")}
      </div>
    </section>

    <section class="section" id="pricing">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">Pricing</p>
            <h2>USDT-priced plans for the global test</h2>
          </div>
          <p>Telegram Stars and CryptoBot are supported. Card payments are not shown on the global page.</p>
        </div>
        ${pricingCards(page, enPlans, "en")}
      </div>
    </section>

    ${useCaseGrid(page, "en")}

    <section class="section section-band" id="setup">
      <div class="wrap split split-reverse">
        <div class="product-frame transparent-visual">
          ${picture(page, { lang: "en", name: "devices-transparent", alt: "Raven VPN on phone, laptop and tablet", webpOnly: true })}
        </div>
        <div>
          <p class="eyebrow">Devices</p>
          <h2>Use one plan across common VPN clients</h2>
          <p class="lead">Use the subscription link or QR code in a supported VPN client on your device.</p>
          <ul class="plain-list">
            <li>Get the subscription link and QR code from the bot.</li>
            <li>Import the link into a supported client.</li>
            <li>Message support if import or connection fails.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">FAQ</p>
            <h2>Before you start</h2>
          </div>
          <p>Short answers about setup, payments and supported apps.</p>
        </div>
        ${faqList(enFaq)}
      </div>
    </section>`;
}

function pricingPage(page) {
  if (page.lang === "en") {
    return `
    ${pageHero(page, "Raven VPN Global pricing", "Trial access and monthly USDT plans with clear traffic, speed and device limits.", "Pricing")}
    <section class="section">
      <div class="wrap">
        ${pricingCards(page, enPlans, "en")}
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">Comparison</p>
            <h2>What each plan includes</h2>
          </div>
          <p>Period discounts: 3 months -10%, 6 months -20%, 12 months -30%.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Parameter</th><th>Trial</th><th>Start</th><th>Standard</th><th>Pro</th></tr></thead>
            <tbody>
              <tr><td>Price</td><td>1.49 USDT</td><td>4.99 USDT/mo</td><td>7.99 USDT/mo</td><td>11.99 USDT/mo</td></tr>
              <tr><td>Traffic</td><td>10 GB</td><td>250 GB</td><td>500 GB</td><td>1000 GB</td></tr>
              <tr><td>Speed</td><td>up to 25 Mbps</td><td>up to 50 Mbps</td><td>up to 100 Mbps</td><td>up to 200 Mbps</td></tr>
              <tr><td>Devices</td><td>2</td><td>2</td><td>4</td><td>6</td></tr>
              <tr><td>Period</td><td>1 day</td><td>monthly</td><td>monthly</td><td>monthly</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="panel payment-panel">
          <h2>Payment methods</h2>
          <ul class="plain-list">
            <li>Telegram Stars.</li>
            <li>CryptoBot with USDT and TON.</li>
            <li>Card payments are not shown on the global page.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">FAQ</p><h2>Payment questions</h2></div></div>
        ${faqList([
          ["Can I buy extra traffic?", "Yes. Extra traffic packages +250 GB, +500 GB and +1000 GB are available; they work until the next monthly traffic reset."],
          ["Can I upgrade my plan?", "Yes. A mid-period plan upgrade is supported. The extra payment is calculated for the remaining time, and the new monthly traffic and speed limits apply immediately."],
          ["What should I do if I was charged twice?", "Message support and include the payment method, approximate time and safe payment details without full sensitive data."],
        ])}
      </div>
    </section>`;
  }

  return `
    ${pageHero(page, "Тарифы Raven VPN", "Пробный доступ для проверки и три месячных тарифа с понятными лимитами трафика, скорости и устройств.", "Тарифы")}
    <section class="section">
      <div class="wrap">
        ${pricingCards(page, ruPlans, "ru")}
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">Сравнение</p>
            <h2>Что входит в каждый тариф</h2>
          </div>
          <p>Скидки за период: 3 месяца —10%, 6 месяцев —20%, 12 месяцев —30%.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Параметр</th><th>Пробный</th><th>Старт</th><th>Стандарт</th><th>Про</th></tr></thead>
            <tbody>
              <tr><td>Цена</td><td>15₽</td><td>149₽/мес</td><td>249₽/мес</td><td>349₽/мес</td></tr>
              <tr><td>Трафик</td><td>10 ГБ</td><td>250 ГБ</td><td>500 ГБ</td><td>1000 ГБ</td></tr>
              <tr><td>Скорость</td><td>до 25 Мбит/с</td><td>до 50 Мбит/с</td><td>до 100 Мбит/с</td><td>до 200 Мбит/с</td></tr>
              <tr><td>Устройства</td><td>2</td><td>2</td><td>4</td><td>6</td></tr>
              <tr><td>Срок</td><td>1 день</td><td>месяц</td><td>месяц</td><td>месяц</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="panel payment-panel">
          <h2>Способы оплаты</h2>
          <ul class="plain-list">
            <li>Telegram Stars.</li>
            <li>CryptoBot с USDT и TON.</li>
            <li>YooKassa, включая оплату картой и СБП.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">FAQ</p><h2>Вопросы по оплате</h2></div></div>
        ${faqList([
          ["Можно ли докупить трафик?", "Да. Доступны докупки +250 ГБ, +500 ГБ и +1000 ГБ; они действуют до ближайшего месячного сброса лимита."],
          ["Можно ли повысить тариф?", "Да, повышение тарифа посреди оплаченного срока поддерживается. Доплата считается за оставшийся срок, новый месячный лимит и скорость применяются сразу."],
          ["Что делать при двойном списании?", "Напишите в поддержку и укажите способ оплаты, примерное время и безопасные детали платежа без полных чувствительных данных."],
        ])}
      </div>
    </section>`;
}

function setupPage(page) {
  if (page.lang === "en") {
    return `
    ${pageHero(page, "Raven VPN setup on iPhone, Android, Windows and macOS", "Open the bot, choose a plan, pay and import the link or QR code into a supported app.", "Setup")}
    <section class="section">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Connection</p><h2>From purchase to connection</h2></div></div>
        ${compactSetupSteps("en")}
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap split split-reverse">
        <div class="product-frame transparent-visual">
          ${picture(page, { lang: "en", name: "devices-transparent", alt: "Supported Raven VPN devices", webpOnly: true })}
        </div>
        <div>
          <p class="eyebrow">Devices</p>
          <h2>Choose an app for your platform</h2>
          <p class="lead">The bot sends a connection link and a QR code. Import them into a compatible VPN client.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="cards">
          <article class="card"><h3>Android</h3><p>Hiddify, Happ or v2rayNG. In most cases, paste the subscription link from the bot.</p></article>
          <article class="card"><h3>iPhone and iPad</h3><p>Hiddify, Happ, V2Box or Shadowrocket. You can use either the QR code or the link.</p></article>
          <article class="card"><h3>Windows</h3><p>Hiddify, Happ or v2rayN. After import, choose the added profile and connect.</p></article>
          <article class="card"><h3>macOS</h3><p>Hiddify, Happ or v2rayN. If the link does not import, update the client to the latest version.</p></article>
          <article class="card"><h3>If it does not connect</h3><p>Switch networks, restart the app and check that the Raven VPN profile is selected.</p></article>
          <article class="card"><h3>What to send to support</h3><p>Device, app, error screenshot and approximate time of the issue. Do not send the full connection link.</p></article>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Basic steps</p><h2>The same logic for every device</h2></div></div>
        <div class="feature-rows">
          <div class="feature-row"><strong>1. Get the link</strong><p>Open paid access in the bot and copy the subscription URL or open the QR code.</p></div>
          <div class="feature-row"><strong>2. Import it</strong><p>In the app, choose subscription import by link or QR code scan.</p></div>
          <div class="feature-row"><strong>3. Connect</strong><p>Select the added profile, turn on the VPN and check that traffic goes through the client.</p></div>
        </div>
      </div>
    </section>`;
  }

  return `
    ${pageHero(page, "Подключение и настройка Raven VPN", "Откройте бота, выберите тариф, оплатите и импортируйте ссылку или QR-код в поддерживаемое приложение.", "Настройка")}
    <section class="section">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Подключение</p><h2>От покупки до подключения</h2></div></div>
        ${compactSetupSteps("ru")}
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap split split-reverse">
        <div class="product-frame transparent-visual">
          ${picture(page, { lang: "ru", name: "devices-transparent", alt: "Поддерживаемые устройства Raven VPN", webpOnly: true })}
        </div>
        <div>
          <p class="eyebrow">Устройства</p>
          <h2>Выберите приложение под свою платформу</h2>
          <p class="lead">Бот выдаёт ссылку подключения и QR-код. Дальше импортируйте их в совместимый клиент.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="cards">
          <article class="card"><h3>Android</h3><p>Hiddify, Happ или v2rayNG. Обычно достаточно вставить ссылку подписки из бота.</p></article>
          <article class="card"><h3>iPhone и iPad</h3><p>Hiddify, Happ, V2Box или Shadowrocket. Можно использовать QR-код или ссылку.</p></article>
          <article class="card"><h3>Windows</h3><p>Hiddify, Happ или v2rayN. После импорта выберите добавленный профиль и подключитесь.</p></article>
          <article class="card"><h3>macOS</h3><p>Hiddify, Happ или v2rayN. Если ссылка не импортируется, обновите клиент до актуальной версии.</p></article>
          <article class="card"><h3>Если не подключилось</h3><p>Переключите сеть, перезапустите приложение и проверьте, что выбран профиль Raven VPN.</p></article>
          <article class="card"><h3>Что прислать в поддержку</h3><p>Устройство, приложение, скриншот ошибки и примерное время проблемы. Полную ссылку подключения присылать не нужно.</p></article>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Базовые шаги</p><h2>Одинаковая логика для всех устройств</h2></div></div>
        <div class="feature-rows">
          <div class="feature-row"><strong>1. Получите ссылку</strong><p>Откройте оплаченный доступ в боте и скопируйте subscription URL или откройте QR-код.</p></div>
          <div class="feature-row"><strong>2. Импортируйте</strong><p>В приложении выберите добавление подписки по ссылке или сканирование QR-кода.</p></div>
          <div class="feature-row"><strong>3. Подключитесь</strong><p>Выберите добавленный профиль, включите VPN и проверьте, что трафик пошёл через клиент.</p></div>
        </div>
      </div>
    </section>`;
}

function faqPage(page) {
  if (page.lang === "en") {
    return `
    ${pageHero(page, "Raven VPN FAQ", "Answers about plans, apps, payments, setup and support.", "FAQ")}
    <section class="section">
      <div class="wrap">
        ${faqList([
          ...enFaq,
          ...enFaqExtra,
        ])}
      </div>
    </section>`;
  }

  return `
    ${pageHero(page, "FAQ Raven VPN", "Ответы на основные вопросы о тарифах, приложениях, оплате, подключении и поддержке.", "FAQ")}
    <section class="section">
      <div class="wrap">
        ${faqList([
          ...ruFaq,
          ...ruFaqExtra,
        ])}
      </div>
    </section>`;
}

function supportPage(page) {
  if (page.lang === "en") {
    return `
    ${pageHero(page, "Raven VPN support", "If payment or connection does not work, message support.", "Support")}
    <section class="section">
      <div class="wrap two-col">
        <div class="panel">
          <h2>Where to write</h2>
          <p class="lead">If you have a question, did not receive the link or cannot connect, message the support bot. We will reply as soon as possible.</p>
          <div class="cta-row"><a class="button button-accent button-with-icon" href="${supportLink("en", "site_en_support_page")}" data-umami-event="support_click">${icon("Headphones", { className: "button-icon" })}<span>Message support</span></a></div>
        </div>
        <div class="panel">
          <h2>What to send first</h2>
          <ul class="plain-list">
            <li>device and app;</li>
            <li>error screenshot without sensitive data;</li>
            <li>approximate payment or issue time;</li>
            <li>payment method, if the question is about payment.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Before support</p><h2>Quick checks</h2></div></div>
        <div class="feature-rows">
          <div class="feature-row"><strong>Update the client</strong><p>Old app versions can import the connection link incorrectly.</p></div>
          <div class="feature-row"><strong>Check the profile</strong><p>Make sure the selected profile is the Raven VPN profile added from the bot.</p></div>
          <div class="feature-row"><strong>Try another network</strong><p>Sometimes the issue is related to the current Wi-Fi or mobile network, not the key.</p></div>
        </div>
      </div>
    </section>`;
  }

  return `
    ${pageHero(page, "Поддержка Raven VPN", "Если что-то не получилось с оплатой или подключением, напишите в поддержку.", "Поддержка")}
    <section class="section">
      <div class="wrap two-col">
        <div class="panel">
          <h2>Куда писать</h2>
          <p class="lead">Если возник вопрос, не пришла ссылка или VPN не подключается, напишите в бота поддержки. Мы ответим как можно скорее.</p>
          <div class="cta-row"><a class="button button-accent button-with-icon" href="${supportLink("ru", "site_ru_support_page")}" data-umami-event="support_click">${icon("Headphones", { className: "button-icon" })}<span>Написать в поддержку</span></a></div>
        </div>
        <div class="panel">
          <h2>Что прислать сразу</h2>
          <ul class="plain-list">
            <li>устройство и приложение;</li>
            <li>скриншот ошибки без секретных данных;</li>
            <li>примерное время оплаты или проблемы;</li>
            <li>способ оплаты, если вопрос про платёж.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section section-band">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">До обращения</p><h2>Быстрые проверки</h2></div></div>
        <div class="feature-rows">
          <div class="feature-row"><strong>Обновите клиент</strong><p>Старые версии приложений могут некорректно импортировать ссылку подключения.</p></div>
          <div class="feature-row"><strong>Проверьте профиль</strong><p>Убедитесь, что выбран именно профиль Raven VPN, который был добавлен из бота.</p></div>
          <div class="feature-row"><strong>Попробуйте другую сеть</strong><p>Иногда проблема связана с текущей Wi-Fi или мобильной сетью, а не с ключом.</p></div>
        </div>
      </div>
    </section>`;
}

function legalPage(page, title, lead, sections) {
  return `
    ${pageHero(page, title, lead, page.crumb)}
    <section class="section">
      <div class="wrap legal-text">
        ${sections
          .map(
            ([heading, body]) => `
          <section>
            <h2>${heading}</h2>
            ${body}
          </section>`
          )
          .join("")}
      </div>
    </section>`;
}

function notFoundPage(page) {
  return `
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">404</p>
        <h1>Страница не найдена</h1>
        <p class="lead">Возможно, ссылка устарела или страница была перемещена.</p>
        <div class="cta-row">
          <a class="button button-accent" href="${local(page)}">На главную</a>
          <a class="button button-ghost" href="${botLink("ru", "site_ru_404")}">Открыть бота</a>
        </div>
      </div>
    </section>`;
}

const pages = [
  {
    file: "index.html",
    url: "/",
    lang: "ru",
    title: "Raven VPN — VPN, который работает",
    description: "Raven VPN открывает привычные сервисы и подключается через Telegram: пробный день 15₽, ключ, QR и инструкция сразу в боте.",
    alternates: [
      { lang: "ru", url: "/" },
      { lang: "en", url: "/en/" },
      { lang: "x-default", url: "/" },
    ],
    faqJson: ruFaq.slice(0, 4),
    render: homeRu,
  },
  {
    file: "en/index.html",
    url: "/en/",
    lang: "en",
    title: "Raven VPN Global — private VPN through Telegram",
    description: "Raven VPN Global: private VPN through Telegram with a connection link, QR code, USDT pricing, Stars and CryptoBot payments.",
    alternates: [
      { lang: "ru", url: "/" },
      { lang: "en", url: "/en/" },
      { lang: "x-default", url: "/" },
    ],
    faqJson: enFaq,
    render: homeEn,
  },
  {
    file: "en/pricing/index.html",
    url: "/en/pricing/",
    lang: "en",
    title: "Raven VPN Global pricing — trial and monthly plans",
    description: "Compare Raven VPN Global plans: Trial, Start, Standard and Pro. Traffic, speed, devices, payment methods and period discounts.",
    render: pricingPage,
  },
  {
    file: "en/how-it-works/index.html",
    url: "/en/how-it-works/",
    lang: "en",
    title: "Raven VPN setup",
    description: "This page moved to the Raven VPN setup section.",
    redirect: "/en/setup/",
    noSitemap: true,
  },
  {
    file: "en/setup/index.html",
    url: "/en/setup/",
    lang: "en",
    title: "Raven VPN setup on iPhone, Android, Windows and macOS",
    description: "How to set up Raven VPN: supported apps, link or QR code import, basic checks and support.",
    render: setupPage,
  },
  {
    file: "en/faq/index.html",
    url: "/en/faq/",
    lang: "en",
    title: "Raven VPN FAQ — plans, payments and setup",
    description: "Answers to common Raven VPN questions: trial access, supported apps, payments, renewal, devices and support.",
    faqJson: [...enFaq, ...enFaqExtra],
    render: faqPage,
  },
  {
    file: "en/support/index.html",
    url: "/en/support/",
    lang: "en",
    title: "Raven VPN support — payment and connection help",
    description: "Where to write if Raven VPN does not connect, the link did not arrive or you have a payment question. What to include in a support message.",
    render: supportPage,
  },
  {
    file: "en/privacy/index.html",
    url: "/en/privacy/",
    lang: "en",
    crumb: "Privacy",
    title: "Raven VPN privacy",
    description: "A short Raven VPN privacy policy: what data is needed for service operation, payments, support and safety.",
    render: (page) =>
      legalPage(page, "Raven VPN privacy", "What data is needed for service operation, payments and support.", [
        ["What the service needs", "<p>Raven VPN works through Telegram. Purchases, support and subscription management use your Telegram ID and technical data needed to issue access.</p>"],
        ["Payments", "<p>Payment can go through Telegram Stars and CryptoBot on the global flow. Payment providers process payments under their own rules. Do not send full sensitive payment data to support.</p>"],
        ["VPN access", "<p>We do not store data about your activity on the network.</p>"],
        ["Support", "<p>If you message support, your message can be used to resolve the request. Do not send the full connection link, secrets or sensitive data.</p>"],
      ]),
  },
  {
    file: "en/terms/index.html",
    url: "/en/terms/",
    lang: "en",
    crumb: "Terms",
    title: "Raven VPN terms and rules",
    description: "Basic Raven VPN terms and usage rules: personal use, plans, limits, renewal, restrictions and support.",
    render: (page) =>
      legalPage(page, "Raven VPN terms and rules", "Basic service terms and acceptable use rules.", [
        ["Personal use", "<p>Raven VPN is intended for personal use. Sharing access keys with third parties is prohibited.</p>"],
        ["Plans and limits", "<p>Traffic, speed and device limits depend on the selected plan. If limits are exceeded, the service can restrict access under product rules.</p>"],
        ["Renewal", "<p>An active subscription can be renewed. If the subscription is still active, renewal is added to the current end date. Details are shown in the bot.</p>"],
        ["Prohibited use", "<ul><li>sharing keys with third parties;</li><li>using the service for spam, DDoS or malicious activity;</li><li>trying to bypass plan or device limits;</li><li>using the service for illegal activity.</li></ul>"],
        ["Access restrictions", "<p>If the rules are violated, access can be limited or blocked. For disputed situations, contact support.</p>"],
      ]),
  },
  {
    file: "en/refund/index.html",
    url: "/en/refund/",
    lang: "en",
    crumb: "Refunds",
    title: "Raven VPN refunds",
    description: "How Raven VPN reviews refunds and disputed payments: manual review, safe support details and support.",
    render: (page) =>
      legalPage(page, "Raven VPN refunds", "Refunds and disputed payments are reviewed manually for the specific situation.", [
        ["Manual review", "<p>An operator checks the payment, access issue status and problem description.</p>"],
        ["What to send", "<p>Include the payment method, approximate time, last 4 characters of the identifier if available, and a screenshot without sensitive data.</p>"],
        ["When to write", "<p>Message support if the payment was not found, the link did not arrive after payment, you were charged twice or there is a dispute about the amount.</p>"],
      ]),
  },
  {
    file: "pricing/index.html",
    url: "/pricing/",
    lang: "ru",
    title: "Тарифы Raven VPN — пробный доступ и месячные планы",
    description: "Сравнение тарифов Raven VPN: Пробный, Старт, Стандарт и Про. Трафик, скорость, устройства, способы оплаты и скидки за период.",
    render: pricingPage,
  },
  {
    file: "how-it-works/index.html",
    url: "/how-it-works/",
    lang: "ru",
    title: "Настройка Raven VPN",
    description: "Страница перемещена в раздел настройки Raven VPN.",
    redirect: "/setup/",
    noSitemap: true,
  },
  {
    file: "setup/index.html",
    url: "/setup/",
    lang: "ru",
    title: "Настройка Raven VPN на iPhone, Android, Windows и macOS",
    description: "Как подключить Raven VPN: поддерживаемые приложения, импорт ссылки или QR-кода, базовые проверки и обращение в поддержку.",
    render: setupPage,
  },
  {
    file: "faq/index.html",
    url: "/faq/",
    lang: "ru",
    title: "FAQ Raven VPN — ответы о тарифах, оплате и подключении",
    description: "Ответы на частые вопросы Raven VPN: пробный доступ, поддерживаемые приложения, оплата, продление, устройства и поддержка.",
    faqJson: [...ruFaq, ...ruFaqExtra],
    render: faqPage,
  },
  {
    file: "support/index.html",
    url: "/support/",
    lang: "ru",
    title: "Поддержка Raven VPN — помощь с оплатой и подключением",
    description: "Куда писать, если Raven VPN не подключается, не пришла ссылка или возник вопрос по оплате. Что приложить к обращению.",
    render: supportPage,
  },
  {
    file: "privacy/index.html",
    url: "/privacy/",
    lang: "ru",
    crumb: "Конфиденциальность",
    title: "Конфиденциальность Raven VPN",
    description: "Краткая политика конфиденциальности Raven VPN: какие данные нужны для работы сервиса, оплаты, поддержки и безопасности.",
    render: (page) =>
      legalPage(page, "Конфиденциальность Raven VPN", "Какие данные нужны для работы сервиса, оплаты и поддержки.", [
        ["Что нужно для сервиса", "<p>Raven VPN работает через Telegram. Для покупки, поддержки и управления подпиской используется ваш Telegram ID и технические данные, необходимые для выдачи доступа.</p>"],
        ["Платежи", "<p>Оплата может проходить через Telegram Stars, CryptoBot, YooKassa и СБП. Платёжные провайдеры обрабатывают оплату по своим правилам. Мы не просим присылать полные чувствительные платёжные данные в поддержку.</p>"],
        ["VPN-доступ", "<p>Мы не храним данные о ваших действиях в сети.</p>"],
        ["Поддержка", "<p>Если вы пишете в поддержку, сообщение может использоваться для решения обращения. Не отправляйте полную ссылку подключения, секреты и чувствительные данные.</p>"],
      ]),
  },
  {
    file: "terms/index.html",
    url: "/terms/",
    lang: "ru",
    crumb: "Условия и правила",
    title: "Условия и правила использования Raven VPN",
    description: "Основные условия и правила Raven VPN: личное использование, тарифы, лимиты, продление, ограничения и поддержка.",
    render: (page) =>
      legalPage(page, "Условия и правила использования Raven VPN", "Основные условия сервиса и правила допустимого использования.", [
        ["Личное использование", "<p>Raven VPN предназначен для личного использования. Передача ключей третьим лицам запрещена.</p>"],
        ["Тарифы и лимиты", "<p>Трафик, скорость и количество устройств зависят от тарифа. При превышении лимитов сервис может ограничить доступ в рамках правил продукта.</p>"],
        ["Продление", "<p>Активную подписку можно продлить. Если подписка ещё активна, продление добавляется к текущей дате окончания. Детали отображаются в боте.</p>"],
        ["Запрещено", "<ul><li>передавать ключи третьим лицам;</li><li>использовать сервис для спама, DDoS и вредоносной активности;</li><li>пытаться обходить ограничения тарифа или лимит устройств;</li><li>использовать сервис для незаконных действий.</li></ul>"],
        ["Ограничение доступа", "<p>При нарушении правил доступ может быть ограничен или заблокирован. В спорных ситуациях обращайтесь в поддержку.</p>"],
      ]),
  },
  {
    file: "refund/index.html",
    url: "/refund/",
    lang: "ru",
    crumb: "Возвраты",
    title: "Возвраты Raven VPN",
    description: "Как Raven VPN рассматривает возвраты и спорные платежи: ручная проверка, безопасные данные для обращения и поддержка.",
    render: (page) =>
      legalPage(page, "Возвраты Raven VPN", "Возвраты и спорные платежи рассматриваются вручную по конкретной ситуации.", [
        ["Ручная проверка", "<p>Оператор проверяет оплату, статус выдачи доступа и описание проблемы.</p>"],
        ["Что прислать", "<p>Укажите способ оплаты, примерное время, последние 4 символа идентификатора при наличии и скриншот без чувствительных данных.</p>"],
        ["Когда писать", "<p>Пишите в поддержку, если платёж не найден, ссылка не пришла после оплаты, было двойное списание или возник спор по сумме.</p>"],
      ]),
  },
  {
    file: "404.html",
    url: "/404.html",
    lang: "ru",
    title: "Страница не найдена — Raven VPN",
    description: "Страница Raven VPN не найдена.",
    noOffer: true,
    noCta: true,
    render: notFoundPage,
  },
];

async function writePage(page) {
  const out = path.join(root, page.file);
  await mkdir(path.dirname(out), { recursive: true });
  const html = page.redirect
    ? `<!doctype html>
<html lang="${page.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${siteUrl}${page.redirect}">
  <meta http-equiv="refresh" content="0; url=${page.redirect}">
  <title>${page.title}</title>
</head>
<body>
  <p><a href="${page.redirect}">${page.lang === "en" ? "Go to Raven VPN setup" : "Перейти к настройке Raven VPN"}</a></p>
  <script>location.replace("${page.redirect}");</script>
</body>
</html>`
    : layout(page, page.render(page));
  await writeFile(out, html.replace(/[ \t]+$/gm, ""), "utf8");
}

function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((page) => page.file !== "404.html" && !page.noSitemap)
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

async function main() {
  for (const page of pages) {
    await writePage(page);
  }

  await writeFile(
    path.join(root, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
    "utf8"
  );

  await writeFile(path.join(root, "sitemap.xml"), sitemap(), "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
