/**
 * @module
 */
var q = require('q');
var format = require('string-template');


/**
 * TransactionPromiseFactory provides promises for transaction processing.
 * @alias TransactionPromiseFactory
 * @memberOf core/extensions/daemons/transaction
 * @param {EStore} store
 * @param {DataAccessObject} dao
 * @constructor
 *
 */
function TransactionPromiseFactory(store, dao) {

	this.store = store;
	this.dao = dao;

}

/**
 * getInventoryUpdatePromise updates the inventory of the items
 * in the transaction.
 * @param {ItemHash} item
 * @return {Function}
 *
 */
TransactionPromiseFactory.prototype.getInventoryUpdatePromise = function(item) {
	var count = 0;
	return function(transaction) {
		return q.ninvoke(
			this.dao.getDataModel('Product').findOneAndUpdate({
				name: item.name,
				transactions: {
					$ne: transaction._id
				}
			}, {
				$inc: {
					'stock.balance': item.quantity * -1
				},
				$push: {
					transactions: transaction._id
				}
			}), 'exec').

		then(function(product) {

			if (!product) {

				console.log(
					format('Item {name} appears to have' +
						' already been updated! ' +
						'\nDid the application ' +
						'crash before?', item));


			} else {
				if (product.stock.balance <= 0)
					this.store.broadcast(
						this.store.PRODUCT_OUT_OF_STOCK,
						product,
						transaction);
			}
			return transaction;

		}.bind(this));
	}.bind(this);
};


/**
 * getSaveInvoicePromise provides a promise for saving the invoice.
 * @param {TransactionHash} transaction
 * @return {Function}
 */
TransactionPromiseFactory.prototype.getSaveInvoicePromise = function(transaction) {

	var invoice = this.dao.getDataModel('Invoice', true,
		transaction.invoice.toObject());

	invoice.set('_id', transaction._id);

	return invoice.saveQStyle().
	then(function(invoice) {
		console.log('Saved invoice number : ' + invoice.number);
		transaction.set('status', 'committed');
		return transaction;

	});

};

/**
 * getSaveCommittedTransactionPromise provides the promise for saving the
 * committed transaction.
 * @param {Transaction} transaction
 * @return {Function}
 */
TransactionPromiseFactory.prototype.getSaveCommittedTransactionPromise = function(transaction) {

	return transaction.saveQStyle().
	then(function(saved) {
		console.log('Transaction ' + transaction._id + ' committed successfully');
	});
};


module.exports = TransactionPromiseFactory;
