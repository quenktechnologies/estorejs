/** @module */
/**
 * Paginator provides an api for paging list type pages.
 * @alias Paginator
 * @param {external:Model} model The model to page.
 * @param {Number} maxItems The max number of items to display on a page.
 * @constructor
 *
 */
module.exports = function Paginator(model, maxItems) {

	/**
	 * paginate performs the actual pagination logic.
	 *
	 * @param {Number} current
	 * @param {Object} query
	 * @return {Promise} mongoose style
	 *
	 */
	this.paginate = function(current, query, select) {

		query = query || {};

		var pager = {
			total: {},
			pages: [],
		};

		return model.
		find(query, select).
		lean().
		count().
		exec().
		then(function(count) {

			pager.total.items = count;
			pager.total.pages = Math.ceil(count / maxItems);
			pager.current = current;
			pager.next = current + 1;
			pager.previous = current - 1;

			if (pager.current + 1 >= pager.total.pages)
			//This is the last page
				pager.next = -1;

			if (pager.current === 0)
			//This is the first page.
				pager.previous = -1;

			for (var i = 0; i < pager.total.pages; i++)
				pager.pages.push(i);

			return model.find(query).skip(current * maxItems).limit(maxItems).lean().exec();

		}).
		then(function(results) {
			pager.items = results;
			return pager;
		});



	};



};
