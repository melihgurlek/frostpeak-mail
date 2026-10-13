// Fills extension pages from _locales: data-i18n sets the text, data-i18n-aria sets aria-label.
const t = (key, ...subs) => chrome.i18n.getMessage(key, subs) || key;

document.documentElement.lang = chrome.i18n.getUILanguage().split("-")[0];
for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
for (const el of document.querySelectorAll("[data-i18n-aria]")) el.setAttribute("aria-label", t(el.dataset.i18nAria));
