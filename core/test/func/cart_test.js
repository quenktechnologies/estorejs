/* 
 * Tests for the cart feature.
 *
 */
var demand = require('must');
var agent = require('supertest-as-promised').agent('http://localhost:8888');
var util = require('../util');
var helpers = util.helpers();

var item;
var product;

before(helpers.setUp);
before(helpers.dropDatabase);
before(helpers.startStore);

beforeEach(function() {

	product = util.mocks.product();
	item = util.mocks.product();
	return helpers.save('products', product);

});

describe('Adding a product to the cart.', function() {

	it('must work', function(done) {
		item.quantity = 1;
		agent.post('/cart/items/' + item.uuid).
		send(item).
		end(function(err, res) {
			res.status.must.equal(201);
			done(err);

		});

	});

	it('must not crash if no quantity is supplied', function(done) {
		agent.post('/cart/items/' + item.uuid).
		send(item).
		end(function(err, res) {
			res.status.must.equal(201);
			done(err);

		});

	});



});

describe('Removing a product from the cart.', function() {

	beforeEach(function(done) {

		agent.post('/cart/items/' + item.uuid).
		send(item).
		end(function(err, res) {
			res.status.must.equal(201);
			done(err);

		});


	});

	it('must work with DELETE method', function(done) {

		agent.delete('/cart/items/' + item.uuid).
		end(function(err, res) {

			res.status.must.equal(204);
			done(err);

		});

	});

	it('must work when overloaded', function(done) {

		agent.post('/cart/items/' + item.uuid).
		send({
			_method: 'DELETE'
		}).
		end(function(err, res) {

			res.status.must.equal(204);
			done(err);

		});

	});




});
