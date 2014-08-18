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
module.exports = function Transaction() {

	var self = {};

	self.onKeyStoneReady = function(keystone) {

		var Transaction = keystone.List('Transaction', {
			nocreate: true,
			noedit: true
		});

		var t = keystone.Field.Types;

		Transaction.schema.add({
			invoice: {
				items: Array,
			}
		});

		Transaction.add({

			invoice: require('./InvoiceBlock')(t),
			status: {
				type: t.Select,
				options: 'pending,comitted,error,rollback,done',
				default: 'pending'
			}

		});

		Transaction.schema.statics.getPending = function(limit) {


			var that = this.model('Transaction').find({
				status: 'pending'
			}).limit(limit);

			return require('q').ninvoke(that, 'exec').
			catch (function(err) {

				system.log.error(err);

			});


		};

		Transaction.schema.methods.promiseInvoice = function() {

			var invoice = this.model('Invoice').create(this.invoice);
			return invoice.onReject(function(err) {
				system.log.error('Error occured while starting transaction:', err);

			});

		};


		Transaction.schema.methods.start = function() {

			return this.model('Transaction').create(this).
			onReject(function(err) {
				system.log.error('Error occured while starting transaction: ', err);
			});


		};

		Transaction.addPattern('standard meta');
		Transaction.register();
	};
	return self;

};
