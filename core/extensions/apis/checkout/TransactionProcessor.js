/**
 * TransactionProcessor provides bindings for the checkout api.
 * @class TransactionProcessor
 *
 * @constructor
 *
 */
module.exports = function TransactionProcessor(store) {

	/**
	 * approveTransaction is called when a transaction is approved.
	 *
	 * @method approveTransaction
	 *
	 * @return {Promise} q style
	 *
	 */
	this.approveTransaction = function(ctx) {

		var InvoiceNumberPromise = require('./InvoiceNumberPromise');
		var Counter = store.keystone.list('Counter').model;

		return new InvoiceNumberPromise(new Counter()).
		then(function(number) {

			ctx.transaction.set({
				status: 'approved',
				invoice: {
					number: number.next
				}
			});

			return require('q').ninvoke(ctx.transaction, 'save');

		}).
		then(function(transaction) {
			ctx.request.session.cart.length = 0;
			ctx.request.session.pendingTransactions.length = 0;
			var url = '/checkout/success/' + transaction[0].tid;
			ctx.response.set('x-checkout-url', url);
			ctx.response.redirect(204, url);
		}).
		then(null, function(err) {

			console.log(err);
                        ctx.response.redirect(409,'/checkout/error');

		});



	};

	/**
	 * declineTransaction is called when a transaction is declined.
	 *
	 * @method declineTransaction
	 *
	 * @return {Promise} q style.
	 *
	 */
	this.declineTransaction = function(ctx) {

		ctx.transaction.set({
			status: 'declined'
		});

		return require('q').ninvoke(ctx.transaction, 'save').
		then(null, function(err) {

			console.log(err);

		});

	};


};
