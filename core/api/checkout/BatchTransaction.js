/**
 * BatchTransaction applies pending transactions.
 * @class BatchTransaction
 * @param {Number} x multiplier
 * @param {Array} transactions
 * @param {KeyStone} keystone
 * @constructor
 *
 */
module.exports = function BatchTransaction(x, transactions, keystone) {

	var self = {};

	var em = new(require('events').EventEmitter)();
	var BatchProductUpdate = require('./BatchProductUpdate');

	self.TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETECOMPLETE';
	self.TRANSACTION_ERROR = 'TRANSACTION_ERROR';
	self.ITEM_OUT_OF_STOCK = 'ITEM_OUT_OF_STOCK';

	/**
	 *
	 *  EventEmitter method.
	 *
	 */
	self.on = function() {

		em.on.apply(em, arguments);
		return self;

	};
	/**
	 * update attempts to apply the Transaction to the respective products.
	 *
	 * @method update
	 * @return
	 *
	 */
	self.update = function() {

		var model = keystone.list('Product').model;

		transactions.forEach(function(trn) {

			var pu = new BatchProductUpdate(x, trn, model);

			return pu.on(pu.PRODUCT_UPDATED, function(product) {

				system.log.info('Finished updating product \'' + product.name + '\'.');
				if (product.stock.balance < 1)
					em.emit(self.ITEM_OUT_OF_STOCK, product);


			}).
			getPromise().
			then(function(product) {

				return require('q').ninvoke(
					keystone.list('Transaction').model.update({
						_id: trn._id,
						status: 'pending'
					}, {
						$set: {
							status: 'committed'
						}
					}), 'exec');

			}).
			then(function() {
				system.log.info('Transaction \'' + trn._id + '\' completed without errors.');
				em.emit(self.TRANSACTION_COMPLETE, trn);

			}).
			catch (function(err) {

				system.log.warn('Transaction  \'' + trn._id + '\'failed: ' + err);
				em.emit(self.TRANSACTION_ERROR, trn);

			});

		});

	};


	return self;


};
