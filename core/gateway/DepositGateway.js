/**
 * DepositGateway for Deposit on Delivery transactions.
 * @class DepositGateway
 *
 * @constructor
 *
 */
module.exports = function DepositGateway() {

	this.NAME = "Bank Deposit";

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
						type: 'deposit'
					}
				}
			});
			ctx.mediator.transactionApproved(ctx);

		}


	};

};

module.exports.prototype = estore.Gateway;
