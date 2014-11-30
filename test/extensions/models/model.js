//Test for common model functionality

var demand = require('must');
var EStore = require('../../../index.js');
var ext = require('../../test-util/mockModelExtension');

var store;

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(300000);
	store = new EStore();
	store.install(ext());
	store.start(done);
});

describe('saveAsync()', function() {

	it('should work', function(done) {

		this.timeout(300000);

		store.getDataModel('Mock', true, {
			name: 'Elis',
			uid: 4,
			active: true
		}).
		saveAsync().
		then(function(mock) {
			demand(mock).exist();
			done();
		}).
		then(null, function(err) {

			demand(err).must.be.true();
			done();
		}).
		end();
	});

});
