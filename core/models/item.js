module.exports = {

	type: 'model',
	name: 'Item',
	options: {
		hidden: true,
		nocreate: true
	},
	model: function(store, types, ui) {
		return [{

			name: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				min: 1,
				max: 9999999,
			},
			price: {
				type: types.Money,
			},
			image: {
				type: types.Url
			}
		}];
	},

};
