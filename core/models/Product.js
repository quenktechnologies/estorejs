module.exports = function(store) {

	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'name,stock.balance,price,createdAt';
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
				width: 'short',
				initial: true
			},
			price: {
				type: t.Money,
				required: true,
				initial: true
			},
			image: {
				type: t.Url,
				width: 'medium',
                                label:'Image URL',
				default: require('../util/DefaultImage'),
				collapse: true
			},
			_keywords: {

				type: t.Textarea,
				label: 'Keywords',
				note: 'Seperate each term with a comma.',
				height: 5,
				collapse: true,
				width: 'medium'

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
		},

		'Stock', {

			stock: {

				sku: {
					type: String,
					label: 'SKU',
					width: 'short',
					collapse: true,

				},
				balance: {

					type: Number,
					label: 'Balance',
					default: 0,
					min: 0,
					collapse: true,
					initial: true


				},
			}

		}, 'Orders', {
			orders: {
				min: {
					type: Number,
					min: 1,
					default: 1,
					collapse: true,
					label: 'Minimum'
				},
				max: {
					type: Number,
					default: 9999999999,
					min: 1,
					collapse: true,
					label: 'Maximum'
				},

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
		nav.products = ['products', 'categories'];
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
				system.log.error('getProductForCart: ', err);

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

			system.log.info('Applying Transaction ' + id + ' to ' + this.name + '.');
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



	};
};
