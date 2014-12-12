var bcrypt = require('bcrypt');
var crypto = require('crypto');

/**
 * TokenParams
 * @alias TokenParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {String} token
 * @constructor
 *
 */
module.exports = function TokenParams(token, params) {


	this.toObject = function() {

		var set = params.toObject();
		set.estorejs_token = bcrypt.hashSync(token, 8);
                return set;

	};



};
