(function () {
	var STORAGE_KEY = 'devuurtorenrond-lang';

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
		var banner = document.getElementById('lang-banner');
		if (!banner) return;

		var pref = readPref();
		if (pref === 'en' || pref === 'nl' || prefersDutch()) {
			hideBanner(banner);
			return;
		}

		banner.hidden = false;
		document.documentElement.classList.add('has-lang-banner');

		var link = banner.querySelector('.lang-banner-link');
		var close = banner.querySelector('.lang-banner-close');

		if (link) {
			link.addEventListener('click', function () {
				writePref('en');
			});
		}

		if (close) {
			close.addEventListener('click', function () {
				writePref('nl');
				hideBanner(banner);
			});
		}
	});
})();
