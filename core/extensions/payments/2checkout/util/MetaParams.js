var Chance = require('chance');
/**
 * MetaParams
 * @alias MetaParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {Configuration} config
 * @constructor
 *
 */
module.exports = function MetaParams(domain, ptid, etid, config) {

	this.toObject = function() {

		var chance = new Chance();
		return {
			mode: '2CO',
			currency_code: config.getPreference('currency'),
			purchase_step: 'payment-method',
			x_receipt_link_url: domain+'/checkout/success/hosted/' + chance.word(50) + '/' + ptid,
			estorejs_ptid: ptid,
			estorejs_etid: etid,
		};


	};

};
