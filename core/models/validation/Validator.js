/**
 * @module
 */

var vjs = require('validate.js');
var unique = require('./unique');
vjs.Promise = require('q').Promise;

/**
 * Validator is a wrapper around the validate.js library.
 *
 * All validation is done using the async api.
 * @alias Validator
 * @param {Object} cons The constraints in validate.js syntax.
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function Validator(cons, store) {
	this._cons = cons;
	vjs.validators.unique = unique(store);
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
