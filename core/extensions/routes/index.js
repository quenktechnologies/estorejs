module.exports = {

	type: 'composite',
        name:'Routes',
	members: [
          require('./cart'),
		require('./checkout'),
		require('./site'),
		require('./store')
	]
};
