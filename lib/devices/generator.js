/**
 * Module dependencies.
 */
const proto_device = require('./../device');
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
        const eContract = new generator.energyContract(
            uuidv4(), JSON.stringify(), JSON.stringify(), Date.now(), wattage
        );

    })
}

module.exports = generator;
