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
	defaultColumns: 'name, isFeatured, children, createdAt',
	model: function(store, types, ui) {
		return [{

				name: {
					type: String,
					trim: true,
					required: true,
					initial: true
				},

				isFeatured: {
					type: Boolean,
					initial: true,
					label: 'Feature this category?'
				},

				image: types.Image

			},

			{
				products: {

					type: types.Relationship,
					ref: 'Product',
					many: true,
					label: 'Products',
					width: 'medium',
				},
				children: {
					type: types.Relationship,
					ref: 'Category',
					label: 'Sub Categories',
					many: true,
					width: 'medium',

				}
			}, {
				description: types.Markdown
			}

		];

	},

	run: function(list, store, types) {

		list.schema.post('save', function(category) {

			store.broadcast(store.CATEGORY_CREATED, category);

		});



	}


};
