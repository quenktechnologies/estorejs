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
				console.log('Found approved transaction ' + trn._id + '.');
				trn.invoice.items.forEach(invert);
				trn.commit().
				then(function() {
					return trn.generateInvoiceNumber().
					then(function(number) {
						if (!number.next) throw new Error('No invoice number found!');
						trn.invoice.items.forEach(invert);
						trn.invoice.number = number.next;
						console.log('Generating invoice number ' + number.next + '.');
						return trn.generateInvoice().
						then(function() {
							//All products have been updated successfully.
							trn.set('status', 'committed');
							var r = require('q').ninvoke(trn, 'save');
                                                  console.log('Transaction '+trn._id+' has been committed');
                                                  return r;


						});

					});
				}).done();

			});

		}).done();


	}, store.TRANSACTION_DAEMON_INTERVAL);
};
