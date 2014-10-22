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
				title: ui.TextField({
					required: true
				}),
				template: {
					type: types.Select,
					options: store.pages.templates,
					initial: true,
					required: true

				},
				author: ui.TextField('Meta Author'),
				description: ui.TextBox('Meta Description'),
				content: ui.PageContentEditor(),
			}, 'Options', {
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
