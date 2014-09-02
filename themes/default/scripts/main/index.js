require('../lib/angular');
require('../estore-angular');

var app = angular.module('seller', ['estore']);

app.controller('CheckOut', ['$scope', 'CartService', require('../controllers/CheckOut')]);

angular.element(document).ready(function() {

	angular.bootstrap(document, ['seller']);

});
