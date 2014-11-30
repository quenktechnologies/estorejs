/** @module */

/**
 *
 * permCheck checks if a user has permision to edit a collection before saving it.
 *
 *
 */
module.exports = function permCheck() {

	if (this._req_user) {

		var collection =
			this.constructor.collection.name;

		if (this._req_user.roles.indexOf(collection) < 0)
			return next(new Error(
				'You do not have the' +
				' required permissions ' +
				'to edit the ' +
				collection + ' collection!'));
	}

	next();
};
