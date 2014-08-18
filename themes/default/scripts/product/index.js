var app = angular.module('seller.product', ['vlizer.cart']);

app.controller('AddButton', ['CartService', '$scope',  require('./AddButton')]);
app.directive('addButton', require('./AddButtonDirective'));
