/**
 * CartBindings provides ajax bindings for a shopping cart.
 * @class CartBindings
 *
 * @constructor
 */

module.exports = function CartBindings(store) {

	var self = {};

	var _ = require('lodash');
	var Models = require('../../../vzlib/keystone/ModelFactory');
	var EFactory = require('../../../vzlib/api/ErrorHandlerFactory')();
	var config = require('../../../vzlib/api/Endpoints')();


	/**
	 * main will setup the cart bindings.
	 * @method main
	 * @param {Object} app
	 * @return
	 *
	 */
	self.main = function(app) {

		app.get(config.CART_ITEMS, self.onGetItemsInCartRequest);
		app.get(config.CART_ITEMS_COUNT, self.onGetCartItemsCountRequest);
		app.get(config.CART_ITEM, self.onGetItemInCartRequest);
		app.put(config.CART_ITEM, self.onAddItemToCartRequest);
		app.del(config.CART_ITEM, self.onRemoveItemFromCartRequest);
		app.head(config.CART_ITEM, self.onHasItemInCartRequest);
		app.get(config.CART_ITEM_QUANTITY, self.onGetCartItemQuatityRequest);
		app.put(config.CART_ITEM_QUANTITY_VALUE, self.onChangeItemQuantityRequest);

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
	self.onGetItemsInCartRequest = function(req, res) {

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
	self.onGetCartItemsCountRequest = function(req, res) {

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
	self.onGetItemInCartRequest = function(req, res) {

		var product = _.find(req.session.cart, {
			_id: req.params[0]
		});

		if (!product)
			return res.send(404);

		Models(store.keystone).get('Product').
		findById(req.params[0], EFactory.create(res).C(503, function(product) {
			res.send(product);
		}));







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
	self.onRemoveItemFromCartRequest = function(req, res) {

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
	 * @method onAddItemToCartRequest
	 * @param {Object} req
	 * @param {Object} res
	 * @return
	 *
	 */
	self.onAddItemToCartRequest = function(req, res) {

		var Big = require('bignumber.js');
		var _ = require('lodash');
		req.session.cart = req.session.cart || [];

		req.body.quantity = Number(req.body.quantity);

		if ((!_.isNumber(req.body.quantity)) || (_.isNaN(req.body.quantity))) {
			req.body.quantity = 1;
			system.log.info('Invalid quantity detected, forcing to 1');
		}

		req.session.cart.push({
			_id: req.body._id,
			quantity: req.body.quantity
		});


		//Adjust what was actually created.
		Models(store.keystone).get('Product').findOne({
			_id: req.body._id
		}).
		select('_id name price stock.sku image').exec(function(err, product) {

			req.session.cart = _.reject(req.session.cart, {
				'_id': req.body._id
			}); //If the _id could not be found for some reason then the item will disappear.
			if (err) return log.warn(err) && res.send(409);
			req.session.cart.push({
				_id: product._id,
				name: product.name,
				price: product.price,
				slug: product._id,
				stock: product.stock,
				image: {
					url: product.image.url
				},
				quantity: req.body.quantity,
				subtotal: Big(product.price).times(req.body.quantity).toString()

			});
			res.send(201); //Tell the user it was created.


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
	self.onGetCartTotalRequest = function(req, res) {

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
	self.onHasItemInCartRequest = function(req, res) {
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
	self.onGetCartItemQuatityRequest = function(req, res) {

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
	self.onChangeItemQuantityRequest = function(req, res) {

		var match = _.find(req.session.cart, {
			_id: req.params[0]
		});

		if (!match) return res.send(409);

		_.each(req.session.cart, function(v, k) {

			if (v._id == req.params[0]) {
				req.session.cart[k].quantity = req.params[1];
				console.log(req.session.cart[k]);
			}
		});


		res.send(201);





	};





	return self;


};
