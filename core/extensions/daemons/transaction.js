/** @module */

var TransactionCallbacks = require('./TransactionCallbacks');
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
	exec: function(store) {

		var callbacks = new TransactionCallbacks(store);

		return function() {

			store.getDataModel('Transaction').
			find({
				status: 'approved'
			}).
			limit(process.env.MAX_TRANSACTIONS_PROCESSED || 10).
			exec(function(err, transactions) {

				if (err)
					return console.log(err);

				transactions.forEach(
					callbacks.getProductUpdateCallback(
						callbacks.getInvoiceNumberCallback(
							callbacks.getSaveInvoiceCallback(
								callbacks.
                                                                getSaveCommittedTransactionCallback()))));
			});
		};
	}
};
