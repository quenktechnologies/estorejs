var demand = require('must');
var request = require('supertest-as-promised').agent('http://localhost:8888');
var util = require('../../util');
var helpers = util.helpers();

var store;
before(helpers.setUp);
after(helpers.tearDown);
before(helpers.dropDatabase);

before(function(done) {
	store = helpers.createStore();
	store.start(done);
});

describe('Accesing web pages', function() {

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

		return helpers.save('pages', {
			title: 'valid',
			slug: 'valid',
			template: 'pages/default.html'
		}).
		then(function() {

			request.get('/pages/valid').expect(200, done);


		}).
		catch(done);




	});

	it('GET /pages/about', function(done) {

		request.get('/pages/about').expect(200, done);

	});

	it('GET /pages/contact', function(done) {

		request.get('/pages/contact').expect(200, done);

	});

	if ('GET /pages/terms', function(done) {

		request.get('/pages/terms').expect(200, done);

	});
});
