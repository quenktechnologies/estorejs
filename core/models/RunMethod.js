/**
 * @module
 */


/**
 * RunMethod calls the run method during model compilation.
 * @alias RunMethod
 *
 * @constructor
 *
 */
module.exports = function RunMethod(f) {

  this.f = f;

};

module.exports.prototype = {

	execute: function(list, types, fields, store) {
		this.f(list, store, types);
	}

};
