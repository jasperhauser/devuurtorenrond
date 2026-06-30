/**
 * Quantity stepper for the buy buttons.
 *
 * Each control marked with [data-qty-control] holds a number input and a buy
 * link (Shopify cart permalink). Changing the quantity rewrites the quantity
 * segment in the cart permalink (…/cart/<variant>:<qty>?…) and updates the
 * price shown on the button (unit price × quantity).
 */
(function () {
	'use strict';

	function clamp(value, min, max) {
		if (isNaN(value)) return min;
		if (value < min) return min;
		if (max !== null && value > max) return max;
		return value;
	}

	function formatPrice(amount) {
		// Prices are whole euros; keep decimals only when they actually occur.
		var rounded = Math.round(amount * 100) / 100;
		return '\u20AC' + (rounded % 1 === 0 ? rounded : rounded.toFixed(2).replace('.', ','));
	}

	function setupControl(control) {
		var input = control.querySelector('[data-qty-input]');
		var link = control.querySelector('[data-buy-link]');
		if (!input || !link) return;

		var priceEl = control.querySelector('[data-buy-price]');
		var unitPrice = parseFloat(control.getAttribute('data-unit-price')) || 0;
		var min = parseInt(input.getAttribute('min'), 10) || 1;
		var maxAttr = parseInt(input.getAttribute('max'), 10);
		var max = isNaN(maxAttr) ? null : maxAttr;
		var baseHref = link.getAttribute('href');
		var decBtn = control.querySelector('[data-qty-step="-1"]');
		var incBtn = control.querySelector('[data-qty-step="1"]');

		function render(qty) {
			link.setAttribute('href', baseHref.replace(/(\/cart\/\d+:)\d+/, '$1' + qty));
			if (priceEl && unitPrice) {
				priceEl.textContent = formatPrice(unitPrice * qty);
			}
			if (decBtn) decBtn.disabled = qty <= min;
			if (incBtn) incBtn.disabled = max !== null && qty >= max;
		}

		function currentQty() {
			return clamp(parseInt(input.value, 10), min, max);
		}

		function commit(qty) {
			input.value = qty;
			render(qty);
		}

		control.querySelectorAll('[data-qty-step]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var step = parseInt(btn.getAttribute('data-qty-step'), 10) || 0;
				commit(clamp(currentQty() + step, min, max));
			});
		});

		// Live preview while typing, without forcing the value back yet.
		input.addEventListener('input', function () {
			var raw = parseInt(input.value, 10);
			if (!isNaN(raw)) {
				render(clamp(raw, min, max));
			}
		});

		// Normalise on blur/change (handles empty or out-of-range input).
		input.addEventListener('change', function () {
			commit(currentQty());
		});

		commit(currentQty());
	}

	function init() {
		document.querySelectorAll('[data-qty-control]').forEach(setupControl);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
