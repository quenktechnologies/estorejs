/**
 * StoreSettings is the model for store config data.
 * @class Store
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function Settings(store) {

	var types = store.keystone.Field.Types;

	this.NAME = 'Settings';
	this.options = {
		nocreate: true,
		nodelete: true,
		map: {
			name: '_id'
		}

	};
	this.fields = ['Owner Information', {
		owner: {
			brand: {
				type: String,
				label: 'Brand',
				width: 'medium'
			},
			contact: {
				type: types.Name,
				label: 'Name'
			},
			company: {
				type: String,
				width: 'medium',
				label: 'Company Name'
			},

			email: {
				type: types.Email,
				width: 'medium',
				label: 'Email',
			},
			phone: {
				type: String,
				label: 'Phone',
				width: 'medium'
			},


		}
	}, 'Site', {

		about: {
			short: {
				type: String,
				label: 'Short'
			},
			long: {
				type: types.Markdown,
				label: 'Long'
			}
		}


	}];


	/**
	 * navigate
	 *
	 * @method navigate
	 * @return
	 *
	 */
	this.navigate = function(nav) {





	};


	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.statics.getSettings = function() {

			var that = this.model('Settings').findOne();

			return require('q').ninvoke(that, 'exec');

		};

		list.schema.post('save', function(data) {

			store.ebus.emit('SETTINGS_CHANGED', data);

		});

	};

};
