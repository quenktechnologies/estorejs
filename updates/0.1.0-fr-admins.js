exports.create = {

	User: [{
		name: {
			first: 'Admin',
			last: 'User'
		},
		email: 'root@example.com',
		password: 'password123',
                canAccessKeystone: true,
		roles:{admin: true}

	}]

};
