/**
 * @module
 */
var q = require('q');
/**
 * Mailer sends mail using mandrill (via keystone).
 * @alias name
 * @param {MailConfiguration} config
 * @param {Keystone} keystone
 * @constructor
 *
 */
module.exports = function Mailer(config, keystone) {

	/**
	 * send the email.
	 *
	 * @todo document mail object.
	 * @param {Object} mail
	 *
	 */
	this.send = function(mail) {
		config.templateName = mail.template;
		config.toEmail = mail.to;
		config.fromEmail = mail.from;
		var email = new keystone.Email(config);
		return q.ninvoke(email, 'send', mail);

	};
};
