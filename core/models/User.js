/**
 * User
 * @class User
 * @constructor
 *
 */
module.exports = function UserModel(store) {

	var types = store.keystone.Field.Types;
	this.NAME = 'User';
	this.COLLECTION = 'users';
	this.DEFAULT_COLUMNS = 'name, email, roles.admin';
	this.fields = [{

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

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		// Provide access to Keystone
		list.schema.virtual('canAccessKeystone').get(function() {
			return this.roles.admin;
		});

	};





};
