/**
 * CashPayment for cash on delivery checkouts.
 * @class CashPayment
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function CashPayment(store) {


	/**
	 * checkout
	 *
	 * @method checkout
	 *
	 * @return
	 *
	 */
	this.checkout = function(order, res) {

                if(order.payment.type === 'cod')
		store.ebus.emit(store.events.TRANSACTION_APPROVED, order, res);

	};





};
