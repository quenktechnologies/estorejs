/**
 * Gateways is a containter of gateways.
 * @class Gateways
 *
 * @constructor
 *
 */
module.exports = function Gateways() {

	this._gateways = [];
	this._options = [];

	/**
	 * has checks if a Gateway exits for a workflow.
	 * @class has
	 * @param {String} workflow
	 * @return {Boolean}
	 *
	 */
	this.has = function(workflow) {

		return (this._gateways[workflow] !== undefined);

	};

	/**
	 * add a gateway to the list.
	 *
	 * @method add
	 * @param {Object} def {name:'Cash on Delivery', value:'cod'}
	 * @param {Gateway} gw
	 * @return
	 *
	 */
	this.add = function(def, gw) {

		this._gateways[def.value] = gw;
		this._options.push(def);
		return this;


	};

	/**
	 * get provides a gateway.
	 *
	 * @method get
	 * @param {String} name
	 * @return {Gateway}
	 *
	 */
	this.get = function(name) {

		return this._gateways[name];


	};


	/**
	 * getPaymentOptions returns a list of options for payment.
	 *
	 * @method getPaymentOptions
	 * @return {Array}
	 *
	 */
	this.getPaymentOptions = function() {

		return this._options;

	};





};
