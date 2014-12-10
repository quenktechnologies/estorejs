var _ = require('lodash');

module.exports = {

	type: 'controller',
	name: 'SiteRoutesController',

	/**
	 * SiteRoutesController handles arbitrary site routes.
	 *
	 * @alias SiteRoutesController
	 * @param {EStore} store
	 * @param {Configuration} config
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function SiteRoutesController(store, config) {

		var render = store.getRenderCallback();

		this.routeRegistration = function(app) {

			var route;
			var routes = [];
			var theme = config.getThemeProperties();

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

			store.getDataModel('Page').
			findOne({
				isIndex: true
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

	}
};
