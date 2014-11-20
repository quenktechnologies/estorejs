/**
 * @module
 */

var Big = require('bignumber.js');

/**
 * delivery summates the delivery charge for an order.
 * @alias delivery
 *
 * @param {Array} items
 *
 */
module.exports = function delivery(items) {

	var total = new Big(0);

	items.forEach(function(item) {

		if (item.order.delivery)
			total = total.plus(item.order.delivery);
	});

	return total.toString();


};
