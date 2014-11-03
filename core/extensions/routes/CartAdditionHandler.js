/**
 * CartAdditionHandler  is used by CartAddition to handler errors that prevent a valid Product
 * from being added to the cart.
 * @class CartAdditionHandler
 * @param {Request} req
 * @param {Response} res
 * @param {Function} cb
 * @constructor
 *
 */
module.exports = function CartAdditionHandler(req, res, next, cb) {


	/**
	 * onProductOutOfStock
	 *
	 * @method onProductOutOfStock
	 * @param {Product} product
	 * @return
	 *
	 */
	this.onProductOutOfStock = function(product) {

		res.locals.$cartError = 'That product is out of stock!';
		res.locals.$product = product;
		res.status(409);
		res.render('cart.html');

	};

	/**
	 * onQuantityMoreThanBalance
	 *
	 * @method onQuantityMoreThanBalance
	 * params
	 * @return
	 *
	 */
	this.onQuantityMoreThanBalance = function(qty, balance, product) {

		res.locals.$cartError = 'The quantity you selected is more than that available!';
		res.locals.$product = product;
		res.status(409);
		res.render('cart.html');



	};


	/**
	 * onQuantityLessThanMin
	 *
	 * @method onQuantityLessThanMin
	 * @return
	 *
	 */
	this.onQuantityLessThanMin = function(qty, min, product) {

		res.locals.$cartError = 'Please select a minimum quantity of ' + min + ' ' + product.name + ' (s).';
		res.locals.$product = product;
		res.status(409);
		res.render('cart.html');


	};


	/**
	 * onQuantityMoreThanMax
	 *
	 * @method onQuantityMoreThanMax
	 * @return
	 *
	 */
	this.onQuantityMoreThanMax = function(qty, max, product) {

		res.locals.$cartError = 'Please select a maximum quantity of ' + max + ' ' + product.name + ' (s).';
		res.locals.$product = product;
		res.status(409);
		res.render('cart.html');


	};


	/**
	 * onItemCanBeAddedToCart
	 *
	 * @method onItemCanBeAddedToCart
	 * @return
	 *
	 */
	this.onItemCanBeAddedToCart = function(item) {

		var _ = require('lodash');
		req.session.cart = _.reject(req.session.cart, {
			'_id': req.params[0]
		});

		req.session.cart.push(item);
		if (cb) return cb();
		res.status(201);
		res.redirect('/cart');



	};







};
