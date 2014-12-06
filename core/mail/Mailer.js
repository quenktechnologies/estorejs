/**
 * @module
 */

/**
 * MandrillMailer sends mail using mandrill (via keystone).
 * @alias name
 * @param {MailConfiguration} config
 * @param {Keystone} keystone 
 * @constructor
 *
 */
module.exports = function MandrillMailer(config, keystone) {

	/**
	 * send the email.
	 *
	 * @todo document mail object.
	 * @param {Object} mail
	 *
	 */
	this.send = function(mail) {
		config.templateName = mail.template;
		var email = new keystone.Email(conifg);
		return q.ninvoke(email, 'send', mail);

	};
};
