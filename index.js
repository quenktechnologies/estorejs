var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/util/Theme');
var Extras = require('./core/util/Extras');
var Endpoints = require('./core/extensions/apis/Endpoints');
var Express = require('express');
var NunjucksMongoose = require('nunjucks-mongoose');
var CompositeController = require('./core/util/CompositeController');
var Installer = require('./core/util/Installer');
var UIFactory = require('./core/util/UIFactory');
var MainEventHandler = require('./core/util/MainEventHandler');
var KeystoneProvider = require('./core/util/KeystoneProvider');

/**
 * EStore is the main entry point for EStore
 * @class EStore
 * @param {Object} nunjucks
 * @constructor
 *
 */
module.exports = function EStore() {



	this.models = {};
	this.settingFields = {};
	this.runnableSettings = [];
	this.daemons = [];
	this.keystoneConfig = new KeystoneProvider();

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
	this.CATEGORY_CREATED = 'category created';

	//Constants
	this.STATUS_SYSTEM_ERROR = 503;
	this.STATUS_CLIENT_ERROR = 409;
	this.STATUS_OPERATION_COMPLETE = 201;

	/**
	 * locals
	 *
	 * @property
	 * @type {Object}
	 */
	this.locals = {};


	/**
	 * theme
	 *
	 * @property theme
	 * @type {Theme}
	 */
	this.theme = undefined;


	/**
	 *
	 * @property {EventEmitter} bus
	 *
	 */
	this.bus = new EventEmitter();

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
	 * @type {Object}
	 */
	this.gateways = {
		available: [],
		other: [],
		active: {},
		list: []
	};

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
	 * @type {Array}
	 */
	this.extensions = [];


	/**
	 * composite
	 *
	 * @property composite
	 * @type {CompositeController}
	 */
	this.composite = new CompositeController();


	/**
	 * util methods that are commonly used.
	 *
	 * @property util
	 * @type {Object}
	 */
	this.util = require('lodash');

	/**
	 * installer
	 *
	 * @property installer
	 * @type {Installer}
	 */
	this.installer = new Installer(this);



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

		var db = require('mongojs')(this.keystoneConfig.mongoURI(), ['settings']);

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

		if (this.settings.theme)
			theme = this.settings.theme.current;

		if (!theme)
			theme = 'themes/default';

		this.theme = new Theme(require('path').dirname(
			require.main.filename), theme);

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
			'cookie secret': this.keystoneConfig.cookieSecret(),
			'view engine': 'html',
			'views': this.theme.getTemplatePath(),
			'static': this.theme.getStaticPath(),
			'emails': this.theme.getEmailPath(),
			'port': process.env.PORT || 3000,
			'mongo': this.keystoneConfig.mongoURI(),
			'custom engine': this.viewEngine.render,
			'user model': 'User'

		};

		this.keystone.init(defaults);
		this.keystone.mongoose.connection.on('error', this.mongooseError);
		this.viewEngine.addExtension('NunjucksMongoose',
			new NunjucksMongoose(this.keystone.mongoose, 'get'));
		this.keystone.connect(this.app);


	};

	/**
	 * _gatherExtensions
	 *
	 * @method _gatherExtensions
	 * @return
	 *
	 */
	this._gatherExtensions = function() {

		this.extensions.push(require('./core/extensions/payments/cod'));
		this.extensions.push(require('./core/extensions/payments/bank'));
		this.extensions.push(require('./core/extensions/payments/cheque'));
		this.extensions.push(require('./core/extensions/daemons/transaction'));

		if (this._extras.has('extensions'))
			this.extensions.push.apply(this.extensions, this._extras.get('extensions', true));

		this.extensions.forEach(function(ext) {
			if (typeof ext.settings === 'object') {
				this.installer.settings(ext.settings);

			}

		}.bind(this));




	};

	/**
	 * _registerSettingsDataModel
	 *
	 * @method _registerSettingsDataModel
	 * @return
	 *
	 */
	this._registerSettingsDataModel = function() {

		var settings = require('./core/models/settings');
		var fields = settings.model(this, this.keystone.Field.Types);

		fields.push.apply(this.settingFields);

		var list = new this.keystone.List('Settings', settings.options);

		list.add.apply(list, fields);
		settings.run(list, this);

		this.runnableSettings.forEach(function(f) {
			f(list, this.keystone.Field.Types);
		}.bind(this));

		list.register();

		this.settings = this.keystone.list('Settings').model(this.settings).toObject();

	};

	/**
	 * _processExtensions
	 *
	 * @method _processExtensions
	 * @return
	 *
	 */
	this._processExtensions = function() {

		var list = [];
		var pkg = this.theme.getPackageFile().estore;

		list.push(require('./core/models/user'));
		list.push(require('./core/models/counter'));
		list.push(require('./core/models/item'));
		list.push(require('./core/models/invoice'));
		list.push(require('./core/models/product'));
		list.push(require('./core/models/category'));
		list.push(require('./core/models/transaction'));
		list.push(require('./core/models/destinations'));
		list.push(require('./core/extensions/blog'));
		list.push(require('./core/extensions/pages'));
		list.push(require('./core/extensions/routes'));

		if (pkg.apis) {

			if (pkg.apis.checkout)
				list.push(require('./core/extensions/apis/checkout'));

			if (pkg.apis.products)
				list.push(require('./core/extensions/apis/products'));

			if (pkg.apis.cart)
				list.push(require('./core/extensions/apis/cart'));
		}

		this.extensions.unshift.apply(this.extensions, list);

		this.extensions.forEach(function(ext) {

			this.install(ext);

		}.bind(this));

	};


	/**
	 * _scanPages scans the theme package file for pages support.
	 *
	 * @method _scanPages
	 * @return
	 *
	 */
	this._scanPages = function() {

		var pkg = this.theme.getPackageFile().estore;

		var routes = pkg.pages.templates;
		this.pages = pkg.pages;
		this.pages.templates = [];

		Object.keys(routes).forEach(function(key) {

			this.pages.templates.push({
				value: routes[key],
				label: key
			});


		}.bind(this));



	};


	/**
	 * _modelRegistration registers the keystone models.
	 *
	 * @method _modelRegistration
	 * @return
	 *
	 */
	this._modelRegistration = function() {

		this.composite.modelRegistration(this.models);

		var next;
		var list;

		Object.keys(this.models).forEach(function(key) {

			next = this.models[key];
			list = new this.keystone.List(next.name, next.options || {});

			if (next.defaultColumns)
				list.defaultColumns = next.defaultColumns;

			list.add.apply(list, next.model(this, this.keystone.Field.Types,
				new UIFactory(this.keystone.Field.Types)));

			next.run && next.run(list, this, this.keystone.Field.Types);
			next.navigate && next.navigate(this.navigation);

			list.register();

			console.log('Registered List ' + next.name + '.');



		}.bind(this));

		this.navigation.settings = ['settings', 'users', 'destinations', 'counters'];
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

		var handler = new MainEventHandler(this);
		handler.handleEvents(this.bus);

	};

	/**
	 * _buildGatewayList
	 *
	 * @method _buildGatewayList
	 * @return
	 *
	 */
	this._buildGatewayList = function() {

		var self = this;

		this.gateways.list.length = 0;

		this.gateways.available.forEach(function(gw) {

			if (gw.workflow === 'card') {

				if (gw.value === self.settings.payments.card.active) {
					self.gateways.active.card = gw;
					self.gateways.list.push({
						label: 'Credit Card',
						value: 'card'
					});
				}

			} else {

				if (self.settings.payments[gw.key])
					if (self.settings.payments[gw.key].active === true) {
						self.gateways.active[gw.workflow] = gw;
						self.gateways.list.push({
							label: gw.label,
							value: gw.workflow
						});


					}



			}




		});

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
			res.locals.user = req.session.user;
			res.locals.$settings = this.settings;
			res.locals.$query = req.query;
			res.locals.$url = req.protocol + '://' + req.get('Host') + req.url;
			res.locals.$categoryList = this.locals.categories;
			res.locals.$navigation = this._navigation;
			req.session.cart = req.session.cart || [];
			res.locals.$cart = req.session.cart;
			req.session.pendingTransactions = req.session.pendingTransactions || [];

			next();

		}.bind(this));

		this.keystone.set('routes', function(app) {

			this.composite.routeRegistration(app);
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

		this.daemons.forEach(function(daemon) {

			setInterval(daemon.exec(this), daemon.interval);

		}.bind(this));

	};

	/**
	 * _fetchNavigationLinks
	 *
	 * @method _fetchNavigationLinks
	 * @return
	 *
	 */
	this._fetchNavigationLinks = function(cb) {

		this.keystone.list('Page').model.find({
			navigation: true
		}, {
			_id: false,
			slug: true,
			index: true
		}).
		exec().
		then(null, function(err) {

			console.log(err);

		}).
		then(function(links) {

			if (!links)
				links = [];

			this._navigation = links;

		}).end();


	};

	/**
	 * _fetchCategories
	 *
	 * @method _fetchCategories
	 * @return
	 *
	 */
	this._fetchCategories = function() {

		this.keystone.list('Category').model.
		find().
		lean().
		exec().
		then(function(categories) {

			this.locals.categories = categories;

		}.bind(this));

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
			this._bootstrapNunjucks();
			this._boostrapKeystone();
			this._gatherExtensions();
			this._registerSettingsDataModel();
			this._processExtensions();
			this._scanPages();
			this._modelRegistration();
			this._buildGatewayList();
			this._eventRegistration();
			this._routeRegistration();
			this._startDaemons();
			this.keystone.start();
			this._fetchNavigationLinks();
			this._fetchCategories();
		}.bind(this));

	};

	/**
	 * install an extension.
	 *
	 * @method install
	 * @param {Object} ext An object declaring an extension.
	 * @return
	 *
	 */
	this.install = function(ext) {

		this.installer.install(ext);

	};


	/**
	 * onSettingsChanged is called when the settings data has changed.
	 *
	 * @method onSettingsChanged
	 * @param {Object} settings The settings object.
	 * @return
	 *
	 */
	this.onSettingsChanged = function(settings) {
		this.settings = settings;
		this._buildGatewayList();
	};



};
