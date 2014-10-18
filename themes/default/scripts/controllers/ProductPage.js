/**
 * ProductPage is the controller for the product page.
 * @class Product
 * @constructor
 *
 */
module.exports = function ProductPage() {

	/**
	 * addSuccess
	 *
	 * @method addSuccess
	 * @return
	 *
	 */
	this.addSuccess = function() {
		window.location = '/cart';
	};

	/**
	 * addFailure
	 *
	 * @method addFailure
	 * params
	 * @return
	 *
	 */
	this.addFailure = function() {

		console.log('Error adding to cart');


	};





};
