module.exports = {

	type: 'composite',
        name:'Blog Extension',
	members: [require('./post'),
        require('./category'), 
        {type: 'controller', controller:require('./BlogController')}]


};
