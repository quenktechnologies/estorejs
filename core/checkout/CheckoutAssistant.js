/**
 * CheckoutAssistant is a model object used for actually doing a checkout.
 * @class CheckoutAssistant
 * @param {DataAccessObject} dao
 * @param {Controllers} controllers
 * @param {CheckoutHandler} handler
 * @constructor
 *
 */
module.exports = function CheckoutAssistant(dao, controllers, handler) {

	/**
	 * hasItems checks the cart for validity.
	 *
	 * @method hasItems
	 * @param {Array} cart
	 * @return
	 *
	 */
	this.hasItems = function(cart) {
		return (cart.length > 0);
	};

	/**
	 * checkout
	 *
	 * @method checkout
	 * @param {Array} cart
	 * @param {Object} checkout
	 * @return
	 *
	 */
	this.checkout = function(cart, checkout, req, res) {

		var gateways = {};
		controllers.onGetGateways(gateways);

		if (!gateways.hasOwnProperty(checkout.workflow))
			return handler.onGatewayNotFound();

		var invoice = dao.getDataModel('Invoice', true, checkout);

		invoice.set({
			items: cart,
			payment: {
				id: '',
				type: checkout.workflow,
				status: 'outstanding'
			}
		});

		invoice.validate(function(err) {

			if (err)
				return handler.onValidationError(err);

			invoice.calculateTotals();

			var transaction = dao.getDataModel('Transaction', true);
			transaction.set('invoice', invoice.toObject());
			transaction.
			save(function(err, saved) {

				if (err) return handler.onTransactionSaveFailed(err, saved);

				gateways[checkout.workflow].checkout({
					transaction: saved,
					request: req,
					response: res,
					callbacks: handler,
				});


			});
		});
	};
};
