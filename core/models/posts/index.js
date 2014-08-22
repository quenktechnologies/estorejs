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
	 * register
	 *
	 * @method register
	 * params
	 * @return
	 *
	 */
	self.register = function(keystone) {

		require('./Post')().register(keystone);



	};


	return self;


};
