module.exports = {

	type: 'model',
	name: 'Navigation',
	options: {
		track: true,
	},
	run: function(list, store, types) {

		list.add({
			name: {
				type: String
			},
			links: {
				type: types.Table,
                                columns: [
                                  {
					name: 'label'
				}, {
					name: 'url'
				}, {
					name: 'title'
				}, {
					name: 'target'
				}]
			}
		});

	}


};
