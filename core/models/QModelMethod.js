/**
 * @module
 */
var q = require('q');

/**
 * QModelMethod wraps a model method in a q style promise.
 * @alias QModelMethod
 * @param {String} method
 * @constructor
 *
 */
module.exports = function QModelMethod(method) {
	this.method = method;
};

module.exports.prototype = {

	execute: function(name, list, types, fields, store) {

		var method = this.method;

		list.schema.statics[method + 'QStyle'] = function() {

			//@todo optomize ..sleepy
                        var args =Array.prototype.slice.call(arguments);
                        args.unshift(this.model(name), method);
                        return q.ninvoke.apply(q, args);

		};
	}

};
