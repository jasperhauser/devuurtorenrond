(function () {
	var PRODUCTS = {
		standard: {
			name: 'Standaard Editie',
			price: 55
		},
		special: {
			name: 'Speciale Editie',
			price: 125
		}
	};

	function pageLanguage() {
		return /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'nl';
	}

	function track(eventName, params) {
		if (typeof gtag !== 'function') {
			return;
		}
		gtag('event', eventName, params);
	}

	function trackBeginCheckout(edition, location) {
		var product = PRODUCTS[edition];
		if (!product) {
			return;
		}

		track('begin_checkout', {
			currency: 'EUR',
			value: product.price,
			items: [{
				item_id: edition,
				item_name: product.name,
				price: product.price,
				quantity: 1
			}],
			location: location,
			page_language: pageLanguage(),
			transport_type: 'beacon'
		});
	}

	function bindBuyButtons() {
		document.querySelectorAll('a[data-edition].button, a.button[data-edition]').forEach(function (link) {
			link.addEventListener('click', function () {
				var card = link.closest('.edition-card');
				var edition = link.getAttribute('data-edition')
					|| (card && card.classList.contains('edition-card-special') ? 'special' : 'standard');

				trackBeginCheckout(
					edition,
					link.getAttribute('data-location') || 'buy_button'
				);
			});
		});
	}

	function bindNewsletter() {
		var form = document.getElementById('mc-embedded-subscribe-form');
		var success = document.getElementById('mce-success-response');
		if (!form || !success) {
			return;
		}

		var tracked = false;

		function trackNewsletterLead() {
			if (tracked) {
				return;
			}
			if (success.style.display === 'none' || !success.textContent.trim()) {
				return;
			}

			tracked = true;
			track('generate_lead', {
				form_location: 'newsletter',
				page_language: pageLanguage()
			});
		}

		new MutationObserver(trackNewsletterLead).observe(success, {
			attributes: true,
			attributeFilter: ['style'],
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	function bindLanguageTracking() {
		document.querySelectorAll('.lang-switch[data-lang-pref]').forEach(function (link) {
			link.addEventListener('click', function () {
				track('language_preference', {
					choice: link.getAttribute('data-lang-pref'),
					source: 'footer',
					page_language: pageLanguage()
				});
			});
		});

		var banner = document.getElementById('lang-banner');
		if (!banner) {
			return;
		}

		var bannerLink = banner.querySelector('.lang-banner-link');
		if (bannerLink) {
			bannerLink.addEventListener('click', function () {
				track('language_preference', {
					choice: pageLanguage() === 'en' ? 'nl' : 'en',
					source: 'banner',
					page_language: pageLanguage()
				});
			});
		}

		var close = banner.querySelector('.lang-banner-close');
		if (close) {
			close.addEventListener('click', function () {
				track('language_preference', {
					choice: pageLanguage(),
					source: 'banner_dismiss',
					page_language: pageLanguage()
				});
			});
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		bindBuyButtons();
		bindNewsletter();
		bindLanguageTracking();
	});
})();
