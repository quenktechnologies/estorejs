/**
 * User
 * @class User
 * @constructor
 *
 */
module.exports = {

	type: 'model',
	name: 'User',
	defaultColumns: 'name, email, roles.canAccessKeystone',
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
					canAccessKeystone: {
						type: Boolean,
						label: 'Can access keystone?',
						default: false
					},
					author: {
						type: Boolean,
						label: 'Author',
						default: false


					},
					userManager: {

						type: Boolean,
						label: 'User Manager',
						default: false

					},
					productManager: {
						type: Boolean,
						label: 'Product Manager',
						default: false
					},
					settingsManager: {
						type: Boolean,
						label: 'Settings Manager',
						default: false
					}

				}
			}
		];

	},
	run: function(list) {

		// Provide access to Keystone
		list.schema.virtual('canAccessKeystone').get(function() {
			return this.roles.canAccessKeystone;
		});

		list.schema.pre('validate', function(user, next, done) {
			if (this._req_user)
				if (!this._req_user.userManager)
					return next(new Error('You do not have the required permissions to do that!'));
			next();
		});

	}





};
