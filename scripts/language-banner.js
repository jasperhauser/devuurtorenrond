(function () {
	var STORAGE_KEY = 'devuurtorenrond-lang';
	var isEnglishPage = /^\/en(\/|$)/.test(window.location.pathname);

	function prefersDutch() {
		var langs = navigator.languages && navigator.languages.length
			? Array.prototype.slice.call(navigator.languages)
			: [navigator.language || ''];
		return langs.some(function (lang) {
			return /^nl\b/i.test(String(lang));
		});
	}

	function readPref() {
		try {
			return localStorage.getItem(STORAGE_KEY);
		} catch (error) {
			return null;
		}
	}

	function writePref(value) {
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch (error) {
			/* ignore */
		}
	}

	function hideBanner(banner) {
		banner.hidden = true;
		document.documentElement.classList.remove('has-lang-banner');
	}

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('.lang-switch[data-lang-pref]').forEach(function (link) {
			link.addEventListener('click', function () {
				writePref(link.getAttribute('data-lang-pref'));
			});
		});

		var banner = document.getElementById('lang-banner');
		if (!banner) return;

		var pref = readPref();
		if (isEnglishPage) {
			if (pref === 'nl' || pref === 'en' || !prefersDutch()) {
				hideBanner(banner);
				return;
			}
		} else if (pref === 'en' || pref === 'nl' || prefersDutch()) {
			hideBanner(banner);
			return;
		}

		banner.hidden = false;
		document.documentElement.classList.add('has-lang-banner');

		var link = banner.querySelector('.lang-banner-link');
		var close = banner.querySelector('.lang-banner-close');

		if (link) {
			link.addEventListener('click', function () {
				writePref(isEnglishPage ? 'nl' : 'en');
			});
		}

		if (close) {
			close.addEventListener('click', function () {
				writePref(isEnglishPage ? 'en' : 'nl');
				hideBanner(banner);
			});
		}
	});
})();
