var render = require('./render');
/**
 * SiteRoutes
 * @class SiteBindings
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function SiteBindings(store) {


	/**
	 * routeRegistration will configure routes based on the theme.
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		var route;
		var routes = [];
		var theme = store.theme.getPackageFile().estore;
		var _ = store.util;

		app.get('/', this.onIndexPageRequest);

		if (theme.serve) {

			_.forIn(theme.serve.static,
				function(value, key) {
					app.get(key, render(value));
				});

			_.forIn(theme.serve.pattern, function(file, key) {
				app.get(new RegExp(key), render(file));

			});




		}
	};


	/**
	 * onIndexPageRequest
	 *
	 * @method IndexPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onIndexPageRequest = function(req, res, next) {


		store.keystone.list('Page').model.findOne({
			index: true
		}).
		exec().
		then(null, function(err) {

			next();

		}).
		then(function(page) {

			res.locals.$page = page;
			render('index.html')(req, res, next);


		}).end();


	};

};
