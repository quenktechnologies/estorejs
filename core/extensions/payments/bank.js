function BankCheckout() {

	BankCheckout.$parent.apply(this, arguments);

}

BankCheckout.prototype.onGetGateways = function(gateways) {

	if (this.$config.getPreference('payments').bank.active === true)
		gateways.bank = this;

};

BankCheckout.prototype.onGetPaymentOptions = function(options) {
	if (this.$config.getPreference('payments').bank.active === true)
		options.push({
			label: 'Bank Transfer',
			value: 'bank',
		});


};

BankCheckout.prototype.checkout = function(ctx) {

	ctx.callbacks.onTransactionApproved(ctx.transaction);

};

module.exports = {

	type: 'controller',
	name: 'Bank Payments',
	controller: BankCheckout,
	settings: {
		run: function(list, store, types) {

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
