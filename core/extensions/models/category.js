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
					lowercase: true,
					trim: true,
					required: true,
					initial: true
				},

				isFeatured: {
					type: Boolean,
					initial: true
				},

				image: store.engines.ImageEngine(store,types)

			},

			{
				description: ui.PageContentEditor()

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
					label: 'Child categories',
					many: true,
				}
			}

		];

	},

	run: function(list, store, types) {

		list.schema.post('save', function(category) {

			store.broadcast(store.CATEGORY_CREATED, category);

		});



	}


};
