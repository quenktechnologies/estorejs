var uuid = require('node-uuid');

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
				uuid: {
					type: String,
					noedit: true,
					unique: true,
					hidden: true,
					default: function() {
						return uuid.v4();
					}
				},
				name: {
					type: String,
					required: true,
					initial: true,
					width: 'medium',
				},
				price: {
					type: types.Money,
					required: true,
					initial: true
				},
				description: {

					type: types.Markdown,
					height: 400,
				}
			}, 'Additional Details', {
				vendor: {
					type: String,
					width: 'short'
				},
				isTangible: {
					type: Boolean,
					label: 'Physical product?',
					hidden: true,
					default: true,
				},
				weight: {
					type: Number,
					min: 0,
					label: 'Weight (kgs)',
					default: 0
				},
				image: types.Image
			},
			'Stock', {

				stock: {
					sku: {
						type: String,
						label: 'Product SKU',
						width: 'medium'
					},
					track: {
						type: Boolean,
						label: 'Track stock balance?',
						default: true
					},
					balance: {
						type: Number,
						label: 'Inventory balance',
						dependsOn: {
							'stock.track': true
						},
						min: 0,
						default: 1,
					},

				}

			},
			'Ordering', {
				order: {
					min: {
						type: Number,
						min: 1,
						default: 1,
						label: 'Minimum'
					},
					max: {
						type: Number,
						min: 1,
						default: 9999999999,
						label: 'Maximum'
					}

				}
			}, 'Charges', {

				charges: {

					delivery: {
						type: types.Money,
						label: 'Delivery',
						default: '0.00',
					}
				}
			},
			'Search Engines', {

				meta: {

					title: {

						type: String,
						width: 'medium',
						label: 'Title'

					},
					description: {
						type: types.Textarea,
						width: 'medium',
						label: 'Description',
					}
				}

			},
			'Options', {
				isFeatured: {
					type: Boolean,
					label: 'Featured product?'
				}
			},
			'Keywords', {
				keywords: {
					type: types.TextArray,
					label: 'Terms',
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

		products: ['products', 'categories']

	}






};
