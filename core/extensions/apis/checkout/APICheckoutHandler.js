/**
 * APICheckoutHandler
 * @class APICheckoutHandler
 *
 * @constructor
 *
 */
module.exports = function APICheckoutHandler(store, req, res) {


	/**
	 * onGatewayNotFound
	 *
	 * @method onGatewayNotFound
	 * params
	 * @return
	 *
	 */
	this.onGatewayNotFound = function() {

		res.send(400, 'Gateway not found!');

	};


	/**
	 * onTransactionSaveFailed
	 *
	 * @method onTransactionSaveFailed
	 * @return
	 *
	 */
	this.onTransactionSaveFailed = function(err, trn) {

		console.log(err, trn);
		res.send(500);
	};

	/**
	 * onTransactionApproved
	 *
	 * @method onTransactionApproved
	 * @return
	 *
	 */
	this.onTransactionApproved = function(trn) {

		req.session.cart.length = 0;

		var url = '/checkout/success/' + trn.tid;
		res.set('x-checkout-url', url);
		res.redirect(204, url);
		store.publish(store.TRANSACTION_APPROVED, trn);
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
