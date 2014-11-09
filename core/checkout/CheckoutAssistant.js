/**
 * CheckoutAssistant is a model object used for actually doing a checkout.
 * @class CheckoutAssistant
 * @param {EStore} store
 * @param {CheckoutHandler} handler
 * @constructor
 *
 */
module.exports = function CheckoutAssistant(store, handler) {

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
	this.checkout = function(cart, checkout) {

		var gateways = store.getGateways();
		if (!gateways.hasActive(checkout.workflow))
			return handler.onGatewayNotFound();

		var invoice = store.createDataModel('Invoice', checkout);
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

			var transaction = store.createDataModel('Transaction');
			transaction.set('invoice', invoice.toObject());
			transaction.
			save(function(err, saved) {

				if (err) return handler.onTransactionSaveFailed(err, saved);

				gateways.getActive(checkout.workflow).checkout({
					transaction: saved,
					handler: handler,
				});


			});
		});
	};
};
