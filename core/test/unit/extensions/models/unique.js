var demand = require('must');
var EStore = require('../../../../../index.js');
var ext = require('../../test-util/mockModelExtension');
var unique = require('../../../../../core/models/validation/unique');

var store;
var tested;

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(300000);
	store = new EStore();
	store.install(ext());
	store.start(done);
});

after(function(done) {

	store.getDataModel('Mock').
	remove({}, function(err) {
		done(err);
	});
});


beforeEach(function(done) {

	store.getDataModel('Mock').
	remove({}, function(err) {
		done(err);
	});
	store.getDataModel('Mock', true, {
		name: 'invalid'
	}).save();
});



describe('valid data', function() {

	xit('should  work', function(done) {

		this.timeout(30000);

		unique(store)
		('valid', {
			model: 'Mock'
		}, 'name').
		then(null, function(err) {
			demand(err).not.exist();
			done(err);

		}).
		then(function(doc) {
			demand(doc).not.exist();
			done();

		}).
		done();


	});

});

describe('invalid data', function() {

	it('should work', function(done) {

		this.timeout(30000);

		unique(store)
		('invalid', {
			model: 'Mock'
		}, 'name').
		catch (function(err) {
			demand(err).be.string();
			done();
		}).
		then(function(doc) {
			console.log(arguments);
			demand(doc).not.exist();
			done();
		}).then(null, function() {
			console.log(arguments);
		});



	});

});
