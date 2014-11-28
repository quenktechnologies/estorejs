/**
 * PaymentSchema
 * @class PaymentSchema
 * @param {EStore} store
 * @param {Object} types
 * @param {UIFactory} ui
 * @constructor
 *
 */
module.exports = function PaymentSchema(store, types, ui) {

	return {
		id: {
			type: String,
			width: 'short',
			label: 'Payment Id'

		},

		type: {
			type: String,
			noedit: true,
			label: 'Type',
			width: 'short'

		},
		workflow: {
			type: String,
			hidden: true,
			width: 'short',
			noedit: 'true'
		},

		status: {
			type: types.Select,
			options: 'outstanding,paid,cancelled',
			default: 'outstanding'
		}



	};
};
