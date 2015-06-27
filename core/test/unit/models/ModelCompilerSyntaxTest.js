var syntax, model, stack, source;
var demand = require('must');
var sinon = require('sinon');
var ModelCompilerSyntax = require('../../../../core/models/ModelCompilerSyntax');
var DocumentMethod = require('../../../../core/models//DocumentMethod');
var ModelMethod = require('../../../../core/models//ModelMethod');
var RunMethod = require('../../../../core/models/RunMethod');
var FieldsMethod = require('../../../../core/models/FieldsMethod');

beforeEach(function() {

	stack = [];
	model = {};
	syntax = new ModelCompilerSyntax();

	source = {
		options: {
			nocreate: true,
			nodelete: true,
			map: {
				name: 'title'
			}
		},
		defaultColumns: 'name id fish',
		navigation: {
			settings: ['users', 'settings'],
			sales: ['invoices', 'transactions']
		},
		model: function() {

			return ['Fields', {
				name: {
					type: String
				}
			}];

		},
		methods: {},
		statics: {},
		run: function() {

		}


	};

	syntax.newRound({
		options: {},
		navigation: {},
		stack: []
	});


});

describe('ModelCompilerSyntax', function() {

	describe('options()', function() {

		it('must set the options on the model', function() {

			syntax.options(source);
			model = syntax.getTree();
			demand(model.options).eql(source.options);

		});

	});

	describe('navigation()', function() {

		it('must set the navigation on the model', function() {

			syntax.navigation(source);
			model = syntax.getTree();
			demand(model.navigation).eql(source.navigation);

		});

	});

	describe('defaultColumns()', function() {

		it('must set the defaultColumns on the model', function() {

			syntax.defaultColumns(source);
			model = syntax.getTree();
			demand(model.defaultColumns).eql(source.defaultColumns);

		});

	});

	describe('model()', function() {


		it('must set the model\'s fields', function() {

			syntax.model(source);

			model = syntax.getTree();
			model.stack.pop().must.be.instanceOf(FieldsMethod);

		});

	});

	describe('methods', function() {


		it('must add to the model\'s document methods', function() {

			syntax.methods(source);
			model = syntax.getTree();
			model.stack.pop().must.be.instanceOf(DocumentMethod);

		});

	});

	describe('statics', function() {

		it('must add to the model\'s document methods', function() {

			syntax.methods(source);
			model = syntax.getTree();
			model.stack.pop().must.be.instanceOf(DocumentMethod);

		});

	});

	describe('run', function() {

		it('must add to the model\'s run methods', function() {

			syntax.run(source);
			model = syntax.getTree();
		model.	stack.pop().must.be.instanceOf(RunMethod);

		});

	});

});
