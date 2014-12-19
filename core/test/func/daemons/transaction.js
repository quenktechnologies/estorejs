var demand = require('must');
var util = require('../../util')();
var daemon = require('../../../extensions/daemons/transaction');

var invoice = util.invoice();

before(util.setEnvironment);
before(util.startStore);
before(util.clearCollection('Transaction'));
before(util.clearCollection('Invoice'));

describe('The Transaction daemon', function() {

	it('must commit approved transactions', function(done) {
		invoice.number = 1;
		this.timeout(60000);


		util.store.getDataModel('Transaction', true).
		set('invoice', invoice).
		set('status', 'approved').
		set('_id', '41224d776a326fb40f000001').
		saveQStyle().

		then(null, done).
		then(function() {

			setTimeout(function() {

				util.store.getDataModel('Transaction').
				findById('41224d776a326fb40f000001').
				exec().
				then(null, done).
				then(function(trn) {

					trn.status.must.equal('committed');
					return util.store.getDataModel('Invoice').
					findOne().
					exec();

				}).
				then(null, done).
				then(function(invoice) {
					demand(invoice.number).equal(1);
					done();

				}).end();


			}, 30000);

		});


	});

});
