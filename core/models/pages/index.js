/**
 * PageModel
 * @class PageModel
 *
 * @constructor
 *
 */
module.exports = function PageModel() {

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

		require('./Page')().onKeyStoneReady(keystone);



	};



	return self;


};
