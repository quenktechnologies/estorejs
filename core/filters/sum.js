/**
 * @module
 */

var Big = require('bignumber.js');

/**
 * sum summates a list of objects passed to it.
 * @alias sum
 *
 * @param {Array} items
 * @param {String} key The key to sum on.
 *
 */
module.exports = function sum(items, key) {

	var total = new Big(0);

	items.forEach(function(item) {

		if (Object.hasOwnProperty(item, key))
			total = total.plus(item[key]);

	});

	return total;


};
