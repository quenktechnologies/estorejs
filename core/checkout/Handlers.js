var CheckoutAssistantHandlerWrapper = require('./CheckoutAssistantHandlerWrapper');
var StandardCheckoutAssistantHandler = require('./StandardCheckoutAssistantHandler');
module.exports = {

	createStandardCheckoutAssistantHandler: function(dao, session, callbacks, res, next) {

		return new CheckoutAssistantHandlerWrapper(dao, session, callbacks,
			new StandardCheckoutAssistantHandler(res, next));


	}




};
