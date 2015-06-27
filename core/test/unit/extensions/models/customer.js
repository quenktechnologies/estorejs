var EStore = require('../../../../../index.js');
var store;
var demand = require('must');

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(300000);
	store = new EStore();
	store.extensions.push(require('../../../../../core/extensions/customers'));
	store.start(done);
});

beforeEach(function(done) {

	return store.getDataModel('Customer').
	remove({}, function(err) {
		done(err);
	});
});

describe('saving model', function() {

	it('fails with no data', function(done) {

			store.getDataModel('Customer', true, {}).save(function(err) {

			demand(err).not.be.null();
			done();
		});

	});

});
