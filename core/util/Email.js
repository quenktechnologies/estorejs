var nunjucks = require('nunjucks');
/**
 * @module
 */


/**
 * Email provides an abstraction for sending emails.
 * @alias Email
 * 
 * @constructor
 *
 */
module.exports = function Email (template, emailFolder) {

  return {
			templateExt: 'html',
			templateEngine: {
				compile: function(html, paths) {
					return function(locals) {

						return nunjucks.configure(
							emailFolder, {
								autoescape: true
							}).
						renderString(html, locals);
					};
				}
			},

			templateName: template,
			templatePath: emailFolder,
			mandrill: {
				track_opens: true,
				track_clicks: true,
				preserve_recipients: false,
				inline_css: true
			}

		}))	}
  

};

