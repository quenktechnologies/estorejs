/**
 * CheckoutAssistantHandlerWrapper wraps around other
 * CheckoutAssistantHandlers to simplify what they must do.
 *
 * @alias CheckoutAssistantHandlerWrapper
 * @param {EStore} store
 * @param {Object} session
 * @param {CheckoutAssistantHandler} handler
 * @constructor
 * @implements {CheckoutAssistantHandler}
 *
 */
module.exports = function CheckoutAssistantHandlerWrapper(store, session, callbacks, handler) {

	this.onGatewayNotFound = function() {
		handler.onGatewayNotFound();
	};

	this.onTransactionSaveFailed = function(err) {
		handler.onTransactionSaveFailed(err);
	};

	this.onTransactionApproved = function(trn) {

		store.getDataModel('Counter').
		increment('invoices', 1).
		then(null, function(err) {
			if (err)
				return handler.onTransactionSaveFailed(err, trn);


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
				session.cart.length = 0;
				handler.onTransactionApproved(trn);
				store.broadcast(store.TRANSACTION_APPROVED, trn);


			}).
			then(null, function(err) {

				handler.onTransactionSaveFailed(err, trn);

			}).done();

		}).end();


	};

	this.onTransactionDeclined = function(trn) {

		trn.set({
			status: 'declined'
		});

		trn.save(function(err, saved) {

			if (err)
				return handler.onTransactionSaveFailed(err, saved);

			handler.onTransactionDeclined();


		});

	};



};
