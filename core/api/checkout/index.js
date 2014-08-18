/**
 * CheckoutBindings provides bindings for the checkout api.
 * @class CheckoutBindings
 *
 * @constructor
 *
 */
module.exports = function CheckoutBindings(keystone) {

	var self = {};


	/**
	 *
	 *  This method is called every 10000ms to initiate the conversion of transactions
	 *  to orders and product updates.
	 *
	 */
	var daemon = function() {

		var BatchTransaction = require('./BatchTransaction');

		keystone.list('Transaction').model.
		getPending(10).
		then(function(transactions) {

			var trn = BatchTransaction(-1, transactions, keystone);

			trn.on(trn.ITEM_OUT_OF_STOCK, self.onItemOutOfStock);
			trn.on(trn.TRANSACTION_COMPLETE, self.onTransactionComplete);
			trn.on(trn.TRANSACTION_ERROR, self.onTransactionError);

			return trn.update();

		}).
		catch (function(err) {
			system.log.log('error', err.toString());
			//See: https://github.com/flatiron/winston/issues/280

		}).done();

	};


	/**
	 * main is the main method.
	 *
	 * @method main
	 * @param {Object} app
	 * @return
	 *
	 */
	self.onRoutingReady = function(app) {

		app.post('/_/checkout/transactions', self.onCheckoutTransactionRequest);
		setInterval(daemon, 10000); //In the future I would like this to be handled by an external process.

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
	self.onCheckoutTransactionRequest = function(req, res) {

		var InvoiceNumberPromise = require('./InvoiceNumberPromise');
		var SaveTransactionPromise = require('./SaveTransactionPromise');
		var Counter = keystone.list('Counter').model;
		var Transaction = keystone.list('Transaction').model;
		//var ctl = require('./CheckoutTransactionController')(req,res);

		if ((!req.session.cart) || (req.session.cart.length < 1))
			return res.send(409, "The cart is empty");
		//XXX Needs proper validation and protection from overwriting important keys.
		req.body.items = req.session.cart;
		var sale = new Transaction({
			invoice: req.body

		});

		InvoiceNumberPromise(new Counter()).
		then(function(number) {

			sale.set({
				invoice: {
					number: number.next
				}
			});

			return SaveTransactionPromise(sale);

		}).
		then(function(transaction) {

			res.send(204);
		}).
		catch (function(err) {

			res.send(500);
			system.log.error(err);


		}).
		done();
		return;


	};

	/**
	 * onItemOutOfStock is called when an item is out of stock.
	 *
	 * @method onItemOutOfStock
	 * params
	 * @return
	 *
	 */
	self.onItemOutOfStock = function() {


	};

	/**
	 * onTransactionComplete is called when a transaction is committed.
	 *
	 * @method onTransactionComplete
	 * params
	 * @return
	 *
	 */
	self.onTransactionComplete = function(transaction) {

		var Email = require('../../emails/NewInvoiceEmail');
		var q = require('q');

		var Invoice = keystone.list('Invoice').model;
		var invoice = new Invoice(transaction.get('invoice'));

		q.ninvoke(invoice, 'save').
		then(function(invoice) {

			Email(invoice[0]).send();

		}).
		catch (function(err) {

			if (err)
				system.log.error(err.toString());

		}).done();


	};


	/**
	 * onTransactionError is called when an error occurs applying a Transaction.
	 *
	 * @method onTransactionError
	 * params
	 * @return
	 *
	 */
	self.onTransactionError = function() {



	};


	return self;


};
