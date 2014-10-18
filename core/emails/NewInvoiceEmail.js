/**
 * NewInvoiceEmail is used to send an email when a new invoice is generated.
 * @class NewInvoiceEmail
 *
 * @constructor
 *
 */
module.exports = function NewInvoiceEmail(invoice) {

	var self = {};

	/**
	 * send the email.
	 *
	 * @method send
	 * @return
	 *
	 */
	self.send = function() {

		var nunjucks = require('nunjucks');
		var keystone = require('keystone');

		var bcc = (process.env.INVOICE_BCC_LIST) ?
			process.env.INVOICE_BCC_LIST.split('.') : process.env.WEBMASTER;

		require('./Email')('invoice', keystone, nunjucks).
		send({
			to: [invoice.customer.email],
			bcc: bcc,
			from: {
				name: ' Vendorlizer on ' + process.env.DOMAIN,
				email: 'noreply@' + process.env.DOMAIN
			},
			subject: 'Your order from ' + process.env.DOMAIN,
			invoice: invoice,
		}, function(err) {

			if (err) console.log(err);
		});

	};

	return self;


};
