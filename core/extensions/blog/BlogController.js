/** @module **/
var Paginator = require('../../util/Paginator');
/**
 * BlogRouteController is the controller for the blog feature.
 * @alias BlogRouteController
 * @constructor
 * @extends {Controller}
 *
 */
function BlogRouteController() {

	BlogRouteController.$parent.apply(this, arguments);

}

BlogRouteController.prototype.onRouteConfiguration = function(app) {

  app.get(this.$routes.standard.blog.index,
  this.onGetBlogIndexRequest.bind(this));

  app.get(this.$routes.standard.blog.post,
		this.onGetBlogPageRequest.bind(this));

};

/**
 * onGetBlogPageRequest
 *
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 *
 */
BlogRouteController.prototype.onGetBlogPageRequest = function(req, res, next) {

	this.$data.getDataModel('Post').
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
		res.render('blog/post.html');

	}).end();




};

/**
 * onGetBlogIndexRequest
 *
 * @param {Object} req The express Request object.
 * @param {Object} res The express Response object.
 *
 */
BlogRouteController.prototype.onGetBlogIndexRequest = function(req, res, next) {

	var pager = new Paginator(this.$data.getDataModel('Post'), 30);

	pager.paginate(Number(req.params[0]) || 0, {
		state: 'published'
	}).
	then(function(pager) {
		res.locals.$pagination = pager;
		res.locals.$posts = pager.items;
		res.render('blog/index.html');

	}).end(function(err) {
		console.log(err);
		next();
	});

};



module.exports = BlogRouteController;
