/**
 * System represents the vendorlizer system.
 * @class System
 *
 * @constructor
 *
 */
module.exports = function System() {


	return {

		log: require('winston'),
		settings: require('./Settings')(),

	};





};
