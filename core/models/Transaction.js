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

			return require('q').ninvoke(that, 'exec');

		};

		list.schema.statics.getCommitted = function(limit) {

			var that = this.model('Transaction').find({
				status: 'commited'
			}).limit(limit);

			return require('q').ninvoke(that, 'exec');

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

		list.schema.methods.generateInvoiceNumber = function() {

			return require('q').ninvoke(store.keystone.list('Counter').model(),
				'increase', 'invoices', 1).
			then(null, function(err) {

				system.log.error('generateInvoiceNumber: ', err);

			});



		};

		list.schema.methods.generateInvoice = function() {

			var Invoice = store.keystone.list('Invoice');
			var newInvoice = new Invoice.model(this.invoice.toObject(), {_id:false});
                        newInvoice.set('_id', this._id);

			return require('q').ninvoke(newInvoice, 'save').
			then(null, function(err) {

				system.log.error('generateInvoice: ', err);

			});

		};

	};

};
