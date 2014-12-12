module.exports = {

	type: 'controller',
	name: 'Bank Payments',
	controller: function(store, dao, controllers, callbacks, config) {

		this.onGetGateways = function(gateways) {

			if (config.getPreference('payments').bank.active === true)
				gateways.bank = this;

		};

		this.onGetPaymentOptions = function(options) {

			if (config.getPreference('payments').bank.active === true)
				options.push({
					label: 'Bank Transfer',
					value: 'bank',
				});


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
