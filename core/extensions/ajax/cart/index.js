/** @module */

var _ = require('lodash');
var CartAssistant = require('../../../cart/CartAssistant');
var CartAssistantHandlerWrapper = require('../../../cart/CartAssistantHandlerWrapper');
var AjaxCartAssistantHandler = require('./AjaxCartAssistantHandler');

module.exports = {

	type: 'controller',
	name: 'AjaxCartController',
	/**
	 *
	 * AjaxCartController provides the endpoints for the cart ajax api.
	 * @alias AjaxCartController
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function AjaxCartController(store) {

		var self = this;


		this.routeRegistration = function(app) {

			app.get(store.endpoints.CART_ITEMS,
				this.onGetItemsInCartRequest);

			app.get(store.endpoints.CART_ITEMS_COUNT,
				this.onGetCartItemsCountRequest);

			app.get(store.endpoints.CART_ITEM,
				this.onGetItemInCartRequest);

			app.put(store.endpoints.CART_ITEM,
				this.onAddItemToCartRequest);

			app.del(store.endpoints.CART_ITEM,
				this.onRemoveItemFromCartRequest);

			app.head(store.endpoints.CART_ITEM,
				this.onHasItemInCartRequest);

		};

		/**
		 * onGetCartItemsRequest sends the list of items in the cart.
		 *
		 * @param {Object} req
		 * @param {Object} res
		 *
		 */
		this.onGetItemsInCartRequest = function(req, res) {

			res.json(req.session.cart);

		};



		/**
		 * onGetCartItemsCountRequest returns a count of the items in the cart.
		 *
		 * @param {Object} req The express Request object.
		 * @param {Object} res The express Response object.
		 *
		 */
		this.onGetCartItemsCountRequest = function(req, res) {

			res.json({
				count: req.session.cart.length
			});

		};

		/**
		 * onGetItemInCart responds with an item in the cart.
		 *
		 * @param {Object} req The express Request object.
		 * @param {Object} res The express Response object.
		 *
		 */
		this.onGetItemInCartRequest = function(req, res) {

			var product = _.find(req.session.cart, {
				_id: req.params[0]
			});

			if (!product)
				return res.send(404);

			store.getDataModel('Product').
			findById(req.params[0], function(err, product) {

				if (product)
					return res.json(product);

				if (err)
					console.log(err);

				res.send(404);
			});

		};

		/**
		 * onRemoveItemFromCartRequest removes an item.
		 *
		 * @param {Object} req
		 * @param {Object} res
		 *
		 */
		this.onRemoveItemFromCartRequest = function(req, res) {

			req.session.cart = _.reject(req.session.cart, {
				'_id': req.params[0]
			});
			res.send(204);


		};

		/**
		 * onAddItemToCartRequest adds an item to the cart
		 *
		 * The structure of the post request should be as follows:
		 * {
		 *  _id: "uuid",
		 *  quantity: 1
		 *
		 * }
		 *
		 * @param {Object} req
		 * @param {Object} res
		 *
		 */
		this.onAddItemToCartRequest = function(req, res) {

			var item = req.body;

			store.getDataModel('Product').
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

				item.slug = req.params[0];

				var assistant = new CartAssistant(
					new CartAssistantHandlerWrapper(req.session,
						new AjaxCartAssistantHandler(res)));

				assistant.addToCart(item, product);

			}).end();

		};

		/**
		 * onGetCartTotalRequest provides the sum total of value of the items
		 * in the cart.
		 *
		 * @param {Object} req
		 * @param {Object} res
		 *
		 */
		this.onGetCartTotalRequest = function(req, res) {

			var total;

			store.keystone.
			list('Product').
			model.
			find({
				'_id': {
					$in: _.pluck(req.session.cart, '_id')
				}
			}).select({
				price: true
			}).exec(function(err, products) {
				if (!products)
					return res.send(404);

				_(products).forIn(function(product, key) {

					total = product.price.add(total);

				});
				res.json({
					total: total
				});

			});

		};


		/**
		 * onHasItemInCartRequest responds to a request that
		 * queries the existance of an item in the cart.
		 *
		 * @param {Object} req
		 * @param {Object} res
		 *
		 */
		this.onHasItemInCartRequest = function(req, res) {
			if (_.filter(req.session.cart, {
				'_id': req.params[0]
			}).length > 0)
				return res.send(200);
			return res.send(404);

		};


		/**
		 * onGetCartItemQuatityRequest responds with the
		 * quantity of an item in the cart.
		 *
		 * @param {Object} req The express Request object.
		 * @param {Object} res The express Response object.
		 *
		 */
		this.onGetCartItemQuatityRequest = function(req, res) {

			var match = _.find(req.session.cart, {
				_id: req.params[0]
			});

			if (!match) return res.send(404);
			res.send({
				_id: match._id,
				quantity: match.quantity || 0
			});



		};


		/**
		 * onChangeItemQuantityRequest updates the quantity
		 * of an item in the cart.
		 *
		 * @method ChangeItemQuantityRequest
		 * @param {Object} req The express Request object.
		 * @param {Object} res The express Response object.
		 * @return
		 *
		 */
		this.onChangeItemQuantityRequest = function(req, res) {

			var match = store.util.find(req.session.cart, {
				_id: req.params[0]
			});

			if (!match) return res.send(409);

			store.util.each(req.session.cart, function(v, k) {

				if (v._id === req.params[0]) {
					req.session.cart[k].quantity = req.params[1];
					console.log(req.session.cart[k]);
				}
			});


			res.send(201);

		};


	}
};
