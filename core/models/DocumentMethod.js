/**
 * @module
 */


/**
 * DocumentMethod sets up the Document methods for models during compilation.
 * @alias DocumentMethod
 * @param {Object|Function} m
 * @implements Method
 * @constructor
 *
 */
module.exports = function DocumentMethod(m) {

	this.methods = m;


};


module.exports.prototype = {


	execute: function(name, list) {

		for (var key in this.methods)
			if (this.methods.hasOwnProperty(key)) {

				list.schema.methods[key] = this.methods[key];

			}



	}

};
