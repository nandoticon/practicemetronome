(() => {
  "use strict";

  const supported = ["en-US", "pt-BR", "es", "it", "fr", "de", "ja", "zh-CN", "ko"];
  const messages = typeof window !== "undefined"
    ? window.MetronomeLocaleMessages
    : Object.fromEntries(supported.map((language) => [language, require(`./locales/${language}.js`)]));
  const keys = Object.keys(messages["en-US"]);
  Object.values(messages).forEach((locale) => {
    keys.forEach((key) => {
      if (typeof locale[key] !== "string") throw new Error(`Missing translation: ${key}`);
    });
  });
  let current = "en-US";
  const translate = (key, params = {}) => {
    const template = messages[current][key] ?? messages["en-US"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
  };
  const setLanguage = (language) => {
    current = supported.includes(language) ? language : "en-US";
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = translate(key);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });
    document.title = translate("pageTitle");
    return current;
  };
  const api = Object.freeze({ translate, setLanguage, get language() { return current; }, supported, keys });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeI18n = api;
})();
