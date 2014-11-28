/**
 * @module
 */


/**
 * FieldsMethod sets up the fields for the model.
 * @alias FieldsMethod
 * @param {Function} f
 * @implements Method
 * @constructor
 *
 */
module.exports = function FieldsMethod(f) {

	this.f = f;

};

module.exports.prototype = {

	execute: function(list, types, fields, store) {
		list.add.apply(list, this.f(store, types, fields));
	}
};
