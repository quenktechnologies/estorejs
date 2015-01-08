exports.create = {

	Page: [{
			title: "about",
			template: "pages/default.html",
		}, {
			title: "terms",
			template: "pages/default.html"
		}, {
			title: "contact",
			template: "pages/default.html"
		}, {
			title: "delivery",
			template: "pages/default.html"
		}, {

			title: "index",
			template: "pages/default.html",
			"content.md": require("./pages/index.js"),
			"isIndex": true
		}, {

			title: "About",
			template: "pages/default.html",
			"content.md": require("./pages/about.js")
		}

	]


};
