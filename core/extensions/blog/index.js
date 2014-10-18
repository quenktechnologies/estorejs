module.exports = {

	type: 'composite',
	members: [require('./post'),
        require('./category'), 
        {type: 'controller', controller:require('./BlogController')}]


};
