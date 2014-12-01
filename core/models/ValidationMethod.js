/**
 * @module
 */

var Validator = require('./validation/Validator');
var fieldValidate = require('./validation/fieldValidate');

/**
 * ValidationMethod sets up the validation for the model.
 *
 * Validation is done using validate.js rather than mongoose middleware.
 * @alias ValidationMethod
 *
 * @param {Object} m
 * @constructor
 *
 */
module.exports = function ValidationMethod(m) {
	this.m = m;
};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		var m = this.m;

		if ('function' === typeof m)
			m = m(store);

		store.validators[name] = m;

		list.schema.virtual('constraints').get(
			function() {
				return m;
			});

		list.schema.methods.validateAsync = function() {

			var validator = new Validator(this.constraints, store);
			var promise = validator.validate(this.toObject());
			return promise;


		};

		for (var key in m)
			if (m.hasOwnProperty(key)) {

				var field = {};
				field[key] = {};

				//list.schema.path(key);

				if (!field)
				// throw new store.errors.SchemaFieldDoesNotExistError();
					throw new Error('Field ' + key + ' does not exist!');

				var target = {};
				target[key] = store.validators[name];
				field[key].valdidate = fieldValidate(key, new Validator(target));

			}
	}

};
