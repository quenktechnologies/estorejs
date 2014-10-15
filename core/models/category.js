module.exports =  
{

  type:'model',
  name:'Category',
  options: {
		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true,
		drilldown: 'products'
	},
  model: function(store, types, ui) {
return [{

			name: {
				type: String,
				required: true,
				initial: true
			}
		},
		'Details', {
			image: {
				type: types.Url,
				collapse: true
			}

		},

		'Description', {
			description: {

				short: {
					type: types.Text,
					label: 'Short',
					width: 'long',
					collapse: true
				},

				long: {
					type: types.Markdown,
					label: 'Long',
					width: 'long',
					height: 10,
					collapse: true
				}

			}
		}, 'Products', {
			products: {

				type: types.Relationship,
				ref: 'Product',
				many: true,
				label: 'member',
				width: 'medium',
				collapse: true


			}
		}


	];

  }

  
};

