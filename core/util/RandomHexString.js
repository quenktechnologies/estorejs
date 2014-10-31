/**
 * RandomHexString generates one.
 * @class RandomHexString
 * @param {Number} bytes The number of bytes to generate.
 * @constructor
 *
 */
module.exports = function RandomHexString (bytes) {

return  require('crypto').randomBytes(bytes).toString('hex');

};

