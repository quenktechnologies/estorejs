/**
 * CheckoutBindings provides bindings for the checkout api.
 * @class CheckoutBindings
 *
 * @constructor
 *
 */
module.exports = function CheckoutBindings(store) {

	var self = this;


	/**
	 * routeRegistration is the routeRegistration method.
	 *
	 * @method routeRegistration
	 * @param {Object} app
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.post('/_/checkout/transactions', this.onCheckoutTransactionRequest);
		app.get('/_/payments/options', this.onPaymentOptionsRequest);
		app.get('/_/countries', this.onGetCountriesRequest);

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
		var TransactionProcessor = require('./TransactionProcessor');
		var that = this;
		var gateway;

		if ((!req.session.cart) || (req.session.cart.length < 1))
			return res.send(400, 'The cart is empty!');

		if (store.gateways.active.hasOwnProperty(req.body.workflow))
			gateway = store.gateways.active[req.body.workflow];

		if (!gateway)
			return res.send(400, 'Gateway not found!');


		var invoice = new Invoice(req.body);
		invoice.set({
			items: req.session.cart,
			payment: {
				id: '',
				type: req.body.workflow,
				status: 'outstanding'
			}
		});

		invoice.calculateTotals();

		invoice.validate(function(err) {

			//create transaction and save it, then seek approval.

			if (err) return console.log(err) && res.send(400, 'There were validation errors!');

			var transaction = new Transaction();
			transaction.set('invoice', invoice.toObject());
			transaction.
			save(function(err, saved) {

				if (err) return console.log(err) && res.send(500);
				gateway.checkout({
					transaction: saved,
					model: new TransactionProcessor(store),
					request: req,
					response: res
				});


			});


		});

	};

	/**
	 * onPaymentOptionsRequest
	 *
	 * @method PaymentOptionsRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onPaymentOptionsRequest = function(req, res) {

		res.json(store.gateways.list);

	};


	/**
	 * onGetCountriesRequest
	 *
	 * @method GetCountriesRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetCountriesRequest = function(req, res) {

		store.keystone.list('Destination').model.
		find(null, {
			_id: false,
			__v: false
		}).
		lean().
		exec().
		then(null, function(err) {
			res.send(500);
			console.log(err);

		}).
		then(function(list) {

			res.json(list);


		}).end();



	};


};
