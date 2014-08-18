var app = angular.module('seller.cart', ['vlizer.cart', 'seller.templates']);

app.controller('CartApplication', ['CartService', require('./CartApplication')]);
app.directive('cart', require('./CartDirective'));
