var _ = require('lodash');
var CartFactory = require('../../../cart/CartFactory');
//@todo use new cart apis
/**
 *
 * AjaxCartController provides the endpoints for the cart ajax api.
 * @alias AjaxCartController
 * @constructor
 * @extends {Controller}
 *
 */
function AjaxCartController() {

	AjaxCartController.$parent.apply(this, arguments);

}

AjaxCartController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.ajax.cart.items.all,
		this.onGetItemsInCartRequest.bind(this));

	app.get(this.$routes.ajax.cart.items.count,
		this.onGetCartItemsCountRequest.bind(this));

	app.get(this.$routes.ajax.cart.items.item,
		this.onGetItemInCartRequest.bind(this));

	app.put(this.$routes.ajax.cart.items.item,
		this.onAddItemToCartRequest.bind(this));

	app.delete(this.$routes.ajax.cart.items.item,
		this.onRemoveItemFromCartRequest.bind(this));

	app.head(this.$routes.ajax.cart.items.item,
		this.onHasItemInCartRequest.bind(this));

};

/**
 * onGetCartItemsRequest sends the list of items in the cart.
 *
 * @param {Object} req
 * @param {Object} res
 *
 */
AjaxCartController.prototype.onGetItemsInCartRequest = function(req, res) {

  //@todoconsider updating the items in the cart first
	res.json(req.session.cart);

};



/**
 * onGetCartItemsCountRequest returns a count of the items in the cart.
 *
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 *
 */
AjaxCartController.prototype.onGetCartItemsCountRequest = function(req, res) {

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
AjaxCartController.prototype.onGetItemInCartRequest = function(req, res) {

	var product = _.find(req.session.cart, {
		_id: req.params[0]
	});

	if (!product)
		return res.send(404);

	this.$store.getDataModel('Product').
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
AjaxCartController.prototype.onRemoveItemFromCartRequest = function(req, res) {

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
AjaxCartController.prototype.onAddItemToCartRequest = function(req, res, next) {

	var item = req.body;

	this.$store.getDataModel('Product').
	findOne({
		uuid: req.params[0]
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


		CartFactory.createAjaxAssistant(req.session, res).
		addToCart(item, product);

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
AjaxCartController.prototype.onGetCartTotalRequest = function(req, res) {

	var total;

	this.$store.keystone.
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
AjaxCartController.prototype.onHasItemInCartRequest = function(req, res) {
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
AjaxCartController.prototype.onGetCartItemQuatityRequest = function(req, res) {

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
AjaxCartController.prototype.onChangeItemQuantityRequest = function(req, res) {

	var match = _.find(req.session.cart, {
		_id: req.params[0]
	});

	if (!match) return res.send(409);

	_.each(req.session.cart, function(v, k) {

		if (v._id === req.params[0]) {
			req.session.cart[k].quantity = req.params[1];
			console.log(req.session.cart[k]);
		}
	});


	res.send(201);

};



module.exports = {

	type: 'controller',
	name: 'AjaxCartController',
	controller: AjaxCartController
};
