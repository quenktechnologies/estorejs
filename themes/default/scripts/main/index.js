require('../lib/angular');
require('../estore-angular');

var app = angular.module('seller', ['estore']);

app.controller('Checkout', ['$scope', 'CartService', 'ConfigService', require('../controllers/Checkout')]);
app.controller('ProductPage', [require('../controllers/ProductPage')]);
angular.element(document).ready(function() {

	angular.bootstrap(document, ['seller']);

});
