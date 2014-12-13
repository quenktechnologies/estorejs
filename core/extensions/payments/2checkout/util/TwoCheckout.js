var bcrypt = require('bcrypt');
var crypto = require('crypto');
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

		if (config.getPreference('payments').card === '2co-hosted')
			if (config.get('TWO_CHECKOUT_SELLER_ID'))
				if (config.get('TWO_CHECKOUT_SECRET'))
					return true;

		return false;



	},
	create: function(cons) {

		return new TCO(cons);
	},
	createParamsForHosted: function(ctx, config) {

		var ptid = ctx.transaction.tid;
		var etid = this.encryptTID(ptid, config);

		var params = new ProductParams(ctx.transaction.invoice,
			new MetaParams(
				ctx.request.protocol + '://' +
				ctx.request.get('host'), ptid, etid, config));

		params = new AddressParams(ctx.transaction.invoice.customer.email,
			ctx.transaction.invoice.address, params);

		params = new TokenParams(etid, params);
		return params.toObject();

	},
	encryptTID: function(token, config) {

		return bcrypt.hashSync(token + config.get('TWO_CHECKOUT_SECRET'), 8);


	},
	verifyTwoCheckoutKey: function(params, config) {

		var key = params.key;

		var target = crypto.createHash('md5').
		update(config.get('TWO_CHECKOUT_SECRET') +
			config.get('TWO_CHECKOUT_SELLER_ID') +
			params.order_number +
			params.total).
		digest('hex').toUpperCase();
		console.log('DEBUG: comparing (key) computed ' + target + ' with ' + key);

		return (key === target);

	},
	verifyEncryptedTID: function(ptid, hash, config) {

		console.log('DEBUG: comparing (ptid - hash) ' + ptid + ' with ' + hash);
		return bcrypt.compareSync(ptid + config.get('TWO_CHECKOUT_SECRET'),
			hash);

	}





};
