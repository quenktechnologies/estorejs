var CheckoutAssistant = require('./CheckoutAssistant');
var CACWrapper = require('./CACWrapper');
var AjaxCAC = require('./AjaxCAC');
var StandardCheckoutHandler = require('./StandardCAC');

/**
 * A factory object for easier coding.
 * @memberOf core/checkout
 */
module.exports = {

	createAjaxAssistant: function(dao, req, res, model) {

		return new CheckoutAssistant(dao,
			model,
			new CACWrapper(dao,
				req.session,
				new AjaxCAC(res)));

	},
	createStandardAssistant: function(dao, req, res, next, model) {

		return new CheckoutAssistant(dao,
			model,
			new CACWrapper(dao,
				req.session,
				new StandardCAC(res, next)));

	},
	createStandardCallbacks: function(dao, session, callback, res, next) {

		return new CACWrapper(dao,
			req.session,
			model,
			new StandardCAC(res, next));


	}





};
