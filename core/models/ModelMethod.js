/**
 * @module
 */


/**
 * ModelMethod sets up the model methods for models during compilation.
 * @alias ModelMethod
 * @param {Object|Function} m
 * @implements Method
 * @constructor
 *
 */
module.exports = function ModelMethod(m) {

	this.methods = m;


};

module.exports.prototype = {

	execute: function(name, list) {

		for (var key in this.methods)
			if (this.methods.hasOwnProperty(key)) {

				list.schema.statics[key] = this.methods[key];

			}



	}

};
