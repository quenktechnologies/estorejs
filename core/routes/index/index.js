/**
 * IndexRoute
 * @class IndexRoute
 *
 * @constructor
 *
 */
module.exports = function IndexRoute(ctx) {


	ctx.app.get('/', ctx.render('index/index.html'));

	return ctx.next;


};
