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
	options: {
		nocreate: true,
		nodelete: true,
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


		list.schema.methods.increment = function(name, qty) {

			return this.model('Counter').findOneAndUpdate({
				name: name
			}, {
				$inc: {
					next: qty
				}
			}).exec();
		};

	}




};
