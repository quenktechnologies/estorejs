var EStore = require('../../index.js');
var demand = require('must');
var Ext = require('./MockModelExtension');

var store;


beforeEach(function(done) {
	this.timeout(30000);
	process.env.PORT = 8888;
	process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
	process.env.DISABLE_CSRF = true;
	store = new EStore();
	done();
});


describe('Extending core models', function() {

	it('must work', function(done) {

		this.timeout(30000);
		store.install(new Ext('Settings'));
		store.start(function() {

			var model = store.getDataModel('Settings', true, {});
			model.must.have.enumerable('mockField0');
			model.must.have.enumerable('mockField1');
			done();

		});


	});


});
