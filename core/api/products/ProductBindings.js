var APIServer = require('../APIServer');
/**
 * ProductsBinding provides the api bindings for products.
 * @class ProductsBinding
 *
 * @constructor
 *
 */
module.exports = function ProductsBindings(store) {

	APIServer.call(this, store);

	/**
	 * main sets up the routing.
	 *
	 * @method main
	 * @param {Object} app
	 * @return
	 *
	 */
	this.onRouting = function(app) {
		app.get(store.endpoints.PRODUCTS, this.onGetProductListRequest);
		app.get(store.endpoints.PRODUCT, this.onGetProductRequest);
	};


	/**
	 * onGetProductListRequest provides a list of products.
	 *
	 * The list provides 0 - MAX_PRODUCTS_RESPONSE products. MAX_PRODUCTS_RESPONSE
	 * must be set in process.env or it will default to 10. This endpoint also checks
	 * the offset query variable, if set, it will skip that many products it returns.
	 *
	 * @method onGetProductListRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetProductListRequest = function(req, res) {

		//TODO: use a promise api.

		store.keystone.list('Product').model.
		getProductList(req.query.offset,
			100, function(err, products) {

				if (err) return this.systemError(res, err);
				res.json(data);

			});

	};

	/**
	 * onGetProductRequest returns the specific product requested.
	 *
	 * @method GetProductRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetProductRequest = function(req, res) {

		//TODO: use a promise api

		store.keystone.list('Product').model.
		findOneBySlug(req.params[0]).exec(function(err, product) {
			if (!product) return res.send(404);
			res.json(product);
		});
	};


	return this;


};

module.exports.prototype = estore.Extension;
