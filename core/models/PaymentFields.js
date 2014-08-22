/**
 * PaymentBlock for payment sections.
 * @class PaymentBlock
 * @param {Object} t keystone.Types
 * @constructor
 *
 */
module.exports = function PaymentBlock(t) {
	return {

		type: {
			type: t.Select,
			options: 'cash',
			label: 'Payment Type'
		},
		id: {
			type: String,
			label: 'Payment ID'
		},

		status: {
			type: t.Select,
			options: 'outstanding,paid,cancelled',
			default: 'outstanding'

		},




	};
};
