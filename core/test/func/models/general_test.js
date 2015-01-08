var demand = require('must');
var util = require('../../util');
var helpers = util.helpers();


before(helpers.setUp);
before(helpers.dropDatabase);

describe('Extending core models', function() {

	it('must work', function(done) {
		//	store.install(new util.mocks.modelExtension('Settings'));

return 	store.start(function() {
			helpers.find('settings', {});
			then(function(models) {
				//	var model = models[0];
				//	console.log('model is ', models);
				//	model.must.have.enumerable('mockField0');
				//	model.must.have.enumerable('mockField1');
				//			store.shutDown(done);
				//	console.log('done');
			}).
			catch(done);
		});


	});

	xit('must work', function(done) {
		//	store.install(new util.mocks.modelExtension('Settings'));

		store.start(function() {
			helpers.find('settings', {}).
			then(function(models) {
				var model = models[0];
				console.log('model is', model);

				model.must.have.enumerable('mockField0');
				model.must.have.enumerable('mockField1');
				store.shutDown(done);
			}).
			catch(done).done();


		});


	});






});
describe('Extending core models', function() {

	xit('must work', function(done) {
		//	store.keystone.mongoose.models = {};
		store.install(new util.mocks.modelExtension('Settings'));

		//This will use the promise api when it is ready.
		store.start(function() {

			helpers.find('settings', {}).
			then(function(models) {

				var model = models[0];
				model.must.have.enumerable('mockField0');
				model.must.have.enumerable('mockField1');
				done();
			}).
			catch(done);


		});


	});


});
