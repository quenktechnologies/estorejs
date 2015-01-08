/**
 * CheckoutAssistantCallbacks is an interface for reacting to the various states
 * a checkout maybe in.
 *
 * @alias CheckoutAssistantCallbacks
 * @interface
 *
 */
function CheckoutAssistantCallbacks() {}

/**
 * onGatewayNotFound is called when the user supplies an invalid
 * gateway.
 */
CheckoutAssistantCallbacks.prototype.onGatewayNotFound = function() {};

/**
 * onTransactionSaveFailed is called when we fail to save a transaction.
 *
 * @param {Error} err
 *
 */
CheckoutAssistantCallbacks.prototype.onTransactionSaveFailed = function(err) {};

/**
 * onTransactionApproved is called when we get approval for a transaction.
 *
 * Approval maybe automatic or come from some 3rd party payment service.
 * @method onTransactionApproved
 * @param {Transaction} trn
 */
CheckoutAssistantCallbacks.prototype.onTransactionApproved = function(trn) {};


/**
 * onTransactionDeclined is the opposite of onTransactionApproved
 *
 * @param {Transaction} trn
 *
 */
CheckoutAssistantCallbacks.prototype.onTransactionDeclined = function(trn) {};

/**
 *
 * onRedirectNeeded is called when the checkout needs to be redirected.
 * For example: hosted checkouts.
 *
 * @param {String} url 
 *
 */
CheckoutAssistantCallbacks.prototype.onRedirectNeeded = function(url) {};
