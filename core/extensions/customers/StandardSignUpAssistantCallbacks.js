/**
 * StandardSignUpAssistantCallbacks for non ajax requests.
 * @alias StandardSignUpAssistantCallbacks
 * @memberOf core/extensions/customers/standard
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @constructor
 *
 */
module.exports = function StandardSignUpAssistantCallbacks(req, res, next) {

	this.onUnknownError = function(err) {
		next(err);
		console.log(err);

	};


	this.onValidationError = function(errors) {
		return res.render('customers/signup.html', {
			$errors: errors
		});
	};

	this.onCustomerRegistered = function(customer) {
		res.redirect('/signup/validate');
	};




};
