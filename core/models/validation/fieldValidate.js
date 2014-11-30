/** @module */

/**
 * fieldValidate provides a callback for validating fields using validate.js.
 * @param {String} name
 * @param {Validator} validator
 * @returns {Function}
 *
 */
module.exports = function fieldValidate(name, validator) {

	/**
	 * @param {String} value
	 * @param {Function} done
	 */
	return function(value, done) {

		var target = {};
		target[name] = value;
		validator.validate(target).
		catch (function(err) {
			return done(false, err);
		}).
		done(function() {
			return done(true);
		});

	};
};
