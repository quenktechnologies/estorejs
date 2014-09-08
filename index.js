var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/util/Theme');
var Extras = require('./core/util/Extras');
var NFactory = require('./core/util/NunjucksEnvironmentFactory')();
var DefaultKeystoneConfiguration = require('./core/util/DefaultKeystoneConfiguration');
var Express = require('express');
var System = require('./core/sys/System');
var NunjucksMongoose = require('nunjucks-mongoose');
var Subscription = require('./core/util/Subscription');
var fs = require('fs');
var CompositeExtension = require('./core/util/CompositeExtension');
var o_O; //a nonsense variable (think /dev/null). 


/**
 * Estore is the main entry point for Estore
 * @class Estore
 * @param {Object} nunjucks
 * @constructor
 *
 */
module.exports = function Estore(keystone) {


	/**
	 *
	 * @property {String} title The title of the app shown in ps output.
	 * TODO: We may have to do size comparison in the future, see
	 * http://nodejs.org/api/process.html#process_process_pid
	 *
	 */
	this.title = undefined;

	/**
	 *
	 * @property {EventEmitter} ebus
	 *
	 */
	this.ebus = undefined;

	/**
	 *
	 * @property {Object} events
	 *
	 */
	this.events = {
		ROUTE_REGISTRATION: 0xf,
		model_REGISTRATION: 0x3e,
		CHECKOUT_REQUEST: 0x14,
		TRANSACTION_APPROVED: 0x01,
	};

	/**
	 *
	 * @property {Application}
	 *
	 */
	this.app = undefined;

	/**
	 *
	 * @property {Keystone} keystone
	 *
	 *
	 */
	this.keystone = keystone;

	/**
	 *
	 * @property {Environment} nunjucksEnvironment
	 *
	 */
	this.nunjucksEnvironment = undefined;


	/**
	 *
	 * @property {Array} models
	 */
	this.models = [];

	/**
	 *
	 *
	 *  @property {Object} navigation Navigation settings for keystone.
	 *
	 *
	 */
	this.navigation = {};

	/**
	 * gateways is an array containing the gateway modules that are enabled.
	 *
	 * @property gateways
	 * @type {Array}
	 */
	this.gateways = [];

	/**
	 * themePackage
	 *
	 * @property themePackage
	 * @type {Object}
	 */
	this.themePackage = undefined;

	/**
	 * subs are the event subscriptions currently active.
	 * @property subs
	 * @type {Subscription}
	 *
	 */
	this.subs = undefined;

	/**
	 * extras represents the contents of the extras folder.
	 *
	 * @property extras
	 * @type {Extras}
	 *
	 */
	this.extras = undefined;

	/**
	 * extensions
	 *
	 * @property extensions
	 * @type {Array}
	 */
	this.extensions = undefined;

	/**
	 * blacklist
	 *
	 * @property blacklist
	 * @type {Array}
	 */
	this.blacklist = [];

	/**
	 * _init initializes the application.
	 *
	 * @method _init
	 * @return
	 *
	 */
	this._init = function() {

		this.title = process.env.DOMAIN || 'estore-' + process.env.id;
		process.title = this.title;
		global.system = new System();

		this.ebus = new EventEmitter();
		this.app = new Express();
		this.subs = new Subscription(this.ebus);
		this.theme = new Theme(process.cwd() + '/themes', process.env.THEME || 'default');

		this.themePackage = this.theme.get('package.json');
		if (this.themePackage.estore.blacklist)
			this.blacklist.push.apply(this.blacklist, this.themePackage.estore.blacklist);

		this.extras = new Extras(process.cwd() + '/extras');
		this.Extension = require('./core/util/Extension');
		this.extensions = new CompositeExtension(this);
		this.nunjucksEnvironment = NFactory.getEnvironment(this.theme.getTemplatePath(), this.app);

		if (this.extras.has('extensions'))
			this.extras.get('extensions', true).forEach(
				function(Ext) {
					this.extensions.add(new Ext(this));
				}.bind(this));

		this.blacklist.push.apply(this.blacklist, this.extensions.blacklist);

		o_O = this.theme.exists() || this.theme.use('default');
		this.keystone.connect(this.app);

	};

	/**
	 * _gatewayRegistration will register the enabled payment gateway(s).
	 *
	 * @method _gatewayRegistration
	 * @return
	 *
	 */
	this._gatewayRegistration = function() {




	};

	/**
	 * _modelRegistration registers the keystone models.
	 *
	 * @method _modelRegistration
	 * @return
	 *
	 */
	this._modelRegistration = function() {


		this.models.push.apply(this.models, [
			require('./core/models/User'),
			require('./core/models/Counter'),
			require('./core/models/CheckoutSettings'),
			require('./core/models/GeneralSettings'),
			require('./core/models/StoreSettings'),
			require('./core/models/ProductCategory'),
			require('./core/models/Product'),
			require('./core/models/Item'),
			require('./core/models/Invoice'),
			require('./core/models/Transaction'),
			require('./core/models/Address'),
		]);


		if (this.theme.has('pages'))
			this.models.push(require('./core/models/Page'));

		if (this.extras.has('models'))
			this.models.push.apply(this.models, this.extras.get('models', true));

		this.models.forEach(function(Model) {

			this.onModelFound(new Model(this));

		}.bind(this));

		this.extensions.onModels(this);
		this.ebus.emit(this.events.MODEL_REGISTRATION, this);
		this.keystone.set('user model', 'User');
		this.keystone.set('nav', this.navigation);

	};


	/**
	 * _engineConfiguration configures the 3rd party engines.
	 *
	 * @method _engineConfiguration
	 * @return
	 *
	 */
	this._engineConfiguration = function() {

		/** Temporary hack to ensure CSRF protection for Estore routes **/
		this.keystone.pre('routes', function(req, res, next) {

			if (req.originalUrl.match(/^\/keystone/))
				return next();

			Express.csrf()(req, res, function(err) {
				//This prevents 403 errors from being thrown after the csrf middleware.
				if (err) return res.send(403);
				next();




			});

		});

		this.keystone.pre('routes', function(req, res, next) {

			res.locals._csrf = res.locals._csrf || req.csrfToken && req.csrfToken();
			res.cookie('XSRF-TOKEN', res.locals._csrf);
			next();

		});
		/** end hack **/



		var defaults = new DefaultKeystoneConfiguration(this.theme);
		defaults['custom engine'] = this.nunjucksEnvironment.render;

		this.keystone.init(defaults);

		this.nunjucksEnvironment.
		addExtension('provide',
			new NunjucksMongoose('provide', this.keystone.mongoose));



	};

	/**
	 * _routeRegistration registers the routes.
	 *
	 * @method _routeRegistration
	 * @return
	 *
	 */
	this._routeRegistration = function() {

		this.keystone.set('routes', function(app) {

			var route;
			var routes = [
				require('./core/api/cart'),
				require('./core/api/checkout'),
				require('./core/api/products'),
				require('./core/api/payments')
			];

			if (this.extras.has('routes'))
				routes.push.apply(routes, this.get('routes', true));
			//XXX in future routes will be grouped in a logical way
			//so that they can be disabled by group or individually.
			if (this.blacklist.indexOf('api') < 0) {

				routes.forEach(function(Route) {
					route = new Route(this);
					route.main(app);
				}.bind(this));

				this.extensions.onRouting(app);
			} else {

				system.log.warn('Disabling api!');

			}

			var theme = this.themePackage.estore;

			var _ = require('lodash');

			var render = function(value) {

				return function(req, res) {
					res.locals._csrf = req.csrfToken();
					res.locals.BRAND = process.env.BRAND;
					res.locals.user = req.session.user;
					res.locals.cart = req.session.cart;
					res.locals.params = req.params;
					res.locals.DOMAIN = process.env.DOMAIN;
					res.locals.CART_COUNT = _.unique(req.session.cart).length;
					res.render(value);
				};

			};

			if (theme.serve) {

				_.forIn(theme.serve.static,
					function(value, key) {

						if ('index' == key)
							return app.get('/', render(value));
						app.get(key, render(value));

					});

				_.forIn(theme.serve.pattern, function(file, key) {
					app.get(new RegExp(key), render(file));

				});



			}
			this.ebus.emit(this.events.ROUTE_REGISTRATION, app);

		}.bind(this));

	};

	/**
	 * start will start the server
	 *
	 * @method start
	 * @param {Object} keystone
	 * @return
	 *
	 */
	this.start = function() {

		this._init();
		this._gatewayRegistration();
		this._engineConfiguration();
		this._modelRegistration();
		this._routeRegistration();
		this.keystone.start({
			onMount: function() {
				system.log.info('Estore started on port ' + this.keystone.get('port'));
			}.bind(this)
		});


	};

	/**
	 * onModelFound sets up model registration with keystone.
	 *
	 * A model should be an object like the following:
	 *  { NAME: 'MyModel', COLLECTION: 'models', fields: []}
	 *
	 * @method onModelFound
	 * @param {Model} model
	 * @return
	 *
	 */
	this.onModelFound = function(model) {

		if (this.blacklist.indexOf(model.NAME) > -1)
			return system.log.warn('Model ' + model.NAME + ' has been disabled!');
		var options = model.options || {};
		var list = new this.keystone.List(model.NAME, options);

		if (model.DEFAULT_COLUMNS)
			list.defaultColumns = model.DEFAULT_COLUMNS;


		list.add.apply(list, model.fields);

		var O_o = model.run && model.run(list, this.keystone);
		O_o = model.navigate && model.navigate(this.navigation);

		list.register();

		system.log.info('Registered List ' + model.NAME + '.');


	};




};
