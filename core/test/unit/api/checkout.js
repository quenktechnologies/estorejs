require('dotenv').load();
var must = require('must');
var keystone = require('keystone');
var invoice;
var EStore = require('../../../../index');
var store = new EStore(require('keystone'));
store.start();
var request = require('supertest')(store.app);
var Cookie = require('../util/Cookie');
var cookie;

beforeEach(function() {

	var invoice = {
		address: {
			billing: {
				name: 'John Doe',
				email: 'john@doe.no',
				phone: '6751462',
				company: 'NA',
				street1: 'Test street',
				street2: 'Some street 2',
				code: '000000',
				city: 'Port of Spain',
				country: 'Trinidad and Tobago'
			},
			shipping: {
				name: 'John Doe',
				email: 'john@doe.no',
				phone: '6751462',
				company: 'NA',
				street1: 'Test street',
				street2: 'Some street 2',
				code: '000000',
				city: 'Port of Spain',
				country: 'Trinidad and Tobago'
			}
		},
		payment: {

		}


	};
});

beforeEach(function() {

	process.env.KEYSTONE_AUTO_UPDATE = false;

});

describe('on checking out a transaction', function(done) {

	it('must not be allowed without a valid CSRF token', function(done) {
		request.post('/_/checkout/transactions').
		send(invoice).
		expect(403, done);
	});

	it('will checkout cash workflows', function(done) {
		request.
		get('/').
		end(function(err, res) {
			cookie = new Cookie(res.headers['set-cookie']);
			//should have the csrf token here.
			request.post('/_/checkout/transactions').
			set('X-XSRF-TOKEN', unescape(cookie.read('XSRF-TOKEN', true))).
			send(invoice).
			expect(201, done);
		});


	});



});
