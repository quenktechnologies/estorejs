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

	//Constants
	this.STATUS_SYSTEM_ERROR = 503;
	this.STATUS_CLIENT_ERROR = 409;
	this.STATUS_OPERATION_COMPLETE = 201;

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
	this.app = undefined;

	/**
	 *
	 * @property {Keystone} keystone
	 *
	 *
	 */
	this.keystone = undefined;

	/**
	 *
	 * @property {Environment} nunjucksEnvironment
	 *
	 */
	this.nunjucksEnvironment = undefined;

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
	this.gateways = undefined;

	/**
	 * themePackage
	 *
	 * @property themePackage
	 * @type {Object}
	 */
	this.themePackage = undefined;

	/**
	 * endpoints is an object with the api endpoints for the app.
	 * TODO: In the future, this may be an external package so it can be reused onGateways
	 * the client side.
	 * @property endpoints
	 * @type {Object}
	 */
	this.endpoints = new Endpoints();

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


		this.keystone = require('keystone');
		this.ebus = new EventEmitter();
		this.app = new Express();
		this.subs = new Subscription(this.ebus);
		this.theme = new Theme(process.cwd() + '/themes', process.env.THEME || 'default');

		this.themePackage = this.theme.get('package.json');

		this.gateways = new Gateways();
		this.extras = new Extras(process.cwd() + '/extras');
		this.nunjucksEnvironment = NFactory.getEnvironment(this.theme.getTemplatePath(), this.app);
		var defaults = new DefaultKeystoneConfiguration(this.theme);
		defaults['custom engine'] = this.nunjucksEnvironment.render;

		this.keystone.init(defaults);
		this.keystone.mongoose.connection.on('error', this.mongooseError);

		this.theme.exists() || this.theme.use('default');
		this.keystone.connect(this.app);


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

		var db = require('mongojs')(this.keystone.get('mongo'), ['settings']);

		db.settings.findOne(function(err, settings) {

			if (err) throw err;

			if (!settings)
				settings = {};

			this.settings = settings;

			cb();


		}.bind(this));



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

		list.push(
			require('./core/api/products'),
			require('./core/api/cart'),
			require('./core/api/checkout'),
			require('./core/gateway/bank-deposit'),
			require('./core/gateway/2checkout-hosted')

		);

		if (this.extras.has('extensions'))
			list.push.apply(list, this.extras.get('extensions', true));

		list.push(require('./core/themes'));


		list.forEach(function(ext) {

			this.installExtension(ext);

		}.bind(this));

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
	 * _extensionRegistration registers the extensions (plugins) contained
	 * in the extras/extensions folder.
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

							system.log.info('Not registering extension: "' +
								this.extensions.names[key] + '"');

						}
				if (Ctrl) {
					this.extensions.composite.add(new Ctrl(this));
					system.log.info('Registered extension ' +
						this.extensions.names[key] + '.');
				}


			}



		}



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

		models.forEach(function(Model) {
			this.installModel(new Model(this));

		}.bind(this));

		this.extensions.composite.modelRegistration(this);
		this.navigation.settings = ['settings', 'users', 'counters'];
		this.keystone.set('nav', this.navigation);


	};

	/**
	 * _configureEvents sets up event listening.
	 *
	 * @method _configureEvents
	 * @return
	 *
	 */
	this._eventConfiguration = function() {


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
	 * _engineConfiguration configures the 3rd party engines.
	 *
	 * @method _engineConfiguration
	 * @return
	 *
	 */
	this._engineConfiguration = function() {


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

		});

		this.nunjucksEnvironment.
		addExtension('NunjucksMongoose',
			new NunjucksMongoose(this.keystone.mongoose, 'get'));



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

		this.keystone.set('routes', function(app) {

			this.extensions.composite.routeRegistration(app);

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
		system.log.info('Starting application daemons.');
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

		system.log.info('Registered List ' + model.NAME + '.');


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

		system.log.error('Uncaught mongoose error detected!', err);
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

		this._init();
		this._preloadSettings(function() {
			this._scanExtensions();
			this._coreModelRegistration();
			this._extensionRegistration();
			this._modelRegistration();
			this._eventConfiguration();
			this._gatewayRegistration();
			this._engineConfiguration();
			this._routeRegistration();
			this._startDaemons();
			this.keystone.start();
		}.bind(this));

	};


};
