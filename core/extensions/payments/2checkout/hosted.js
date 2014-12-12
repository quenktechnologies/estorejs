var TwoCheckout = require('./util/TwoCheckout');

module.exports = {

	type: 'controller',
	name: '2Checkout Hosted',
	controller: function(store, dao, controllers, callbacks, config) {

		this.onGetGateways = function(gateways) {

			var tco = config.getPreference('payments').TwoCheckout;

			if (tco.active === true)
				if (TwoCheckout.isHostedReady(config))
					gateways.card = this;

		};

		this.onGetPaymentOptions = function(options) {

			var tco = config.getPreference('payments').TwoCheckout;

			if (TwoCheckout.isHostedReady(config))
				options.push({
					label: '2Checkout Hosted',
					value: 'card',
				});

		};
		this.checkout = function(ctx) {

			var tco = TwoCheckout.create({
				sellerId: config.get('TWO_CHECKOUT_SELLER_ID')
			});

			ctx.onRedirectNeeded(tco.checkout.link(
				TwoCheckout.createParamsForHosted(ctx, config)));


		};

	},
	settings: {
		run: function(list, types) {

			list.add('Bank Transfers', {
				payments: {
					bank: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Bank Transfer Payments?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.bank.active': true
							}
						}
					}
				}
			});





		}
	},

};
