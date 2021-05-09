/**
 * Module dependencies.
 */
const proto_device = require('./../device');


let storage = {};

// Add proto_device prototype to storage thus inheriting all the attributes of 'Device'.
storage = Object.create(proto_device, storage);

storage.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = storage;