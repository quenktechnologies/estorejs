var Checkout = require('../../checkout/Checkout');

/**
 * CheckoutRoutesController
 * @alias CheckoutRoutesController
 * @extends {Controller}
 *
 */
function CheckoutRoutesController() {

	CheckoutRoutesController.$parent.apply(this, arguments);

}

/**
 * onRouteConfiguration
 * @method onRouteConfiguration
 * @return
 *
 */
CheckoutRoutesController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.standard.checkout.index,
		this.onCheckoutPageRequest.bind(this));

	app.get(this.$routes.standard.checkout.error,
		this.render('checkout/error.html'));

	app.get(this.$routes.standard.checkout.success,
		this.onCheckoutSuccessPageRequest.bind(this));

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
CheckoutRoutesController.prototype.onCheckoutSuccessPageRequest = function(req, res, next) {

	var self = this;

	self.$data.getDataModel('Transaction').findOne({
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
			if (self.$config.getPreference('payments')[trn.invoice.payment.type])
				res.locals.$page = self.$config.getPreference('payments')[trn.invoice.payment.type];

		res.locals.$page = res.locals.$page || {};
		res.locals.$page.title = 'Order #' + trn.invoice.number;
		res.render('checkout/success.html');

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
CheckoutRoutesController.prototype.onCheckoutPageRequest = function(req, res, next) {

	if (req.session.cart.length < 1)
		return res.redirect('/cart');

	res.render('checkout/index.html');
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
CheckoutRoutesController.prototype.onCheckoutTransactionRequest = function(req, res, next) {

	var checkout = Checkout.
	createStandardAssistant(this.$data, req, res, next, this.$model);
	if (!checkout.hasItems(req.session.cart))
		return res.redirect('/cart');

	checkout.checkout(req.session.cart, req.body, req, res);

};

module.exports = {

	type: 'controller',
	name: 'CheckoutRoutesController',
	controller: CheckoutRoutesController

};
