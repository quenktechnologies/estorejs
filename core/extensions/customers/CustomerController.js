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
 * @extends {Controller}
 *
 */
function CustomerController() {

	CustomerController.$parent.apply(this, arguments);
}

/**
 * onRouteConfiguration is called.
 *
 * @method onRouteConfiguration
 * @instance
 * @param {external:express} app
 * @return {undefined}
 *
 */
CustomerController.prototype.onRouteConfiguration = function(app) {

	var provider = new PassportFactory(passport);

	passport.use('local-signup', provider.getLocalSignupStrategy(
		new SignUpCallbacks(this.$store)));

	passport.use('local-signin', provider.getLocalSigninStrategy(this.$store));

	app.get(this.$routes.standard.members.signup.index,
		this.render('customers/signup.html'));

	app.get(this.$routes.standard.members.signup.validate,
		this.render('customers/validate.html'));

	app.get(this.$routes.standard.members.signup.activate,
		this.onActivateCustomerRequest.bind(this));

	app.post(this.$routes.standard.members.signup.index,
		this.onSignUpRequest.bind(this));

	app.get(this.$routes.standard.members.signin.index,
		this.render('customers/signin.html'));

	app.post(this.$routes.standard.members.signin.index,
		this.onSignInRequest.bind(this));

	app.get(this.$routes.standard.members.signout.index,
		this.onSignOutRequest.bind(this));

	app.get(this.$routes.standard.members.signin.dashboard,
		this.onGetDashboardRequest.bind(this));


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
CustomerController.prototype.onSignUpRequest = function(req, res, next) {

	var help = new SignUpAssistant(
		req.protocol + '://' +
		req.get('host'), this.$store,
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
CustomerController.prototype.onSignInRequest = function(req, res, next) {

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

		this.$store.broadcast(this.$store.CUSTOMER_SIGNED_IN, customer);


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
CustomerController.prototype.onSignOutRequest = function(req, res, next) {

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
CustomerController.prototype.onActivateCustomerRequest = function(req, res, next) {

	var Customer = this.$data.getDataModel('Customer');

	Customer.
	findOneAndUpdate({
			'tokens.validate': req.params[0],
			status: 'pending'
		}, {
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
		this.$store.broadcast(this.$store.CUSTOMER_ACTIVATED, customer);


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
CustomerController.prototype.onGetDashboardRequest = function(req, res, next) {

	if (!req.session.user)
		return res.redirect('/signin');

	res.render('customers/dashboard.html');

};

module.exports = CustomerController;
