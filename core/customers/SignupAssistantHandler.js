/**
 *
 * SignUpAssistantHandler provides an interface of callback
 * functions used during the signup process. The interface
 * exists to be implemented by both standard and AJAX requests.
 * @interface
 *
 */
function SignUpAssistantCallbacks() {}

/**
 *onUnknownError is called when an error we did not expect occcurs.
 * @param{Error} err
 */
SignUpAssistantCallbacks.prototype.onUnknownError = function(err) {};

/**
 *onValidationError is called when the creds supplied are invalid.
 *@param {Object} errors
 */
SignUpAssistantCallbacks.prototype.onValidationError = function(errors) {};

/**
 *
 * onCustomerRegistered is called when the customer is successfully registered.
 * @param {CustomerHash} customer
 */
SignUpAssistantCallbacks.prototype.onCustomerRegistered = function(customer) {};
