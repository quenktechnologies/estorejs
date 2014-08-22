module.exports = function(store) {

	this.NAME = 'Category';
	this.defaultColumns = 'name, createdOn';
	var t = store.keystone.Field.Types;
	this.options = {
		path: 'product_categories',
		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
                track:true,
		drilldown: 'products'
	};

	this.fields = [{

		name: {
			type: String,
			required: true,
			initial: true
		},
		description: {

			text: {

				type: t.Textarea,
				label: 'Text description',
				collapse: true
			},
			html: {
				type: t.Html,
				wysiwyg: true,
				label: 'HTML description',
				collapse: true
			}

		},
		image: {
			type: t.CloudinaryImage
		},
		products: {

			type: t.Relationship,
			ref: "Product",
			many: true,
			collapse: true


		}


	}];


};
