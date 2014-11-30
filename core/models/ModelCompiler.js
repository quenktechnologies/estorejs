/**
 * @module
 */
var _ = require('lodash');
var ModelCompilerSyntax = require('./ModelCompilerSyntax');
var UIFactory = require('./UIFactory');

/**
 * ModelCompiler is responsible for compiling model extensions.
 * @alias ModelCompiler
 * @param {ModelCompilerSyntax} syntax
 * @constructor
 *
 */
module.exports = function ModelCompiler(syntax) {

	var trees = {};

	/**
	 *
	 * parse a model extension.
	 * @param {ModelExtension} source
	 */
	this.parse = function(source) {

		var model = trees[source.name] || {
			options: {},
			navigation: {},
			stack: []
		};

		if (source.replace)
			model.stack.length = 0;

		syntax.newRound(model);

		for (var key in source)
			if (source.hasOwnProperty(key))
				if (syntax.hasOwnProperty(key))
					syntax[key](source);

		var tree = syntax.getTree();

		trees[source.name] = tree;


	};


	/**
	 *
	 * compile actually compiles the model with mongoose.
	 *
	 */
	this.compile = function(store) {

		var tree;
		var types = store.keystone.Field.Types;
		var nav = {};
		fields = new UIFactory(types);

		for (var key in trees)
			if (trees.hasOwnProperty(key)) {

				tree = trees[key];
				var list = store.keystone.List(key, tree.options);
				list.defaultColumns = tree.defaultColumns;
				while (tree.stack.length > 0)
					tree.stack.pop().execute(key, list, types, fields, store);

				list.register();
				_.merge(nav, tree.navigation);
				console.log('Registered List ' + key + '.');

			}
		nav.settings = ['settings', 'users', 'countries', 'counters'];
		store.keystone.set('nav', nav);

	};

};
