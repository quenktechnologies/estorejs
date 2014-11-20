/**
 * @module
 */
var Big = require('bignumber.js');
var delivery = require('./delivery');
var subtotal = require('./subtotal');

/**
 * total calculates the total of an order.
 * @alias total
 * @param {Array} cart
 *
 */
module.exports = function total(cart) {

	var t = new Big(0);
	t = t.plus(subtotal(cart));
		t = t.plus(delivery(cart));
	return t.toString();

};
