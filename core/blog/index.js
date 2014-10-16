module.exports = {

	type: 'composite',
	models: [require('./post'), require('./category')],
	controllers: [require('./BlogController')]


};
