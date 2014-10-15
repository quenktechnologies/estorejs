
module.exports = {

  type:'model',
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
			required: true
		},
		price: {
			type: types.Money,
			required: true,
		},
		image: {
			type: types.Url
		}
	}];
  },

};
