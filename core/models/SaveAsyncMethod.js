/**
 * @module
 */


/**
 * SaveAsyncMethod adds a method to the model that allows Promise style save ops.
 * @alias SaveAsyncMethod
 *
 * @constructor
 *
 */
module.exports = function SaveAsyncMethod() {

};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		list.schema.methods.saveAsync = function() {

			var promise = new store.keystone.mongoose.Promise();

			this.save(function(err, result) {
				promise.resolve(err, result);
			});

			return promise;
		};
	}

};
