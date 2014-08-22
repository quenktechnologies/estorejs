/**
 * StoreSettings is the model for store config data.
 * @class Store
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function StoreSettings(store) {

	this.COLLECTION = 'store_settings';
	this.NAME = 'StoreSettings';
	this.options = {
		nocreate: true,
		nodelete: true,
		path: 'store_settings',
		label: 'Store',
		plural: 'Store Configurations',
		singular: 'Store Configurations',

	};
	this.fields = [{

		name: {
			type: String,
			default: process.env.BRAND || process.env.DOMAIN || 'Vendorlize',
			noedit: true
		},
		brand: {

			type: String,
			default: process.env.BRAND


		}

	}];

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.post('save', function(data) {

			system.settings.set('store_settings', data);
			process.env.BRAND = data.brand;

		});

	};

};
