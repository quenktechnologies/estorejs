/**
 * SubTotal calculates the sum of all the numerical values of a key in an array of objects.
 * @class SubTotal
 *
 * @constructor
 *
 */
module.exports = function SubTotal(price, quantity, list) {

	var Big = require('bignumber.js');
        var newList = [];

	list.forEach(function(v, k) {

		v.subtotal = Big(v[price]).times(v[quantity]);
                newList.push(v);

	});

	return newList;





};
