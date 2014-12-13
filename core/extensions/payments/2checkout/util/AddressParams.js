/**
 * AddressParams
 * @alias AddressParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {AddressHash} address
 * @param {Params} params`
 * @constructor
 *
 */
module.exports = function AddressParams(email, address, params) {


	this.toObject = function() {

		var set = params.toObject();


		set.first_name = address.billing.name.first;
		set.last_name = address.billing.name.last;
		set.street_address = address.billing.street1;
		set.street_address2 = address.billing.street2;
		set.city = address.billing.city;
		set.state = address.billing.state;
		set.zip = address.billing.code;
		set.country = address.billing.country;
		set.phone = address.billing.phone;
		set.email = email;

		if (address.shipping.street1) {

			set.ship_name = address.shipping.name.first + ' ' +
				address.shipping.name.last;

			set.ship_street_address = address.shipping.street1;
			set.ship_street_address2 = address.shipping.street2;
			set.ship_city = address.shipping.city;
			set.ship_state = address.shipping.state;
			set.ship_zip = address.shipping.code;
			set.ship_country = address.shipping.country;
		}

		return set;
	};



};
