/**
 * PaymentSelectController
 * @class PaymentSelectController
 * @constructor
 *
 */
module.exports = function PaymentSelectController(paymentService) {

	var self = this;
	this.options = {};

	(function() {

		paymentService.getPaymentOptions().
		then(function(res) {

			self.options = res.data;

		});

	}());







};
