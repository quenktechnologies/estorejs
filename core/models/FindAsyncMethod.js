/**
 * @module
 */
var q = require('q');

/**
 * QMethod wraps a model method in a q style promise.
 * @alias QMethod
 * @param {String} method
 * @param {Boolean} bindMethods
 * @constructor
 *
 */
module.exports = function QMethod(method, bindMethods) {
	this.method = method;
	this.bindMethods = bindMethods;
};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		console.log(list.schema.methods, list.schema.statics);
		var bind = this.bindMethods ? 'methods' : 'statics';
		var method = this.method;
		list.schema[bind][method + 'QStyle'] = function() {

			return q.ninvoke(this, method, arguments);

		};
	}

};
