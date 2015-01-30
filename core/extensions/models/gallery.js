module.exports = {

	type: 'model',
	name: 'Gallery',
	options: {
		track: true
	},
	defaultColumns: 'name,description,createdAt',
	run: function(list, store, types) {

		list.add({

			name: {
				type: String,
                                lowercase: true,
                                trim: true
			},
			description: {
				type: types.Textarea
			},
			images: types.Images
		});
	},
	navigation: {
		galleries: ['galleries']


	}







};
