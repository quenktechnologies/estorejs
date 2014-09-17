var Invoice = require('./Invoice');
/**
 * Transaction represents the state of an order.
 *
 * Because of MongoDB's preference for atmoic operations over transactions,
 * we have to consider errors occuring during multi collection updates (operations are only atomic per colelction).
 *
 * I tried a 2 phase commit thing here as a single order may require more than one collections to be updated.
 * The key here is not to avoid errors but rather to avoid an unrecoverable state of any collection(s).
 *
 * More info:
 *
 * http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/
 *
 * @class Transaction
 *
 * @constructor
 *
 */
module.exports = function Transaction(store) {

	var t = store.keystone.Field.Types;
	this.NAME = 'Transaction';

	this.options = {
		hidden: true,
		track: true
	};

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		var Invoice = require('./NestedInvoice');

		list.schema.add({
			invoice: new Invoice(),
			status: {
				type: String,
				default: 'created'
			}
		});

		list.schema.statics.getApproved = function(limit) {

			var that = this.model('Transaction').find({
				status: 'approved'
			}).limit(limit);

			return require('q').ninvoke(that, 'exec').
			then(function(result) {

				system.log.info('Handling ' + result.length + ' transactions.');
				return result;

			});

		};


		list.schema.methods.commit = function() {

			var q = require('q');
			var tasks = [];

			this.invoice.items.forEach(function(item) {

				var f = store.keystone.list('Product').model.applyTransaction(this._id, item);

				tasks.push(function() {

					return q.ninvoke(f, 'exec').
					then(function(product) {
						if (product)
							store.ebus.emit(store.events.PRODUCT_UPDATED, product, this);
					});
				}());
			}.bind(this));

			return q.all(tasks);


		};

		list.schema.methods.promiseInvoice = function() {

			var invoice = this.model('Invoice').create(this.invoice);
			return invoice.onReject(function(err) {
				system.log.error('Error occured while starting transaction:', err);

			});

		};


		list.schema.methods.start = function() {

			return this.model('Transaction').create(this).
			onReject(function(err) {
				system.log.error('Error occured while starting transaction: ', err);
			});


		};

	};

};
