/** @module */
var q = require('q');
var TransactionPromiseFactory = require('./TransactionPromiseFactory');
/**
 *
 * This daemon polls (every 10 seconds by default) to find a list
 * of approved transactions that have been approved but have not been committed.
 *
 * It then commits the transactions and changes the transaction state to commited.
 *
 * @returns {Function}
 */
module.exports = {

	type: 'daemon',
	interval: process.env.TRANSACTION_APPROVAL_INTERVAL || 10000,
	exec: function(store, cb) {

		var factory = new TransactionPromiseFactory(store, store);

		return function() {

			store.getDataModel('Transaction').
			find({
				status: 'approved'
			}).
			limit(process.env.MAX_TRANSACTIONS_PROCESSED || 10).
			exec(function(err, transactions) {

				if (err)
					return console.log(err);

				transactions.forEach(function(transaction) {

					var list = [];

					transaction.invoice.items.forEach(function(item) {
						if (item.stock)
							if (item.stock.track);
						list.push(
							factory.getInventoryUpdatePromise(item, transaction).bind(factory));

					});

					list.push(factory.getSaveInvoicePromise.bind(factory));
					list.push(factory.getSaveCommittedTransactionPromise.bind(factory));
					list.reduce(q.when, q(transaction)).done();


				});

			});
		};
	}
};
