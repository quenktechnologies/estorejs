var EStore = require('../../index.js');
var demand = require('must');
var ext = require('../../core/extensions/services/mandrill');

var store;

before(function(done) {

	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	this.timeout(300000);
	store = new EStore();
	store.start(done);
});

var test = function() {

	ext.action({
		to: process.env.MANDRILL_TEST_EMAIL,
		from: process.env.MANDRILL_TEST_EMAIL,
		template: 'test'

	}, store);
};

var ok = function() {

	var msg;

	if (!process.env.MANDRILL_TEST_EMAIL)
		msg = 'MANDRILL_TEST_EMAIL must be set to run this test.';

	if (!process.env.MANDRILL_API_KEY)
		msg = 'MANDRILL_API_KEY must be set to run this test.';

	if (msg)
		return console.log(msg);

	return true;


};

describe('sending emails', function() {

	it('should work', function(done) {

		if (ok() !== true)
			return done();

		this.timeout(30000);

		test.must.not.
		throw ();

		setTimeout(function() {
			done();

		}, 20000);

	});


});
