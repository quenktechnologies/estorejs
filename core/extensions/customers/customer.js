/**
 * @module
 *
 * The customer model makes a collection available for recording
 * and storing client data.
 */

module.exports = {

	type: 'model',
	name: 'Customer',
	track: true,
	model: function(store, types, ui) {

		return [{
				name: {
					type: types.Name,
					initial: true,
				},
				email: {
					type: types.Email,
					initial: true,
				},
				password: {
					type: types.Password,
				},
				uid: {
					type: String,
					unique: true,
					default: require('node-uuid').v4
				},
				status: {
					type: types.Select,
					options: ['active', 'disabled', 'inactive', 'pending'],
					default: 'pending'
				},
				tokens: {
					validate: {
						type: String,
						hidden: true,
						default: require('just.randomstring')
					}
				},
				invoices: {
					type: types.Relationship,
					many: true,
					ref: 'Invoice'
				}
			}

		];

	},
	validation: {

		email: {
			presence: true
		},
		password: {
			presence: true,
			length: {
				minimum: 8,
				message: 'must be at least 8 characters'
			}
		}
	},
	navigation: {
		customers: ['customers']
	}
};
