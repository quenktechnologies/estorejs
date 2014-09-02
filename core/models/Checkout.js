
/**
 * Checkout 
 * @class Checkout
 * 
 * @constructor
 *
 */
module.exports = function Checkout(store) {

	var types = store.keystone.Field.Types;
	this.NAME = 'Checkout';
        this.options = {

          hidden:true,
          nocreate:true

        };
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

  
  

};

