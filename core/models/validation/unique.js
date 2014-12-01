/** @module */
var q = require('q');

module.exports = function(store) {

	return function(value, options, key) {

		var def = q.defer();
		var match = {};
		match[key] = value;

		store.getDataModel(options.model).findOneQStyle(match).
		then(null, function(err) {

			throw err;

		}).
		then(function(doc) {

			if (doc)
			throw new Error(' "' + value + '" already exists');


		}).done();


		return def.promise;


	};
};
