/**
 * Settings provides the various settings models.
 * @class Settings
 *
 * @constructor
 *
 */
module.exports = function Settings() {

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


		[
                  require('./GeneralSettings'),
			require('./StoreSettings'),
			require('./CheckoutSettings')
		].

		forEach(function(m) {

			m().onKeyStoneReady(keystone);

		});



	};



	return self;


};
