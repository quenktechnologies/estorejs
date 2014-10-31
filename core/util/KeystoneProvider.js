var RandomHexString = require('./RandomHexString');
/**
 * KeystoneProvider provides certain config values for keystone.
 * @class KeystoneProvider
 * @constructor
 *
 */
module.exports = function KeystoneProvider() {



	/**
	 * mongoURI provides the mongodb uri.
	 *
	 * Checks the MONGO_URI variable first, after that:
	 * MONGO_URL
	 * MONGOLAB_URI
	 *
	 * Will add any other PaaS provider in the future.
	 *
	 * @method mongoURI
	 * @return
	 *
	 */
	this.mongoURI = function() {

	var uri = process.env.MONGO_URI ||
		process.env.MONGO_URL ||
		process.env.MONGOLAB_URI;
	return uri;

	};


	/**
	 * cookieSecret
	 *
	 * @method cookieSecret
	 * @return
	 *
	 */
	this.cookieSecret = function() {

  var secret = process.env.COOKIE_SECRET || new RandomHexString(64);
  return secret;

	};




};
