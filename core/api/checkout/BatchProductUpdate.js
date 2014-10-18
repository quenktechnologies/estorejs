/**
 * BatchProductUpdate updates the items in a single transaction.
 * @class BatchProductUpdate
 * @param {Number} x multiplier
 * @param {Transaction} trn
 * @param {ProductModel} model
 * @constructor
 *
 */
module.exports = function BatchProductUpdate(x, trn, model) {

	var self = {};
	var em = new(require('events').EventEmitter)();

	self.PRODUCT_UPDATED = 'productUpdated';

	/**
	 * on events.
	 *
	 * @method on
	 * @return
	 *
	 */
	self.on = function() {

		em.on.apply(em, arguments);
		return self;

	};

	/**
	 * getPromise provides the promise for the update.
	 *
	 * @method getPromise
	 * @return  {Promise}
	 *
	 */
	self.getPromise = function() {

		var q = require('q');
		var tasks = [];

		trn.invoice.items.forEach(function(item) {

			item.quantity = item.quantity * x;

			var f = model.applyTransaction(trn._id, item);

			tasks.push(function() {

				return q.ninvoke(f, 'exec').
				then(function(product) {

					if (product)
						return em.emit(self.PRODUCT_UPDATED, product);

					console.log('Transaction ' + trn._id +
						' did not have any effect.');

				});
			}());


		});

		return q.all(tasks);
	};

	return self;
};
