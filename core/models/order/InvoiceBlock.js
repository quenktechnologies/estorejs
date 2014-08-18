/**
 * InvoiceBlock provides the invoice object for the model.
 * @class InvoiceBlock
 * @param {Object<keystone.Types>} t The keystone type object.
 *
 * @constructor
 *
 */
module.exports = function InvoiceBlock(t) {

	return {


		number: {
			type: Number,
			unique: true,
			initial: true,
			noedit: true

		},

		date: {

			type: Date,
			noedit: true,
			default: Date.now

		},

		customer: {

                  name:{type: t.Name},
                  email:{type: t.Email},
                  account:{
			type: t.Relationship,
			ref: 'Client'
                  }
		},
		address: {
			billing: require('./AddressBlock')(t),
			shipping: require('./AddressBlock')(t)
		},
		subtotal: {

			type: t.Money,
			default: "0.00",
			label: 'Subtotal'
		},
		total: {

			type: t.Money,
			default: "0.00",
			label: 'Total'
		},


		payment: require('./PaymentBlock')(t)


	};

};
