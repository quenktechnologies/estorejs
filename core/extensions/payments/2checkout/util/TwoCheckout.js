var TCO = require('2checkout-node');
var MetaParams = require('./MetaParams');
var ProductParams = require('./ProductParams');
var AddressParams = require('./AddressParams');
var TokenParams = require('./TokenParams');
/**
 * TwoCheckout is a helper object for use with 2Checkout payments.
 */
module.exports = {

	isHostedReady: function(config) {

		if (config.get('TWO_CHECKOUT_SELLER_ID'))
			return true;

		return false;



	},
	create: function(cons) {

		return new TCO(cons);
	},
	createParamsForHosted: function(ctx,config) {

		var params = new ProductParams(ctx.transaction.invoice, new MetaParams(config, {}));
		params = new AddressParams(ctx.transaction.invoice.address, params);

		params = new TokenParams(
			ctx.transaction.tid + '' +
			transaction.invoice.total + '' +
			config.get('TWO_CHECKOUT_SECRET'),
			params);

		return params.toObject();

	}



};
