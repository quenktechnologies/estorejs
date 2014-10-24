module.exports = {

	type: 'model',
	name: 'Destination',
	track: true,
	model: function(store, types, ui) {

		return [{
				name: ui.Selection(require('./countries.json'), {
					unique: true,
					initial: true,
					required: true
				}),
			}


		];


	}

};
