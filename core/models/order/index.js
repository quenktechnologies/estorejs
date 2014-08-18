/**
 * Order
 * @class Order
 *
 * @constructor
 *
 */
module.exports = function Order() {

	var self = {};

	/**
	 * onKeyStoneReady
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		require('./Transaction')().onKeyStoneReady(keystone);
		require('./Invoice')().onKeyStoneReady(keystone);



	};


	return self;


};
