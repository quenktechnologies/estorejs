/** @module */

var CheckoutAssistant = require('../../checkout/CheckoutAssistant');
var CheckoutHandlerWrapper = require('../../checkout/CheckoutAssistantHandlerWrapper');
var StandardCheckoutHandler = require('./StandardCheckoutAssistantHandler');

module.exports = {

	type: 'controller',
	name: 'CheckoutRoutesController',

	/**
	 * CheckoutRoutesController
	 * @alias CheckoutRoutesController
	 * @param {EStore} store
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function CheckoutRoutesController(store) {

          var render = store.getRenderCallback();

		/**
		 * routeRegistration
		 * @method routeRegistration
		 * @return
		 *
		 */
		this.routeRegistration = function(app) {

			var render = store.getRenderCallback();

			app.get('/checkout', this.onCheckoutPageRequest);

			app.get('/checkout/error', render('checkout/error.html'));

			app.get(/^\/checkout\/success\/([a-f\d-]{36})$/,
				this.onCheckoutSuccessPageRequest);

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

			store.keystone.list('Transaction').model.findOne({
				tid: req.params[0]
			}).
			exec().
			then(null, function(err) {

				console.log(err) && next();

			}).
			then(function(trn) {

				if (!trn)
					return next();

				res.locals.$order = trn;

				if (trn.invoice.payment.type !== 'card')
					if (store.settings.payments[trn.invoice.payment.type])
						res.locals.$page = store.settings.payments[trn.invoice.payment.type];

				res.locals.$page = res.locals.$page || {};
				res.locals.$page.title = 'Order #' + trn.invoice.number;
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
		this.onCheckoutPageRequest = function(req, res, next) {

			if (req.session.cart.length < 1)
				return res.redirect('/cart');

			render('checkout/index.html')(req, res, next);
		};

		/**
		 * onCheckoutTransactionRequest
		 *
		 * @method CheckoutTransactionRequest
		 * @param {Object} req The express Request object.
		 * @param {Object} res The express Response object.
		 * @return
		 *
		 */
		this.onCheckoutTransactionRequest = function(req, res, next) {

			var checkout = new CheckoutAssistant(store,
				new CheckoutHandlerWrapper(store, req.session,
					new StandardCheckoutHandler(res)));

			if (!checkout.hasItems(req.session.cart))
				return res.redirect('/cart');

			checkout.checkout(req.session.cart, req.body);

		};
	}
};
