var Assistants = require('../../../checkout/Checkout');

function AjaxCheckoutContoller() {

	AjaxCheckoutContoller.$parent.apply(this, arguments);

}

AjaxCheckoutContoller.prototype.onRouteConfiguration = function(app) {

	app.post(this.$routes.ajax.checkout.transactions,
		this.onCheckoutTransactionRequest.bind(this));

	app.get(this.$routes.ajax.checkout.options.gateways,
		this.onPaymentOptionsRequest.bind(this));

	app.get(this.$routes.ajax.checkout.options.countries,
		this.onGetCountriesRequest.bind(this));

};

/**
 * onCheckoutTransactionRequest will register a checkout.
 *
 * @method CheckoutTransactionRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
AjaxCheckoutContoller.prototype.onCheckoutTransactionRequest = function(req, res) {

	var checkout = Assistants.
	createAjaxAssistant(this.$store, req, res, this.$model);

	if (!checkout.hasItems(req.session.cart))
		return res.send(400, 'Your cart is empty!');

	checkout.checkout(req.session.cart, req.body, req, res);


};

/**
 * onPaymentOptionsRequest
 *
 * @method PaymentOptionsRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
AjaxCheckoutContoller.prototype.onPaymentOptionsRequest = function(req, res) {
	var list = [];
	this.$model.onGetPaymentOptions(list);
	res.json(list);
};

/**
 * onGetCountriesRequest
 *
 * @method GetCountriesRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 * @return
 *
 */
AjaxCheckoutContoller.prototype.onGetCountriesRequest = function(req, res) {

	this.$store.keystone.list('Country').model.
	find(null, {
		_id: false,
		__v: false
	}).
	lean().
	exec().
	then(null, function(err) {
		res.send(500);
		console.log(err);

	}).
	then(function(list) {

		res.json(list);


	}).end();



};

module.exports = {
	type: 'controller',
	controller: AjaxCheckoutContoller
};
