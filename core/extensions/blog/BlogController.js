/** @module **/
var Paginator = require('../../util/Paginator');
/**
 * BlogRouteController is the controller for the pages feature.
 * @alias BlogRouteController
 * @param {EStore} estore
 * @constructor
 * @extends {Controller}
 *
 */
module.exports = function BlogRouteControllerr(store) {

	var render = store.getRenderCallback();

	this.routeRegistration = function(app) {
		app.get('/blog', this.onGetBlogIndexRequest);
		app.get(/^\/blog\/posts\/([\w]+(?:-[\w]+)*)$/, this.onGetBlogPageRequest);

	};

	/**
	 * onGetBlogPageRequest
	 *
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 *
	 */
	this.onGetBlogPageRequest = function(req, res, next) {

		store.keystone.list('Post').
		model.
		findOne({
			slug: req.params[0],
			state: 'published'
		}).
		exec().
		then(null, function(err) {

			console.log(err);
			next();

		}).
		then(function(post) {

			if (!post)
				return next();

			res.locals.$post = post;
			render('blog/post.html')(req, res, next);

		}).end();




	};

	/**
	 * onGetBlogIndexRequest
	 *
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 *
	 */
	this.onGetBlogIndexRequest = function(req, res, next) {

		var pager = new Paginator(store.getDataModel('Post'), 30);

		pager.paginate(Number(req.params[0]) || 0, {
			state: 'published'
		}).
		then(function(pager) {
			res.locals.$pagination = pager;
			res.locals.$posts = pager.items;
			render('blog/index.html')(req, res, next);

		}).end(function(err) {
			console.log(err);
			next();
		});

	};




};
