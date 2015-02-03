var Paginator = require('../../util/Paginator');
/**
 * StoreRoutesController
 * @constructor
 * @extends {Controller}
 *
 */
function StoreRoutesController() {

		StoreRoutesController.$parent.apply(this, arguments);
	}
	/**
	 * onRouteConfiguration will configure routes based on the theme.
	 *
	 * @method onRouteConfiguration
	 * @return
	 *
	 */
StoreRoutesController.prototype.onRouteConfiguration = function(app) {


	app.get(this.$routes.standard.store.search,
		this.render('search.html'));

	app.get(this.$routes.standard.store.categories.all,
		this.onGetAllProductsRequest.bind(this));

	app.get(this.$routes.standard.store.products.all,
		this.onGetAllProductsRequest.bind(this));

	app.get(this.$routes.standard.store.categories.category,
		this.onShowCategoryPageRequest.bind(this));

	app.get(this.$routes.standard.store.categories.product,
		this.onProductPageRequest.bind(this));

	app.get(this.$routes.standard.store.products.product,
		this.onProductPageRequest.bind(this));

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
StoreRoutesController.prototype.onShowCategoryPageRequest = function(req, res, next) {

	res.locals.$currentCategory = req.params[0];

	this.$data.getDataModel('Category').
	findOne({
	slug: req.params[0]
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
		res.render('category.html');


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
StoreRoutesController.prototype.onProductPageRequest = function(req, res, next) {

	this.$data.getDataModel('Product').findOne({
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
		res.render('product.html');


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
StoreRoutesController.prototype.onGetAllProductsRequest = function(req, res, next) {

	var pager = new Paginator(this.$data.getDataModel('Product'), 30);

	pager.paginate(Number(req.params[0]) || 0).
	then(function(pager) {
		res.locals.$pagination = pager;
		res.locals.$products = pager.items;
		res.locals.$currentCategory = 'all';
		res.render('categories.html');
	}).end(function(err) {
		console.log(err);
		next();
	});


};

module.exports = {

	type: 'controller',
	name: 'StoreRoutesController',
	controller: StoreRoutesController

};
