/**
 * Blog route.
 * @class Blog
 * @param {Object} ctx
 * @constructor
 *
 */
module.exports = function Blog(ctx) {

	ctx.app.get(/^\/blog(?:\/pages\/([\d]{2}))?$/, function(req, res, next) {

		var skip = 0;

		if (req.params.length > 0)
			skip = req.params * 10;

		ctx.keystone.list('Post').
		model.
		find().
		limit(10).
		skip(skip).
		exec(function(err, posts) {

			if (err) return system.log.info(err) && next();

			if (posts.length < 1)
				return next();

			res.render('blog/index.html', {
				posts: posts
			});

		});





	});

	ctx.app.get(/^\/blog\/([\w-]+)$/, function(req, res) {
		ctx.keystone.list('Post').model.findOne({
			slug: req.params[0]
		}, function(err, post) {

			if (!post) {

				if (err) system.log.info(err);
				if (!err) system.log.info("Post was not found! ");
				return res.send(404);
			}

			res.locals.post = post;

			res.render('blog/post.html');





		});



	});

	ctx.app.get('/blog', ctx.render('blog/index.html'));

	return ctx.next;


};
