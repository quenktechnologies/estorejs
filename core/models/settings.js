module.exports = {

	type: 'model',
	name: 'Settings',
	options: {
		nocreate: true,
		nodelete: true,
		map: {
			name: '_id'
		}

	},
	model: function(store, types, ui) {

		return ['Owner Information', {
			owner: {
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
			site: {
				brand: {
					type: String,
					label: 'Brand',
					width: 'medium'
				},
				about: {
					type: types.Markdown,
					label: 'About'
				}

			}

		}, 'Theme', {
			theme: {
				current: {

					type: types.Select,
					options: store._templates,
                                  default: {label:'default', value:'default'},
					label: 'Theme'


				},
			}
		}, 'Ajax Apis', {
			apis: {
				checkout: {
					type: types.Select,
					options: [{
						value: false,
						label: 'off'
					}, {
						value: true,
						label: 'on'
					}],
					default: true
				},
				products: {
					type: types.Select,
					options: [{
						value: false,
						label: 'off'
					}, {
						value: true,
						label: 'on'
					}],
					default: true
				},
				cart: {
					type: types.Select,
					options: [{
						value: false,
						label: 'off'
					}, {
						value: true,
						label: 'on'
					}],
					default: true
				}

			}
		}];
	},
	run: function(list, store) {

		list.schema.statics.getSettings = function() {

			var that = this.model('Settings').findOne();

			return require('q').ninvoke(that, 'exec');

		};

		list.schema.post('save', function(data) {

			store.ebus.emit('SETTINGS_CHANGED', data);

		});

	}


};
