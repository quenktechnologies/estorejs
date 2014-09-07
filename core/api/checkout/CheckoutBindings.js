/**
 * CheckoutBindings provides bindings for the checkout api.
 * @class CheckoutBindings
 *
 * @constructor
 *
 */
module.exports = function CheckoutBindings(store) {

	this.NAME = "checkout-api";


	/**
	 * onRouting is the onRouting method.
	 *
	 * @method onRouting
	 * @param {Object} app
	 * @return
	 *
	 */
	this.onRouting = function(app) {

		app.post('/_/checkout/transactions', this.onCheckoutTransactionRequest);

	};

	/**
	 * onCheckoutTransactionRequest will register a checkout.
	 *
	 * @method CheckoutTransactionRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onCheckoutTransactionRequest = function(req, res) {

		var Invoice = store.keystone.list('Invoice').model;
		var Transaction = store.keystone.list('Transaction').model;

		if ((!req.session.cart) || (req.session.cart.length < 1))
			return res.send(409, "The cart is empty!");

		if ((!req.body.workflow) || ('string' !== typeof req.body.workflow))
			return res.send(409, 'No workflow specified!') && console.log(req.body);

		var trn = new Transaction();
		trn.invoice = new Invoice(req.body);

		trn.invoice.validate(function(err) {
			if (err) return system.log.warn(err) && res.send(409, "There were validation errors!");

			store.extensions.forEach(function(ext) {

				ext.onCheckout(req.body.workflow, trn);

			});




		});

	};


};
