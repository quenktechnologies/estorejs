/**
 * Gateways is a map of gateways we know about.
 * @class Gateways
 * @param {gateways} gateways
 * @constructor
 *
 */
module.exports = function Gateways() {

	this.available = [];
	this.other = [];
	this.active = {};
	this.list = [];

	/**
	 * hasActive checks if the given key is an active gateway.
	 *
	 * @method hasActive
	 * @param {String} key
	 * @return
	 *
	 */
	this.hasActive = function(key) {

		return this.active.hasOwnProperty(key);
	};

	/**
	 * getActive returns an active gateway
	 *
	 * @method getActive
	 * @param {String} name
	 * @return {Gateway}
	 *
	 */
	this.getActive = function(name) {
		return this.active[name];
	};


};
