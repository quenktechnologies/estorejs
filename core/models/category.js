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
				},
				image: store.engines.image(store)

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
			}, {
				products: {

					type: types.Relationship,
					ref: 'Product',
					many: true,
					label: 'Child products',
					width: 'medium',
					collapse: true
				},
				children: {
					type: types.Relationship,
					ref: 'Category',
                                        label:'Child categories',
					many: true,
				}
			}, {
				isFeatured: {
					type: Boolean
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
