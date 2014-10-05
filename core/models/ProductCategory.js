module.exports = function(store) {

	this.NAME = 'Category';
	this.defaultColumns = 'name, createdOn';
	var t = store.keystone.Field.Types;
	this.options = {
		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true,
		drilldown: 'products'
	};

	this.fields = [{

			name: {
				type: String,
				required: true,
				initial: true
			}
		},
		'Details', {
			image: {
				type: t.Url,
				collapse: true
			}

		},

		'Description', {
			description: {

				short: {
					type: t.Text,
					label: 'Short',
					width: 'long',
					collapse: true
				},

				long: {
					type: t.Markdown,
					label: 'Long',
					width: 'long',
					height: 10,
					collapse: true
				}

			}
		}, 'Products', {
			products: {

				type: t.Relationship,
				ref: 'Product',
				many: true,
				label: 'member',
				width: 'medium',
				collapse: true


			}
		}


	];

        


};
