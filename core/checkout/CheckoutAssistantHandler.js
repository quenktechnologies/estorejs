/**
 * CheckoutAssistantHandler is an interface for reacting to the various states
 * a checkout maybe in.
 *
 * @alias CheckoutAssistantHandler
 * @interface
 *
 */
function CheckoutAssistantHandler() {}

/**
 * onGatewayNotFound is called when the user supplies an invalid
 * gateway.
 */
CheckoutAssistantHandler.prototype.onGatewayNotFound = function() {};

/**
 * onTransactionSaveFailed is called when we fail to save a transaction.
 *
 * @param {Error} err
 *
 */
CheckoutAssistantHandler.prototype.onTransactionSaveFailed = function(err) {};

/**
 * onTransactionApproved is called when we get approval for a transaction.
 *
 * Approval maybe automatic or come from some 3rd party payment service.
 * @method onTransactionApproved
 * @param {Transaction} trn
 */
CheckoutAssistantHandler.prototype.onTransactionApproved = function(trn) {};


/**
 * onTransactionDeclined is the opposite of onTransactionApproved
 *
 * @param {Transaction} trn
 *
 */
CheckoutAssistantHandler.prototype.onTransactionDeclined = function(trn) {};
