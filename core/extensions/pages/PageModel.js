module.exports = {

	type: 'model',
	name: 'Page',
	defaultColumns: 'title,author,template,createdBy,createdAt',
	options: {

		autokey: {
			path: 'slug',
			from: 'title',
			unique: true
		},
		map: {
			name: 'title'
		},
		track: true

	},
	model: function(store, types, ui) {

		return [{
                  title: {
                    type:String,
					required: true
				},
				template: {
					type: types.Select,
                                        options: store.pages.templates, //Maybe get from types infuture?
					initial: true,
					default: store.pages.templates[0].value,
					required: true

				},

                                meta: {
                                  author:{type: String},
                                  description:{type: types.Textarea}
				}
			}, {
				isIndex: {
					type: Boolean,
					default: false,
					label: 'Use for site index?'

				}

                        },{
                                content: 	{
                                  type: types.Markdown,
                                  height: 400,
                                  wysiwyg: true
                                  
                                }}

		];

	},

	navigation: {
		pages: ['pages']
	}




};
