process.env.PORT = 8888;
process.env.MONGO_URI = 'mongodb://localhost/estorejs-spec-testing-database';
module.exports = {


	init: function() {

		var EStore = require('../../index.js');
		store = new EStore();
		return store;
	}
};
