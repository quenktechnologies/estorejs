/** module */
var CheckoutAssistant = require('../../../checkout/CheckoutAssistant');

var CheckoutAssistantHandlerWrapper =
	require('../../../checkout/CheckoutAssistantHandlerWrapper');

var AjaxCheckoutAssistantHandler = require('./AjaxCheckoutAssistantHandler');

module.exports = {

	type: 'controller',
	/**
	 *
	 * @alias AjaxCheckoutController
	 * @param {EStore} store
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function AjaxCheckoutController(store) {

		var self = this;

		this.routeRegistration = function(app) {

			app.post('/_/checkout/transactions',
				this.onCheckoutTransactionRequest);

			app.get('/_/payments/options',
				this.onPaymentOptionsRequest);

			app.get('/_/countries',
				this.onGetCountriesRequest);

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
		this.onCheckoutTransactionRequest = function(req, res) {

			var checkout = new CheckoutAssistant(store,
				new CheckoutAssistantHandlerWrapper(store, req.session,
					new AjaxCheckoutAssistantHandler(res)));

			if (!checkout.hasItems(req.session.cart))
				return res.send(400, 'Your cart is empty!');

			checkout.checkout(req.session.cart, req.body);


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
		this.onPaymentOptionsRequest = function(req, res) {

			res.json(store.gateways.list);

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
		this.onGetCountriesRequest = function(req, res) {

			store.keystone.list('Country').model.
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


	}

};
