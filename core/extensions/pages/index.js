module.exports = {

	type: 'composite',
	members: [{type:'controller', controller:require('./PagesController')}, require('./PageModel')]
};
