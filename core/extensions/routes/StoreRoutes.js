var Paginator = require('../../util/Paginator');
var render = require('./render');
var CartAddition = require('./CartAddition');
var CartAdditionHandler = require('./CartAdditionHandler');
/**
 * StoreRoutes
 * @class StoreRoutes
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function StoreRoutes(store) {

	/**
	 * routeRegistration will configure routes based on the theme.
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.get('/search', render('search.html'));
		app.get('/cart', render('cart.html'));

		app.post(/^\/cart\/items\/([\w]+(?:-[\w]+)*)$/, this.onAddItemToCartRequest);
		app.put(/^\/cart\/items\/([\w]+(?:-[\w]+)*)$/, this.onAddItemToCartRequest);

		app.get(/^\/categories\/all(?:\/([\d]{1,9999}))?$/, this.onGetAllProductsRequest);
		app.get(/^\/products\/(?:\/([\d]{1,9999}))?$/, this.onGetAllProductsRequest);

		app.get(/^\/categories\/([\w]+(?:-[\w]+)*)$/, this.onShowCategoryPageRequest);

		app.get(/^\/categories\/([\w]+(?:-[\w]+)*)\/products\/([\w]+(?:-[\w]+)*)$/,
			this.onProductPageRequest);
		app.get(/^\/(products)\/([\w]+(?:-[\w]+)*)$/,
			this.onProductPageRequest);

	};

	/**
	 * onAddItemToCartRequest
	 *
	 * @method AddItemToCartRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onAddItemToCartRequest = function(req, res, next) {

		var item = req.body;
		var _ = require('lodash');

		item.quantity = Number(item.quantity);
		if ((!_.isNumber(item.quantity)) || (_.isNaN(item.quantity))) {
			console.log('Cannot add non number quantity to cart!');
			res.status(409);
			return next();
		}

		store.keystone.list('Product').
		model.
		findOne({
			_id: req.params[0]
		}).
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(product) {

			if (!product)
				return next();

			var addition = new CartAddition(product,
				new CartAdditionHandler(req, res, next));

			item.slug = req.params[0];
			addition.add(item);

		}).end();


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

		store.keystone.list('Category').model.
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

		store.keystone.list('Product').model.findOne({
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

		var pager = new Paginator(store.keystone.list('Product').model, 30);

		pager.paginate(Number(req.params[0]) || 0).
		then(function(pager) {
			console.log(arguments);
			res.locals.$pagination = pager;
			res.locals.$products = pager.items;
			res.locals.$currentCategory = 'all';
			render('categories/all.html')(req, res, next);
		}).end(function(err) {
			console.log(err);
			next();
		});


	};

};
