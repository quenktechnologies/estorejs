module.exports = function(store) {

	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'name,price,stock.sku,stock.balance,createdOn';
	this.NAME = 'Product';
	this.options = {

		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true

	};
	this.fields = [{

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
				type: t.Url
			}
		},

		'Stock', {

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

		}, {
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
		}, 'Description', {
			description: {

				html: {
					type: t.Html,
					label: 'Html',
					wysiwyg: true
				}

			}
		}
	];

	/**
	 * navigate
	 *
	 * @method navigate
	 * @param {Object} nav
	 * @return
	 *
	 */
	this.navigate = function(nav) {
		nav.products = ['product_categories', 'products'];

	};

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.add({
			transactions: Array,
		});

		list.relationship({
			ref: "Category",
			path: "categories",
			refPath: "products"
		});

		list.schema.statics.getManyByIds = function(_ids, cb) {

			this.model('Product').
			find({
				'_id': {
					$in: _ids
				}
			}).lean(true).exec(cb);



		};


		list.schema.statics.getProductList = function(offset, max, cb) {

			this.model('Product').
			find({}, {
				name: true,
				_id: true,
				price: true,
				stock: true,
				order: true
			}).
			lean(true).
			skip(offset).
			limit(max).
			exec(cb);


		};

		list.schema.statics.applyTransaction = function(id, item) {

			return this.model('Product').findOneAndUpdate({

				_id: item._id,
				transactions: {
					$ne: id
				}
			}, {
				$inc: {
					'stock.balance': item.quantity
				},
				$push: {
					transactions: id
				}
			});




		};



	};
};
