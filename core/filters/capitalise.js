module.exports = function capitalise(string) {
  
  var value = string.split(' ').map(function(string) {

		return string.charAt(0).toUpperCase() + string.slice(1);

	});
console.log(value, ' os ' , string);
	return value.join(' ');

};
