var demand = require('must');
var ext = require('../../../extensions/services/mandrill');
var util = require('../../util')();

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
before(util.setEnvironment);
before(util.startStore);

describe('sending emails', function() {

	it('should work', function(done) {

		var test = function() {

			ext.action({
				to: process.env.MANDRILL_TEST_EMAIL,
				from: process.env.MANDRILL_TEST_EMAIL,
				template: 'test'

			}, util.store);
		};

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
