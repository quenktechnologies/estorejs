var demand = require('must');
var Validator = require('../../../core/models/validation/Validator');
var fieldValidate = require('../../../core/models/validation/fieldValidate');


describe('fieldValidate()', function() {

	it('must work', function() {

		fieldValidate('field', new Validator({
			field: {
				presence: true
			}
		}))
		('goat', function(result) {

			demand(result).be.true();

		});







	});


});
