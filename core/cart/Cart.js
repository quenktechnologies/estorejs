var CartAssistant = require('./CartAssistant');
var AjaxCartAssistantHandler = require('./AjaxCartAssistantHandler');
var StandardCartAssistantHandler = require('./StandardCartAssistantHandler');

/**
 *
 * Factory object for easier interaction with the cart module.
 */

module.exports = {

	createAjaxAssistant: function(cart, res) {

		return new CartAssistant(cart,
			new AjaxCartAssistantHandler(res));


	},
	createStandardAssistant: function(cart, res) {

		return new CartAssistant(cart,
			new StandardCartAssistantHandler(res));

	}



};
