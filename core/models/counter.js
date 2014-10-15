/**
 * Counter model.
 * Counter objects are used to simulate auto increment fields in mongo.
 * @class Counter
 *
 */
module.exports = {

  type: 'model',
  name: 'Counter',
  defaultColumns: 'name',
  options:{
		nocreate: true,
		nodelete: true,
		map: {
			name: '_id'
		}
	},

  model: function(store, types, ui) {

    return [{
		name: {
			type: String,
			noedit: true

		},
		next: {
			type: Number,
			note: 'Do not change this unless you know what you are doing!'
		}
	}];

  },

  run: function(list) {


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




	}


  
  
};
