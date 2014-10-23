
module.exports = {

  type: 'model',
  name: 'Address',
  options: {
		hidden: true,
		nocreate: true
	},
  model:  function(store, types, ui) {

    return [{

			name: {
				type: types.Name,
                                  label:'Name'

			},
				phone: {
				type: types.Text,
				match: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})?[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
				label: 'Phone',

			},
			company: {
				type: String,
                                label:'Company'
			},
			street1: {
				type: types.Text,
				label: 'Street Line1',
				match: /.{1,128}/,
			},
			street2: {
				type: types.Text,
				label: 'Street Line2',
				match: /.{0,128}/,

			},
			city: {
				type: types.Text,
				label: 'City/Region',
				match: /\w{2,32}/,
			},
			country: {
				type: types.Text,
				label: 'Country',
				match: /\w{2,32}/,
			},
	code: {

				type: types.Text,
				label: 'Postal Code',
				match: /\w{2,8}/,

			},
                        state: {
                          type: types.Text,
                          label: 'State',
				match: /\w{2,32}/,

                        },
				}

	];

  }

  
};
