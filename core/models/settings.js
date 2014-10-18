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
						label: 'Theme'
					},
				}
			}, 'Payments', {
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
							label: 'Credit Card Processor:'
						}
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

			store.onSettingsChanged(data);

		});

	}


};
