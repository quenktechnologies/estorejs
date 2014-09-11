/**
 * Context of a transaction during checkout.
 * @class Context
 * @param {Transaction} transaction
 * @param {TransactionMediator} mediator
 * @param {Request} request
* @param {Response} response
 * @constructor
 *
 */
module.exports = function Context(transaction, mediator, request, response) {

	/**
	 * transaction
	 *
	 * @property transaction
	 * @type
	 */
	this.transaction = transaction;

	/**
	 * mediator
	 *
	 * @property mediator
	 * @type
	 */
	this.mediator = mediator;

	/**
	 * response
	 *
	 * @property response
	 * @type
	 */
	this.response = response;

      /**
       * request 
       *
       * @property request
       * @type 
       */
      this.request = request;









};
