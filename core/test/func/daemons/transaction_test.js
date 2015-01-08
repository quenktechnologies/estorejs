var must = require('must');
var util = require('../../util');
var helpers = util.helpers();
var invoice = util.mocks.invoice();
var id;

before(helpers.setUp);
before(helpers.dropDatabase);
describe('The Transaction daemon', function() {

	before(helpers.startStore);
	before('Saving the transaction', function() {

		id = helpers.generateOID();
		invoice.number = 1;
		return helpers.save('transactions', {
			status: 'approved',
			_id: id,
			invoice: invoice
		});
	});

	it('must commit approved transactions', function(done) {

		console.log('Waiting for transaction processor');
		setTimeout(function() {
			helpers.findOne('transactions', {
				_id: id
			}).
			then(function(trn) {
				must(trn).exist();
				console.log('trn', trn, 'trnrnrknrkr');
				trn.status.must.equal('committed');
				return helpers.findOne('invoices', {});

			}).
			then(function(invoice) {
				must(invoice).exist();
				must(invoice.number).equal(1);

			}).catch(done).done();
		}, 20000);


	});


});
