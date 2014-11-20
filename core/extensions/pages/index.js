module.exports = {

	type: 'composite',
	name: 'Pages Extension',
	members: [require('./PagesController'), require('./PageModel')]
};
