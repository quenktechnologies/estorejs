/**
 * CustomerSchema
 * @class CustomerSchema
 * @param {EStore} store
 * @param {Object} types
 * @param {UIFactory} ui
 * @constructor
 *
 */
module.exports = function CustomerSchema(store, types, ui) {

	return {
		email: {
			type: types.Email,
			label: 'Email',
			noedit: true,
			width: 'short'
		}
	};

};
