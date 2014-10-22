/**
 * render a view
 * @param {String} view
 * @param {EStore} store
 * @param {Function}
 *
 */
module.exports = function(value, store) {

	return function(req, res, next) {

		res.locals.$params = req.params;

		res.render(value, function(err, html) {

			if (err) {
				console.log(err);
				return next();
			}
			return res.send(html);

		});
	};
};
