/**
 * @module
 */

var Big = require('bignumber.js');
var _ = require('lodash');

/**
 * subtotal finds the subtotal of the target passed to it.
 * @alias subtotal
 * @param {Array|Item} target
 *
 */
module.exports = function subtotal(target) {

	var sum = function(p, q) {
		return (new Big(p)).times(q).toString();

	};

	if (!target.length)
		return sum(target.price, target.quantity);

	var total = new Big(0);

	target.forEach(function(item) {

		total = total.plus(sum(item.price, item.quantity));

	});

	return total.toString();

};
