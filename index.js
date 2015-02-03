var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var ThemeProperties = require('./core/boot/ThemeProperties');
var Extras = require('./core/util/Extras');
var Endpoints = require('./core/extensions/ajax/Endpoints');
var NunjucksMongoose = require('nunjucks-mongoose');
var UIFactory = require('./core/util/UIFactory');
var MainEventHandler = require('./core/util/MainEventHandler');
var DynamicFileSystemLoader = require('./core/loader/DynamicFileSystemLoader');
var Directory = require('./core/boot/Directory');
var ModelCompiler = require('./core/models/ModelCompiler');
var ModelCompilerSyntax = require('./core/models/ModelCompilerSyntax');
var FieldFactory = require('./core/models/FieldFactory.js');
var AppModel = require('./core/mvc/AppModel');
var ThemeSelection = require('./core/boot/ThemeSelection');
var ThemePreLoader = require('./core/boot/ThemePreLoader');
var SettingsPreLoader = require('./core/boot/SettingsPreLoader');
var Configuration = require('./core/boot/Configuration.js');
var Environment = require('./core/boot/Environment');
var InstallerFactory = require('./core/boot/installers/Factory');
var SocketRegistry = require('./core/server/SocketRegistry');
var Routes = require('./core/util/Routes');
var ControllerCollection = require('./core/mvc/ControllerCollection');
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

	var config = new Configuration(process.env);
	var modelCompiler = new ModelCompiler(new ModelCompilerSyntax());
	var controllers = new ControllerCollection();

	//@todo stop direct access
	this.engines = {};

	var bus = new EventEmitter();
	var extensions = [];

	this.settingFields = {};
	this.runnableSettings = [];
	this.validators = {};

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
	this.THEME_CHANGED = 'THEME_CHANGED';
	this.STOPPING = 'stopping';



	//Constants
	this.STATUS_SYSTEM_ERROR = 503;
	this.STATUS_CLIENT_ERROR = 409;
	this.STATUS_OPERATION_COMPLETE = 201;

	this.locals = {};
	this.settings = {};
	this.keystone = require('keystone');
	this.viewEngine = undefined;
	this.endpoints = new Endpoints();
	this.mediator = new AppModel(this, controllers, config);
	this.sockets = new SocketRegistry();

	/**
	 * _preloadThemes
	 *
	 * Gather a list of available themes, remove any
	 * that are blacklisted (if implemented).
	 *
	 * @method _preloadThemes
	 * @return
	 *
	 */
	this._preloadThemes = function() {

		var selection = new ThemeSelection();
		var loader = new ThemePreLoader(selection);
		loader.load(__dirname + '/themes');
		this._templates = selection.getSelection();

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

		var loader =
			new SettingsPreLoader(Environment.getMongoURI(),
				this.mediator);

		this._preloadThemes();

		return loader.load();
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
			path = config.get('DEFAULT_THEME', 'themes/default');

		config.setThemeProperties(
			new ThemeProperties(__dirname + '/' + path));

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
		this.loader = new DynamicFileSystemLoader(config.getThemeProperties());
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

		this.viewEngine.addFilter('capitalise', require('./core/filters/capitalise'));

		this.keystone.init();
		this.viewEngine.express(this.keystone.app);


	};


	/**
	 * _boostrapKeystone
	 *
	 * @method _boostrapKeystone
	 * @return
	 *
	 */
	this._boostrapKeystone = function() {

		var theme = config.getThemeProperties();

		this.keystone.set('name', config.get('BRAND', 'EstoreJS'));
		this.keystone.set('brand', config.get('BRAND', 'EstoreJS'));
		this.keystone.set('auto update', true);
		this.keystone.set('session', true);
		this.keystone.set('session store', 'mongo');
		this.keystone.set('auth', true);
		this.keystone.set('cookie secret', Environment.getCookieSecret());
		this.keystone.set('view engine', 'html');
		this.keystone.set('static', theme.statics());
		this.keystone.set('emails', theme.emails());
		this.keystone.set('port', config.get('PORT', 3000));
		this.keystone.set('mongo', Environment.getMongoURI());
		this.keystone.set('user model', 'User');

		this.viewEngine.addExtension('NunjucksMongoose',
			new NunjucksMongoose(this.keystone.mongoose, 'get'));


		var fields = new FieldFactory(config);
		var types = this.keystone.Field.Types;
		this.keystone.Field.Types.Image = fields.getSingleImage(types);
		this.keystone.Field.Types.Images = fields.getMultiImage(types);

	};

	/**
	 * _scanPages scans the theme package file for pages support.
	 *
	 * @method _scanPages
	 * @return
	 *
	 */
	this._scanPages = function() {

		var pages = config.getThemeProperties().
		getProperties().
		supports.pages;

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
	 * _gatherExtensions
	 *
	 * @method _gatherExtensions
	 * @return
	 *
	 */
	this._gatherExtensions = function() {

		var pkg = config.
		getThemeProperties().
		getProperties();

		extensions.push(require('./core/extensions/routes'));
		extensions.push(require('./core/extensions/payments/2checkout/hosted'));
		extensions.push(require('./core/extensions/payments/cod'));
		extensions.push(require('./core/extensions/payments/bank'));
		extensions.push(require('./core/extensions/payments/cheque'));
		extensions.push(require('./core/extensions/daemons/transaction'));
		extensions.push(require('./core/extensions/models/settings'));
		extensions.push(require('./core/extensions/models/user'));
		extensions.push(require('./core/extensions/models/counter'));
		extensions.push(require('./core/extensions/models/item'));
		extensions.push(require('./core/extensions/models/invoice'));
		extensions.push(require('./core/extensions/models/product'));
		extensions.push(require('./core/extensions/models/category'));
		extensions.push(require('./core/extensions/models/transaction'));
		extensions.push(require('./core/extensions/models/country'));
		extensions.push(require('./core/extensions/models/navigation.js'));
		extensions.push(require('./core/extensions/models/gallery.js'));

		if (config.get('MANDRILL_API_KEY'))
			extensions.push(require('./core/extensions/services/mandrill'));

		if (pkg.supports.blog)
			extensions.push(require('./core/extensions/blog'));

		if (pkg.supports.pages)
			extensions.push(require('./core/extensions/pages'));

		if (pkg.supports.contact)
			extensions.push(require('./core/extensions/contact'));


		if (pkg.ajax) {

			if (pkg.ajax.checkout)
				extensions.push(require('./core/extensions/ajax/checkout'));

			if (pkg.ajax.products)
				extensions.push(require('./core/extensions/ajax/products'));

			if (pkg.ajax.cart)
				extensions.push(require('./core/extensions/ajax/cart'));
		}

		if (pkg.supports)
			if (pkg.supports.customers)
				extensions.push(require('./core/extensions/customers'));

		var extras = new Directory(__dirname + '/extras/extensions');
		extras.forEachDirectory(function(path) {

			extensions.push(require(path));

		}.bind(this));



	};


	/**
	 * _processExtensions
	 *
	 * @method _processExtensions
	 * @return
	 *
	 */
	this._processExtensions = function() {

		var installer = InstallerFactory.
		create({
			store: this,
			data: this,
			config: config,
			modelCompiler: modelCompiler,
			gateways: this.gateways,
			engines: this.engines,
			model: this.mediator,
			controllers: controllers,
			factories: {},
			routes: Routes

		});

		extensions.forEach(function(ext) {
			installer.install(ext);
		});

		modelCompiler.compile(this);

		this.settings = this.
		keystone.
		list('Settings').
		model(this.settings).
		toObject();

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
	 * _routeRegistration registers the routes.
	 *
	 * @method _routeRegistration
	 * @return
	 *
	 */
	this._routeRegistration = function() {

		var self = this;
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
			res.locals._csrf = self.keystone.security.TOKEN_KEY;
			res.locals.$csrf = res.locals._csrf;

			next();

		}.bind(this));

		this.keystone.set('routes',
			controllers.onRouteConfiguration.bind(controllers));

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
			self._scanPages();
			self._gatherExtensions();
			self._processExtensions();
			self._eventRegistration();
			self._routeRegistration();
			self.keystone.start(function() {
				self.keystone.httpServer.
				on('connection',
					self.sockets.addConnection.bind(self.sockets));

				self._fetchCategories();
				self.broadcast(self.SERVER_STARTED, self);
				if (cb) cb(null, self);

			});

		}).done(null, function(err) {
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

		extensions.push(ext);

	};

	/**
	 * addEventListener puts a callback on the internal
	 * event bus.
	 *
	 * @method addEventListener
	 * @param {String} event
	 * @param {Function} cb
	 * @param {Boolean} once
	 * @return
	 *
	 */
	this.addEventListener = function(event, cb, once) {

		if (once)
			bus.once(event, cb);

		if (!once)
			bus.on(event, cb);

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
		bus.emit.apply(bus, arguments);
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
	 * stop the app
	 *
	 * @param {Function} cb
	 *
	 */
	this.stop = function(cb) {

		var self = this;
		self.broadcast(this.STOPPING);
		self.keystone.httpServer.close(function() {
			self.keystone.mongoose.disconnect(function() {
				if (cb)
					cb();
				//			process.exit();
			});

		});
	};


	/**
	 * shutDown the system.
	 *
	 * Closes the http server and any existing connections,
	 * it then proceeds to issue the disconnect command to mongoose.
	 * @param {Function} cb
	 *
	 */
	this.shutDown = function(cb) {

		var self = this;
		self.broadcast(self.STOPPING);
		self.keystone.httpServer.close(function() {
			self.sockets.flush();
			self.keystone.mongoose.disconnect(cb);
		});




	};





};
