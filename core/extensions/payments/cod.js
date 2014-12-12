module.exports = {

	type: 'controller',
	name: 'Cash Payments',
	controller: function(store, dao, controllers, callbacks, config) {

		this.onGetGateways = function(gateways) {
			if (config.getPreference('payments').cod.active === true)
				gateways.cod = this;

		};

		this.onGetPaymentOptions = function(options) {

			if (config.getPreference('payments').cod.active === true)
				options.push({
					label: 'Cash on Delivery',
					value: 'cod',
				});


		};

		this.checkout = function(ctx) {

			ctx.handler.onTransactionApproved(ctx.transaction);

		};

	},
	settings: {
		run: function(list, types) {

			list.add('Cash On Delivery', {
				payments: {
					cod: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Cash On Delivery Checkouts?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.cod.active': true
							}
						}
					}
				}
			});





		}
	}
};
