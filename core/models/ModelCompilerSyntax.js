/**
 * @module
 */

var _ = require('lodash');
var DocumentMethod = require('./DocumentMethod');
var ModelMethod = require('./ModelMethod');
var StaticMethod = require('./ModelMethod');
var FieldsMethod = require('./FieldsMethod');
var PreMethod = require('./PreMethod');
var PostMethod = require('./PostMethod');
var RunMethod = require('./RunMethod');
var ValidationMethod = require('./ValidationMethod');

/**
 * sourceCompilerSyntax contains the steps involved in compiling a source.
 *
 * All of the methods here correspond to a field value for a sourceExtension.
 * @alias ModelCompilerSyntax
 * @constructor
 *
 */
module.exports = function ModelCompilerSyntax() {

	var stack;
	var model;

	/**
	 *
	 * newRound prepares the syntax for a new round of parsing.
	 * @param {Object} newModel
	 */
	this.newRound = function(newModel) {

		stack = [];
		model = newModel;

	};

	/**
	 * getTree returns the AST for the model.
	 * @returns {Array}
	 */
	this.getTree = function() {
		model.stack = stack;
		return model;
	};

	this.options = function(source) {
		model.options = model.options || {};
		_.merge(model.options, source.options);
	};

	this.navigation = function(source) {
		model.navigation = model.navigation || {};
		_.merge(model.navigation, source.navigation);
	};

	this.defaultColumns = function(source) {
		model.defaultColumns = source.defaultColumns;
	};

	this.model = function(source) {
		stack.push(new FieldsMethod(source.model));
	};

	this.methods = function(source) {
		stack.push(new DocumentMethod(source.methods));
	};

	this.statics = function(source) {
		stack.push(new StaticMethod(source.statics));
	};

	this.pre = function(source) {
		stack.push(new PreMethod(source.pre));
	};

	this.post = function(source) {
		stack.push(new PostMethod(source.post));
	};

	this.run = function(source) {
		stack.push(new RunMethod(source.run));
	};

        this.validation = function(source) {
stack.push(new ValidationMethod(source.validation));
        };


};
