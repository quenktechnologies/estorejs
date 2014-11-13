exports.create = {

	User: [{
		name: {
			first: "Super",
			last: "User"
		},
		email: function() {

			if (process.env.DEFAULT_EMAIL)
				return process.env.DEFAULT_EMAIL;

			return "estore@quenk.com";

		},
		password: function() {

			if (process.env.DEFAULT_PASSWORD)
				return process.env.DEFAULT_PASSWORD;

			return "password123";

		},
		roles: ["keystone",
			"users",
			"settings",
			"categories",
			"products",
			"posts",
			"pages",
			"counters",
			"countries",
			"transactions",
                        "customers"
		],
	}]

};
