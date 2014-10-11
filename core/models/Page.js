module.exports = function(store) {

	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'title,stock.balance,price,createdAt';
	this.NAME = 'Page';
	this.options = {

		autokey: {
			path: 'slug',
			from: 'title',
			unique: true
		},
		map: {
			name: 'title'
		},
		track: true

	};
	this.fields = [{
			title: {
				type: String,
				width: 'long',
				required: true
			},
			state: {
				type: t.Select,
				options: 'draft, published',
				width: 'long',
				default: 'draft',
			},
			author: {
				type: String,
				width: 'medium'
			},
			content: {
				type: t.Markdown,
				wysiwyg: true,
				width: 'long'
			},
			description: {
				type: String,
				width: 'long',
				label: 'Meta Description'

			},
			template: {
				type: t.Select,
				options: store.settings._pageOptions,
				width: 'long'

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
