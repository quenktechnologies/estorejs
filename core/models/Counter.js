/**
 * Counter model.
 * Counter objects are used to simulate auto increment fields in mongo.1
 * @class Counter
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function Counter(store) {

	this.NAME = 'Counter';
	this.options = {
		nocreate: true,
		map: {
			name: '_id'
		}
	};
	this.fields = [{
		_id: {
			type: String
		},
		next: {
			type: Number,
			noedit: true
		}
	}];

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {


		list.schema.methods.increment = function(id, qty) {

			return this.model('Counter').findOneAndUpdate({
				_id: id
			}, {
				$inc: {
					next: qty
				}
			}, {
				new: true

			}).exec().
			onReject(function(err) {

				system.log.error('Cannot query counters! ', err);

			});
		};

		/**
		 *
		 *
		 *  Like increment but does not return a Promise.
		 *
		 */
		list.schema.methods.increase = function(id, qty, cb) {

			return this.model('Counter').findOneAndUpdate({
				_id: id
			}, {
				$inc: {
					next: qty
				}
			}, {
				new: true

			}).exec(cb);
		};




	};



};
