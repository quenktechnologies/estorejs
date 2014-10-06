require('../lib/angular');
require('../estore-angular');
require('../lib/angular-truncate');

var app = angular.module('seller', ['estore', 'truncate']);

app.controller('Checkout', ['$scope', 'CartService', 'ConfigService', '$window', require('../controllers/Checkout')]);
app.controller('ProductPage', [require('../controllers/ProductPage')]);
angular.element(document).ready(function() {

	angular.bootstrap(document, ['seller']);

});
