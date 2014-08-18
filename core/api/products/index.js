/**
 * ProductsBinding provides the api bindings for products.
 * @class ProductsBinding
 *
 * @constructor
 *
 */
module.exports = function ProductsBinding(keystone) {

	var self = {};
	var EFactory = require('../../../vzlib/api/ErrorHandlerFactory')();
	var config = require('../../../vzlib/api/Endpoints')();

	/**
	 * onRoutingReady sets up the routing.
	 *
	 * @method onRoutingReady
	 * @param {Object} app
	 * @return
	 *
	 */
	self.onRoutingReady = function(app) {
		app.get(config.PRODUCTS, self.onGetProductListRequest);
		app.get(config.PRODUCT, self.onGetProductRequest);
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
	self.onGetProductListRequest = function(req, res) {

		var errors = EFactory.create(res);
		keystone.list('Product').model.
		getProductList(req.query.offset,
			process.env.MAX_PRODUCTS_RESPONSE || 100,
			errors.C(503, function(data) {

				res.json(data);

			}));

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
	self.onGetProductRequest = function(req, res) {

		var errors = EFactory.create(res);
		keystone.list('Product').model.
		findOneBySlug(req.params[0]).exec(
			errors.C(503, function(product) {
				if (!product) return res.send(404);
				res.json(product);
			}));
	};


	return self;


};
