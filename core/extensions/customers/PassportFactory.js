/**
 * @module
 */

var LocalStrategy = require('passport-local').Strategy;

/**
 * PassportFactory is a factory object for setting up passport authentication.
 * @alias PassportFactory
 * @param {external:passport} passport
 * @constructor
 *
 */
module.exports = function PassportFactory(passport) {

	/**
	 * getLocalSignupStrategy provides a callback for signing users up.
	 *
	 * @method getLocalSignupStrategy
	 * @instance
	 * @param {EStore} store
	 * @return {external:Strategy}
	 *
	 */
	this.getLocalSignupStrategy = function(store) {

		var opts = {
			usernameField: 'email',
			passwordField: 'password',
		};

		var stop;

		return new LocalStrategy(opts,

			function(email, password, done) {

				store.getDataModel('Customer').
				findOneQStyle({
					email: email
				}).
				then(null, function(err) {
					done(err);
				}).
				then(function(customer) {

					if (customer) {
						done(null, false, {
							email: 'That email already exists!'
						});
						return false;
					} else {

						return store.getDataModel('Customer', true, {
							email: email,
							password: password,
						}).
						validateAsync();
					}

				}).
				then(null, function(errors) {
					done(null, false, errors);
					return false;
				}).
				then(function(unique) {

                                  if(unique === false)
                                  return unique;


					return store.getDataModel('Customer', true, {
						email: email,
						password: password,
					}).saveQStyle();

				}).
				then(null, function(err) {

					done(err);


				}).
				then(function(customer) {

                                  if(customer === false)
                                  return customer;

					done(null, customer);

				}).done();

			});
	};

	/**
	 * getLocalSigninStrategy provides a method for authenticating users.
	 *
	 * @method getLocalSigninStrategy
	 * @instance
	 * @param {EStore} store
	 * @return undefined
	 *
	 */
	this.getLocalSigninStrategy = function(store) {

		return new LocalStrategy({
				usernameField: 'email',
				passwordField: 'password',
			},
			function(email, password, done) {

				store.getDataModel('Customer').findOne({
					email: email
				}).
				exec().
				then(function(customer) {

					if (!customer)
						return done(null, false, 'Invalid username or password');

					customer._.password.compare(password, function(err, result) {

						if (err)
							return done(err, null);

						if (!result)
							return done(null, false, 'Invalid username or password.');

						return done(null, customer);

					});

				}).
				end(function(err) {

					if (err) {
						console.log(err);
						done(err, null);
					}

				});
			});



	};

	/**
	 * getLocalActivateStrategy does the activation of a user account.
	 *
	 * @method getLocalActivateStrategy
	 * @instance
	 * @param {EStore} store
	 *
	 */
	this.getLocalActivateStrategy = function(store) {



	};








};
