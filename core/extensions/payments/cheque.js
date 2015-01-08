function ChequeCheckout() {

	ChequeCheckout.$parent.apply(this, arguments);

}

ChequeCheckout.prototype.onGetGateways = function(gateways) {

	if (this.$config.getPreference('payments').cheque.active === true)
		gateways.cheque = this;

};

ChequeCheckout.prototype.onGetPaymentOptions = function(options) {

	if (this.$config.getPreference('payments').cheque.active === true)
		options.push({
			label: 'Cheque',
			value: 'cheque',
		});


};

ChequeCheckout.prototype.checkout = function(ctx) {

	ctx.callbacks.onTransactionApproved(ctx.transaction);

};

module.exports = {

	type: 'controller',
	name: 'Cheque Payments',
	controller: ChequeCheckout,
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
