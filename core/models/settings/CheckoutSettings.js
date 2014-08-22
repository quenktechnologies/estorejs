/**
 * CheckoutSettings is the model for checkout settings.
 * @class Checkout
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function CheckoutSettings(store) {

	var self = {};

	/**
	 * register
	 *
	 * @method register
	 * @return
	 *
	 */
	self.register = function() {

		var t = store.keystone.Field.Types;
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
