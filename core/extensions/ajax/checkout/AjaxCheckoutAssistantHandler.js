/**
 * AjaxCheckoutAssistantHandler is the CheckoutAssistantHandler for ajax requests.
 * @class AjaxCheckoutAssistantHandler
 * @param {Response} res
 * @constructor
 * @implements {CheckoutAssistantHandler}
 *
 */
module.exports = function AjaxCheckoutAssistantHandler(res) {


	this.onGatewayNotFound = function() {
		res.send(400, 'Gateway not found!');
	};

	this.onTransactionSaveFailed = function(err, trn) {
		console.log(err, trn);
		res.send(500);
	};

	this.onTransactionApproved = function(trn) {

		var url = '/checkout/success/' + trn.tid;
		res.set('x-checkout-url', url);
		res.redirect(204, url);
	};

	/**
	 * onTransactionDeclined
	 *
	 * @method onTransactionDeclined
	 * @return
	 *
	 */
	this.onTransactionDeclined = function() {
		res.send(409);
	};



};
