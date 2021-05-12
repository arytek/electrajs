/**
 * Module dependencies.
 */
const express = require('express');
const axios = require('axios');


const app = express();
app.use(express.json());

function device() {
	this.deviceId = undefined;
	this.deviceAddress = undefined;
	this.deviceType = undefined;
    this.connectedDevices = [];
}


/**
 * ----------------------------------------------
 * Public Attributes:                             
 * ----------------------------------------------
 */

// An object containing each of this device's routes and a boolean value that turns true when the route has been created.
const activeRoutes = {
	connect: false,
	econtract: false
};


/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
device.prototype.getID = function() {

}

/**
 * Listens for incoming connections.
 * 
 * @returns {Promise} 
 * Promise containing the address the device is listening on.
 * @public
 */
device.prototype.listen = function() {
    return new Promise((resolve, reject) => {
		const [address, port] = this.deviceAddress.split(':');
        app.listen(port, address, () => {
            resolve(this.deviceAddress);
        });
    })
}

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
 device.prototype.onConnection = function(successCb) {
	app.get('/api/connect', (req, res) => {
		const deviceData = req.body;
		this.connectedDevices.push(deviceData);

		// Reply back with device's attributes.
		res.send(JSON.stringify(this));
		successCb(deviceData);
	});
}


/**
 * Attempts to connect to the specified Electra-enabled device through
 *  the supplied deviceAddress. If the connection is successful, the 
 * specified device is added to this device's connectedDevices array. 
 * If the deviceAddress does not contain a port, the port defaults 
 * to port 4374.
 *
 * Examples:
 * 
 * 		addDevice('192.168.1.2:1234');
 * 		addDevice('192.168.1.2'); // Port 4374 assumed.
 *
 * @param {string} address The device's address.
 * @public
 */
 device.prototype.addDevice = function(address) {
    return new Promise((resolve, reject) => {
		const endpoint = '/api/connect';
		if (!address.includes(':')) address = address.concat(':' + 4374);
		
		const URL = 'http://' + address;

		console.log('Attempting to connect to ', address);
		// The device being added will reply back with its attributes.
        this.createHTTPRequest(URL, endpoint, 'get', undefined, this)
		.then((response) => {
			const data = response.data;
			// Checks if the device already exists in its connectedDevices array.
			if (!this.hasDevice(data.deviceId)) {
				this.connectedDevices.push(data);
			}

			// Add connected devices of the device that was just added.
			for (const deviceElm of data.connectedDevices) {
				console.log(deviceElm);
				// Only add devices that 'this' device does not have, and device's that are not itself.
				if (!(this.hasDevice(deviceElm.deviceId)) && (this.deviceId !== deviceElm.deviceId)) {
					this.connectedDevices.push(deviceElm);
				}
			}
			resolve(data);
		})
	  	.catch((error) => {
			reject(error);
		  });
    })
}


/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
 device.prototype.getDevices = function() {

}

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
 device.prototype.getConnectedDeviceOfType = function(deviceType) {
	for (const deviceElm of this.connectedDevices) {
		if (deviceElm.deviceType == deviceType) {
			return deviceElm;
		}
	}
	// TODO: This error message can be improved.
	return null;
}


/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @public
 */
device.prototype.hasDevice = function(deviceId) {
	for (const deviceElm of this.connectedDevices) {
		if (deviceElm.deviceId == deviceId) {
			return true;
		}
	}
	return false;
}

/**
 * Creates a HTTP request.
 * @param {String} hostname  The hostname you would like to access.
 * @param {String} endpoint  The API end-point you would like to access.
 * @param {String} method  The HTTP method you would like to use (GET, POST).
 * @param {String} params  The params of this HTTP request.
 * @param {Object} body  The body data object you would like to send (optional).
 * @returns {Promise}
 * @public
 */
device.prototype.createHTTPRequest = function(hostname, endpoint, method, params, body) {
	const config = {
		method: method,
		baseURL: hostname + endpoint,
		params: params,
		headers: {
		  'Content-Type': 'application/json'
		},
		data: JSON.stringify(body), // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'.
	};
	return axios(config);
}


/**
 * Constructs an energyContract object.
 * 
 * @param {object} id
 * @param {object} source
 * @param {object} sink
 * @param {Date} establishment_time
 * @param {number} wattage
 * @public
 */
device.prototype.energyContract = function(id, source, sink, establishment_time, wattage) {
	this.id = id;
	this.source = source;
	this.sink = sink;
	this.establishment_time = establishment_time;
	this.wattage = wattage;
}


exports.proto_device = device;
exports.app = app;