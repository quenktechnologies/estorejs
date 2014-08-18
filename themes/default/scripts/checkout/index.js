var app = angular.module('seller.checkout', ['vlizer.cart']);

app.directive('email', [require('./EmailElementDirective')]);
app.directive('address', [require('./AddressElementDirective')]);
app.controller('AddressElementController', [require('./AddressElementController')]);
app.controller('CheckOutController', ['$scope', 'CartService', require('./CheckOutController')]);
