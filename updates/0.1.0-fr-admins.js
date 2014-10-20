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
		"roles.canAccessKeystone": true,
		"roles.author": true,
                "roles.userManager": true,
		"roles.productManager": true,
		"roles.settingsManager": true

	}]

};
