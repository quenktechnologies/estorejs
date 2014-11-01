module.exports = {

	type: 'model',
	name: 'Category',
	options: {
		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true,
		drilldown: 'products'
	},
	model: function(store, types, ui) {
		return [{

				name: {
					type: String,
					required: true,
					initial: true
				}
			}, {
				image: {
					type: store.engines.image(store)
				}

			},
			'Description', {
				description: {

					brief: ui.TextBox({
						label: 'Brief'
					}),
					full: ui.PageContentEditor({
						label: 'Full'
					})


				}
			}, 'Products', {
				products: {

					type: types.Relationship,
					ref: 'Product',
					many: true,
					label: 'Click to select',
					width: 'medium',
					collapse: true


				}
			}


		];

	},

	run: function(list, store, types) {

		list.schema.post('save', function(category) {

			store.bus.emit(store.CATEGORY_CREATED, category);

		});



	}


};
