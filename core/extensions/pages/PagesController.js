/**
 * PagesController is the controller for the pages feature.
 * @class PagesController
 * @param {EStore} estore
 * @constructor
 *
 */
module.exports = function PagesController(store) {

	/**
	 * routeRegistration
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {
		app.get(/^\/pages\/([\w]+(?:-[\w]+)*)$/, this.onGetPageRequest);
		app.get('/', this.onGetIndexRequest);

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
	this.onGetPageRequest = function(req, res, next) {

		store.keystone.list('Page').
		model.
		findOne({
			slug: req.params[0]
		}).
		lean().
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(page) {

			if (!page)
				return next();

			res.locals.$page = page;
			res.render(page.template);

		}).end();



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
	this.onGetIndexRequest = function(req, res, next) {

		store.keystone.list('Page').
		model.
		findOne({
			index: true
		}).
		exec().
		then(null, function(err) {

			store.ebus.emit(store.SYSTEM_ERROR, err);
			next();

		}).
		then(function(page) {

			if (!page)
				return next();

			res.locals.$page = page.toObject();
			res.render('index.html');

		}).end();



	};


};
