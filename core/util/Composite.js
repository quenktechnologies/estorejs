/**
 * Composite pattern.
 * @class Composite
 * @constructor
 *
 */
module.exports = function Composite() {

	this._members = [];
	/**
	 * add an Object to the internal list.
	 *
	 * @method add
	 * @param {Object} o
	 * @return Composite
	 *
	 */
	this.add = function(o) {

		this._members.push(o);

		return this;

	};

	/**
	 * _callEach will call a method for each member of this composition.
	 *
	 * @method _callEach
	 * @param {String} method
	 * @return
	 *
	 */
	this._callEach = function(method) {

		var args = Array.prototype.slice.call(arguments, 1);

		this._members.forEach(function(member, key) {

			var f = member[method];

			if (!f) throw new Error("Method '" + method + "' not found!");

			f.call(member, args);

		});


	};





};
