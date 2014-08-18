/**
 * Email is a wrapper around the keystone Email object.
 * @class Email
 *
 * @constructor
 *
 */
module.exports = function Email(name, keystone, nunjucks) {

	return new keystone.Email({

		templateExt: 'html',
		templateEngine: {
			compile: function(html, paths) {
				return function(locals) {
					return nunjucks.configure(process.env.THEME_PATH + '/private/email').renderString(html, locals);
				};
			}
		},

		templateName: name,
		templateBasePath: keystone.get('emails'),
		mandrill: {
			track_opens: true,
			track_clicks: true,
			preserve_recipients: false,
			inline_css: true
		}

	});


};
