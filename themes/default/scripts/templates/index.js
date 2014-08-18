angular.module('seller.templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('/assets/partials/seller/cart/cart.html',
    '<div class="table-responsive cart_info" ng-init="cart.getItems()">\n' +
    '      <table class="table table-condensed">\n' +
    '        <thead>\n' +
    '          <tr class="cart_menu">\n' +
    '            <td class="image">Item</td>\n' +
    '            <td class="description"></td>\n' +
    '            <td class="price">Price</td>\n' +
    '            <td class="quantity">Quantity</td>\n' +
    '            <td class="total">Total</td>\n' +
    '            <td></td>\n' +
    '          </tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr ng-repeat="item in cart.items">\n' +
    '          <td class="cart_product">\n' +
    '            <a href="/store/products/{{item.slug}}"><img ng-src="{{item.image.url}}" alt="item image"></a>\n' +
    '          </td>\n' +
    '          <td class="cart_description">\n' +
    '            <h4><a target="_blank" href="/store/products/{{item.slug}}">{{item.name }}</a></h4>\n' +
    '            <p>Web ID: {{item.stock.sku}}</p>\n' +
    '          </td>\n' +
    '          <td class="cart_price">\n' +
    '            <p>{{item.price | currency}}</p>\n' +
    '          </td>\n' +
    '          <td class="cart_quantity">\n' +
    '            <div class="cart_quantity_button">\n' +
    '              <a class="cart_quantity_up" href="" ng-click="cart.modify(item, 1)"> + </a>\n' +
    '              <input class="cart_quantity_input" ng-model="item.quantity" type="text" name="quantity" value="1" autocomplete="off" size="2">\n' +
    '              <a class="cart_quantity_down" href="" ng-click="cart.modify(item, -1)"> - </a>\n' +
    '            </div>\n' +
    '          </td>\n' +
    '          <td class="cart_total">\n' +
    '            <p class="cart_total_price">{{ item.price * item.quantity | currency}}</p>\n' +
    '          </td>\n' +
    '          <td class="cart_delete">\n' +
    '            <a class="cart_quantity_delete" ng-click="cart.remove(item)" href=""><span class="glyphicon glyphicon-trash"></span></a>\n' +
    '          </td>\n' +
    '        </tr>\n' +
    '        </tbody>\n' +
    '      </table>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '');
  $templateCache.put('/assets/partials/seller/checkout/address.html',
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="bind.name.first">Name*</label>\n' +
    '  <div class="col-md-5">\n' +
    '    <input ng-disabled="disable" ng-model="bind.name.first" id="bind.name.first" name="order[customer][name][first]" placeholder="First" class="form-control input-md" required type="text">\n' +
    '\n' +
    '  </div>\n' +
    '  <div class="col-md-5">\n' +
    '    <input ng-disabled="disable" data-ng-model="bind.name.last" id="bind.name.last" name="order[customer][name][last]" placeholder="Last" class="form-control input-md" required type="text">\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="bind.company">Company</label>\n' +
    '  <div class="col-md-10">\n' +
    '    <input ng-disabled="disable" ng-model="bind.company" id="bind.customer.company" name="bind.customer.company" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="bind.customer.address.street1">Address</label>\n' +
    '  <div class="col-md-10">\n' +
    '    <input ng-dis/abled="disable" ng-model="bind.street1" id="bind.customer.address.street1" name="bind.customer.address.street1" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="bind.customer.address.street2"></label>\n' +
    '  <div class="col-md-10">\n' +
    '    <input ng-disabled="disable" data-ng-model="bind.street2" id="bind.customer.address.street2" name="bind.customer.address.street2" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="bind.customer.address.city">City</label>\n' +
    '  <div class="col-md-10">\n' +
    '    <input ng-disabled="disable" data-ng-model="bind.city" id="bind.customer.address.city" name="bind.customer.address.city" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- Text input-->\n' +
    '<div class="form-group">\n' +
    '  <label class="col-md-2 control-label" for="order[phone]">Phone*</label>\n' +
    '  <div class="col-md-10">\n' +
    '    <input ng-disabled="disable" data-ng-model="bind.phone" id="order[phone]" name="order[phone]" placeholder="868-777-7777" class="form-control input-md" type="text" data-ng-pattern="/^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})?[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$/" required>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
  $templateCache.put('/assets/partials/seller/checkout/addressx.html',
    '<div class="panel panel-default">\n' +
    '  <div class="panel-heading">\n' +
    '    <h4>{{title}}</h4>\n' +
    '  </div>\n' +
    '  <div class="panel-body">\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind.name.first">Name*</label>\n' +
    '      <div class="col-md-5">\n' +
    '        <input data-ng-model="bind.name.first" id="bind.name.first" name="order[customer][name][first]" placeholder="First" class="form-control input-md" required type="text">\n' +
    '\n' +
    '      </div>\n' +
    '      <div class="col-md-5">\n' +
    '        <input data-ng-model="bind.name.last" id="bind.name.last" name="order[customer][name][last]" placeholder="Last" class="form-control input-md" required type="text">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind.company">Company</label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind.company" id="bind.customer.company" name="bind.customer.company" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind.customer.address.street1">Address</label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind.street1" id="bind.customer.address.street1" name="bind.customer.address.street1" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind.customer.address.street2"></label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind.street2" id="bind.customer.address.street2" name="bind.customer.address.street2" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind.customer.address.city">City</label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind.city" id="bind.customer.address.city" name="bind.customer.address.city" placeholder="" class="form-control input-md" required="" type="text">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <!-- Text input-->\n' +
    '    <div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="order[phone]">Phone*</label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind.phone" id="order[phone]" name="order[phone]" placeholder="868-777-7777" class="form-control input-md" type="text" data-ng-pattern="/^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})?[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$/"\n' +
    '        required>\n' +
    '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
  $templateCache.put('/assets/partials/seller/checkout/checkout.html',
    '<checkout-email bind="order.customer"></checkout-email>\n' +
    '<div class="row">\n' +
    '  <div class="col-md-6">\n' +
    '<checkout-address title="Billing" bind="order.address.billing"></checkout-address>\n' +
    '<div class="row">\n' +
    '<checkout-ship-to-bill copy="order.address.billing" to="order.address.shipping"></checkout-ship-to-bill>\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="col-md-6">\n' +
    '<checkout-address title="Shipping" bind="order.address.shipping" ng-show="!shipper.hide"></checkout-address>\n' +
    '</div>\n' +
    '</div>\n' +
    '<a class="btn btn-success" href="#" ng-click="checkout.confirm()"> Confirm</a>\n' +
    '\n' +
    '');
  $templateCache.put('/assets/partials/seller/checkout/email.html',
    '<div class="form-group">\n' +
    '      <label class="col-md-2 control-label" for="bind">Email*</label>\n' +
    '      <div class="col-md-10">\n' +
    '        <input data-ng-model="bind" id="order.email" name="order.email" placeholder="" class="form-control input-md" required="" type="email">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '');
  $templateCache.put('/assets/partials/seller/checkout/ship-to-bill.html',
    '<p><input class="form-control" type="checkbox" data-ng-click="shipper.flip()">Ship items to the billing address.</p>\n' +
    '');
}]);
