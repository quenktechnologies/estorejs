/**
 * Cookie is a helper for dealing with cookies in supertest.
 * @class Cookie
 *
 * @constructor
 *
 */
module.exports = function Cookie(cookies) {
	cookies = cookies.join(';').split(';');
	/**
	 * read a cookie from a raw header string.
	 *
	 * @method read
	 * @param {String} cookie
	 * @param {String} name
	 * @return
	 *
	 */
	this.read = function(name, asString) {

		var list = {};
		cookies.forEach(function(string) {

			var splitted = string.split('=');

			if (splitted.length > 1)
				list[splitted[0]] = splitted[1];

		});
                if(asString)
                  return ''+name+'='+list[name];

		return list[name];
	};




};
