var EStore = require('../../index.js');
var store;
var demand = require('must');
var request = require('supertest-as-promised').agent('http://localhost:8888');

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(300000);
	store = new EStore();
	store.start(done);
});

beforeEach(function(done) {

	return store.getDataModel('Page').
	remove({}, function(err) {

		done(err);

	});

});

describe('Accesing pages', function() {

	it('GET /', function(done) {

		return request.
		get('/').
		expect(200, done);

	});

	it('GET /invalid.html', function(done) {

		return request.get('/invalid.html').expect(404, done);

	});

	it('GET /pages/invalid', function(done) {

		return request.get('/pages/invalid').expect(404, done);

	});

	it('GET /pages/valid', function(done) {

		store.getDataModel('Page', true, {
			title: 'valid'
		}).
		save(function(err) {

			if (err)
				done(err);

			request.get('/pages/valid').expect(200, done);

		});


	});
});
