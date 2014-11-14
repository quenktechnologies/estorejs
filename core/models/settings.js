var address = require('./settingsAddress');
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

		return ['Site Details', {
				site: {
					name: {
						type: String,
						label: 'Name',
						width: 'medium'
					},
					meta: {

						description: {
							type: types.Textarea,
							label: 'Meta Description',
							note: 'Used by some search engines to summarize the site.'
						},
						title: {

							type: String,
							label: 'Meta title',
							width: 'medium',

						}

					}

				}

			},
			'Store Address', {
				store: {

					address: address(store, types, ui)

				}
			},


			'Theme', {
				theme: {
					current: {
						type: types.Select,
						options: store._templates,
						default: 'themes/default',
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
						default: 'lumen'

					}
				}
			}, 'Credit Cards', {
				payments: {
					card: {
						active: {
							type: types.Select,
							options: (function() {
								var list = [];
								store.gateways.available.forEach(function(gw) {
									if (gw.workflow === 'card')
										list.push(gw);
								});
								return list;
							})(),
							default: 'none',
							label: 'Choose a gateway:'
						}
					}
				}

			},
			'Currency', {
				currency: {
					type: types.Select,
					options: require('currency-codes').codes(),
					default: 'TTD',
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

			store.broadcast(store.SETTINGS_CHANGED, settings);
		});


	}


};
