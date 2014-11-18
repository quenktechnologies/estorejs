/** @module */

var Paginator = require('../../util/Paginator');
var CartAssistant = require('../../cart/CartAssistant');
var CartAssistantHandlerWrapper = require('../../cart/CartAssistantHandlerWrapper');
var StandardCartAssistantHandler = require('./StandardCartAssistantHandler');

module.exports = {
	type: 'controller',
	name: 'CartRoutesController',

	/**
	 * CartRoutesController is the controller for the cart routes.
	 *
	 * @alias CartRoutesController
	 * @param {EStore} store
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function CartRoutesController(store) {

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

			app.get('/cart', render('cart.html'));

			app.post(/^\/cart\/items\/([\w]+(?:-[\w]+)*)$/,
				this.onAddItemToCartRequest);

			app.put(/^\/cart\/items\/([\w]+(?:-[\w]+)*)$/,
				this.onAddItemToCartRequest);

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

			store.getDataModel('Product').
			findOne({
				_id: req.params[0]
			}).
			lean().
			exec().
			then(null, function(err) {

				console.log(err);
				next();

			}).
			then(function(product) {

				if (!product)
					return next();

				var assistant = new CartAssistant(
					new CartAssistantHandlerWrapper(req.session,
						new StandardCartAssistantHandler(res)));

				item._id = req.params[0];
				assistant.addToCart(item, product);

			}).end();


		};
	}
};
