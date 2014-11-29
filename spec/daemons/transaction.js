var EStore = require('../../index.js');
var demand = require('must');
var request = require('supertest-as-promised').agent('http://localhost:8888');

var store;
var daemon;
var invoice;
var nextNumber;

function cleanup(done) {

	this.timeout(60000);
	daemon = require('../../core/extensions/daemons/transaction');
	invoice = require('../test-utils/invoice')();

	store.getDataModel('Transaction').
	remove({}).
	exec().
	then(function() {
		done();
	}).
	end(function(err) {

		if (err)
			done(err);
	});
}

//init
before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(60000);
	store = new EStore();
	store.start(done);
});

before(function(done) {

	store.getDataModel('Invoice').
	remove({}, done);

});

describe('The Transaction daemon', function() {

	beforeEach(cleanup);

	//@todo When global configuration is sorted out, set timers based on commit interval

	beforeEach(function(done) {

		this.timeout(30000);
		store.getDataModel('Counter').
		findOne().
		exec(function(err, counter) {

			if (err) return done(err);

			nextNumber = counter.next;
			done();

		});
	});

	beforeEach(function(done) {

		this.timeout(30000);
		store.getDataModel('Transaction', true).
		set('invoice', invoice).
		set('status', 'approved').
		set('_id', '41224d776a326fb40f000001').
		save(done);


	});

	it('must commit approved transactions', function(done) {

		this.timeout(40000);
		setTimeout(function() {

			store.getDataModel('Transaction').
			findById('41224d776a326fb40f000001',
				function(err, trn) {

					if (err)
						return done(err);

					trn.status.must.equal('committed');

					done();
				});
		}, 30000);

	});

	it('must set the correct invoice number', function(done) {

		store.getDataModel('Invoice').
		findOne(function(err, invoice) {

			if (err) return done(err);
			demand(invoice.number).equal(nextNumber);
			done();

		});



	});
	afterEach(cleanup);
});
