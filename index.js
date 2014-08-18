/**
 * Vendorlize is the main entry point for Vendorlize
 * @class Vendorlize
 * @param {Object} app
 * @param {Object} nunjucks
 * @constructor
 *
 */
module.exports = function Vendorlize(app, keystone) {



	var self = {};
	var nunjucks = require('nunjucks');
	var env;
	var express = require('express');


	/**
	 * initGlobals sets the global variables used internally.
	 *
	 * @method initGlobals
	 * @return
	 *
	 */
	var init = function(cb) {

		var fs = require('fs');
		var e = process.env;

		var THEME_PATH_CURRENT = process.cwd() + '/themes/current';
		var THEME_PATH_DEFAULT = process.cwd() + '/themes/default';
		process.title = process.env.DOMAIN;

		fs.exists(THEME_PATH_CURRENT, function(yes) {

			if (yes) {
				e.THEME = 'current';
				e.THEME_PATH = THEME_PATH_CURRENT;
			} else {
				e.THEME = 'default';
				e.THEME_PATH = THEME_PATH_DEFAULT;
			}

			e.PLUGIN_DIRECTORY = e.THEME_PATH + '/plugins';

			env = new nunjucks.Environment(new nunjucks.FileSystemLoader(
				e.THEME_PATH + '/private'), {
				autoescape: true,
				tags: {
					variableStart: '<$',
					variableEnd: '$>'
				}
			});


			env.express(app);
			keystone.connect(app);
			keystone.pre('routes', function(req, res, next) {

				if (req.originalUrl.match(/^\/keystone/))
					return next();

				express.csrf()(req, res, next);

			});
			keystone.pre('routes', function(req, res, next) {
				res.locals._csrf = res.locals._csrf || req.csrfToken && req.csrfToken();

				res.cookie('XSRF-TOKEN', res.locals._csrf);
				next();
			});


			keystone.init({
				'name': process.env.DOMAIN || 'Vendorlize',
				'brand': process.env.DOMAIN || 'Vendorlize',
				'auto update': true,
				'session': true,
				'session store': 'mongo',
				'auth': true,
				'cookie secret': process.env.COOKIE_SECRET,
				'view engine': 'html',
				'views': "./themes/" + process.env.THEME + '/private',
				'custom engine': env.render,
				'static': process.env.THEME_PATH + '/public',
				'emails': process.env.THEME_PATH + '/private/email',
				'port': process.env.PORT || 3000,
				'logger': 'short',
				'mongo': process.env.MONGO_URI,
			});


			global.system = require('./core/sys/System')();
			cb();


		});

		return self;

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

		init(function() {
			var _ = require('lodash');
			var fs = require('fs');

			var CompositePlugin = require('./vzlib/plugins/CompositePlugin');
			var Theme = require('./vzlib/theme/Theme');
			var PluginScanner = require('./vzlib/express/PluginScanner');
			var nav = {
				'products': ['product_categories', 'products'],
				'sales': ['invoices'],
				'clients': 'clients',
				'pages': 'pages',
				'posts': 'posts',
				'settings': ['general_settings', 'store_settings', 'checkout_settings', 'users']

			};

			var composite = CompositePlugin();

			composite.addDir(__dirname + '/core/models');
			composite.add(Theme(process.env.THEME_PATH));

			env.addExtension('provide', require('nunjucks-mongoose')('provide', keystone.mongoose));
			composite.addDir(__dirname + '/core/api', keystone);

			composite.onNunjucksReady(env);
			composite.onKeyStoneReady(keystone);

			keystone.set('user model', 'User');
			keystone.set('routes', composite.onRoutingReady);

			var scanPlugins = function() {
				PluginScanner().
				scan(__dirname + '/core/routes').
				scan(process.env.PLUGIN_DIRECTORY).
				getPlugins().
				forEach(function(plugin) {
					app.use(plugin({
						nav: nav,
						keystone: keystone,
						env: env,
						app: app,
						render: function(path) {

							return function(req, res, next) {
								res.render(path);
							};

						},
						next: function(_, __, next) {
							next();
						}
					}));

				});
				keystone.set('nav', nav);

			};

			keystone.start({
				onHttpServerCreated: scanPlugins,
				onMount: function() {
					system.log.info('Vendorlize started on port ' + keystone.get('port'));

				}
			});


		});

	};



	return self;



};
