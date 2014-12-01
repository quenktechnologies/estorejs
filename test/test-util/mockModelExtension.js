/**
 * @module
 */

module.exports = function() {

	return {
		type: 'model',
		name: 'Mock',
		model: function() {

			return [{
				name: {
					type: String,
					initial: true,
				},
				uid: {
					type: Number,
					initial: true,
				},
				active: {
					type: Boolean
				}
			}];

		}
	};
};
