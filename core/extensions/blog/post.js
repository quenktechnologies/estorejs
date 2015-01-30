module.exports = {

	type: 'model',
	name: 'Post',
	defaultColumns: 'title,state,author.name,createdBy,createdAt',
	options: {

		autokey: {
			path: 'slug',
			from: 'title',
			unique: true
		},
		map: {
			name: 'title'
		},
		track: true

	},
	model: function(store, types, ui) {

		return [{
				title: {
					type: String,
					required: true,
					initial: true
				},
				author: {

					name: {
						type: String,
						intital: true,
						default: 'System',
						initial: true
					},
					url: {
						type: types.Url

					}
				},
				image: {
					type: types.Image,
					autoCleanup: true
				},
				state: {
					type: types.Select,
					options: 'draft, published, archived',
					default: 'draft',
					index: true
				},
				postedOn: {
					type: Date,
					dependsOn: {
						state: 'published'
					}
				},
				summary: {
					type: types.Textarea,
					wysiwyg: true,
					height: 150,
					initial: true

				},
				content: {

					type: types.Markdown,
					wysiwyg: true,
					height: 600
				},
				keywords: {

					type: types.TextArray

				}
			}

		];

	},
	navigation: {
		blog: ['posts', 'post-categories']
	}



};
