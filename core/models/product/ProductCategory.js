module.exports = function() {

	var self = {};

	self.onKeyStoneReady = function(keystone) {

		var t = keystone.Field.Types;
		var Category = new keystone.List('Category', {
			path: 'product_categories',
			autokey: {
				path: 'slug',
				from: 'name',
				unique: true
			},
			drilldown: 'products'
		});

		Category.add({

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


		});


		/**
		 * Registration
		 * ============
		 */
		Category.addPattern('standard meta');
		Category.defaultColumns = 'name, createdOn';
		Category.addPattern('standard meta');
		Category.register();

	};
	return self;
};
