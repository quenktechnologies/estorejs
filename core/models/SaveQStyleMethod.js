/**
 * @module
 */
var q = require('q');

/**
 * SaveQStyleMethod
 * @alias SaveQStyleMethod
 * @constructor
 *
 */
module.exports = function SaveQStyleMethod() {};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		list.schema.methods.saveQStyle = function() {

			var deferred = q.defer();

			this.save(function(err, saved) {

				if (err)
					return deferred.reject(err);

				deferred.resolve(saved);

			});
			return deferred.promise;


		};
	}

};
