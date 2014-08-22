/**
 * CheckoutSettings is the model for checkout settings.
 * @class Checkout
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function CheckoutSettings(store) {


	this.COLLECTION = 'checkout_settings';
        this.NAME='CheckoutSettings';
	this.options = {
		nocreate: true,
		nodelete: true,
                path: 'checkout_settings',
		label: 'Checkout',
		singular: 'customer checkout configuration',
		plural: ' customer checkout configurations',
	};

	this.fields = [{
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

	}];







};
