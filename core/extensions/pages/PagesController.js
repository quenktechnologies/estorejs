/**
 * PagesController provides the pages feature.
 * @alias PagesController
 * @constructor
 * @extends {Controller}
 *
 */
function PagesController() {
	PagesController.$parent.apply(this, arguments);
}

PagesController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.standard.pages.index,
		this.onGetIndexRequest.bind(this));

	app.get(this.$routes.standard.pages.page,
		this.onGetPageRequest.bind(this));

};

/**
 * onGetPageRequest
 *
 * @method GetPageRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
PagesController.prototype.onGetPageRequest = function(req, res, next) {

	this.$data.getDataModel('Page').
	findOneQStyle({
		slug: req.params[0]
	}).
	then(function(page) {

		if (!page)
			return next();

		res.locals.$page = page;
		res.render(page.template);

	}).catch(function(err) {

		console.log(err);
		next();

	}).
	done();



};


/**
 * onGetIndexRequest
 *
 * @method GetIndexRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
PagesController.prototype.onGetIndexRequest = function(req, res, next) {

	this.$data.getDataModel('Page').
	findOneQStyle({
		index: true
	}).
	then(function(page) {

		if (!page)
			return next();

		res.locals.$page = page;
		res.render('index.html');

	}).catch(null, function(err) {

		console.log(err);
		next();

	}).then();



};

module.exports = {

	type: 'controller',
	controller: PagesController
};
