/**
 * BankDepositGateway
 * @class BankDepositGateway
 *
 * @constructor
 *
 */
module.exports = function BankDepositGateway() {


	/**
	 * gatewayRegistration registers this gateway.
	 *
	 * @method gatewayRegistration
	 * @param {Gateways} gateways
	 * @return
	 *
	 */
	this.gatewayRegistration = function(gateways) {

		gateways.add({
			name: 'Bank Deposit',
			value: 'deposit'
		}, this);



	};


	/**
	 * onCheckout
	 *
	 * @method onCheckout
	 * @param {Context} ctx
	 * @return
	 *
	 */
	this.onCheckout = function(ctx) {

		if (ctx.transaction.invoice.workflow === 'deposit') {
			ctx.transaction.set({
				invoice: {
					payment: {
						type: 'deposit',
						status: 'pending'
					}
				}
			});
			ctx.controller.transactionApproved(ctx).
			then(function() {

				//ctx.response.redirect('/checkout/success');
                                ctx.send(204);

			}).
			done();

		}


	};

};
