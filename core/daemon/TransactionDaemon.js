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
				system.log.info('Found approved transaction ' + trn._id + '.');
				trn.invoice.items.forEach(invert);
				trn.commit().
				then(function() {
					return trn.generateInvoiceNumber().
					then(function(number) {
						if (!number.next) throw new Error('No invoice number found!');
						trn.invoice.items.forEach(invert);
						trn.invoice.number = number.next;
						system.log.info('Generating invoice number ' + number.next + '.');
						return trn.generateInvoice().
						then(function() {
                                                  system.log.info('Transaction '+trn._id+' has been committed');
							//All products have been updated successfully.
							trn.set('status', 'committed');
							return require('q').ninvoke(trn, 'save');

						});

					});
				}).done();

			});

		}).done();


	}, store.TRANSACTION_DAEMON_INTERVAL);
};
