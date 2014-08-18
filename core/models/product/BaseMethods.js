/**
 * BaseMethods binds the basic product methods to the Product model.
 * @class BaseMethods
 *
 * @constructor
 *
 */
module.exports = function BaseMethods(model) {


	model.schema.statics.getManyByIds = function(_ids, cb) {

		this.model('Product').
		find({
			'_id': {
				$in: _ids
			}
		}).lean(true).exec(cb);



	};


	model.schema.statics.getProductList = function(offset, max, cb) {

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

	model.schema.statics.applyTransaction = function(id, item) {

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
