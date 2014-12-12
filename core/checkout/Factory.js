var CheckoutAssistant =
	require('./CheckoutAssistant');

var CheckoutAssistantHandlerWrapper =
	require('./CheckoutAssistantHandlerWrapper');

var AjaxCheckoutAssistantHandler =
	require('./AjaxCheckoutAssistantHandler');

var StandardCheckoutHandler =
	require('./StandardCheckoutAssistantHandler');

/**
 * Factory object for checkout.
 * @memberOf core/checkout
 */

module.exports = {

	createAjaxAssistant: function(dao, session, res, controllers, callbacks) {

		return new CheckoutAssistant(dao, controllers,
			new CheckoutAssistantHandlerWrapper(dao, session, callbacks,
				new AjaxCheckoutAssistantHandler(res)), callbacks);

	},
	createStandardAssistant: function(dao, session, res, next, controllers, callbacks) {

		return new CheckoutAssistant(dao, controllers,
			new CheckoutAssistantHandlerWrapper(dao, session, callbacks,
				new StandardCheckoutHandler(res, next)), callbacks);

	}





};
