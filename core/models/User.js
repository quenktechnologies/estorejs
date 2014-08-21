/**
 * User
 * @class User
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function UserModel(store) {

	var self = {};

	/**
	 * register
	 *
	 * @method register
	 * @return
	 *
	 */
	self.register = function() {

		var Types = store.keystone.Field.Types;
		var User = store.keystone.List('User');

		User.add({
				name: {
					type: Types.Name,
					required: true,
					index: true
				},
				email: {
					type: Types.Email,
					initial: true,
					required: true,
					index: true
				},
				password: {
					type: Types.Password,
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
			});

		// Provide access to Keystone
		User.schema.virtual('canAccessKeystone').get(function() {
			console.log('accessing');
			console.log(this.roles.admin);
			console.log(this);
			return this.roles.admin;
		}); // for some reason updates files are not populating the roles field.

		User.defaultColumns = 'name, email, roles.admin';
		User.register();



	};



	return self;


};
