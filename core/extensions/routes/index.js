module.exports = {

	type: 'composite',
	members: [{
		type: 'controller',
		controller: require('./SiteRoutes')
	}, {
		type: 'controller',
		controller: require('./StoreRoutes')
	}, {
		type: 'controller',
		controller: require('./CheckoutRoutes')
	}]

};
