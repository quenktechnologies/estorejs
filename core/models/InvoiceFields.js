/**
 * InvoiceFields provides the invoice object for the model.
 * @class InvoiceFields
 * @param {Object<keystone.Types>} t The keystone type object.
 *
 * @constructor
 *
 */
module.exports = function InvoiceFields(t) {

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
			billing: require('./AddressFields')(t),
			shipping: require('./AddressFields')(t)
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


		payment: require('./PaymentFields')(t)


	};

};
