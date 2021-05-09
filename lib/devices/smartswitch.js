/**
 * Module dependencies.
 */
const proto_device = require('./../device');


let smartSwitch = {};

// Add proto_device prototype to smartSwitch thus inheriting all the attributes of 'Device'.
smartSwitch = Object.create(proto_device, smartSwitch);

smartSwitch.sendEnergy = function() {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = smartSwitch;