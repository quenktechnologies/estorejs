/**
 * AddressSchema
 *
 * Created to make sharing schema sections easier.
 * @class AddressSchema
 * @param {EStore} store
 * @param {Object} types
 * @param {UIFactory} ui
 * @constructor
 *
 */
module.exports = function AddressSchema(store, types, schema) {

	return {

		name: {
			type: types.Name,
			label: 'Name'

		},
		phone: {
			type: types.Text,
			match: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
			label: 'Phone',
			width: 'short'

		},
		company: {
			type: String,
			label: 'Company',
			width: 'medium'
		},
		street1: {
			type: types.Text,
			label: 'Street Line1',
			match: /.{1,128}/,
			width: 'medium'
		},
		street2: {
			type: types.Text,
			label: 'Street Line2',
			match: /.{0,128}/,
			width: 'medium'


		},
		city: {
			type: types.Text,
			label: 'City/Region',
			match: /\w{2,32}/,
                        width: 'medium'

		},
		country: {
			type: types.Select,
			options: require('../countries.json'),
			label: 'Country',
		},
		code: {

			type: types.Text,
			label: 'Postal Code',
			match: /\w{2,8}/,
                        width:'short'

		},
		state: {
			type: types.Text,
			label: 'State',
			match: /\w{2,32}/,
                        width: 'short'

		},
	};



};
