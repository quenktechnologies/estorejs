/**
 * SignupCallbacks for the signup process.
 * @alias SignupCallbacks
 * @memberOf core/customers/signup
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function SignupCallbacks(store) {

	/**
	 * getValidateCredsPromise
	 *
	 * @param {String} email
	 * @param {Password} pwd
	 * @return {Promise}
	 *
	 */
	this.getValidateCredsPromise = function(email, password) {
		return store.getDataModel('Customer', true, {
			email: email,
			password: password,
		}).validateAsync();

	};

	/**
	 * getCheckEmailUniquePromiseCallback
	 * @param {Hash} creds
	 * @return {Function}
	 */
	this.getCheckEmailUniquePromiseCallback = function(creds) {

		return function() {

				return store.getDataModel('Customer').
			findOneQStyle({
				email: creds.email
			});

		};


	};

	/**
	 * getCheckEmailUniqueCallback
	 * @param {Hash} creds
	 * @param {Function} done
	 * @return {Function}
	 *
	 */
	this.getCheckEmailUniqueCallback = function(creds, done) {

		return function(customer) {

			if (customer)
				return done(null, false, {
					email: 'That email already exists!'
				});

			done(null, creds);

		};



	};

	/**
	 * getErrorCallback
	 *
	 * @param {Error|Object} errors
	 *
	 */
	this.getErrorCallback = function(done) {
		return function(errors) {
			if (errors instanceof Error)
				return done(errors);
			done(null, false, errors);
		};


	};





};
