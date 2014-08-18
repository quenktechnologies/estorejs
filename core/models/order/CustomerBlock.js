/**
 * CustomerBlock of the models.
 * @class CustomerBlock
 * @param {Object} t keystone.Types
 * @constructor
 *
 */
module.exports = function CustomerBlock(t) {

	return {

		name: {
			type: t.Name,
			label: 'Name'

		},
		phone: {
			type: t.Text,
			match: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
			label: 'Phone'

		},
		email: {
			type: t.Email,

		},
		account: {
			type: t.Relationship,
			ref: 'Client',

		},

		address: {

			street1: {
				type: t.Text,
				label: 'Address Line1',
				match: /.{1,128}/,

			},
			street2: {
				type: t.Text,
				label: 'Address Line2',
				match: /.{0,128}/,

			},
			city: {
				type: t.Text,
				label: 'City',
				match: /\w{2,32}/,
			},
			code: {
				type: t.Text,
				label: 'Postal/Zip Code',
				match: /\w{2,8}/,

			},
			country: {
				type: t.Text,
				label: 'Country',
				match: /\w{2,32}/,
			}
		}
	};

};
