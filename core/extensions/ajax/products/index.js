/** @module */
module.exports = {

	type: 'controller',
	name: 'Product Endpoints',
	controller: function AjaxProductsController(store) {

		this.routeRegistration = function(app) {

			app.get(store.endpoints.PRODUCTS,
				this.onGetProductListRequest);

			app.get(store.endpoints.PRODUCT,
				this.onGetProductRequest);
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
		this.onGetProductListRequest = function(req, res) {

			store.getDataModel('Product').
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
		this.onGetProductRequest = function(req, res) {

			store.getDataModel('Product').
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




	}

};
