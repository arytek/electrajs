/**
 * Module dependencies.
 */
const proto_device = require('./../device');

let generator = {};

// Add proto_device prototype to generator thus inheriting all the attributes of 'Device'.
generator = Object.create(proto_device, generator);

generator.deviceType = "generator";

generator.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = generator;
