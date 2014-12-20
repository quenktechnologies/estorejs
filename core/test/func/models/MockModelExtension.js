module.exports = function(name) {


	return {
		type: 'model',
		name: name,
		model: function() {

			return [{
				mockField0: {
					type: Boolean,
					required: true,
					default: true
				}
			}];


		},
		run: function(list) {
			list.add({

				mockField1: {
					type: String,
					required: true,
					default: 'test value'
				}
			});


		}
	};
};
