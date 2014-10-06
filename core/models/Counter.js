/**
 * Counter model.
 * Counter objects are used to simulate auto increment fields in mongo.1
 * @class Counter
 * @constructor
 *
 */
module.exports = function Counter() {

	this.NAME = 'Counter';
        this.DEFAULT_COLUMNS='name';
	this.options = {
		nocreate: true,
		nodelete: true,
		map: {
			name: '_id'
		}
	};
	this.fields = [{
		name: {
			type: String,
			noedit: true

		},
		next: {
			type: Number,
			note: 'Do not change this unless you know what you are doing!'
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
				name: id
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
				name: id
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
