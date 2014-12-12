/**
 * @module
 */

var _ = require('lodash');
var DocumentMethod = require('./DocumentMethod');
var StaticMethod = require('./ModelMethod');
var FieldsMethod = require('./FieldsMethod');
var PreMethod = require('./PreMethod');
var PostMethod = require('./PostMethod');
var RunMethod = require('./RunMethod');
var ValidationMethod = require('./ValidationMethod');

/**
 * ModelCompilerSyntax contains the steps involved in compiling a source.
 *
 * All of the methods here correspond to a field value for a sourceExtension.
 * @alias treeCompilerSyntax
 * @constructor
 *
 */
module.exports = function ModelCompilerSyntax() {

	var stack;
	var tree;

	/**
	 *
	 * newRound prepares the syntax for a new round of parsing.
	 * @param {Tree} newTree
	 */
	this.newRound = function(newTree) {

		stack = newTree.stack;
		tree = newTree;

	};

	/**
	 * getTree returns the AST for the tree.
	 * @returns {Tree}
	 */
	this.getTree = function() {
		tree.stack = stack;
		return tree;
	};

	this.options = function(source) {
		tree.options = tree.options || {};
		_.merge(tree.options, source.options);
	};

	this.navigation = function(source) {
		tree.navigation = tree.navigation || {};
		_.merge(tree.navigation, source.navigation);
	};

	this.defaultColumns = function(source) {
		tree.defaultColumns = source.defaultColumns;
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
