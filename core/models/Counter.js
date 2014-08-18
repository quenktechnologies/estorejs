/**
 * Counter model.
 * Counter objects are used to simulate auto increment fields in mongo.1
 * @class Counter
 *
 * @constructor
 *
 */
module.exports = function Counter() {

	var self = {};


	/**
	 * onKeyStoneReady
	 *
	 * @method onKeyStoneReady
	 * @param {Object} keystone
	 * @return
	 *
	 */
	self.onKeyStoneReady = function(keystone) {

		var Counter = keystone.List('Counter', {
			nocreate: true,
			map: {
				name: '_id'
			}
		});

		Counter.add({
			_id: {
				type: String
			},
			next: {
				type: Number,
				noedit: true
			}
		});

		Counter.schema.methods.increment = function(id, qty) {

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
		Counter.schema.methods.increase = function(id, qty, cb) {

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


		Counter.register();


	};


	return self;


};
