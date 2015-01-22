module.exports = {

	type: 'model',
	name: 'PostCategory',
	plural: 'Categories',

	options: {
		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true,
		drilldown: 'posts'
	},
	model: function(store, types, ui) {
		return [{

				name: {
					type: String,
					required: true,
					initial: true
				},
				image: store.engines.ImageEngine(store, types),
				posts: {

					type: types.Relationship,
					ref: 'Post',
					many: true,
					collapse: true
				}
			}


		];

	}


};
