module.exports = {

	type: 'model',
	name: 'Post',
	defaultColumns: 'title,author,createdBy,createdAt',
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
					required: true
				},
				state: {
					type: types.Select,
					options: 'draft, published, archived',
					default: 'draft',
					index: true
				},
				author: {
					type: String,
				},
				image: {
					type: types.Url
				},
				content: {
					brief: {
						type: types.Markdown,
						wysiwyg: true,
						height: 150
					},
					full: {
						type: types.Markdown,
						wysiwyg: true,
						height: 400
					}
				}
			}

		];

	},
	navigate: function(nav) {
		nav.blog = ['posts'];
	}



};
