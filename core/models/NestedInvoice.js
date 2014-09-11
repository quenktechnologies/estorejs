/**
 * NestedInvoice is used to provide an embedded Invoice schema in a Transaction.
 * Keystone does not support embedded docs (yet) and mongoose does not do it a
 * clean way regardless.
 *
 * Ideally we would like to simply do this:
 *
 * Transaction.schema.add({invoice: keystone.list('Invoice').schema});
 *
 * but mongoose nested schema must be an array right now so:
 *
 * Transaction.schema.add({invoices: [{keystone.list('Invoice').schema}]});
 *
 * but mongoose seems to choke on the keystone types as updates done on these
 * kind of documents do nothing. What we do instead is define an Invoice like schema into Transaction
 * but using primitives, no keystone sugar.
 *
 * Transaction.schema.add({invoices: [new NestedInvoice()]});
 * @class NestedInvoice
 *
 * @constructor
 *
 */
module.exports = function NestedInvoice() {

	var address = {

		name: {
			type: {
				first: String,
				Last: String
			},

		},
		phone: {
			type: String,
			match: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,

		},
		company: {
			type: String,
		},
		street1: {
			type: String,
			match: /.{1,128}/,
		},
		street2: {
			type: String,
			match: /.{0,128}/,

		},
		code: {

			type: String,
			match: /\w{2,8}/,

		},
		city: {
			type: String,
			match: /\w{2,32}/,
		},
		country: {
			type: String,
			match: /\w{2,32}/,
		}
	};

	return {

		number: {
			type: Number,
		},
		customer: {
			email: {
				type: String
			}
		},

		date: {

			type: Date,

		},
		total: {

			type: String
		},
		address: {
			billing: address,
			shipping: address
		},
		payment: {

			type: {
				type: String,
			},
			id: {
				type: String,
			},
			status: {
				type: String,
			},

		},
		items: [{

			name: {
				type: String,
			},
			quantity: {
				type: Number,
				min: 1,
				max: 9999999,
			},
			price: {
				type: String,
			},
			image: {
				type: String
			}
		}],
		workflow: {
			type: String
		}


	};



};
