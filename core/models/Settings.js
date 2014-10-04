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

	};
	this.fields = ['Store Information', {
		owner: {
			name: {
				type: types.Name
			},
			email: {
				type: types.Email
			}
		},
		company: {
			name: {
				type: String
			},
			phone: {
				type: types.Text
			},
			brand: {

				type: String,

			},
			description: {

				short: {
					type: String
				},
				long: {
					type: types.Markdown
				}


			},

		}
	} ];


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
