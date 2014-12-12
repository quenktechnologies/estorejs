var address = require('./settingsAddress');
module.exports = {

	type: 'model',
	name: 'Settings',
	options: {
		nocreate: true,
		nodelete: true,
	},
	model: function(store, types, ui) {

		return [{
				name: {
					type: String,
					default: 'General',
					noedit: true
				}
			}, 'Brand', {
				brand: {
					name: {
						type: String,
						label: 'Name',
						width: 'medium'
					}
				}
			}, 'Main Address', {

				brand: {
					address: address(store, types, ui)
				}

			},
			'Theme', {
				theme: {
					current: {
						type: types.Select,
						options: store._templates,
						default: process.env.DEFAULT_THEME || 'themes/default',
						label: 'Select one:'
					},
					skin: {
						type: types.Select,
						options: ['cyborg', 'cerulean', 'cyborg', 'darkly', 'flatly',
							'journal', 'lumen', 'paper', 'readable', 'sandstone',
							'simplex', 'slate', 'spacelab',
							'superhero', 'united', 'yeti'
						],
						label: 'Bootstrap Theme',
						note: 'May not be supported by all themes.',
						default: 'lumen'
					}
				}
			}, 'Credit Cards', {
				payments: {
					card: {
						type: types.Select,
						options: [{
							label: 'None',
							value: 'none'
						}, {
							label: '2checkout Hosted',
							value: '2co-hosted'
						}],
						default: 'none',
						label: 'Choose a gateway:'
					}
				}

			},
			'Currency', {
				currency: {
					type: types.Select,
					options: require('currency-codes').codes(),
					default: 'USD',
					label: 'Select default'
				}
			}];
	},
	run: function(list, store) {

		list.schema.statics.getSettings = function() {

			var that = this.model('Settings').findOne();

			return require('q').ninvoke(that, 'exec');

		};

		list.schema.post('save', function(settings) {

			store.mediator.onSettingsChanged(settings);
		});


	}


};
