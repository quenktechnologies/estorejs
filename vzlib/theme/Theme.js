/**
 * Theme represents the current theme.
 * @class Theme
 * @param {String} path The path to the theme folder.
 * @constructor
 *
 */
module.exports = function Theme(path) {

	var self = {};


	/**
	 * onRoutingReady will configure the routing the theme requires.
	 *
	 * @method onRoutingReady
	 * @param {Object} app
	 * @return
	 *
	 */
	self.onRoutingReady = function(app) {

		var theme = require(path + '/package.json').vendorlizer;

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


		/** This used to be used to setup the ajax api. We need to massage this into 
                 * the new internal apis.
		_.forIn(theme.ajax, function(value, key) {

			if (value)
				require('./' + key)(keystone).main(app);

		});**/

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



	return self;


};
