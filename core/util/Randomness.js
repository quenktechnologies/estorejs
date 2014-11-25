/**
 * Randomness is used for getting random strings.
 * @alias Randomness
 *
 */
module.exports = {

	/**
	 *
	 * Generate a random hex string of characters.
	 * @param {Number} bytes
	 *
	 */
	getString: function(bytes) {

		return require('crypto').randomBytes(bytes).toString('hex');


	}


};
