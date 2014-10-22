var APIServer = require('../APIServer');
/**
 * CartBindings provides ajax bindings for a shopping cart.
 * @class CartBindings
 *
 * @constructor
 */

module.exports = function CartBindings(store) {

	APIServer.call(this, store);
	var self = this;

	/**
	 * routeRegistration will setup the cart bindings.
	 * @method routeRegistration
	 * @param {Object} app
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.get(store.endpoints.CART_ITEMS, this.onGetItemsInCartRequest);
		app.get(store.endpoints.CART_ITEMS_COUNT, this.onGetCartItemsCountRequest);
		app.get(store.endpoints.CART_ITEM, this.onGetItemInCartRequest);
		app.put(store.endpoints.CART_ITEM, this.onAddItemToCartRequest);
		app.del(store.endpoints.CART_ITEM, this.onRemoveItemFromCartRequest);
		app.head(store.endpoints.CART_ITEM, this.onHasItemInCartRequest);

	};

	/**
	 * onGetCartItemsRequest sends the list of items in the cart.
	 *
	 * @method onGetItemsInCartRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
	 *
	 */
	this.onGetItemsInCartRequest = function(req, res) {
		res.json(req.session.cart);
	};



	/**
	 * onGetCartItemsCountRequest returns a count of the items in the cart.
	 *
	 * @method GetCartItemsCountRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetCartItemsCountRequest = function(req, res) {

		res.send({
			count: req.session.cart.length
		});



	};

	/**
	 * onGetItemInCart responds with an item in the cart.
	 *
	 * @method GetItemInCart
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetItemInCartRequest = function(req, res) {

		var product = store.util.find(req.session.cart, {
			_id: req.params[0]
		});

		if (!product)
			return res.send(404);

		store.keystone.list('Product').
		findById(req.params[0], function(err, product) {
			if (err)
				return res.send(store.SYSTEM_ERROR_STATUS);
			res.send(product);
		});







	};

	/**
	 * onRemoveItemFromCartRequest removes an item.
	 *
	 * @method onRemoveItemFromCartRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
	 *
	 */
	this.onRemoveItemFromCartRequest = function(req, res) {

		req.session.cart = store.util.reject(req.session.cart, {
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
	 * @method onAddItemToCartRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
	 *
	 */
	this.onAddItemToCartRequest = function(req, res) {

		var Big = require('bignumber.js');
		var _ = store.util;
		req.session.cart = req.session.cart || [];

		store.keystone.list('Product').model.
		getProductForCart(req.params[0]).
		then(null, self.systemError(res)).
		then(function(product) {

			if (!product)
				return res.send(409, new Error('PRODUCT_NOT_FOUND'));

			if (product.stock.balance < 1)
				return res.send(409, new Error('ITEM_OUT_OF_STOCK'));

			req.body.quantity = Number(req.body.quantity);

			if ((!_.isNumber(req.body.quantity)) || (_.isNaN(req.body.quantity)))
				return res.send(409, new Error(
					'INVALID_QUANTITY'));

			if (req.body.quantity > product.stock.balance)
				return res.send(409, new Error('INSUFFICENT_STOCK'));

			req.session.cart = _.reject(req.session.cart, {
				'_id': req.body._id
			});

			req.session.cart.push({
				_id: product._id,
				name: product.name,
				price: product.price,
				slug: product._id,
				stock: product.stock,
                          attributes: product.attributes,
				image: product.image,
				quantity: req.body.quantity,
				subtotal: new Big(product.price).times(req.body.quantity).toString()

			});
			res.send(201);

		});




	};

	/**
	 * onGetCartTotalRequest provides the sum total of value of the items
	 * in the cart.
	 *
	 * @method onGetCartTotalRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
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
	 * onHasItemInCartRequest responds to a request that queries the existance of an item in the cart.
	 *
	 * @method onHasItemInCartRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
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
	 * onGetCartItemQuatityRequest responds with the quantity of an item in the cart.
	 *
	 * @method onGetCartItemQuatityRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
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
	 * onChangeItemQuantityRequest updates the quantity of an item in the cart.
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





};
