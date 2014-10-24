/**
 * InvoiceSchema
 * @class InvoiceSchema
 * @param {EStore} store
 * @param {Object} types
 * @param {UIFactory} ui
 * @constructor
 *
 */
module.exports = function InvoiceSchema(store, types, ui) {


	return {

		number: {
			type: Number,
			unique: true,
			noedit: true,
			default: -1
		},
		date: {

			type: Date,
			noedit: true,
			width: 'short',
			default: Date.now
		},

		total: {

			type: types.Money,
			default: '0.00',
			noedit: true,
			width: 'short'
		}

	};

};
