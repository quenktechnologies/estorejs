var bcrypt = require('bcrypt');
var crypto = require('crypto');

/**
 * etidParams
 * @alias etidParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {String} etid
 * @constructor
 *
 */
module.exports = function etidParams(etid, params) {


	this.toObject = function() {

		var set = params.toObject();
		set.estorejs_etid = etid;
		return set;

	};



};
