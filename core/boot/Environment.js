var Randomness = require('./Randomness');

/**
 *
 * Environment provides methods that compute needed values from process.env
 * @alias Environment
 *
 *
 */
module.exports = {

	/**
	 * getMongoURI provides the mongodb uri.
	 *
	 * Checks the MONGO_URI variable first, after that:
	 * MONGO_URL
	 * MONGOLAB_URI
	 *
	 * Will add any other PaaS provider in the future.
	 *
	 * @return {String}
	 *
	 */
	getMongoURI: function() {

		var uri = process.env.MONGO_URI ||
			process.env.MONGO_URL ||
			process.env.MONGOLAB_URI;
		return uri;

	},


	/**
	 * cookieSecret
	 *
	 * @return {String}
	 *
	 */
	getCookieSecret: function() {

		var secret = process.env.COOKIE_SECRET;

		if (!secret)
			return Randomness.getString(64);

		return secret;

	}




};
