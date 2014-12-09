/**
 * @module
 * @alias MailProvider
 */
var MailConfiguration = require('./MailConfiguration');
var Mailer = require('./Mailer');
var TemplateEngine = require('./TemplateEngine');

/**
 *
 * Factory object for sending emails.
 *
 */
module.exports = {


	/**
	 *
	 * Constructs a mandrill mailer.
	 * @param {String} path
	 * @param {Keystone} keystone
	 * @return {Mailer}
	 */
	mandrill: function(path, keystone) {

		return new Mailer(new MailConfiguration(path, new TemplateEngine(path)),
			keystone);

	}



};
