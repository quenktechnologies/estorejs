/**
 * BlogsController is the controller for the pages feature.
 * @class BlogsController
 * @param {EStore} estore
 * @constructor
 *
 */
module.exports = function BlogsController(store) {


	/**
	 * routeRegistration
	 *
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.get(/^\/blog(?:\/pages\/([\d]{2}))?$/, this.onGetBlogIndexRequest);
		app.get(/^\/blog\/([\w-]+)$/, this.onGetBlogPageRequest);

	};

	/**
	 * onGetBlogPageRequest
	 *
	 * @method GetBlogPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetBlogPageRequest = function(req, res) {

		store.keystone.list('Post').
		model.
		findOne({
			slug: req.params[0]
		}).
		exec().
		then(null, function(err) {

			store.ebus.emit(store.SYSTEM_ERROR, err);
			next();

		}).
		then(function(post) {

			if (!post)
				return next();

			res.locals.$post = post;
			res.render(store.blog.routes.post);

		}).end();




	};

	/**
	 * onGetBlogIndexRequest
	 *
	 * @method GetBlogIndexRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onGetBlogIndexRequest = function(req, res, next) {

		store.keystone.list('Post').
		model.
		find().
		exec().
		then(null, function(err) {

			store.ebus.emit(store.SYSTEM_ERROR, err);
			next();

		}).
		then(function(posts) {

			if (posts.length < 1)
				return next();

			res.locals.$posts = posts;
			res.render(store.blog.routes.index);

		}).end();



	};




};
