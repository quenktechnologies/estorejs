module.exports = function(store) {

	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'title,author,template,createdBy,createdAt';
	this.NAME = 'Page';
	this.options = {

		autokey: {
			path: 'slug',
			from: 'title',
			unique: true
		},
		map: {
			name: 'title'
		},
		track: true

	};
	this.fields = [{
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
				type: t.Markdown,
				wysiwyg: true,
				width: 'long'
			},
			description: {
				type: String,
				width: 'long',
				label: 'Meta Description'

			},
			template: {
				type: t.Select,
				options: store.pages.routes,
				width: 'long',
				initial: true,
				required: true

			}
		}

	];

	/**
	 * navigate
	 *
	 * @method navigate
	 * @param {Object} nav
	 * @return
	 *
	 */
	this.navigate = function(nav) {
		nav.pages = ['pages'];
	};

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {







	};
};
