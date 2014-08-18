/**
 * ClientModel is the model for customers.
 * @class ClientModel
 *
 * @constructor
 *
 */
module.exports = function ClientModel() {

	var self = {};


	/**
	 * onKeyStoneReady sets up the model.
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		var t = keystone.Field.Types;
		var Model = new keystone.List('Client', {});
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
