/**
 * StoreSettings is the model for store config data.
 * @class Store
 *
 * @constructor
 *
 */
module.exports = function StoreSettings() {

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

		var Store = new keystone.List('StoreSettings', {
			nocreate: true,
			nodelete: true,
			path: 'store_settings',
			label: 'Store',
			plural: 'Store Configurations',
			singular: 'Store Configurations',

		});

		Store.add({

			name: {
				type: String,
				default: process.env.BRAND || process.env.DOMAIN || 'Vendorlize',
				noedit: true
			},
			brand: {

				type: String,
				default: process.env.BRAND


			}

		});

		Store.schema.post('save', function(data) {

                  system.settings.set('store_settings', data);
			process.env.BRAND = data.brand;




		});

		Store.register();


	};


	return self;


};
