var demand = require('must');
var sinon = require('sinon');
var FieldsMethod = require('../../core/models/FieldsMethod');
var RunMethod = require('../../core/models/RunMethod');

var method;
var spy;
var list;
var types;
var fields;
var store;



beforeEach(function() {

	spy = sinon.spy();
	list = {
		add: sinon.spy()
	};
	types = {};
	fields = {};
	store = {};

});

describe('RunMethod', function() {

	it('execute()', function() {

		method = new RunMethod(spy);
		method.execute(list, types, fields, store);
		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, list, store, types);
	});

});


describe('FieldsMethod', function() {

	it('execute()', function() {
		method = new FieldsMethod(spy);
		method.execute(list, types, fields, store);
		sinon.assert.calledOnce(list.add);
		sinon.assert.calledWith(spy, store, types, fields);
	});

});
