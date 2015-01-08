/**
 * SocketRegistry keeps record of all the connections spawned.
 *
 * This allows us to close them when we need to.
 * @alias SocketRegistry
 * @memberOf  core/server
 *
 * @constructor
 *
 */
function SocketRegistry() {

	this.sockets = [];

}

/**
 * addConnection adds a sockect to the internal list.
 * @alias addConnection
 * @param {Socket} socket
 * @constructor
 *
 */
SocketRegistry.prototype.addConnection = function(socket) {

	this.sockets.push(socket);

};


/**
 * hasConnections queries if there are existing connections.
 *
 * @returns {Boolean}
 *
 */
SocketRegistry.prototype.hasConnections = function() {

	return (this.sockets.length > 0);
};


/**
 * flush all connections.
 *
 */
SocketRegistry.prototype.flush = function() {

	this.sockets.forEach(function(socket) {
		socket.destroy();
		this.sockets.length = 0;
	}.bind(this));

};


module.exports = SocketRegistry;
