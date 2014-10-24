var AddressSchema = require('./schema/AddressSchema');
var CustomerSchema = require('./schema/CustomerSchema');
var InvoiceSchema = require('./schema/InvoiceSchema');
var PaymentSchema = require('./schema/PaymentSchema');
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
module.exports = {

	type: 'model',
	name: 'Transaction',
	defaultColumns: '_id, invoice.customer.email, status, timestamp, invoice.total',
	options: {
		nocreate: true,
		track: true,
		noedit: true,
	},
	model: function(store, types, ui) {

		var invoice = new InvoiceSchema(store, types, ui);
		var address = new AddressSchema(store, types, ui);
		var customer = new CustomerSchema(store, types, ui);
		var payment = new PaymentSchema(store, types, ui);

		invoice.address = {};
		invoice.address.billing = address;
		invoice.address.shipping = address;
		invoice.customer = customer;
		invoice.payment = payment;

		return [{
			tid: {
				type: String,
				default: require('node-uuid').v4

			},
			status: {
				type: types.Select,
				options: ['created', 'approved', 'committed', 'rollback'],
				default: 'created',



			},
			timestamp: {
				type: types.Datetime,
				default: Date.now,
				noedit: true,

			},
			invoice: invoice
		}];

	},
	run: function(list, store, types, ui) {

		list.schema.add({
			invoice: {
				items: [store.keystone.list('Item').schema]
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

				tasks.push((function() {

					return q.ninvoke(f, 'exec').
					then(function(product) {
						if (product)
							store.ebus.emit(store.PRODUCT_UPDATED_EVENT, product, this);
					});
				}()));
			}.bind(this));

			return q.all(tasks);


		};

		list.schema.methods.generateInvoiceNumber = function() {

			return require('q').ninvoke(store.keystone.list('Counter').model(),
				'increase', 'invoices', 1).
			then(null, function(err) {

				console.log('generateInvoiceNumber: ', err);

			});



		};

		list.schema.methods.generateInvoice = function() {

			var Invoice = store.keystone.list('Invoice');
			var newInvoice = new Invoice.model(this.invoice.toObject(), {
				_id: false
			});
			newInvoice.set('_id', this._id);

			return require('q').ninvoke(newInvoice, 'save').
			then(null, function(err) {

				console.log('generateInvoice: ', err);

			});

		};

	}
};
