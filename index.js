var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/util/Theme');
var NFactory = require('./core/util/NunjucksEnvironmentFactory')();
var DefaultKeystoneConfiguration = require('./core/util/DefaultKeystoneConfiguration');
var Express = require('express');
var System = require('./core/sys/System');
var NunjucksMongoose = require('nunjucks-mongoose');
var ModelInstaller = require('./core/models/Installer');
var RoutesInstaller = require('./core/routes/Installer');


/**
 * Estore is the main entry point for Estore
 * @class Estore
 * @param {Object} nunjucks
 * @constructor
 *
 */
module.exports = function Estore(keystone) {

	var self = {};

	/**
	 *
	 * @property {String} title The title of the app shown in ps output.
	 * TODO: We may have to do size comparison in the future, see
	 * http://nodejs.org/api/process.html#process_process_pid
	 *
	 */
	self.title = process.env.DOMAIN || 'estore-' + process.env.id;

	/**
	 *
	 * @property {EventEmitter} ebus
	 *
	 */
	self.ebus = new EventEmitter();

	/**
	 *
	 * @property {Object} events
	 *
	 */
	self.events = {
		INSTALL_ROUTES: 0xf,
		INSTALL_MODELS: 0x3e
	};

	/**
	 *
	 * @property {Application}
	 *
	 */
	self.app = Express();

	/**
	 *
	 * @property {Keystone} keystone
	 *
	 *
	 */
	self.keystone = keystone;

	/**
	 *
	 * @property {Environment} nunjucksEnvironment
	 *
	 */
	self.nunjucksEnvironment = undefined;


	/**
	 *
	 *
	 *  @property {Object} navigation Navigation settings for keystone.
	 *
	 *
	 */
	self.navigation = {
		'products': ['product_categories', 'products'],
		'sales': ['invoices'],
		'clients': 'clients',
		'pages': 'pages',
		'posts': 'posts',
		'settings': ['general_settings', 'store_settings', 'checkout_settings', 'users']

	};


	/**
	 * start will start the server
	 *
	 * @method start
	 * @param {Object} keystone
	 * @return
	 *
	 */
	self.start = function() {

		var theme = new Theme(process.cwd() + '/themes', process.env.THEME);
		var models = new ModelInstaller();
		var routes = new RoutesInstaller();

		self.nunjucksEnvironment = NFactory.getEnvironment(theme.getTemplatePath(), self.app);

		process.title = self.title;
		global.system = new System();

		var o_0 = theme.exists() || theme.use('default');

		self.keystone.connect(self.app);

		self.ebus.once(self.events.INSTALL_MODELS, models.install);
		self.ebus.once(self.events.INSTALL_ROUTES, routes.install);

		/** Temporary hack to ensure CSRF protection for Estore routes **/
		self.keystone.pre('routes', function(req, res, next) {

			if (req.originalUrl.match(/^\/keystone/))
				return next();

			Express.csrf()(req, res, next);

		});

		self.keystone.pre('routes', function(req, res, next) {

			res.locals._csrf = res.locals._csrf || req.csrfToken && req.csrfToken();
			res.cookie('XSRF-TOKEN', res.locals._csrf);
			next();

		});
		/** end hack **/


		self.nunjucksEnvironment.
		addExtension('provide',
			new NunjucksMongoose('provide', self.keystone.mongoose));

		var defaults = new DefaultKeystoneConfiguration(theme);
		defaults['custom engine'] = self.nunjucksEnvironment.render;

		self.keystone.init(defaults);

		self.ebus.emit(self.events.INSTALL_MODELS, self);

		self.keystone.set('user model', 'User');

		self.keystone.set('routes', function() {

			self.ebus.emit(self.events.INSTALL_ROUTES, self);

		});

		self.keystone.set('nav', self.navigation);

		self.keystone.start({
			//	onHttpServerCreated: scanPlugins,
			onMount: function() {
				system.log.info('Estore started on port ' + keystone.get('port'));

			}
		});


	};



	return self;



};
