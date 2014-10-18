/**
 * ThemeBindings comment
 * @class ThemeBindings
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function ThemeBindings(store) {

	var render = function(value) {

		return function(req, res, next) {
			res.locals.$params = req.params;
			res.render(value, function(err, html) {
				if (err) {
					console.log(err);
					return next();
				}
				return res.send(html);

			});
		};
	};



	/**
	 * routeRegistration will configure routes based on the theme.
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		//TODO: Prefer regex/string matched routes rather than pulling data via direct user input.
		var route;
		var routes = [];
		var theme = store.theme.getPackageFile().estore;
		var _ = store.util;

		app.get('/', this.onIndexPageRequest);
		app.get('/search', render('search.html'));
		app.get('/cart', render('cart.html'));
		app.get(/^\/categories(?:\/all)?$/, render('categories.html'));
		app.get(/^\/categories\/([-\w]{1,128})$/, render('category.html'));
		app.get(/^\/products\/([-\w]{1,128})$/, this.onProductPageRequest);
		app.get(/^\/categories\/[-\w]{1,128}\/products\/([-\w]{1,128})$/, render('product.html'));
		app.get('/checkout', this.onCheckoutPageRequest);
		app.get('/checkout/error', render('checkout/error.html'));
		app.get(/^\/checkout\/success\/([a-f\d]{24})$/, this.onCheckoutSuccessPageRequest);

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



	/**
	 * onCheckoutSuccessPageRequest
	 *
	 * @method CheckoutSuccessPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onCheckoutSuccessPageRequest = function(req, res, next) {

		//TODO
		//In future do not query using mongo _ids

		store.keystone.list('Transaction').model.findOne({
			_id: req.params[0]
		}).
		exec().
		then(null, function(err) {

			console.log(err) && next();

		}).
		then(function(trn) {

			if (!trn)
				return next();

			res.locals.order = trn;

			if (trn.invoice.payment.type !== 'card')
				if (store.settings.payments[trn.type])
					res.locals.content = store.settings.payments[trn.type].content;

			render('checkout/success.html')(req, res, next);

		}).end();


	};


        /**
         * onCheckoutPageRequest 
         *
         * @method CheckoutPageRequest
         * @param {Object} req The express Request object.
         * @param {Object} res The express Response object.
         * @return
         *
         */
        this.onCheckoutPageRequest = function (req, res, next) {


          if(req.session.cart.length < 1)
          return res.redirect('/cart');

render('checkout/index.html')(req, res, next);




        };
};
