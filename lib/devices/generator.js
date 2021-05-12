/**
 * Module dependencies.
 */
const { app, proto_device } = require('./../device');
const { v4: uuidv4 } = require('uuid');

// Add proto_device prototype to generator thus inheriting all the attributes of 'device'.
const generator = new proto_device();

generator.generator = function(deviceAddress) {
    generator.deviceId = uuidv4();
	generator.deviceAddress = deviceAddress;
	generator.deviceType = "generator";
    return generator;
}

generator.sendEnergy = function(wattage) {
    return new Promise((resolve, reject) => {
        const lc = generator.getConnectedDeviceOfType('localcontroller');
        const st = generator.getConnectedDeviceOfType('storage');

        const eContract = new generator.energyContract(
            uuidv4(), this, st, Date.now(), wattage
        );

        console.log('sdsdsasdasdasd', eContract);
        const endpoint = '/api/econtract';
		const URL = 'http://' + lc.deviceAddress;

        // Send's the eContract in a controlled fashion every 5 seconds.
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

        const metadataPacket = new generator.metadataPacket(device, currentWattage);

        const endpoint = '/api/metadata';
		const URL = 'http://' + lc.deviceAddress;
        generator.createHTTPRequest(
            URL, endpoint, 'get', undefined, metadataPacket
        )
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

generator.metadataPacket = function(device, currentWattage) {
    this.device = device;
    this.currentWattage = currentWattage;
}

module.exports = generator;
