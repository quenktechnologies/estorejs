/**
 * @module
 */

var vjs = require('validate.js');
vjs.Promise = require('q').Promise;

/**
 * Validator is a wrapper around the validate.js library.
 *
 * All validation is done using the async api.
 * @alias Validator
 * @param {Object} cons The constraints in validate.js syntax.
 * @constructor
 *
 */
module.exports = function Validator(cons) {
	this._cons = cons;
};

module.exports.prototype = {

	/**
	 *
	 * validate the target
	 * @param {Object} target
	 * @returns {Promise}
	 *
	 */
	validate: function(target) {
		return vjs.async(target, this._cons);
	}

};
