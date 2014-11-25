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
					default: store.pages.templates[0].value,
					required: true

				},
				content: ui.PageContentEditor(),
				meta: {
					author: ui.TextField('Meta Author'),
					description: ui.TextBox('Meta Description'),

				}
			}, {
				isIndex: {
					type: Boolean,
					default: false,
					label: 'Use for site index?'

				},
				isNav: {
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
