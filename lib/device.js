/**
 * Module dependencies.
 */
const express = require('express');
const axios = require('axios');
const ip = require('ip');


const app = express();
app.use(express.json());

// The application will be publically accessible on this port.
const port = process.env.PORT || 4374; 



// let device = {
//     deviceId: uuidv4(),
// 	deviceAddress: address,
// 	deviceType: undefined,
//     connectedDevices: []
// };

function device() {
	this.deviceId = undefined;
	this.deviceAddress = undefined;
	this.deviceType = undefined;
    this.connectedDevices = [];
}


/**
 * ----------------------------------------------
 * Public Methods:                             
 * ----------------------------------------------
 */


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
 * @returns {Promise<port>} Promise object represents the port 
 * that the application is listening on.
 * @public
 */
device.prototype.listen = function() {
    return new Promise((resolve, reject) => {
        app.listen(port, this.deviceAddress, () => {
			const address = this.deviceAddress + ':' + port;
            resolve(address);
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
 device.prototype.onConnection = function() {
    return new Promise((resolve, reject) => {
        app.get('/api/connect', (req, res) => {
			const device_data = req.body;
			this.connectedDevices.push(device_data);

			// Reply back with device's attributes.
			res.send(JSON.stringify(this));
            resolve(device_data);
        });
    })
}


/**
 * Attempts to connect to the specified Electra-enabled device.
 * If the connection is successful, the specified device is added to 
 * this device's connectedDevices array.
 *
 * Examples:
 *
 *     addDevice('192.168.1.2');
 *
 * @param {string} hostname
 * @param {number} port Optional - defaults to 4374.
 * @public
 */
 device.prototype.addDevice = function(hostname, port = 4374) {
    return new Promise((resolve, reject) => {
		const endpoint = '/api/connect';
		const URL = 'http://' + hostname + ':' + port;

		console.log('Attempting to connect to ', hostname);
        this.createHTTPRequest(URL, endpoint, 'get', undefined, this)
		.then((response) => {
			const data = response.data;
			// Checks if the device already exists in its connectedDevices array.
			if (!this.hasDevice(data.deviceId)) {
				this.connectedDevices.push(data);
			}
			resolve(data);
		})
	  	.catch(() => {
			reject();
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
	for (device of this.connectedDevices) {
		if (device.deviceType == deviceType) {
			return device;
		}
	}
	return `No connected device of ${deviceType} typefound.`
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
	for (device of this.connectedDevices) {
		if (device.deviceId == deviceId) {
			return true;
		}
	}
	return false;
}

/**
 * Creates a HTTP request.
 * @param {String} URL  The URL you would like to access.
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


module.exports = device;