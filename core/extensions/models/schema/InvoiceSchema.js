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
		},
		date: {

			type: Date,
			noedit: true,
			width: 'short',
			default: Date.now
		},
		charges: {

			delivery: {
				type: types.Money,
				default: '0.00',
				noedit: true,
				width: 'short',
                                required:true,
			},
			tax: {
				type: types.Money,
				default: '0.00',
				noedit: true,
				width: 'short',
                                required:true
			},
		},
		total: {

			type: types.Money,
			default: '0.00',
			noedit: true,
			width: 'short'
		}

	};

};
