/**
 * SumAll calculates the sum of all the numerical values of a key in an array of objects.
 * @class SumAll
 *
 * @constructor
 *
 */
module.exports = function SumAll(list) {

	var total = '0';
	var Big = require('bignumber.js');

	list.forEach(function(v, k) {

          if(v)
		total = Big(total).plus(v);


	});

        return total;





};
