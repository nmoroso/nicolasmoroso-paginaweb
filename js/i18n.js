const I18N_CACHE = {};
let currentLang = 'es';
let currentDictionary = {};

const getNestedValue = (source, key) => {
  if (!source) return undefined;
  return key.split('.').reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, source);
};

const t = (key) => {
  const value = getNestedValue(currentDictionary, key);
  return value !== undefined ? value : key;
};

const loadLanguage = async (lang) => {
  if (I18N_CACHE[lang]) {
    return I18N_CACHE[lang];
  }

  const response = await fetch(`/i18n/${lang}.json`, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`No se pudo cargar el idioma: ${lang}`);
  }

  const data = await response.json();
  I18N_CACHE[lang] = data;
  return data;
};

const updateLanguageToggle = (lang) => {
  document.querySelectorAll('.language-toggle-button').forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive.toString());
  });
};

const applyLanguage = async (lang) => {
  currentDictionary = await loadLanguage(lang);
  currentLang = lang;

  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    const value = t(key);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const value = t(key);
    if (value !== undefined) {
      el.setAttribute('placeholder', value);
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    const value = t(key);
    if (value !== undefined) {
      el.setAttribute('title', value);
    }
  });

  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const key = el.dataset.i18nContent;
    const value = t(key);
    if (value !== undefined) {
      el.setAttribute('content', value);
    }
  });

  updateLanguageToggle(lang);

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
};

const detectInitialLanguage = () => {
  const stored = localStorage.getItem('lang');
  if (stored) {
    return stored;
  }
  const browserLang = (navigator.language || 'es').toLowerCase();
  return browserLang.startsWith('en') ? 'en' : 'es';
};

const setLanguage = async (lang) => {
  try {
    await applyLanguage(lang);
    localStorage.setItem('lang', lang);
  } catch (error) {
    console.error(error);
    if (lang !== 'es') {
      await applyLanguage('es');
      localStorage.setItem('lang', 'es');
    }
  }
};

const attachLanguageToggle = () => {
  document.querySelectorAll('.language-toggle-button').forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      if (lang) {
        setLanguage(lang);
      }
    });
  });
};

const initI18n = () => {
  attachLanguageToggle();
  const initialLang = detectInitialLanguage();
  setLanguage(initialLang);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}

window.setLanguage = setLanguage;
window.t = t;
window.loadLanguage = loadLanguage;
window.applyLanguage = applyLanguage;
