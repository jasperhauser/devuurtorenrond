/**
 * Shows the remaining stock for editions in their titles (e.g. "Speciale Editie - 17 over").
 *
 * Uses the Shopify Storefront API, which can return live inventory counts. This needs a
 * PUBLIC Storefront API access token (safe to ship in client-side code) created from a
 * custom app in the Shopify admin, with the "Read product inventory" Storefront scope
 * (unauthenticated_read_product_inventory) enabled. See setup notes at the bottom.
 *
 * If the token is missing or the request fails, nothing is shown — the title stays clean.
 */
(function () {
	'use strict';

	var CONFIG = {
		shopDomain: 'de-vuurtoren-rond.myshopify.com',
		storefrontToken: 'ef56e44835d83581dc9c350e6c518d64', // public Storefront API access token
		apiVersion: '2025-01',
		editions: {
			special: {
				productHandle: 'speciale-editie',
				// Only show the counter at/below this many copies. Set to null to always show.
				showAtOrBelow: null,
			},
			standard: {
				productHandle: 'de-vuurtoren-rond',
				showAtOrBelow: null,
			},
		},
	};

	function render(edition, quantity) {
		var config = CONFIG.editions[edition];
		var els = document.querySelectorAll('[data-edition-stock="' + edition + '"]');
		if (!els.length || !config || typeof quantity !== 'number' || quantity <= 0) return;
		if (config.showAtOrBelow !== null && quantity > config.showAtOrBelow) return;

		els.forEach(function (el) {
			el.textContent = quantity;
			el.hidden = false;
		});
	}

	function fetchRemaining() {
		if (!CONFIG.storefrontToken) return;

		var selections = Object.keys(CONFIG.editions).map(function (edition) {
			return edition + ': product(handle: "' + CONFIG.editions[edition].productHandle + '") { ' +
				'totalInventory variants(first: 1) { nodes { quantityAvailable } } }';
		}).join(' ');

		fetch('https://' + CONFIG.shopDomain + '/api/' + CONFIG.apiVersion + '/graphql.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': CONFIG.storefrontToken,
			},
			body: JSON.stringify({ query: '{ ' + selections + ' }' }),
		})
			.then(function (response) {
				return response.ok ? response.json() : null;
			})
			.then(function (data) {
				if (!data || !data.data) return;

				Object.keys(CONFIG.editions).forEach(function (edition) {
					var product = data.data[edition];
					if (!product) return;

					var variant = product.variants && product.variants.nodes && product.variants.nodes[0];
					var quantity = variant && typeof variant.quantityAvailable === 'number'
						? variant.quantityAvailable
						: product.totalInventory;

					render(edition, quantity);
				});
			})
			.catch(function () {
				/* network/parse error — leave the title untouched */
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', fetchRemaining);
	} else {
		fetchRemaining();
	}
}());
