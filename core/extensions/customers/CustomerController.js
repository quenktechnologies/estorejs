var passport = require('passport');
var PassportFactory = require('../../customers/PassportFactory');
var SignUpCallbacks = require('../../customers/signup/SignUpCallbacks');
var SignUpAssistant = require('../../customers/signup/SignUpAssistant');
var StandardSignUpAssistantCallbacks = require('./StandardSignUpAssistantCallbacks');

/**
 * CustomerController is the controller for the customer account feature.
 *
 * @alias CustomerController
 * @constructor
 * @param {EStore} store
 *
 */
module.exports = function CustomerController(store) {

	/**
	 * routeRegistration is called.
	 *
	 * @method routeRegistration
	 * @instance
	 * @param {external:express} app
	 * @return {undefined}
	 *
	 */
	this.routeRegistration = function(app) {

		var provider = new PassportFactory(passport);
		var render = store.getRenderCallback();

		passport.use('local-signup', provider.getLocalSignupStrategy(
			new SignUpCallbacks(store)));

		passport.use('local-signin', provider.getLocalSigninStrategy(store));

		//Actual routes
		app.get('/signup', render('customers/signup.html'));
		app.get('/signup/validate', render('customers/validate.html'));
		app.get(/^\/signup\/activate\/(\w+)/, this.onActivateCustomerRequest);
		app.post('/signup', this.onSignUpRequest);

		app.get('/signin', render('customers/signin.html'));
		app.post('/signin', this.onSignInRequest);

		app.get('/signout', this.onSignOutRequest);

		app.get('/dashboard', this.onGetDashboardRequest);


	};


	/**
	 * onSignupRequest handles user signups.
	 *
	 * @method onSignupRequest
	 * @instance
	 * @param {Request} req
	 * @param {Response} res
	 * @param {Function} next
	 */
	this.onSignUpRequest = function(req, res, next) {

		var help = new SignUpAssistant(
			req.protocol + '://' +
			req.get('host'), store,
			new StandardSignUpAssistantCallbacks(req, res, next));

		res.locals.$submit = req.body;

		(passport.authenticate('local-signup', {
				session: false,
			},
			help.onValidationFinished))(req, res, next);

	};

	/**
	 * onSignInRequest logs the customer in.
	 *
	 * @method onSignInRequest
	 * @instance
	 * @param {external:Request} req
	 * @param {external:Response} res
	 * @param {Function} next
	 * @return undefined
	 *
	 */
	this.onSignInRequest = function(req, res, next) {

		passport.authenticate('local-signin', {
			session: false
		}, function(err, customer, msg) {

			if (err)
				return next(err);

			if (!customer)
				return res.render('customers/signin.html', {
					message: msg
				});

			if (customer.status === 'pending')
				return res.redirect('/signup/validate');

			if (customer.status === 'inactive')
				return res.redirect('/signin/inactive');

			if (customer.status === 'disabled')
				return res.redirect('/signin/disabled');

			req.session.customer = customer;
			res.redirect('/dashboard');

			store.broadcast(store.CUSTOMER_SIGNED_IN, customer);


		})(req, res, next);



	};

	/**
	 * onSignOutRequest logs out the customer.
	 *
	 * @method SignOutRequest
	 * @instance
	 * @param {external:Request} req
	 * @param {external:Response} res
	 * @param {Function} next
	 */
	this.onSignOutRequest = function(req, res, next) {

		req.session.user = undefined;
		res.redirect('/signin');


	};

	/**
	 * onActivateCustomerRequest activates a customer account.
	 *
	 * @method onActivateCustomerRequest
	 * @instance
	 * @param {external:Request} req
	 * @param {external:Response} res
	 * @param {Function} next
	 */
	this.onActivateCustomerRequest = function(req, res, next) {

		var Customer = store.getDataModel('Customer');

		Customer.
		findOneAndUpdate({
			'tokens.validate': req.params[0],
                        status: 'pending'
		},
               {
				$set: {
					status: 'active',
                  'tokens.validate': null
				}
			} 
                
                ).
		exec().
		then(function(customer) {

                  			console.log(arguments);
			if (!customer)
				return next();

		req.session.user = customer;
                req.session.customer = req.session.user;
			res.redirect('/dashboard');
			store.broadcast(store.CUSTOMER_ACTIVATED, customer);


		}).
		end(function(err) {

			console.log(err);
			next(err);

		});

	};



	/**
	 * onGetDashboardRequest displays the customers' dashboard.
	 *
	 * @method GetDashboardRequest
	 * @instance
	 * @param {external:Request} req
	 * @param {external:Response} res
	 */
	this.onGetDashboardRequest = function(req, res, next) {

		if (!req.session.user)
			return res.redirect('/signin');

		res.render('customers/dashboard.html');

	};











};
