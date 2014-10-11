module.exports = function(store) {
	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'title,author,createdBy,createdAt';
	this.NAME = 'Post';
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
				required: true
			},
			state: {
				type: t.Select,
				options: 'draft, published, archived',
				default: 'draft',
				index: true
			},
			author: {
				type: String,
			},
			image: {
				type: t.Url
			},
			content: {
				brief: {
					type: t.Markdown,
					wysiwyg: true,
					height: 150
				},
				full: {
					type: t.Markdown,
					wysiwyg: true,
					height: 400
				}
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
		nav.blog = ['posts'];
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
