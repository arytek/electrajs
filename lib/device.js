/**
 * Module dependencies.
 */
const express = require('express');
const axios = require('axios');
const ip = require('ip');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// The application will be publically accessible on this port.
const port = process.env.PORT || 4374; 

// The IP address of the running application.
const address = process.argv[2] || process.env[IP] || ip.address() || "127.0.0.1";

let device = {
    id: uuidv4(),
	deviceAddress: address,
	deviceType: undefined,
    connectedDevices: []
};


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
device.getID = function() {

}

/**
 * Listens for incoming connections.
 * 
 * @returns {Promise<port>} Promise object represents the port 
 * that the application is listening on.
 * @public
 */
device.listen = function() {
    return new Promise((resolve, reject) => {
        app.listen(port, this.deviceAddress, () => {
            resolve(port);
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
 device.onConnection = function() {
    return new Promise((resolve, reject) => {
        app.get('/api/connect', (req, res) => {
			const device_data = req.body;
			this.connectedDevices.push(device_data);
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
 device.addDevice = function(hostname, port = 4374) {
    return new Promise((resolve, reject) => {
		const endpoint = '/api/connect';
		const body = {
			deviceType: this.deviceType,
			deviceAddress: this.deviceAddress
		};
        createHTTPRequest(hostname, endpoint, 'GET', undefined, body)
		.then(resolve)
	  	.catch(reject);
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
 device.getDevices = function() {

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
device.hasDevice = function() {

}



/**
 * ----------------------------------------------
 * Private Methods:                             
 * ----------------------------------------------
 */


/**
 * Creates a HTTP request.
 * @param {String} hostname  The API end-point you would like to access.
 * @param {String} endpoint  The API end-point you would like to access.
 * @param {String} method  The HTTP method you would like to use (GET, POST).
 * @param {String} params  The params of this HTTP request.
 * @param {Object} body  The body data object you would like to send (optional).
 * @returns {Object} Object containing the following structure:
 * 
 * {
		loading: Boolean,
		data: Object,
		error: Boolean
    }
 * @private
 */
 function createHTTPRequest(hostname, endpoint, method, params, body) {
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


// Refactor this to the 'eContract'.
/**
 * Constructs a Response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *
 * @param {string|number|boolean|object} obj
 * @private
 */
class Response {
	constructor(success, data) {
		this.success = success;
		this.data = data;

	}
}


module.exports = device;