/* Ease the stress of testing with a god like util object.*/
require('dotenv')().load();
var EStore = require('../../../index.js');

module.exports = function() {

	var self = {

		MONGO_URI: process.env.TEST_MONGO_URI ||
			'mongodb://localhost/estorejs-spec-testing-database',

		PORT: process.env.TEST_PORT || 8888,
		BIND_ADDRESS: process.env.TEST_BIND_ADDRESS || 'localhost:8888',
                invoice: require('./invoice'),



	};

	self.setEnvironment = function() {

		process.env.MONGO_URI = self.MONGO_URI;
		process.env.PORT = self.PORT;

	};

	self.clearCollection = function(model) {

		return function(done) {
			self.store.getDataModel(model).
			remove({}).
			exec(done);
		};


	};

	self.createStore = function() {

		self.store = new EStore();

	};

	self.startStore = function(done) {

		if (this.timeout)
			this.timeout(30000);

		self.createStore();
		self.store.start(done);

	};



	return self;


};
