/** @module */

module.exports = {

	type: 'model',
	name: 'Enquiry',
	defaultColumns: 'name, company, email, subject',
	options: {
		nocreate: true,
		noedit: true,
	},
	model: function(store, types, ui) {

		return [{
			name: {
				type: types.Name,
				required: true,


			},
			company: {
				type: String,
				match: /^.{,32}/

			},
			phone: {
				type: String,
				match: /^.{,32}/


			},
			email: {
				type: types.Email,
				required: true,

			},
			subject: {
				type: String,
				required: true,
				match: /^.{,32}/


			},
			message: {
				type: types.Textarea,
				required: true,
				match: /^.{,512}/


			}
		}];

	},

};
