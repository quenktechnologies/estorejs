var path = require('path');
var fs = require('fs');
/**
 * Page model.
 * @class Page
 *
 * @constructor
 *
 */
module.exports = function Page(store) {

	this.NAME = "page";
	this.DEFAULT_COLUMNS = "title, description, createdOn";
	this.options = {

		map: {
			name: 'title'
		}
	};


	fs.readdirSync(store.theme.getTemplatePath()+'/pages').forEach(
		function(path) {

			types.push(p.basename(path, p.extname('.' + path)));


		});

	this.fields = [{

		title: {
			type: String,
			required: true,
			initial: true
		},
		description: {
			type: String,
		},
		type: {
			type: types.Select,
			options: types,
			required: true,
			initial: true
		},

		slug: {

			type: String,
			noedit: true,
			collapse: true

		},
		editor: {
			type: types.Select,
			options: 'Html, Markdown',
			required: true,
			initial: true
		},
		md: {
			type: types.Markdown,
			dependsOn: {
				'editor': 'Markdown'
			}
		},
		html: {
			type: types.Html,
			wysiwyg: true,
			dependsOn: {
				'editor': 'Html'
			}
		}

	}];

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.virtual('body').get(function() {

			if (this.editor == 'Markdown') return this.md.html;

			if (this.editor == 'Html') return this.html;

			system.log.warn('No html found!');

		});

		list.schema.pre('save', function(n) {
			this.slug = keystone.utils.slug(this.title);
			n();
		});

		list.addPattern('standard meta');



	};
};
