module.exports = {

	type: 'composite',
	members: [
          require('./cart'),
		require('./checkout'),
		require('./site'),
		require('./store')
	]
};
