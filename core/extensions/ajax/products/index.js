function AjaxProductsController() {

	AjaxProductsController.$parent.apply(this, arguments);

}

AjaxProductsController.prototype.onRouteConfiguration = function(app) {

	app.get(this.$routes.ajax.products.index,
		this.onGetProductListRequest.bind(this));

	app.get(this.$routes.ajax.products.product,
		this.onGetProductRequest.bind(this));
};


/**
 * onGetProductListRequest provides a list of products.
 *
 * The list provides 0 - MAX_PRODUCTS_RESPONSE products.
 * MAX_PRODUCTS_RESPONSE
 * must be set in process.env or it will default to 10.
 * This endpoint also checks
 * the offset query variable, if set, it will skip that many
 * products it returns.
 *
 * @method onGetProductListRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 *
 */
AjaxProductsController.prototype.onGetProductListRequest = function(req, res) {

	this.$store.getDataModel('Product').
	getProductList(req.query.offset,
		100).
	then(function(products) {

		res.json(products);

	}).
	end(function(err) {

		if (!err) {
			console.log(err);
			res.send(500);

		}
	});

};

/**
 * onGetProductRequest returns the specific product requested.
 *
 * @method GetProductRequest
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 *
 */
AjaxProductsController.prototype.onGetProductRequest = function(req, res) {

	this.$store.getDataModel('Product').
	findOne({
		slug: req.params[0]
	}).
	then(function(product) {
		res.json(product);
	}).
	end(function(err) {

		if (!err) {
			console.log(err);
			res.send(500);

		}


	});
};

module.exports = {

	type: 'controller',
	name: 'Product Endpoints',
	controller: AjaxProductsController
};
