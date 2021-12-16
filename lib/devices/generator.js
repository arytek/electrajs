/**
 * Module dependencies.
 */
const { app, proto_device } = require('./../device');
const { v4: uuidv4 } = require('uuid');

// Add proto_device prototype to generator thus inheriting all the attributes of 'device'.
const generator = new proto_device();

generator.generator = function(deviceAddress, deviceName) {
    generator.deviceId = uuidv4();
	generator.deviceAddress = deviceAddress;
	generator.deviceType = "generator";
    generator.deviceName = deviceName;
    return generator;
}

generator.sendEnergy = function(wattage) {
    return new Promise((resolve, reject) => {
        const lc = generator.getConnectedDeviceOfType('localcontroller');
        let st = generator.getConnectedDeviceOfType('storage'); // destination.
        st = generator.sanitizeDevice(st);
        const sanitizedSelf = generator.sanitizeDevice(generator); // origin.
        
        const eContract = new generator.energyContract(
            uuidv4(), generator.methodEnum.SEND, sanitizedSelf, st, Date.now(), wattage
        );
        
        const endpoint = '/api/econtract';
		const URL = 'http://' + lc.deviceAddress;

        // Send's the eContract in a controlled fashion after 5 seconds.
        setTimeout(() => {
            generator.createHTTPRequest(
                URL, endpoint, 'get', undefined, eContract
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
        }, 5000);
    })
}

generator.sendMetadataToLC = function(currentWattage) {
    return new Promise((resolve, reject) => {
        const lc = generator.getConnectedDeviceOfType('localcontroller');
        if (lc == null) reject('No local controller connected. Please add a local controller.');

        const metadataPacket = new generator.metadataPacket(generator, currentWattage);

        const endpoint = '/api/metadata';
		const URL = 'http://' + lc.deviceAddress;

        // Sends the metadataPacket in a controlled fashion every 5 seconds.
        setTimeout(() => {
            generator.createHTTPRequest(
                URL, endpoint, 'get', undefined, metadataPacket
            )
            .then(resolve)
            .catch((error) => {
                reject(error);
            });
        }, 5000);
    })
}

generator.metadataPacket = function(device, currentWattage) {
    this.device = device;
    this.metadata = {
        currentWattage: currentWattage
    };
}

module.exports = generator;
