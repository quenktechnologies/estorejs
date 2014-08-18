/**
 * CheckoutSettings is the model for checkout settings.
 * @class Checkout
 *
 * @constructor
 *
 */
module.exports = function CheckoutSettings() {

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

		var t = keystone.Field.Types;
		var path = require('path');

		var Checkout = new keystone.List('CheckoutSettings', {
			nocreate: true,
			nodelete: true,
			label: 'Checkout',
			path: 'checkout_settings',
			singular: 'customer checkout configuration',
			plural: ' customer checkout configurations',
		});

		Checkout.add({
			name: {
				type: String,
				default: process.env.DOMAIN || 'Open',
				noedit: true
			}
		}, 'Cash on Delivery', {

			cod: {
				enabled: {
					type: Boolean,
					label: 'Enabled?',
				}
			}

		});


		Checkout.register();

	};


	return self;


};
