/**
 * MetaParams
 * @alias MetaParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {Configuration} config
 * @constructor
 *
 */
module.exports = function MetaParams(config) {



  this.toObject = function () {

   return {
     currency_code:config.getPreference('currency'),
                   purchase_step:'payment_method',
                   x_receipt_link_url:'/checkout/success/hosted', 
   };


  };

};
