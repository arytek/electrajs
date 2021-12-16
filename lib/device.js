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
	this.deviceName = undefined;
    this.connectedDevices = [];
}


/**
 * ----------------------------------------------
 * Public Attributes:                             
 * ----------------------------------------------
 */

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
 * Triggers on a connection request.
 *
 * @param {function} successCb
 * @public
 */
 device.prototype.onConnection = function(successCb) {
	app.get('/api/connect', (req, res) => {
		const deviceData = req.body;
		const sanitizedAddedDevice = this.sanitizeDeviceV2(deviceData);
		const sanitizedSelf = this.sanitizeDeviceV2(this);

		this.connectedDevices.push(sanitizedAddedDevice);

		// Reply back with device's attributes.
		res.send(JSON.stringify(sanitizedSelf));
		successCb(sanitizedAddedDevice);
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
		const sanitized = this.sanitizeDeviceV2(this);
		const URL = 'http://' + address;

		console.log('Attempting to connect to ', address);
		// The device being added will respond back with its attributes.
        this.createHTTPRequest(URL, endpoint, 'get', undefined, sanitized)
		.then((response) => {
			const data = response.data;
			// Checks if the device already exists in its connectedDevices array.
			if (!this.hasDevice(data.deviceId)) {
				this.connectedDevices.push(data);
			}

			// Add connected devices of the device that was just added.
			for (const deviceElm of data.connectedDevices) {
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
 * Gets a connected device of the specified type.
 *
 * @param {string} deviceType
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
 * Returns a boolean representing whether or not this device has a connected
 *  device with the specified deviceId.
 *
 * @param {string} deviceId
 * @returns {boolean}
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
 * @param {object} method
 * @param {object} origin
 * @param {object} destination
 * @param {Date} establishment_time
 * @param {number} wattage
 * @public
 */
device.prototype.energyContract = function(id, method, origin, destination, establishment_time, wattage) {
	this.id = id;
	this.method = method;
	this.origin = origin;
	this.destination = destination;
	this.establishment_time = establishment_time;
	this.wattage = wattage;
}

/**
 * Returns a sanitized device object.
 * Removes the 'connectedDevices' attribute.
 * 
 * @param {object} 
 * @public
 */
 device.prototype.sanitizeDevice = function(device) {
	let sanitized = {};
	sanitized.deviceId = device.deviceId;
	sanitized.deviceAddress = device.deviceAddress;
	sanitized.deviceType = device.deviceType;
	sanitized.deviceName = device.deviceName;
	return sanitized;
}

/**
 * Returns a sanitized device object.
 * Retains everything except the private attributes.
 * 
 * @param {object} 
 * @public
 */
 device.prototype.sanitizeDeviceV2 = function(device) {
	let sanitized = {};
	sanitized.deviceId = device.deviceId;
	sanitized.deviceAddress = device.deviceAddress;
	sanitized.deviceType = device.deviceType;
	sanitized.deviceName = device.deviceName;
	sanitized.connectedDevices = device.connectedDevices;
	return sanitized;
}

/**
 * Enums:
 */

 device.prototype.methodEnum = Object.freeze({
	 "SEND": "SEND",
	 "RECEIVE": "RECEIVE",
	});

exports.proto_device = device;
exports.app = app;