/* === Mortmain Studio — shared script for sub-pages === */
/* Handles: language switching (10 languages, dropdown, EN fallback) + sticky nav */

(function() {
    'use strict';

    // Sticky nav
    var nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Language code shown in the dropdown trigger
    var META = {
        en: 'EN', uk: 'UA', ru: 'RU', de: 'DE', es: 'ES',
        pt: 'PT', fr: 'FR', it: 'IT', zh: 'ZH', ja: 'JA'
    };

    window.MortmainI18n = {
        LANG: 'en',

        apply: function(lang) {
            var T = window.pageTranslations;
            if (!T) return;
            var dict = T[lang] || T['en'];
            var en = T['en'] || {};
            this.LANG = lang;
            document.documentElement.lang = lang;

            // Plain-text keys (fall back to English for anything this language omits)
            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                var key = el.dataset.i18n;
                var val = (dict && dict[key] != null) ? dict[key] : en[key];
                if (val != null) el.textContent = val;
            });
            // HTML keys (preserve embedded links) — same fallback
            document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
                var key = el.dataset.i18nHtml;
                var val = (dict && dict[key] != null) ? dict[key] : en[key];
                if (val != null) el.innerHTML = val;
            });

            var cur = document.getElementById('langCurrentCode');
            if (cur) cur.textContent = META[lang] || META.en;
            document.querySelectorAll('.lang-option').forEach(function(opt) {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });
            var SOON = { en:"— soon", ru:"— скоро", uk:"— незабаром", de:"— bald", es:"— pronto", pt:"— em breve", fr:"— bientôt", it:"— presto", zh:"— 即将", ja:"— 近日" };
            document.documentElement.style.setProperty('--soon-label', '"' + (SOON[lang] || SOON.en) + '"');
            try { localStorage.setItem('mortmain_lang', lang); } catch (e) {}
        },

        init: function() {
            var self = this;
            var switcher = document.getElementById('langSwitcher');
            var current = document.getElementById('langCurrent');
            if (current && switcher) {
                current.addEventListener('click', function(e) {
                    e.stopPropagation();
                    switcher.classList.toggle('open');
                });
                document.addEventListener('click', function() {
                    switcher.classList.remove('open');
                });
            }
            document.querySelectorAll('.lang-option').forEach(function(opt) {
                opt.addEventListener('click', function(e) {
                    e.stopPropagation();
                    self.apply(opt.dataset.lang);
                    if (switcher) switcher.classList.remove('open');
                });
            });
            try {
                var stored = localStorage.getItem('mortmain_lang');
                if (stored && window.pageTranslations) self.apply(stored);
            } catch (e) {}
        }
    };

    // Page transition: veil fades in on internal navigation, page reveals on load
    function initTransitions() {
        var veil = document.createElement('div');
        veil.className = 'page-veil';
        veil.style.background = '#080706';
        document.body.appendChild(veil);
        // Back/forward cache restore: strip the veil so the page is visible again
        window.addEventListener('pageshow', function() {
            document.body.classList.remove('leaving');
        });


        document.addEventListener('click', function(e) {
            var a = e.target.closest ? e.target.closest('a[href]') : null;
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('http') === 0) return;
            if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            document.body.classList.add('leaving');
            setTimeout(function() { window.location.href = href; }, 380);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { window.MortmainI18n.init(); initTransitions(); });
    } else {
        window.MortmainI18n.init();
        initTransitions();
    }
})();
