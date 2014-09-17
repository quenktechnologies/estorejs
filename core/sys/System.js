/**
 * System represents the vendorlizer system.
 * @class System
 *
 * @constructor
 *
 */
module.exports = function System() {


	var sys = {

		log: require('winston'),
		settings: require('./Settings')(),

	};

	sys.log.error = console.error;
	return sys;





};
