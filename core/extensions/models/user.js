/**
 * User
 * @class User
 * @constructor
 *
 */
module.exports = {

	type: 'model',
	name: 'User',
	defaultColumns: 'name, email, roles',
	model: function(store, types, ui) {

		return [{

				name: {
					type: types.Name,
					required: true,
					index: true
				},
				email: {
					type: types.Email,
					initial: true,
					required: true,
					index: true
				},
				password: {
					type: types.Password,
					initial: true,
					required: false
				}
			},
			'Roles', {
				roles: {
					type: types.TextArray,
					default: ['products', 'categories', 'transactions']

				}
			}, {
				notifications: {
					type: types.TextArray
				}
			}
		];

	},
	run: function(list) {

		// Provide access to Keystone
		list.schema.virtual('canAccessKeystone').get(function() {

			if (this.get('roles').indexOf('keystone') < 0)
				return false;

			return true;
		});

	}





};
