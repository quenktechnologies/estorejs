/**
 * Sum calculates the sum of all the numerical values of a key in an array of objects.
 * @class Sum
 *
 * @constructor
 *
 */
module.exports = function Sum(key, list) {

	var total = '0';
	var Big = require('bignumber.js');

	list.forEach(function(v, k) {

          var target = v[key];

          if(target)
		total = Big(total).plus(target);


	});

        return total;





};
