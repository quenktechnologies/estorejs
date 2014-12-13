/**
 * StandardCheckoutAssistantHandler is the checkout handler for pull style checkouts.
 * @class StandardCheckoutAssistantHandler
 *
 * @constructor
 *
 */
module.exports = function StandardCheckoutAssistantHandler(res, next) {

	this.onGatewayNotFound = function() {
          next();
	};

	this.onTransactionSaveFailed = function(err, trn) {
		console.log(err,trn);
                next();
	};

	this.onTransactionApproved = function(trn) {

		var url = '/checkout/success/' + trn.tid;
		res.redirect(url);
	};

	/**
	 * onTransactionDeclined
	 *
	 * @method onTransactionDeclined
	 * @return
	 *
	 */
	this.onTransactionDeclined = function() {
          res.redirect('/checkout/declined');
	};


        this.onValidationError = function(err) {

          var errors = err.errors || err;
res.locals.$errors = errors;
res.render('checkout/index.html');
        };


};
