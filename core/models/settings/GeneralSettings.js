module.exports = function GeneralSettings(store) {

	var self = {};

	self.register = function() {
		var t = store.keystone.Field.Types;
		var path = require('path');

		var General = new store.keystone.List('GeneralSettings', {
			nocreate: true,
			nodelete: true,
			path: 'general_settings',
			label: 'General',
			singular: 'General Configuration',
			plural: 'General Configurations',
			map: {
				name: 'domain'
			}

		});

		General.schema.virtual('domain').get(function() {
			return process.env.DOMAIN;
		});

		General.schema.methods.getCheckOutOptions = function(cb) {
			return this.model('General').findOne({}).select('checkout').select('-_id').exec(cb);

		};

		General.schema.statics.load = function(refresh, cb) {

			var that = this;

			if (this.cache && !refresh) cb(this.cache);
			this.model('General').findOne(function(err, data) {

				if (err) throw err;

				that.cache = data;


			});

		};

		/**
		 * Registration
		 * ============
		 */
		General.register();


		return self;

	};


	return self;
};
