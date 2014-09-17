/**
 * TransactionDaemon
 * @class TransactionDaemon
 *
 * @constructor
 *
 */
module.exports = function TransactionDaemon(store) {

	var invert = function(item) {

		item.quantity = item.quantity * -1;

	};
	//XXX callback soup
	setInterval(function() {
		store.keystone.
		list('Transaction').model.
		getApproved(store.MAX_TRANSACTIONS_PROCESSED).
		then(function(transactions) {
			transactions.forEach(function(trn) {
				trn.invoice.items.forEach(invert);
				trn.commit().
				then(function() {
					trn.invoice.items.forEach(invert);
					//All products have been updated successfully.
					trn.set('status', 'committed');
					trn.save();

				}).
				done();
			});

		}).then(null, function(err) {
			system.log.error(err);

		}).done();
	}, store.TRANSACTION_DAEMON_TIME);

};
