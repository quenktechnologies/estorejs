/** @module */
var Paginator = require('../../util/Paginator');

module.exports = {

  type: 'controller',
  name: 'StoreRoutesController',
  
/**
 * StoreRoutesController
 * @param {EStore} store
 * @constructor
 *
 */
controller: function StoreRoutesController(store) {

	var render = store.getRenderCallback();

	/**
	 * routeRegistration will configure routes based on the theme.
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		var render = store.getRenderCallback();

		app.get('/search', render('search.html'));

		app.get(/^\/categories\/all(?:\/([\d]{1,9999}))?$/,
			this.onGetAllProductsRequest);

		app.get(/^\/products\/(?:\/([\d]{1,9999}))?$/,
			this.onGetAllProductsRequest);

		app.get(/^\/categories\/([\w]+(?:-[\w]+)*)$/,
			this.onShowCategoryPageRequest);

		app.get(/^\/categories\/([\w]+(?:-[\w]+)*)\/products\/([\w]+(?:-[\w]+)*)$/,
			this.onProductPageRequest);

		app.get(/^\/(products)\/([\w]+(?:-[\w]+)*)$/,
			this.onProductPageRequest);

	};

	/**
	 * onShowCategoryPageRequest
	 *
	 * @method ShowCategoryPageRequest
	 * @param {Object} req The express Request object.<F9>
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onShowCategoryPageRequest = function(req, res, next) {

		res.locals.$currentCategory = req.params[0];

		store.getDataModel('Category').
		findOne({
			name: req.params[0]
		}).
		populate('products').
		lean().
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(category) {

			if (!category)
				return next();

			res.locals.$category = category;
			render('categories/category.html')(req, res, next);


		}).end();



	};

	/**
	 * onProductPageRequest
	 *
	 * @method ProductPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onProductPageRequest = function(req, res, next) {

		store.getDataModel('Product').findOne({
			slug: req.params[1]
		}).
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(product) {

			if (!product)
				next();

			res.locals.$currentCategory = req.params[0];
			res.locals.$product = product;
			render('categories/product.html')(req, res, next);


		}).end();



	};

	/**
	 * onGetAllProductsRequest
	 *
	 * @method GetAllProductsRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetAllProductsRequest = function(req, res, next) {

		var pager = new Paginator(store.getDataModel('Product'), 30);

		pager.paginate(Number(req.params[0]) || 0).
		then(function(pager) {
			res.locals.$pagination = pager;
			res.locals.$products = pager.items;
			res.locals.$currentCategory = 'all';
			render('categories/all.html')(req, res, next);
		}).end(function(err) {
			console.log(err);
			next();
		});


	};
}
};
