/**
 * CheckoutBindings provides bindings for the checkout api.
 * @class CheckoutBindings
 *
 * @constructor
 *
 */
module.exports = function CheckoutBindings(store) {

	this.NAME = "checkout-api";
	var self = this;


	/**
	 * onRouting is the onRouting method.
	 *
	 * @method onRouting
	 * @param {Object} app
	 * @return
	 *
	 */
	this.onRouting = function(app) {

		if (this === global)
			throw new Error('???');
		app.post('/_/checkout/transactions', this.onCheckoutTransactionRequest);
		app.get('/_/payments/options', this.onPaymentOptionsRequest);


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
			return res.send(400, "The cart is empty!");

		if ((!req.body.workflow) || ('string' !== typeof req.body.workflow))
			return res.send(400, 'No workflow specified!') && console.log(req.body);

		var invoice = Invoice(req.body);
		invoice.set({
			items: req.session.cart,
			payment: {
				id: '',
				type: '',
				status: 'outstanding'
			}
		});


		invoice.validate(function(err) {

			//create transaction and save it, then seek approval.

			if (err) return system.log.warn(err) && res.send(400, "There were validation errors!");

			if (!store.gateways.has(req.body.workflow))
				return res.send(400, 'Gateway not found!');

			var gateway = store.gateways.get(req.body.workflow);

			var transaction = new Transaction();
			transaction.set('invoice', invoice.toObject());
			transaction.
			save(function(err, saved) {

				if (err) return res.send(500) && system.log.error(err);
				gateway.onCheckout(new Context(saved, self, req, res));


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
	 * @return
	 *
	 */
	this.transactionApproved = function(ctx) {

		var InvoiceNumberPromise = require('./InvoiceNumberPromise');
		var SaveTransactionPromise = require('./SaveTransactionPromise');
		var Counter = store.keystone.list('Counter').model;

		InvoiceNumberPromise(new Counter()).
		then(function(number) {

			ctx.transaction.set({
				status: 'approved',
				invoice: {
					number: number.next
				}
			});

			return SaveTransactionPromise(ctx.transaction);

		}).
		then(function(transaction) {

                  ctx.request.session.cart.length = 0;
			ctx.response.send(204);
		}).
		catch (function(err) {

			ctx.response.send(500);
			system.log.error(err);


		}).
		done();


	};

	/**
	 * transactionDeclined is called when a transaction is declined.
	 *
	 * @method transactionDeclined
	 *
	 * @return
	 *
	 */
	this.transactionDeclined = function(ctx) {

		ctx.transaction.set({
			status: 'declined'
		});

		ctx.transaction.save(function(err) {

			if (err) return ctx.res.send(500) && system.log.error(err);
			ctx.response.send(404);



		});





	};




};

module.exports.prototype = estore.Extension;
