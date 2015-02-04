var CartAssistant = require('./CartAssistant');
var AjaxCartAssistantHandler = require('./AjaxCartAssistantHandler');
var StandardCartAssistantHandler = require('./StandardCartAssistantHandler');
var BufferedStandardCartAssistantHandler = require('./BufferedStandardCartAssistantHandler');
var Cart = require('./Cart');

/**
 *
 * Factory object for easier interaction with the cart module.
 */

module.exports = {

	/**
	 *
	 * @param {Array} cart
	 *
	 */
	createCart: function(cart) {

		return new Cart(cart);

	},
	createAjaxAssistant: function(cart, res, handler) {

		handler = new AjaxCartAssistantHandler(res);
		return new CartAssistant(cart, handler);


	},
	createStandardAssistant: function(cart, res, handler) {

		handler = handler || new StandardCartAssistantHandler(res);
		return new CartAssistant(cart, handler);

	},
	createBufferedStandardCartAssistantHandler: function(res) {

		return new BufferedStandardCartAssistantHandler(res);

	}



};
