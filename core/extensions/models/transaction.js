/** @module */

var AddressSchema = require('./schema/AddressSchema');
var CustomerSchema = require('./schema/CustomerSchema');
var InvoiceSchema = require('./schema/InvoiceSchema');
var PaymentSchema = require('./schema/PaymentSchema');
module.exports = {

	type: 'model',
	name: 'Transaction',
	defaultColumns: '_id, invoice.customer.email, status, timestamp, invoice.total',
	options: {
		nocreate: true,
		track: true,
		noedit: true,
	},
	/**
	 * Transaction represents the state of an order.
	 *
	 * Because of MongoDB's preference for atmoic operations over transactions,
	 * we have to consider errors occuring during multi collection updates
	 * (operations are only atomic per colelction).
	 *
	 * I tried a 2 phase commit thing here as a single order may require more than
	 * one collections to be updated.
	 * The key here is not to avoid errors but rather to avoid an
	 * unrecoverable state of any collection(s).
	 *
	 * More info:
	 *
	 * http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/
	 *
	 * @alias Transaction
	 *
	 * @constructor
	 *
	 */
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
		invoice.number.unique = false;

		return [{
			tid: {
				type: String,
				unique: true,
				default: require('node-uuid').v4

			},
			status: {
				type: types.Select,
				options: ['created', 'approved', 'committed', 'rollback'],
				default: 'created',



			},
			flag: {
				type: String
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
	}
};
