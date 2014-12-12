module.exports = {

	type: 'controller',
	name: 'Cheque Payments',
	controller: function(store, dao, controllers, callbacks, config) {

		this.onGetGateways = function(gateways) {

			if (config.getPreference('payments').cheque.active === true)
				gateways.cheque = this;

		};

		this.onGetPaymentOptions = function(options) {

			if (config.getPreference('payments').cheque.active === true)
				options.push({
					label: 'Cheque',
					value: 'cheque',
				});


		};

		this.checkout = function(ctx) {

			ctx.callbacks.onTransactionApproved(ctx.transaction);

		};





	},
	settings: {
		run: function(list, store, types) {

			list.add('Cheque/Money Orders', {
				payments: {
					cheque: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Cheque/Money Order payments?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.cheque.active': true
							}
						}
					}
				}
			});





		}
	},


};
