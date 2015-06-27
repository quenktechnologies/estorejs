/*
 * Can a visitor of the site actually buy something?
 *
 * Test if a user of the site can browse the catalog of all products,
 * add one to cart and checkout the transaction.
 *
 * In future we should test against all possible
 * checkout methods.
 */

var demand = require('must');
var agent = require('supertest-as-promised').agent('http://localhost:8888');
var util = require('../util');
var helpers = util.helpers();

var item;
var product;
var checkout;

before(helpers.setUp);
before(helpers.dropDatabase);
before(helpers.startStore);

beforeEach(function() {

	checkout = util.mocks.checkout();
	product = util.mocks.product();
	item = util.mocks.product();
	item.quantity = 1;
	return helpers.save('products', product);

});
afterEach(helpers.clearCollection('products'));

describe('Browsing the catalog and making purchases.', function() {

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

	it('POST /cart/items/uuid', function(done) {
		item.quantity = 1;
		agent.post('/cart/items/' + item.uuid).
		send(item).
		end(function(err, res) {

			res.status.must.not.equal(403);
			res.status.must.not.equal(404);
			res.status.must.not.equal(500);

			process.nextTick(function(err) {
				done(err);

			});

		});

	});

	it('GET /cart', function(done) {

		agent.get('/cart').
		expect(200, done);

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

	it('should generate an invoice', function(done) {

		setTimeout(function() {

			helpers.
			findOne('invoices').
			catch(done).
			then(function(iv) {

				demand(iv).not.be.null();
				done();

			}).then();

		}, 15000);

	});




});
