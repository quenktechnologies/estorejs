module.exports = {

	type: 'composite',
        name:'Pages Extension',
	members: [{type:'controller', controller:require('./PagesController')}, require('./PageModel')]
};
