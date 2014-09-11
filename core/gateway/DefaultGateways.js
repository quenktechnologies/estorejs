/**
 * DefaultGateways is an extension to install the default gateways
 * shipped with EStore.
 * @class DefaultGateways
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function DefaultGateways(store) {

	/**
	 * onGateways
	 *
	 * @method onGateways
	 * @return
	 *
	 */
	this.onGateways = function(gateways) {

		var DepositGateway = require('./DepositGateway');

		gateways.add({name:'Bank Deposit', value:'deposit'}, new DepositGateway());



	};







};

module.exports.prototype = estore.Extension;
