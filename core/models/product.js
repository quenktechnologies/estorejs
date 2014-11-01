module.exports = {
	type: 'model',
	name: 'Product',
	options: {

		autokey: {
			path: 'slug',
			from: 'name',
			unique: true
		},
		track: true

	},
	defaultColumns: 'name,stock.balance,price,createdAt',
	model: function(store, types, ui) {

		return [{

				name: ui.TextField({
					required: true,
					initial: true
				}),
				price: ui.PriceField({
					required: true,
					initial: true
				}),
				image: store.engines.image(store),
				_keywords: ui.TextBox({
					label: 'Keywords'
				})

			},
			'Stock', {

				stock: {
					isTangible: {
						type: Boolean,
						label: 'This product is tangible?',
						default: true
					},

					sku: ui.ShortTextField({
						label: 'SKU',
						collapse: true,
					}),
					balance: ui.NumberField(0, null, {
						label: 'Inventory',
						dependsOn: {
							'stock.isTangible': true
						},
						default: 0,
						initial: true
					}),
				}

			},
			'Attributes', {

				attributes: {

					weight: ui.NumberField(0.00000001, null, {
						label: 'Weight',
						dependsOn: {
							'stock.isTangible': true
						}
					})
				}


			},
			'Order', {
				order: {
					min: ui.NumberField(1, null, {
						default: 1,
						collapse: true,
						dependsOn: {
							'stock.isTangible': true
						},
						label: 'Minimum'
					}),
					max: ui.NumberField(1, null, {
						default: 9999999999,
						collapse: true,
						label: 'Maximum'
					}),
					deliveryCharge: ui.PriceField({
						label: 'Delivery Charge',
					})

				}
			},
			'Description', {
				description: {

					brief: ui.TextBox({
						label: 'Brief'
					}),
					full: ui.PageContentEditor({
						label: 'Full'
					})

				}
			}, {},
			'Other', {
				isFeatured: {
					type: Boolean,
					label: 'Feature this product?'
				},
				keywords: {

					type: types.TextArray

				}

			}
		];
	},
	run: function(list, store, types, ui) {

		list.schema.add({

			keywords: [String]

		});

		list.schema.add({
			transactions: Array,
		});

		list.relationship({
			ref: 'Category',
			path: 'categories',
			refPath: 'products'
		});


		list.schema.pre('save', function(next) {

			if (this._keywords)
				this.set('keywords', this._keywords.toLowerCase().split(','));

			next();

		});


		//TODO: Convert the methods to use promises.

		list.schema.statics.getProductForCart = function(id) {

			return require('q').ninvoke(this.model('Product').findOne({
				_id: id
			}).select('_id name price stock, image'), 'exec').
			then(null, function(err) {
				console.log('getProductForCart: ', err);

			});

		};

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

			console.log('Applying Transaction ' + id + ' to ' + this.name + '.');
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

		list.schema.statics.findProductsByKeywords = function(keywords, limit, skip) {

			keywords = keywords || '';

			skip = skip || 0;
			limit = limit || 50;

			keywords = keywords.toLowerCase().split(',');

			return this.model('Product').find({
				keywords: {
					$in: keywords
				}
			}).
			skip(skip).
			limit(limit);
		};


		list.schema.pre('validate', function(product, next) {

			if (this._req_user)
				if (!this._req_user.roles.productManager)
					return next(new Error('You do not have the required permissions to do that!'));

			next();

		});



	},
	navigate: function(nav) {

		nav.products = ['products', 'categories'];

	}






};
