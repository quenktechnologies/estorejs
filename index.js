var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/util/Theme');
var Extras = require('./core/util/Extras');
var NFactory = require('./core/util/NunjucksEnvironmentFactory')();
var DefaultKeystoneConfiguration = require('./core/util/DefaultKeystoneConfiguration');
var Endpoints = require('./core/api/Endpoints');
var Express = require('express');
var System = require('./core/sys/System');
var NunjucksMongoose = require('nunjucks-mongoose');
var Subscription = require('./core/util/Subscription');
var Extension = require('./core/util/Extension');
var CompositeExtension = require('./core/util/CompositeExtension');
var Gateways = require('./core/gateway/Gateways');
var TransactionDaemon = require('./core/daemon/TransactionDaemon');
var Extension = require('./core/util/Extension');

/**
 * EStore is the main entry point for EStore
 * @class EStore
 * @param {Object} nunjucks
 * @constructor
 *
 */
module.exports = function EStore() {

	//Settings
	this.MAX_TRANSACTIONS_PROCESSED = 10;
	this.TRANSACTION_DAEMON_INTERVAL = 10000;
	this.INVOICE_DAEMON_INTERVAL = 5000;

	//Events
	this.ROUTE_REGISTRATION = 'Route Registration';
	this.SETTINGS_CHANGED = 'Settings Changed';
	this.TRANSACTION_APPROVED = 'TRANSACTION_APPROVED';
	this.TRANSACTION_DECLINED = 'TRANSACTION_DECLINED';
	this.SYSTEM_ERROR = 'runtime error';

	//Constants
	this.STATUS_SYSTEM_ERROR = 503;
	this.STATUS_CLIENT_ERROR = 409;
	this.STATUS_OPERATION_COMPLETE = 201;

	/**
	 * theme
	 *
	 * @property theme
	 * @type {Theme}
	 */
	this.theme = undefined;


	/**
	 *
	 * @property {EventEmitter} ebus
	 *
	 */
	this.ebus = new EventEmitter();

	/**
	 * settings contains the settings
	 *
	 * @property config
	 * @type {Object}
	 */
	this.settings = {};

	/**
	 *
	 * @property {Application}
	 *
	 */
	this.app = new Express();

	/**
	 *
	 * @property {Keystone} keystone
	 *
	 *
	 */
	this.keystone = require('keystone');

	/**
	 *
	 * @property {Environment} viewEngine
	 *
	 */
	this.viewEngine = undefined;

	/**
	 *
	 *
	 *  @property {Object} navigation Navigation settings for keystone.
	 *
	 *
	 */
	this.navigation = {};

	/**
	 * gateways is an object containing the gateway modules that are enabled.
	 *
	 * @property gateways
	 * @type {Gateways}
	 */
	this.gateways = new Gateways();

	/**
	 * endpoints is an object with the api endpoints for the app.
	 * TODO: In the future, this may be an external package so it can be reused onGateways
	 * the client side.
	 * @property endpoints
	 * @type {Object}
	 */
	this.endpoints = new Endpoints();

	/**
	 * _extras represents the contents of the _extras folder.
	 *
	 * @property Extras
	 * @type {Extras}
	 *
	 */
	this._extras = new Extras('extras');

	/**
	 * extensions
	 *
	 * @property extensions
	 * @type {Object}
	 */
	this.extensions = {
		names: {},
		controllers: {},
		settings: {},
		composite: new CompositeExtension(this)
	};


	/**
	 * util methods that are commonly used.
	 *
	 * @property util
	 * @type {Object}
	 */
	this.util = require('lodash');


	/**
	 * _preloadThemes
	 *
	 * @method _preloadThemes
	 * @return
	 *
	 */
	this._preloadThemes = function() {

		var fs = require('fs');
		this._templates = [];

		fs.readdirSync('themes').forEach(function(file) {

			if (fs.statSync('themes/' + file).isDirectory())
				this._templates.push({
					value: 'themes/' + file,
					label: file
				});

		}.bind(this));


	};

	/**
	 * _preloadSettings
	 *
	 * @method _preloadSettings
	 * @param {Function} cb
	 * @return  {Promise}
	 *
	 */
	this._preloadSettings = function(cb) {

		var db = require('mongojs')(process.env.MONGO_URI, ['settings']);

		db.settings.findOne(function(err, settings) {

			if (err) throw err;

			if (!settings)
				settings = {};

			this.settings = settings;

			cb();


		}.bind(this));



	};

	/**
	 * _bootstrapTheme
	 *
	 * @method _bootstrapTheme
	 * @return
	 *
	 */
	this._bootstrapTheme = function() {

		var theme;

		if (this.settings.system)
			if (this.settings.system.theme)
				theme = this.settings.system.theme;

		this.theme = new Theme(require('path').dirname(
				require.main.filename) + '/themes',
			theme || 'default');

	};


	/**
	 * _scanExtensions loops over all extensions and collects them.
	 *
	 * @method _scanExtensions
	 * @return
	 *
	 */
	this._scanExtensions = function() {

		var list = [];
		var pkg = this.theme.getPackageFile().estore;

		list.push(
			require('./core/api/products'),
			require('./core/api/cart'),
			require('./core/api/checkout'),
			require('./core/gateway/bank-deposit'),
			require('./core/gateway/2checkout-hosted')

		);

		if (pkg.blog)
			if (pkg.blog.enabled === 'true') {

				this.blog = pkg.blog;
				list.push(require('./core/blog'));
			}

		if (pkg.pages)
			if (pkg.pages.enabled === 'true') {

				var routes = pkg.pages.routes;
				this.pages = pkg.pages;
				this.pages.routes = [];

				Object.keys(routes).forEach(function(key) {

					this.pages.routes.push({
						value: routes[key],
						label: key
					});


				}.bind(this));
				list.push(require('./core/pages'));
			}


		if (this._extras.has('extensions'))
			list.push.apply(list, this._extras.get('extensions', true));

		list.push(require('./core/themes'));


		list.forEach(function(ext) {

			this.installExtension(ext);

		}.bind(this));

	};

	/**
	 * _extensionRegistration registers the extensions (plugins) contained
	 * in the _extras/extensions folder.
	 *
	 * @method _extensionRegistration
	 * @return
	 *
	 */
	this._extensionRegistration = function() {

		var base = new Extension();
		var Ctrl;

		for (var key in this.extensions.controllers) {

			if (this.extensions.controllers.hasOwnProperty(key)) {

				Ctrl = this.extensions.controllers[key];
				Ctrl.prototype = base;

				if (this.settings.extensions.hasOwnProperty(key))
					if (this.settings.extensions[key].hasOwnProperty('enabled'))
						if (this.settings.extensions[key].enabled !== true) {

							Ctrl = null;

							console.log('Not registering extension: "' +
								this.extensions.names[key] + '"');

						}
				if (Ctrl) {
					this.extensions.composite.add(new Ctrl(this));
					console.log('Registered extension ' +
						this.extensions.names[key] + '.');
				}


			}



		}



	};


	/**
	 * _bootstrapNunjucks
	 *
	 * @method _bootstrapNunjucks
	 * @return
	 *
	 */
	this._bootstrapNunjucks = function() {

		var nunjucks = require('nunjucks');

		this.viewEngine = new nunjucks.Environment(
			new nunjucks.FileSystemLoader(this.theme.getTemplatePath()), {
				autoescape: true,
				tags: {
					variableStart: '<$',
					variableEnd: '$>'
				}
			});

		this.viewEngine.express(this.app);


	};


	/**
	 * _boostrapKeystone
	 *
	 * @method _boostrapKeystone
	 * @return
	 *
	 */
	this._boostrapKeystone = function() {

		this.theme.exists() || this.theme.use('default');

		var defaults = {

			'name': process.env.DOMAIN || 'Estore',
			'brand': process.env.DOMAIN || 'Estore',
			'auto update': true,
			'session': true,
			'session store': 'mongo',
			'auth': true,
			'cookie secret': process.env.COOKIE_SECRET,
			'view engine': 'html',
			'views': this.theme.getTemplatePath(),
			'static': this.theme.getStaticPath(),
			'emails': this.theme.getEmailPath(),
			'port': process.env.PORT || 3000,
			'mongo': process.env.MONGO_URI,
			'custom engine': this.viewEngine.render

		};

		this.keystone.init(defaults);
		this.keystone.mongoose.connection.on('error', this.mongooseError);
		this.keystone.connect(this.app);


	};

	/**
	 * _coreModelRegistration
	 *
	 * @method _coreModelRegistration
	 * @return
	 *
	 */
	this._coreModelRegistration = function() {

		var Settings = require('./core/models/Settings');
		var User = require('./core/models/User');
		var settings = new Settings(this);
		var user = new User(this);

		settings.fields.push({
			extensions: this.extensions.settings
		});

		this.installModel(settings);
		this.installModel(user);
		this.settings = this.keystone.list('Settings').model(this.settings).toObject();
		this.keystone.set('user model', 'User');


	};

	/**
	 * _scanPages scans the theme package file for pages support.
	 *
	 * @method _scanPages
	 * @return
	 *
	 */
	this._scanPages = function() {


	};


	/**
	 * _modelRegistration registers the keystone models.
	 *
	 * @method _modelRegistration
	 * @return
	 *
	 */
	this._modelRegistration = function() {

		var models = [];

		models.push.apply(models, [
			require('./core/models/Counter'),
			require('./core/models/ProductCategory'),
			require('./core/models/Product'),
			require('./core/models/Item'),
			require('./core/models/Invoice'),
			require('./core/models/Transaction'),
			require('./core/models/Address'),
		]);

		this.extensions.composite.modelRegistration(models);

		models.forEach(function(Model) {
			this.installModel(new Model(this));

		}.bind(this));

		this.navigation.settings = ['settings', 'users', 'counters'];
		this.keystone.set('nav', this.navigation);


	};


	/**
	 * _eventRegistration
	 *
	 * @method _eventRegistration
	 * @return
	 *
	 */
	this._eventRegistration = function() {

		this.ebus.on(this.SYSTEM_ERROR, function(err) {

			console.log(err);

		});



	};



	/**
	 * _gatewayRegistration will register any  payment gateway extensions.
	 *
	 * @method _gatewayRegistration
	 * @return
	 *
	 */
	this._gatewayRegistration = function() {

		this.extensions.composite.gatewayRegistration(this.gateways);

	};

	/**
	 * _routeRegistration registers the routes.
	 *
	 * @method _routeRegistration
	 * @return
	 *
	 */
	this._routeRegistration = function() {

		var self = this;

		/** Temporary hack to ensure CSRF protection for EStore routes **/
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

		this.keystone.pre('routes', function(req, res, next) {

			//Set some useful variables.
			res.locals.BRAND = process.env.BRAND;
			res.locals.user = req.session.user;
			res.locals.$settings = this.settings;
			res.locals.$query = req.query;
			res.locals.DOMAIN = process.env.DOMAIN;
			req.session.cart = req.session.cart || [];
			res.locals.cart = req.session.cart;
			res.locals.CART_COUNT = req.session.cart.length;
			req.session.pendingTransactions = req.session.pendingTransactions || [];

			next();

		}.bind(this));




		this.keystone.set('routes', function(app) {

			this.extensions.composite.routeRegistration(app);

			this._extras.get('apps', true).
			forEach(function(config) {
				if (typeof config === 'object')
					return app.use(config.mount, config.controller);
				app.use(config);

			}.bind(this));

		}.bind(this));

	};

	/**
	 * _startDaemons starts the daemons.
	 *
	 * @method _startDaemons
	 * @return
	 *
	 */
	this._startDaemons = function() {
		console.log('Starting application daemons.');
		new TransactionDaemon(this);


	};




	/**
	 * installModel sets up model registration with keystone.
	 *
	 * A model should be an object like the following:
	 *  { NAME: 'MyModel', COLLECTION: 'models', fields: []}
	 *
	 * @method installModel
	 * @param {Model} model
	 * @return
	 *
	 */
	this.installModel = function(model) {

		var options = model.options || {};
		var list = new this.keystone.List(model.NAME, options);
		if (model.DEFAULT_COLUMNS)
			list.defaultColumns = model.DEFAULT_COLUMNS;

		list.add.apply(list, model.fields);

		model.run && model.run(list, this.keystone);
		model.navigate && model.navigate(this.navigation);

		list.register();

		console.log('Registered List ' + model.NAME + '.');


	};


	/**
	 * mongooseError is called when uncaught errors are detected.
	 *
	 * @method mongooseError
	 *  @param {Error} err
	 * @return
	 *
	 */
	this.mongooseError = function(err) {

		console.log('Uncaught mongoose error detected!', err);
		process.exit(-1);

	};

	/**
	 * installExtension installs an extension.
	 *
	 * @param {Object} ext
	 * @return {EStore}
	 *
	 */
	this.installExtension = function(ext) {

		var settings = {};
		if (ext.optional) {

			settings.enabled = {
				type: Boolean,
				label: ext.name,
				default: ext.
				default
			};

			if (ext.settings) {
				ext.settings(settings, this.keystone.Field.Types);
			}

			this.extensions.settings[ext.key] = settings;


		}


		this.extensions.controllers[ext.key] = ext.controller;
		this.extensions.names[ext.key] = ext.name;

		return this;




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

		this._preloadThemes();
		this._preloadSettings(function() {
			this._bootstrapTheme();
			this._scanExtensions();
			this._extensionRegistration();
			this._bootstrapNunjucks();
			this._boostrapKeystone();
			this._coreModelRegistration();
			this._scanPages();
			this._modelRegistration();
			this._gatewayRegistration();
			this._eventRegistration();
			this._routeRegistration();
			this._startDaemons();
			this.keystone.start();
		}.bind(this));

	};


};
