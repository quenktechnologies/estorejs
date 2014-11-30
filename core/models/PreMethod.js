/**
 * @module
 */


/**
 * PreMethod calls the pre methods during model compilation.
 * @alias PreMethod
 *
 * @constructor
 *
 */
module.exports = function PreMethod(m) {

	this.m = m;

};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {
		for (var key in this.m)
			if (this.m.hasOwnProperty(key))
				list.schema.pre(key, this.m[key]);
	}

};
