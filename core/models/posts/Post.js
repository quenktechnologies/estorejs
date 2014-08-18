/**
 * Post model for contact form messages.
 * @class Post
 *
 * @constructor
 *
 */
module.exports = function Post() {

	var self = {};


	/**
	 * onKeyStoneReady
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone s
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		Types = keystone.Field.Types;

		/**
		 * Posts Model
		 * ===========
		 */

		var Post = new keystone.List('Post', {
			map: {
				name: 'title'
			},

		});

		Post.add({
			title: {
				type: String,
				required: true
			},
			slug: {
				type: String,
				noedit: true
			},
			state: {
				type: Types.Select,
				options: 'draft, published, archived',
				default: 'draft',
				index: true
			},
			author: {
				type: String,
			},
			publishedDate: {
				type: Types.Date,
				index: true
			},
			image: {
				type: Types.Url
			},
			content: {
				brief: {
					type: Types.Html,
					wysiwyg: true,
					height: 150
				},
				extended: {
					type: Types.Html,
					wysiwyg: true,
					height: 400
				}
			}
		});

		Post.schema.pre('save', function(n) {

			this.slug = keystone.utils.slug(this.title);
                        n();

		});


		Post.addPattern('standard meta');
		Post.register();



	};



	return self;


};
