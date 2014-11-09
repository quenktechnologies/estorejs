/**
 *
 * This daemon polls (every 10 seconds by default) to find a list
 * of approved transactions that have been approved but have not been committed.
 *
 * It then commits the transactions and changes the transaction state to commited.
 *
 */
module.exports = {

	type: 'daemon',
	interval: process.env.TRANSACTION_APPROVAL_INTERVAL || 10000,
	exec: function(store) {

		var invert = function(item) {

			item.quantity = item.quantity * -1;

		};

		return function() {

			//TODO: Fix callback soup
			store.keystone.
			list('Transaction').model.
			getApproved(process.env.MAX_TRANSACTIONS_PROCESSED || 10).
			then(function(transactions) {
				transactions.forEach(function(trn) {
					console.log('Found approved transaction ' + trn._id + '.');
					store.bus.emit(store.TRANSACTION_APPROVED, trn.toObject());
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
								console.log('Transaction ' + trn._id + ' has been committed');
								store.publish(store.TRANSACTION_COMMITED, trn.toObject());
								return r;


							});

						});
					}).done();
				});

			}).done();
		};
	}

};
