var mongo = require('mongojs');
var q = require('q');
var proxy = require('proxyquire').noPreserveCache();
var mongodb = require('mongodb');

module.exports = function helpers() {

	var self = this;
	self.OID = function(id) {

		return mongo.ObjectId(id);
	};

	self.generateOID = function() {

		return new mongodb.ObjectID();

	};
	self.setUp = function(done) {

		process.env.MONGO_URI = process.env.TEST_MONGO_URI ||
			'mongodb://localhost/estorejs-spec-testing-database';
		self.MONGO_URI = process.env.MONGO_URI;
		self.PORT = process.env.TEST_PORT || 8888;
		process.env.PORT = self.PORT;
		process.env.DISABLE_CSRF = true; // until we find a work around.
		self.CONNECTION = mongo(process.env.MONGO_URI);
		done();
	};

	self.dropDatabase = function(done) {
		self.CONNECTION.dropDatabase(done);
	};

	self.clearCollection = function(collection) {

		return function(done) {

			self.CONNECTION.collection(collection).drop(function(err) {

				if (err)
					if (err.errmsg === 'ns not found')
						err = null;
				done(err);
			});
		};
	};

	self.createStore = function() {
		var EStore = require('../../../index.js');
		self.store = new EStore();
		return self.store;
	};

	self.startStore = function(done) {

		if (self.store)
			return self.store.start(done);
		self.createStore().start(done);

	};

	self.save = function(collection, o) {
		return q.ninvoke(self.CONNECTION.collection(collection), 'save', o);
	};

	self.find = function(collection, o) {
		return q.ninvoke(self.CONNECTION.collection(collection), 'find', o);

	};

	self.findOne = function(collection, o) {
		return q.ninvoke(self.CONNECTION.collection(collection), 'findOne', o);

	};

	self.tearDown = function(done) {

		self.store.shutDown(done);


	};

	return self;
};
