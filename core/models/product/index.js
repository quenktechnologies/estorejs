module.exports = function() {

	var self = {};

	self.onKeyStoneReady = function(keystone) {

		var t = keystone.Field.Types;
		var BaseMethods = require('./BaseMethods');
		var Product = new keystone.List('Product', {

			autokey: {
				path: 'slug',
				from: 'name',
				unique: true
			},

		});

		Product.add({

			name: {
				type: String,
				required: true,
				width: 'medium',
				initial: true
			},
			price: {
				type: t.Money,
				required: true,
				initial: true
			},
			image: {
				type: t.CloudinaryImage
			}
		});

		Product.add('Stock', {

			stock: {

				sku: {
					type: t.Key,
					label: "SKU",
					width: 'short',
					initial: true,

				},
				balance: {

					type: Number,
					label: "Balance",
					default: 0,
					min: 0,
					collapse: true

				},



			}

		});

		Product.add({
			order: {
				min: {
					type: Number,
					min: 1,
					default: 1,
					collapse: true,
					label: 'Minimum Order'
				},
				max: {
					type: Number,
					default: 9999,
					min: 1,
					collapse: true,
					label: 'Maximum Order'
				},

			}
		});


		Product.add('Description', {
			description: {

				html: {
					type: t.Html,
					label: 'Html',
					wysiwyg: true
				}

			}
		});


		Product.schema.add({
			transactions: Array,
		});

		BaseMethods(Product);




		/**
		 * Registration
		 * ============
		 */

		Product.relationship({
			ref: "Category",
			path: "categories",
			refPath: "products"
		});

		Product.addPattern('standard meta');
		Product.defaultColumns = 'name,price,stock.sku,stock.balance,createdOn';
		Product.register();

		require('./ProductCategory')().onKeyStoneReady(keystone);
	};

	return self;
};
