var render = require('./render');
/**
 * StoreBindings comment
 * @class StoreBindings
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function StoreBindings(store) {

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
		app.get(/^\/categories(?:\/all)?$/, render('categories.html'));
		app.get(/^\/categories\/([-\w]{1,128})$/, render('category.html'));
		app.get(/^\/products\/([-\w]{1,128})$/, this.onProductPageRequest);
		app.get(/^\/categories\/[-\w]{1,128}\/products\/([-\w]{1,128})$/,
			render('product.html'));

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
			slug: req.params[0]
		}).
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(product) {

			if (!product)
				next();

			res.locals.$product = product;

			render('product.html')(req, res, next);


		}).end();



	};

};
