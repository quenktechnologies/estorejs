/**
 * Page model.
 * @class Page
 *
 * @constructor
 *
 */
module.exports = function Page() {

	var self = {};


	/**
	 * onKeyStoneReady
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone params
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		var fs = require('fs');
		var p = require('path');
		var types = [];
		var model = keystone.List('Page', {

			map: {
				name: 'title'
			}

		});

		fs.readdirSync(process.env.THEME_PATH + '/private/pages').forEach(
			function(path) {

				types.push(p.basename(path, p.extname('.' + path)));


			});

		model.add({

			title: {
				type: String,
				required: true,
				initial: true
			},
			description: {
				type: String,
			},
			type: {
				type: keystone.Field.Types.Select,
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
				type: keystone.Field.Types.Select,
				options: 'Html, Markdown',
				required: true,
				initial: true
			},
			md: {
				type: keystone.Field.Types.Markdown,
				dependsOn: {
					'editor': 'Markdown'
				}
			},
			html: {
				type: keystone.Field.Types.Html,
				wysiwyg: true,
				dependsOn: {
					'editor': 'Html'
				}
			}

		});

		model.schema.virtual('body').get(function() {

			if (this.editor == 'Markdown') return this.md.html;

			if (this.editor == 'Html') return this.html;

			system.log.warn('No html found!');

		});

		model.schema.pre('save', function(n) {
			this.slug = keystone.utils.slug(this.title);
			n();
		});

		model.addPattern('standard meta');
		model.defaultColumns = "title, description, createdOn";
		model.register();



	};


	return self;


};
