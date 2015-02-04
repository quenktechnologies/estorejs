var Paginator = require('../../util/Paginator');
var CartFactory = require('../../cart/CartFactory');
var _ = require('lodash');

/**
 * CartRoutesController is the controller for the cart routes.
 *
 * @alias CartRoutesController
 * @param {EStore} store
 * @constructor
 * @extends {Controller}
 *
 */
function CartRoutesController() {
	CartRoutesController.$parent.apply(this, arguments);
}

/**
 * onRouteConfiguration will configure routes based on the theme.
 *
 * @method onRouteConfiguration
 * @return
 *
 */
CartRoutesController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.standard.cart.index,
		this.render('cart.html'));

	app.post(this.$routes.standard.cart.item,
		this.onAddItemToCartRequest.bind(this));

	app.post(this.$routes.standard.cart.update,
		this.onUpdateItemsInCartRequest.bind(this));

	app.put(this.$routes.standard.cart.item,
		this.onAddItemToCartRequest.bind(this));

	app.delete(this.$routes.standard.cart.item,
		this.onRemoveItemFromCartRequest.bind(this));

};

/**
 * onAddItemToCartRequest
 * @todo enforce a max amount of items that can be added to the cart.
 *
 */
CartRoutesController.prototype.onAddItemToCartRequest = function(req, res, next) {

	var item = req.body;

	this.$data.getDataModel('Product').
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


		item.uuid = req.params[0];
		CartFactory.
		createStandardAssistant(
			CartFactory.createCart(req.session.cart), res).
		addProductToCart(item, product);

	}).end();


};


/**
 * onUpdateItemsInCartRequest
 */
CartRoutesController.prototype.onUpdateItemsInCartRequest = function(req, res, next) {

	var cart = CartFactory.createCart(req.session.cart);
	var handler = CartFactory.createBufferedStandardCartAssistantHandler(res);
	var assist = CartFactory.createStandardAssistant(cart, res, handler);

	req.body.products = (_.isObject(req.body.products)) ? req.body.products : {};

	var _in = Object.keys(req.body.products).map(function(uuid) {

		if (cart.hasUUID)
			return uuid;

	});

	var items = _in.map(function(uuid) {
		return {
			uuid: uuid,
			quantity: req.body.products[uuid].quantity
		};

	});

	this.$data.getDataModel('Product').
	findQStyle({
		uuid: {
			$in: _in
		}
	}).
	then(function(products) {

		products = products || [];
		assist.addProductsToCart(items, products);
		handler.flush();

	}).
	catch(function(err) {
		console.log(err);
		next();
	}).done();

};



/**
 * onRemoveItemFromCartRequest
 *
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 */
CartRoutesController.prototype.onRemoveItemFromCartRequest = function(req, res, next) {

	CartFactory.createStandardAssistant(
		CartFactory.createCart(req.session.cart), res).
	removeFromCart(req.params[0]);

};

module.exports = {
	type: 'controller',
	name: 'CartRoutesController',
	controller: CartRoutesController
};
