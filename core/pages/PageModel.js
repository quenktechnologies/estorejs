module.exports = {

	type: 'model',
	name: 'Page',
	defaultColumns: 'title,author,template,createdBy,createdAt',
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
					width: 'long',
					required: true
				},
				author: {
					type: String,
					width: 'medium'
				},
				content: {
					type: types.Markdown,
					wysiwyg: true,
					width: 'long'
				},
				description: {
					type: String,
					width: 'long',
					label: 'Meta Description'

				},
				template: {
					type: types.Select,
					options: store.pages.templates,
					width: 'long',
					initial: true,
					required: true

				}},'Options',{
				index: {
					type: Boolean,
					default: false,
					unique: true,
					label: 'Use as front page?'

				},
				navigation: {

					type: Boolean,
					default: false,
					label: 'Include in navigation menu?'



				}
			}

		];

	},

	navigate: function(nav) {
		nav.pages = ['pages'];
	}




};
