/**
 * @module
 */
var q = require('q');

/**
 * TransactionCallbacks is a factory object used by the transaction daemon.
 * @alias TransactionCallbacks
 * @constructor
 *
 */
module.exports = function TransactionCallbacks(store) {

	/**
	 * Callback that continues the transaction processing.
	 *
	 * @callback TransactionCallbacks~continueCallback
	 * @param {Transaction} transaction
	 * @return {Promise}
	 */


	/**
	 * getProductUpdateCallback provides a callback that will update a product
	 * with a transaction.
	 * @param {continueCallback} cb
	 * @return {continueCallback}
	 *
	 */
	this.getProductUpdateCallback = function(cb) {

		return function(transaction) {

			var list = [];

			console.log('DEBUG: updating products');

			transaction.invoice.items.forEach(function(item) {
console.log(item);
				if (item.stock)
					if (item.stock.track)

						list.push(

							q.ninvoke(store.getDataModel('Product').

								findOneAndUpdate({

									_id: item._id,
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
								}), 'exec'));


			});

			return q.all(list).
			catch (function(err) {

				console.log(err);


			}).done(function(products) {

				if (products)
					products.forEach(function(product) {

						if (product)
							if (product.stock.balance <= 0)
								if (product.stock.isTangible)
									store.
						broadcast(store.PRODUCT_OUT_OF_STOCK, product, transaction);

					});

				cb(transaction);

			});

		};

	};


	/**
	 * getInvoiceNumberCallback provides a callback for retrieving the
	 * invoice number.
	 *
	 * @param {continueCallback} cb
	 * @return {continueCallback}
	 *
	 */
	this.getInvoiceNumberCallback = function(cb) {


		return function(transaction) {

			console.log('DEBUG: grabbing next invoice number');

			return store.getDataModel('Counter').
			increment('invoices', 1).
			then(function(number) {

				transaction.set('invoice.number', number.next);
				transaction.set('status', 'committed');
				cb(transaction);

			}).
			end(function(err) {

				if (err)
					console.log(err);

			});




		};



	};

	/**
	 * getSaveInvoiceCallback provides a callback for saving the
	 * invoice.
	 *
	 *
	 * @param {continueCallback}
	 * @return {continueCallback}
	 */
	this.getSaveInvoiceCallback = function(cb) {

		return function(transaction) {

			console.log('DEBUG: generating invoice');

			var invoice = store.getDataModel('Invoice', true,
				transaction.invoice.toObject());

			//Allows invoice to overwrited if commit fails.
			invoice.set('_id', transaction._id);
			return q.ninvoke(invoice, 'save').
			catch (function(err) {

				console.log('Save invoice error: ');
				console.log(err);

			}).
			done(function(saved) {
				console.log('Saved invoice number : ' + saved[0].number);
				cb(transaction);

			});

		};


	};

	/**
	 * getSaveCommittedTransactionCallback provides a callback for saving
	 * the commited transaction.
	 *
	 * It is meant to be the finally action.
	 *
	 * @return {continueCallback}
	 *
	 */
	this.getSaveCommittedTransactionCallback = function() {

		return function(transaction) {

			console.log('DEBUG: setting transaction to commit');

			q.ninvoke(transaction, 'save').
			catch (function(err) {

				console.log(err);

			}).
			done(function(saved) {

				console.log('Transaction ' + transaction._id + ' committed successfully');
			});

		};

	};

};
