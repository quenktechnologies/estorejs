var _ = require('lodash');

/**
 * SiteRoutesController handles arbitrary site routes.
 *
 * @alias SiteRoutesController
 * @constructor
 * @extends {Controller}
 *
 */
function SiteRoutesController() {
	SiteRoutesController.$parent.apply(this, arguments);
}

SiteRoutesController.prototype.onRouteConfiguration = function(app) {

	var route;
	var routes = [];
	var theme = this.$config.getThemeProperties();

	app.get(this.$routes.standard.site.index,
		this.onIndexPageRequest.bind(this));

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
SiteRoutesController.prototype.onIndexPageRequest = function(req, res, next) {


	this.$data.getDataModel('Page').
	findOne({
		isIndex: true
	}).
	exec().
	then(null, function(err) {

		next();

	}).
	then(function(page) {

		res.locals.$page = page;
		res.render('index.html');


	}).end();


};

module.exports = {

	type: 'controller',
	name: 'SiteRoutesController',
	controller: SiteRoutesController

};
