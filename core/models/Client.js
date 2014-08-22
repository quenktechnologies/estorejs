/**
 * ClientModel is the model for customers.
 * @class ClientModel
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function ClientModel(store) {

	var self = {};


	/**
	 * register
	 *
	 * @method register
	 * @return
	 *
	 */
	self.register = function() {

		var t = store.keystone.Field.Types;
		var Model = new store.keystone.List('Client', {});
		Model.add({

			name: {
				type: t.Name,
				required: true,
				initial: true

			},
			phone: {
				type: t.Text,
				match: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
				labe: 'Phone'

			},
			email: {
				type: t.Email,
				unique: true,
				required: true,
				initial: true,
				index: true

			},
			gender: {

				type: t.Select,
				options: 'Male,Female'

			},
			password: {

				type: t.Password

			},
			enabled: {

				type: Boolean,
				default: false

			}


		});

		Model.schema.statics.create = function(client) {

			return new this.model(client);




		};

		Model.relationship({
			path: 'invoices',
			ref: 'Invoice',
			refPath: 'client.account'
		});

		Model.addPattern('standard meta');
		Model.register();


	};
	return self;

};
