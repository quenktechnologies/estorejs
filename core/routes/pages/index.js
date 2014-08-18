/**
 * PagesController
 * @class PagesController
 * @param {Object} ctx
 * @constructor
 *
 */
module.exports = function PagesController(ctx) {

	ctx.app.get(/^\/pages\/([\w-]+)$/, function(req, res, next) {

		ctx.keystone.list('Page').model.findOne({
			slug: req.params[0]
		}, function(err, page) {
			if (!page) {

				if (err) system.log.info(err);

				if (!err) return system.log.info("Page was not found! ") &&
					next();
			}

			res.locals.page = page;
			res.render('/pages/' + page.type + '.html');

		});

	});

	return ctx.next;

};
