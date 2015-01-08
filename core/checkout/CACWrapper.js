/**
 * CACWrapper wraps around other CheckoutAssistantCallbacks
 * to share functionality.
 * @alias CACWrapper
 * @param {EStore} store
 * @param {Object} session
 * @param {CheckoutAssistantHandler} callbacks,
 * @constructor
 * @implements {CheckoutAssistantHandler}
 *
 */
function CACWrapper(store, session, callbacks) {

	this.store = store;
	this.session = session;
	this.callbacks = callbacks;

}

CACWrapper.prototype.onGatewayNotFound = function() {

	this.callbacks.onGatewayNotFound();

};

CACWrapper.prototype.onTransactionSaveFailed = function(err) {
	//@todo add hooks for workflow
	this.callbacks.onTransactionSaveFailed(err);
};

CACWrapper.prototype.onTransactionApproved = function(trn) {

	var self = this;

	//@todo add hooks for workflow
	this.store.getDataModel('Counter').
	increment('invoices', 1).
	then(null, function(err) {
		if (err)
			return self.callbacks.onTransactionSaveFailed(err, trn);


	}).
	then(function(number) {

		trn.set({
			status: 'approved',
			invoice: {
				number: number.next
			}
		});

		require('q').ninvoke(trn, 'save').
		then(function(trn) {

			if (Array.isArray(trn))
				trn = trn[0];
			self.session.cart.length = 0;
			self.callbacks.onTransactionApproved(trn);
			self.store.broadcast(self.store.TRANSACTION_APPROVED, trn);


		}).
		then(null, function(err) {

			self.callbacks.onTransactionSaveFailed(err, trn);

		}).done();

	}).end();


};

CACWrapper.prototype.onTransactionDeclined = function(trn) {
	var self = this;
	//@todo add hooks for workflow
	trn.set({
		status: 'declined'
	});

	trn.save(function(err, saved) {

		if (err)
			return self.callbacks.onTransactionSaveFailed(err, saved);

		self.callbacks.onTransactionDeclined();


	});

};

CACWrapper.prototype.onRedirectNeeded = function(url) {

	this.callbacks.onRedirectNeeded(url);

};

CACWrapper.prototype.onValidationError = function(err) {

	this.callbacks.onValidationError(err);

};

module.exports = CACWrapper;
