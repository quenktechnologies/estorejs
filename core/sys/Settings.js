module.exports = function(keystone) {

	var self = {};

	/**
	 * set changes the value of an setting.
	 *
	 * @method set
	 * @param {String} key
	 * @param {Mixed} value
	 * @return
	 *
	 */
	self.set = function(key, value) {

		self[key] = value;

		return self;


	};


	/**
	 * refresh looks up a setting object from the database.
	 *
	 * @method refresh
	 * @param {String} key The name of the collection in the database.
	 * @param {Function} cb A callback. (Does not receive
	 * @return
	 *
	 */
	self.refresh = function(key) {

		var deferred = Q.defer();

		keystone.list(key).model.refreshOne(function(err, data) {

			if (err) return deferred.reject(new Error(err));

			self[key] = data;

			deferred.resolve(data);


		});

		return deferred.promise;




	};


	return self;
};
