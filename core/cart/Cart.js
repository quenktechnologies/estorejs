var CartAssistant = require('./CartAssistant');
var CartAssistantHandlerWrapper = require('./CartAssistantHandlerWrapper');
var AjaxCartAssistantHandler = require('./AjaxCartAssistantHandler');
var StandardCartAssistantHandler = require('./StandardCartAssistantHandler');

/**
 *
 * Factory object for easier interaction with the cart module.
 */

module.exports = {

	createAjaxAssistant: function(session, res) {

		return new CartAssistant(
			new CartAssistantHandlerWrapper(session,
				new AjaxCartAssistantHandler(res)));


        },
        createStandardAssistant: function(session, res) {

return new CartAssistant(
					new CartAssistantHandlerWrapper(session,
						new StandardCartAssistantHandler(res)));

        }



};
