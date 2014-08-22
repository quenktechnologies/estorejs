module.exports = function GeneralSettings(store) {

	this.COLLECTION = 'general_settings';
	this.NAME = 'GeneralSettings';
	this.options = {
		nocreate: true,
		nodelete: true,
		path: 'general_settings',
		label: 'General',
		singular: 'General Configuration',
		plural: 'General Configurations',
                track: true

	};
	this.fields = [{

		name: {
			type: String,
			default: process.env.BRAND || process.env.DOMAIN || 'Estore',
			noedit: true
		},
		brand: {
			type: String,
			default: process.env.BRAND
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

		list.schema.virtual('domain').get(function() {
			return process.env.DOMAIN;
		});

		list.schema.methods.getCheckOutOptions = function(cb) {
			return this.model('General').findOne({}).select('checkout').select('-_id').exec(cb);

		};

		list.schema.statics.load = function(refresh, cb) {

			var that = this;

			if (this.cache && !refresh) cb(this.cache);
			this.model('General').findOne(function(err, data) {

				if (err) throw err;

				that.cache = data;


			});

		};


	};


};
