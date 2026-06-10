/**
 * Shows the remaining stock for the special edition in its title (e.g. "Speciale Editie – ×17").
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
		productHandle: 'speciale-editie',
		// Only show the counter at/below this many copies. Set to null to always show.
		showAtOrBelow: null,
	};

	function render(quantity) {
		var el = document.querySelector('[data-edition-stock="special"]');
		if (!el || typeof quantity !== 'number' || quantity <= 0) return;
		if (CONFIG.showAtOrBelow !== null && quantity > CONFIG.showAtOrBelow) return;

		el.textContent = quantity;
		el.hidden = false;
	}

	function fetchRemaining() {
		if (!CONFIG.storefrontToken) return;

		var query =
			'{ product(handle: "' + CONFIG.productHandle + '") { ' +
			'totalInventory variants(first: 1) { nodes { quantityAvailable } } } }';

		fetch('https://' + CONFIG.shopDomain + '/api/' + CONFIG.apiVersion + '/graphql.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': CONFIG.storefrontToken,
			},
			body: JSON.stringify({ query: query }),
		})
			.then(function (response) {
				return response.ok ? response.json() : null;
			})
			.then(function (data) {
				var product = data && data.data && data.data.product;
				if (!product) return;

				var variant = product.variants && product.variants.nodes && product.variants.nodes[0];
				var quantity = variant && typeof variant.quantityAvailable === 'number'
					? variant.quantityAvailable
					: product.totalInventory;

				render(quantity);
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
