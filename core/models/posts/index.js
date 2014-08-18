/**
 * Blog
 * @class Blog
 *
 * @constructor
 *
 */
module.exports = function Blog() {

	var self = {};

	/**
	 * onKeyStoneReady
	 *
	 * @method onKeyStoneReady
	 * params
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		require('./Post')().onKeyStoneReady(keystone);



	};


	return self;


};
