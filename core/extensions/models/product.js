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
				description: ui.PageContentEditor()
			}, 'Details', {
				price: ui.PriceField({
					required: true,
					initial: true
				}),

				vendor: {
					type: String,
					width: 'short'
				},
				isFeatured: {
					type: Boolean,
					label: 'Featured product?'
				},
				isTangible: {
					type: Boolean,
					label: 'Physical product?',
					default: true,
					initial: true
				},
				weight: {
					type: Number,
					min: 0,
					label: 'Weight (lbs)',
					dependsOn: {
						'isTangible': true
					},
				},
				image: new store.engines.ImageEngine(store,types,ui)
			},
			'Stock', {

				stock: {
					sku: {
						type: String,
						label: 'SKU',
						width: 'short',
						note: 'Optional Stock Keeping Unit code',
						dependsOn: {
							'isTangible': true
						}
					},
					track: {
						type: Boolean,
						label: 'Track the number of this product in stock?',
						dependsOn: {
							'isTangible': true
						},
						default: true
					},
					balance: ui.NumberField(0, null, {
						label: 'Inventory Balance',
						dependsOn: {
							'isTangible': true,
							'stock.track': true
						},
						default: 0,
						initial: true
					}),
					isDisplayed: {
						type: Boolean,
						label: 'Display stock balance?',
						dependsOn: {
							'isTangible': true,
						},
						default: true
					},

				}

			},
			'Ordering', {
				order: {
					hasConstraints: {
						type: Boolean,
						label: 'Set min/max order quantities?'
					},
					min: ui.NumberField(1, null, {
						default: 1,
						dependsOn: {
							'order.hasConstraints': true
						},
						label: 'Minimum'
					}),
					max: ui.NumberField(1, null, {
						default: 9999999999,
						dependsOn: {
							'order.hasConstraints': true
						},
						label: 'Maximum'
					})

				}
			}, 'Charges', {

				charges: {

					delivery: {
						type: types.Money,
						label: 'Delivery',
						dependsOn: {
							'isTangible': true,
						},
						note: 'Assign a fixed charge for delivering this product.'
					}
				}
			},
			'SEO', {
				meta: {
					type: types.Textarea,
					width: 'medium',
					label: 'SEO Description',
					note: 'Used by search engines such as Google.'
				}

			},
			'Keywords', {
				keywords: {
					type: types.TextArray,
					label: 'Terms'

				}

			}, 
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

			var nameSplit = this.name.toLowerCase().split(' ');
			this.keywords = require('lodash').unique(
				this.keywords.concat(this.name.split(' ').concat([this.name.toLowerCase()])));
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


		list.schema.statics.getProductList = function(offset, max) {

			return this.model('Product').
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
			exec();


		};

		list.schema.statics.applyTransaction = function(id, item, invert) {

			var quantity = item.quantity;

			if (invert)
				quantity = quantity * -1;

			console.log('Applying Transaction ' + id + ' to ' + item.name + '.');
			return this.model('Product').findOneAndUpdate({

				_id: item._id,
				transactions: {
					$ne: id
				}
			}, {
				$inc: {
					'stock.balance': quantity
				},
				$push: {
					transactions: id
				}
			});




		};

		list.schema.statics.findProductsByKeywords = function(keywords, limit, skip) {

			keywords = keywords || '';

			skip = skip || 0;
			limit = limit || 30;

			keywords = keywords.toLowerCase().split(',');

			return this.model('Product').find({
				keywords: {
					$in: keywords
				}
			}).
			skip(skip).
			limit(limit);
		};


	},
	navigation: {

          products : ['products', 'categories']

	}






};
