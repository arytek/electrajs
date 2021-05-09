/**
 * Module dependencies.
 */
const proto_device = require('./../device');

let localcontroller = {};

// Add proto_device prototype to localcontroller thus inheriting all the attributes of 'device'.
localcontroller = Object.create(proto_device, localcontroller);

localcontroller.deviceType = "localcontroller";

localcontroller.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = localcontroller;
