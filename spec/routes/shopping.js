var EStore = require('../../index.js');
var Mock = require('../test-utils/mockProduct');
var Checkout = require('../test-utils/mockCheckout');
var demand = require('must');
var request = require('supertest-as-promised');
var agent = request.agent('http://localhost:8888');

var store;
var mock;
var checkout;

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	process.env.DISABLE_CSRF = true;
	this.timeout(300000);
	checkout = new Checkout();
	store = new EStore();
	store.start(done);
});

beforeEach(function(done) {
	this.timeout(300000);
	store.getDataModel('Product', true, new Mock()).
	save(done);
});

beforeEach(function(done) {
	store.getDataModel('Product').
	findOne({
		slug: 'mock-product'
	}).
	exec(function(err, product) {
		mock = product.toObject();
		done(err);
	});

});

afterEach(function(done) {
	return store.getDataModel('Product').
	remove({}, done);
});

describe('Shopping flow', function() {
	it('GET /categories/all/products/<product-slug>', function(done) {
		agent.
		get('/categories/all/products/mock-product').
		end(function(err, res) {
			res.status.must.equal(200);
			process.nextTick(function(err) {
				done(err);

			});
		});

	});

	it('POST /cart/items/<product-_id>', function(done) {
		mock.quantity = 1;
		agent.post('/cart/items/' + mock._id).
		send(mock).
		end(function(err, res) {

			res.status.must.not.equal(403);
			res.status.must.not.equal(404);
			res.status.must.not.equal(500);

			process.nextTick(function(err) {
				done(err);

			});

		});

	});

	it('POST /checkout', function(done) {

		agent.post('/_/checkout/transactions').
		send(checkout).
		end(function(err, res) {

			res.status.must.equal(204);

			process.nextTick(function(err) {
				done(err);

			});

		});

	});


});
