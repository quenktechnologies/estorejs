var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/sys/Theme');
var Extras = require('./core/util/Extras');
var Endpoints = require('./core/extensions/ajax/Endpoints');
var Express = require('express');
var NunjucksMongoose = require('nunjucks-mongoose');
var CompositeController = require('./core/util/CompositeController');
var Installer = require('./core/util/Installer');
var UIFactory = require('./core/util/UIFactory');
var MainEventHandler = require('./core/util/MainEventHandler');
var KeystoneProvider = require('./core/util/KeystoneProvider');
var Gateways = require('./core/checkout/Gateways');
var DynamicFileSystemLoader = require('./core/loader/DynamicFileSystemLoader');
var Directory = require('./core/sys/Directory');
var ModelCompiler = require('./core/models/ModelCompiler');
var ModelCompilerSyntax = require('./core/models/ModelCompilerSyntax');
var Mediator = require('./core/sys/Mediator');

/**
 * EStore is the main constructor for the system.
 *
 * The object from this constructor is currently passed around everywhere
 * and maybe abused in various places.
 *
 * @todo
 * 1 Turn the object into a factory class to avoid leaking abstraction.
 * 2 Pass more work to smaller enscapulated object.
 *
 * @constructor
 * @alias EStore
 *
 */
module.exports = function EStore() {

	var modelCompiler = new ModelCompiler(new ModelCompilerSyntax());

	this.models = [];
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
	this.CUSTOMER_CREATED = 'customer created';
	this.CUSTOMER_ACTIVATED = 'customer activated';
	this.CUSTOMER_SIGNED_IN = 'customer signed in';
	this.QUERY_ERROR = 'query error';
	this.NOTIFICATION = 'notify';
	this.OUTBOUND_MAIL = 'OUTBOUND_MAIL';
	this.ENQUIRY = 'ENQUIRY';
	this.SERVER_STARTED = 'SERVER_STARTED';


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
	this.gateways = new Gateways();
	/**
	 * engines
	 *
	 * @property engines
	 * @type
	 */
	this.engines = {};


	/**
	 * endpoints is an object with the api endpoints for the app.
	 * TODO: In the future, this may be an external package so it can be reused onGateways
	 * the client side.
	 * @property endpoints
	 * @type {Object}
	 */
	this.endpoints = new Endpoints();

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
	this.installer = new Installer(this, modelCompiler);

	this.validators = [];

	this.mediator = new Mediator(this);



	/**
	 * _preloadThemes
	 *
	 * @method _preloadThemes
	 * @return
	 *
	 */
	this._preloadThemes = function() {

		var themes = new Directory(__dirname + '/themes');
		this._templates = [];

		themes.forEachDirectory(function(path, file) {

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
	this._preloadSettings = function() {

		var db = require('promised-mongo')(this.keystoneConfig.mongoURI(), ['settings']);
		var self = this;

		return db.settings.findOne().
		then(function(settings) {

			if (!settings)
				settings = {};

			self.settings = settings;

		});

	};

	/**
	 * _bootstrapTheme
	 *
	 * @method _bootstrapTheme
	 * @return
	 *
	 */
	this._bootstrapTheme = function() {

		var path;

		if (this.settings.theme)
			path = this.settings.theme.current;

		if (!path)
			path = process.env.DEFAULT_THEME || 'themes/default';

		this.theme = new Theme(__dirname + '/' + path);

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
		this.loader = new DynamicFileSystemLoader(this.theme);
		this.viewEngine = new nunjucks.Environment(
			this.loader, {
				autoescape: true,
				tags: {
					variableStart: '<$',
					variableEnd: '$>'
				}
			});

		this.viewEngine.addFilter('subtotal', require('./core/filters/subtotal'));
		this.viewEngine.addFilter('delivery', require('./core/filters/delivery'));
		this.viewEngine.addFilter('total', require('./core/filters/total'));
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

		this.keystone.init();
		this.keystone.set('name', process.env.DOMAIN || 'Estore');
		this.keystone.set('brand', process.env.DOMAIN || 'Estore');
		this.keystone.set('auto update', true);
		this.keystone.set('session', true);
		this.keystone.set('session store', 'mongo');
		this.keystone.set('auth', true);
		this.keystone.set('cookie secret', this.keystoneConfig.cookieSecret());
		this.keystone.set('view engine', 'html');
		//	this.keystone.set('views', this.theme.templates());
		this.keystone.set('static', this.theme.statics());
		this.keystone.set('emails', this.theme.emails());
		this.keystone.set('port', process.env.PORT || 3000);
		this.keystone.set('mongo', this.keystoneConfig.mongoURI());
		//		this.keystone.set('custom engine', this.viewEngine.render);
		this.keystone.set('user model', 'User');

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
		this.extensions.push(require('./core/extensions/engines/image'));
		this.extensions.push(require('./core/extensions/models/user'));
		this.extensions.push(require('./core/extensions/models/counter'));
		this.extensions.push(require('./core/extensions/models/item'));
		this.extensions.push(require('./core/extensions/models/invoice'));
		this.extensions.push(require('./core/extensions/models/product'));
		this.extensions.push(require('./core/extensions/models/category'));
		this.extensions.push(require('./core/extensions/models/transaction'));
		this.extensions.push(require('./core/extensions/models/country'));

		if (process.env.MANDRILL_API_KEY)
			this.extensions.push(require('./core/extensions/services/mandrill'));

		var extras = new Directory(__dirname + '/extras/extensions');
		extras.forEachDirectory(function(path) {

			this.extensions.push(require(path));

		}.bind(this));

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

		var settings = require('./core/extensions/models/settings');
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
		var pkg = this.theme.require('package.json').estore;

		if (pkg.supports.blog)
			list.push(require('./core/extensions/blog'));

		if (pkg.supports.pages)
			list.push(require('./core/extensions/pages'));

		if (pkg.supports.contact)
			list.push(require('./core/extensions/contact'));

		list.push(require('./core/extensions/routes'));

		if (pkg.ajax) {

			if (pkg.ajax.checkout)
				list.push(require('./core/extensions/ajax/checkout'));

			if (pkg.ajax.products)
				list.push(require('./core/extensions/ajax/products'));

			if (pkg.ajax.cart)
				list.push(require('./core/extensions/ajax/cart'));
		}

		if (pkg.supports)
			if (pkg.supports.customers)
				list.push(require('./core/extensions/customers'));

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

		var pages = this.theme.require('package.json').estore.supports.pages;

		if (!pages)
			return;

		this.pages = {
			templates: []
		};

		Object.keys(pages.templates).forEach(function(key) {

			this.pages.templates.push({
				value: pages.templates[key],
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
		modelCompiler.compile(this);
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
			res.locals.$user = req.session.user;
			res.locals.$customer = req.session.customer;
			res.locals.$settings = this.settings;
			res.locals.$query = req.query;
			res.locals.$domain = req.get('host');
			res.locals.$url = req.protocol + '://' + req.get('Host') + req.url;
			res.locals.$categories = this.locals.categories;
			res.locals.$navigation = this._navigation;
			req.session.cart = req.session.cart || [];
			res.locals.$cart = req.session.cart;
			res.locals.$currency = this.settings.currency;
			req.session.pendingTransactions = req.session.pendingTransactions || [];
			next();

		}.bind(this));

		this.keystone.set('routes', function(app) {

			this.composite.routeRegistration(app);

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
		populate('children').
		exec().
		then(function(categories) {
			this.locals.categories = categories;
		}.bind(this));

	};

	/**
	 * start estore
	 * @method start
	 * @return
	 *
	 */
	this.start = function(cb) {

		var self = this;
		self._preloadThemes();

		return self._preloadSettings().
		then(function() {
			self._bootstrapTheme();
			self._bootstrapNunjucks();
			self._boostrapKeystone();
			self._gatherExtensions();
			self._registerSettingsDataModel();
			self._processExtensions();
			self._scanPages();
			self._modelRegistration();
			self._buildGatewayList();
			self._eventRegistration();
			self._routeRegistration();
			self._startDaemons();
			self.keystone.start(function() {

				self._fetchCategories();
				self.broadcast(self.SERVER_STARTED, self);
				if (cb) cb();

			});

		}).done(function(err) {
			if (err) throw err;
		});

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
	 * addEventListener puts a callback on the internal
	 * event bus.
	 *
	 * @method addEventListener
	 * @param {String} event
	 * @param {Function} cb
	 * @return
	 *
	 */
	this.addEventListener = function(event, cb) {

		this.bus.on(event, cb);
		return this;

	};

	/**
	 * broadcast an event on the internal bus.
	 *
	 * TODO: Stop using bus.emit and use this instead.
	 * @method broadcast
	 * @return
	 *
	 */
	this.broadcast = function() {
		console.log('DEBUG: Event ', arguments[0]);
		this.bus.emit.apply(this.bus, arguments);
	};

	/**
	 * getKeystone returns the keystonejs singleton.
	 *
	 * @method getKeystone
	 * @instance
	 * @deprecated
	 * @return {external:Keystone}
	 *
	 */
	this.getKeystone = function() {
		console.log('Estore.getKeystone is deprecated');
		return this.keystone;
	};


	/**
	 * getDataModel is a factory method for getting a model from keystone.
	 *
	 * @method getDataModel
	 * @param {String} name
	 * @param {Boolean} create
	 * @param {Object} args
	 * @return {Function}
	 *
	 */
	this.getDataModel = function(name, create, args) {

		if (!create)
			return this.keystone.list(name).model;

		var Model = this.getDataModel(name);
		return new Model(args);

	};

	/**
	 * getGateways returns the list of gateways in a helpful wrapper.
	 *
	 * @method getGateways
	 * @return
	 *
	 */
	this.getGateways = function() {

		return this.gateways;
	};

	/**
	 * getRenderCallback provides a handy callback for rendering templates.
	 *
	 * @method getRenderCallback
	 * @instance
	 * @return {Function}
	 *
	 */
	this.getRenderCallback = function() {

		return require('./core/util/render');

	};


	/**
	 * getViewEngine returns the installed view engine.
	 *
	 * @method getViewEngine
	 * @instance
	 * @return {Object}
	 *
	 */
	this.getViewEngine = function() {

		return this.viewEngine;

	};


};
