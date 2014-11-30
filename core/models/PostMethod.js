/**
 * @module
 */


/**
 * PostMethod calls the post method hooks during model compilation.
 * @alias PostMethod
 *
 * @constructor
 *
 */
module.exports = function PostMethod(m) {

	this.m = m;

};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		for (var key in this.m)
			if (this.m.hasOwnProperty(key))
				list.schema.post(key, this.m[key]);


	}

};
