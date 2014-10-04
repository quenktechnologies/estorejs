/**
 * CheckoutBindings provides bindings for the checkout api.
 * @class CheckoutBindings
 *
 * @constructor
 *
 */
module.exports = function CheckoutBindings(store) {

	this.NAME = 'checkout';
	var self = this;

	/**
	 * meta
	 *
	 * @property meta
	 * @type {Object}
	 */
	this.meta = {

		name: 'Checkout API',
		key: 'checkoutAPI',
		settings: {
			enabled: {
				type: Boolean,
				default: true
			}
		}




	};



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

		store.ebus.on(store.TRANSACTION_APPROVED, this.transactionApproved);


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
		var Context = require('./Context');
		var that = this;

		if ((!req.session.cart) || (req.session.cart.length < 1))
			return res.send(400, 'The cart is empty!');

		if ((!req.body.workflow) || ('string' !== typeof req.body.workflow))
			return res.send(400, 'No workflow specified!') && console.log(req.body);

		var invoice = new Invoice(req.body);
		invoice.set({
			items: req.session.cart,
			payment: {
				id: '',
				type: '',
				status: 'outstanding'
			}
		});

		invoice.calculateTotals();

		invoice.validate(function(err) {

			//create transaction and save it, then seek approval.

			if (err) return system.log.warn(err) && res.send(400, 'There were validation errors!');

			if (!store.gateways.has(req.body.workflow))
				return res.send(400, 'Gateway not found!');

			var gateway = store.gateways.get(req.body.workflow);

			var transaction = new Transaction();
			transaction.set('invoice', invoice.toObject());
			transaction.
			save(function(err, saved) {


				if (err) return system.log.error(err) && res.send(500);
				gateway.onCheckout({
					transaction: saved,
					controller: self,
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
		res.json(store.gateways.getPaymentOptions());

	};

	/**
	 * transactionApproved is called when a transaction is approved.
	 *
	 * @method transactionApproved
	 *
	 * @return {Promise} q style
	 *
	 */
	this.transactionApproved = function(ctx) {

		var InvoiceNumberPromise = require('./InvoiceNumberPromise');
		var SaveTransactionPromise = require('./SaveTransactionPromise');
		var Counter = store.keystone.list('Counter').model;

		return new InvoiceNumberPromise(new Counter()).
		then(function(number) {

			ctx.transaction.set({
				status: 'approved',
				invoice: {
					number: number.next
				}
			});

			return new SaveTransactionPromise(ctx.transaction);

		}).
		then(function(transaction) {

			ctx.request.session.cart.length = 0;
			ctx.request.session.pendingTransactions.length = 0;
		}).
		then(null, function(err) {

			system.log.error(err);


		});



	};

	/**
	 * transactionDeclined is called when a transaction is declined.
	 *
	 * @method transactionDeclined
	 *
	 * @return {Promise} q style.
	 *
	 */
	this.transactionDeclined = function(ctx) {

		ctx.transaction.set({
			status: 'declined'
		});

		return require('q').ninvoke(ctx.transaction, 'save').
		then(null, function(err) {

			system.log.error(err);

		});





	};




};
