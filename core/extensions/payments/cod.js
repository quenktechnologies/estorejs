function CashCheckout () {

  CashCheckout.$parent.apply(this, arguments);
}
		CashCheckout.prototype.onGetGateways = function(gateways) {
			if (this.$config.getPreference('payments').cod.active === true)
				gateways.cod = this;

		};

		CashCheckout.prototype.onGetPaymentOptions = function(options) {
			if (this.$config.getPreference('payments').cod.active === true)
				options.push({
					label: 'Cash on Delivery',
					value: 'cod',
				});


		};

		CashCheckout.prototype.checkout = function(ctx) {

			ctx.callbacks.onTransactionApproved(ctx.transaction);

		};

module.exports = {

	type: 'controller',
        name: 'Cash Payments',
        controller: CashCheckout,
	settings: {
		run: function(list, store, types) {

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
