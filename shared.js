/* === Mortmain Studio — shared script for sub-pages === */
/* Handles: language switching with localStorage, sticky nav */

(function() {
    'use strict';

    // Sticky nav
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Language switching — each sub-page defines its own `pageTranslations` global
    window.MortmainI18n = {
        LANG: 'en',

        apply: function(lang) {
            if (!window.pageTranslations || !window.pageTranslations[lang]) return;
            this.LANG = lang;
            document.documentElement.lang = lang;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (window.pageTranslations[lang][key]) {
                    el.textContent = window.pageTranslations[lang][key];
                }
            });
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.dataset.i18nHtml;
                if (window.pageTranslations[lang][key]) {
                    el.innerHTML = window.pageTranslations[lang][key];
                }
            });
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
            try { localStorage.setItem('mortmain_lang', lang); } catch (e) {}
        },

        init: function() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => this.apply(btn.dataset.lang));
            });
            try {
                const stored = localStorage.getItem('mortmain_lang');
                if (stored && window.pageTranslations && window.pageTranslations[stored]) {
                    this.apply(stored);
                }
            } catch (e) {}
        }
    };

    // Init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.MortmainI18n.init());
    } else {
        window.MortmainI18n.init();
    }
})();
