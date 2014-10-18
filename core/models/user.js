/**
 * User
 * @class User
 * @constructor
 *
 */
module.exports = {

  type: 'model',
  name: 'User',
  defaultColumns : 'name, email, roles.admin',
  model : function(store, types, ui) {

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
				admin: {
					type: Boolean,
					label: 'Super User',

				},
			}
		}
	];

  },
        run: function(list) {

		// Provide access to Keystone
		list.schema.virtual('canAccessKeystone').get(function() {
			return this.roles.admin;
		});

	}




  
};

