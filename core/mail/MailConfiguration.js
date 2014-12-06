/**
 * @module
 */

/**
 * MailConfiguration is the config for the keystone email class.
 * @alias MailConfiguration
 * @param {String} path
 * @param {TemplateEngine} engine
 * @constructor
 *
 */
module.exports = function MailConfiguration(path, engine) {

	return {

		templateExt: 'html',
		templateEngine: engine,
		templatePath: path,
		mandrill: {
			track_opens: true,
			track_clicks: true,
			preserve_recipients: false,
			inline_css: true
		}


	};

};
