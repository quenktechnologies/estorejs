/**
 * CheckoutHandlerWrapper wraps around other CheckoutHandlers to simplify what they must do.
 * @class CheckoutHandlerWrapper
 * @param {CheckoutHandler} handler
 * @constructor
 *
 */
module.exports = function CheckoutHandlerWrapper(store, handler) {

	/**
	 * onGatewayNotFound
	 *
	 * @method onGatewayNotFound
	 * @return
	 *
	 */
	this.onGatewayNotFound = function() {

		handler.onGatewayNotFound();

	};

	/**
	 * onTransactionSaveFailed
	 *
	 * @method onTransactionSaveFailed
	 * @return
	 *
	 */
	this.onTransactionSaveFailed = function(err) {

		handler.onTransactionSaveFailed(err);

	};

	/**
	 * onTransactionApproved
	 *
	 * @method onTransactionApproved
	 * @param {Transaction} trn
	 * @return
	 *
	 */
	this.onTransactionApproved = function(trn) {

		store.getDataModel('Counter', true).
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

				handler.onTransactionApproved(trn);

			}).
			then(null, function(err) {

				handler.onTransactionSaveFailed(err, trn);

			}).done();

		}).end();


	};


	/**
	 * onTransactionDeclined
	 *
	 * @method onTransactionDeclined
	 * @param {Transaction} trn
	 * @return
	 *
	 */
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
