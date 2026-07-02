(function () {
	var root = document.documentElement;

	// The inline head guard adds `js-reveal` before this file loads.
	if (!root.classList.contains('js-reveal')) return;

	// Signal to the safety fallback that reveal logic is running.
	root.classList.add('reveal-ready');

	// Without IntersectionObserver, just show everything (no hidden states).
	if (!('IntersectionObserver' in window)) {
		root.classList.remove('js-reveal');
		return;
	}

	var SELECTORS = [
		'.intro p',
		'.image-pair > figure',
		'.editions > .edition-card',
		'.book-grid > .media-large',
		'.nested-grid > *',
		'.project .section-heading > *',
		'.media-grid > .media-card',
		'.makers-bio',
		'.makers-photo',
		'.season-grid > .season-card',
		'.book-faq > h2',
		'.book-faq-lead',
		'.book-faq-item',
		'.loek-prints-photo',
		'.loek-prints-copy',
		'.newsletter-copy',
		'.newsletter-photo'
	];

	var targets = [];
	SELECTORS.forEach(function (selector) {
		document.querySelectorAll(selector).forEach(function (el) {
			if (el.classList.contains('reveal')) return;
			el.classList.add('reveal');
			targets.push(el);
		});
	});

	if (!targets.length) {
		root.classList.remove('js-reveal');
		return;
	}

	var STAGGER_STEP = 0.08; // seconds between cascading siblings
	var STAGGER_CAP = 6; // never delay more than ~0.48s
	var REVEAL_DURATION = 0.9; // seconds; keep in sync with styles-boek.css

	var observer = new IntersectionObserver(function (entries) {
		// Reveal everything that entered together with a small cascade so
		// grid rows ripple in rather than popping at once.
		var batch = entries.filter(function (entry) {
			return entry.isIntersecting;
		});

		// Top-to-bottom, then left-to-right keeps the cascade natural.
		batch.sort(function (a, b) {
			var ra = a.boundingClientRect;
			var rb = b.boundingClientRect;
			return ra.top - rb.top || ra.left - rb.left;
		});

		batch.forEach(function (entry, index) {
			var el = entry.target;
			var delay = Math.min(index, STAGGER_CAP) * STAGGER_STEP;
			el.style.setProperty('--reveal-delay', delay + 's');
			el.classList.add('is-visible');
			observer.unobserve(el);

			window.setTimeout(function () {
				el.classList.remove('reveal', 'is-visible');
				el.style.removeProperty('--reveal-delay');
			}, (delay + REVEAL_DURATION) * 1000);
		});
	}, {
		// Trigger the moment an element's edge crosses into the viewport, so
		// the reveal plays as it scrolls into view — not before, not late.
		threshold: 0,
		rootMargin: '0px 0px -5% 0px'
	});

	targets.forEach(function (el) {
		observer.observe(el);
	});
})();
