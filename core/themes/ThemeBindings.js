/**
 * ThemeBindings comment
 * @class ThemeBindings
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function ThemeBindings(store) {

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

		app.get('/', render('index.html'));
		app.get('/search', render('search.html'));
		app.get('/cart', render('cart.html'));
		app.get(/^\/categories(?:\/all)?$/, render('categories.html'));
		app.get(/^\/categories\/([-\w]{1,128})$/, render('category.html'));
		app.get(/^\/products\/([-\w]{1,128})$/, render('product.html'));
		app.get(/^\/categories\/[-\w]{1,128}\/products\/([-\w]{1,128})$/, render('product.html'));
		app.get('/checkout', render('checkout/index.html'));
		app.get('/checkout/error', render('checkout/error.html'));

		app.get(/^\/checkout\/success\/([a-f\d]{24})$/, function(req, res, next) {

			//TODO
			//In future do not query using mongo _ids

			store.keystone.list('Transaction').model.findOne({
				_id: req.params[0]
			}).
			lean().
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


		});

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

};
