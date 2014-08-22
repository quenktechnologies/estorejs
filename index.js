var EventEmitter = require('events').EventEmitter;
var Theme = require('./core/util/Theme');
var NFactory = require('./core/util/NunjucksEnvironmentFactory')();
var DefaultKeystoneConfiguration = require('./core/util/DefaultKeystoneConfiguration');
var Express = require('express');
var System = require('./core/sys/System');
var NunjucksMongoose = require('nunjucks-mongoose');
var Subscription = require('./core/util/Subscription');


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
		ROUTE_REGISTRATION: 0xf,
		MEMBER_REGISTRATION: 0x3e
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
		//	'clients': 'clients',
		//	'pages': 'pages',
		//	'posts': 'posts',
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

		self.theme = new Theme(process.cwd() + '/themes', process.env.THEME || 'default');
		var subs = new Subscription(this.ebus);
		self.nunjucksEnvironment = NFactory.getEnvironment(self.theme.getTemplatePath(), self.app);

		process.title = self.title;
		global.system = new System();

		var o_O = self.theme.exists() || self.theme.use('default');

		self.keystone.connect(self.app);

		subs.once(self.events.MEMBER_REGISTRATION, 'memberRegistration', self);
		subs.once(self.events.ROUTE_REGISTRATION, 'routeRegistration', self);

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



		var defaults = new DefaultKeystoneConfiguration(self.theme);
		defaults['custom engine'] = self.nunjucksEnvironment.render;

		self.keystone.init(defaults);

		self.nunjucksEnvironment.
		addExtension('provide',
			new NunjucksMongoose('provide', self.keystone.mongoose));

		self.ebus.emit(self.events.MEMBER_REGISTRATION, self);

		self.keystone.set('routes', function(app) {

			self.ebus.emit(self.events.ROUTE_REGISTRATION, app);

		});


		self.keystone.start({
			//	onHttpServerCreated: scanPlugins,
			onMount: function() {
				system.log.info('Estore started on port ' + keystone.get('port'));

			}
		});


	};

	/**
	 * memberRegistration registers the core members for Estore.
	 *
	 * @method memberRegistration
	 * @return
	 *
	 */
	self.memberRegistration = function() {

		var members = [
			require('./core/models/User'),
			require('./core/models/Counter'),
			require('./core/models/CheckoutSettings'),
			require('./core/models/GeneralSettings'),
			require('./core/models/StoreSettings'),
			require('./core/models/ProductCategory'),
			require('./core/models/Product'),
			require('./core/models/Invoice'),
			require('./core/models/Transaction'),
		];

		if (self.theme.has('/pages'))
			members.push(require('./core/models/Page'));

		members.forEach(function(Member) {

			self.onMemberFound(new Member(self));

		});

		self.keystone.set('user model', 'User');
		self.keystone.set('nav', self.navigation);


	};

	/**
	 * routeRegistration
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	self.routeRegistration = function(app) {

		var route;
		var routes = [
			require('./core/api/cart'),
			require('./core/api/checkout'),
			require('./core/api/products'),
		];

		routes.forEach(function(Route) {
			route = new Route(self);
			route.main(app);
		});

		var theme = self.theme.get('package.json').estore;

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

	};



	/**
	 * onMemberFound sets up model registration with keystone.
	 *
	 * A member should be an object like the following:
	 *  { NAME: 'MyModel', COLLECTION: 'models', fields: []}
	 *
	 * @method onMemberFound
	 * @param {Member} member
	 * @return
	 *
	 */
	self.onMemberFound = function(member) {

		var options = member.options || {};
		var list = new self.keystone.List(member.NAME, options);

		if (member.DEFAULT_COLUMNS)
			list.defaultColumns = member.DEFAULT_COLUMNS;

		list.add.apply(list, member.fields);

		var O_o = member.run && member.run(list, self.keystone);

		list.register();

		system.log.info('Registered List ' + member.NAME + '.');


	};

	return self;



};
